import { PanelData, SelectableValue } from '@grafana/data';
import { SelectableOptGroup, SelectOptions } from '@grafana/ui/components/Select/types';
import { Children } from 'react';
import { ITree, INode, INodeID, INodeInfo } from 'types';
import { fromPromtoJSON } from './ConvertData';

/**
 * build up tree structured data from panel data
 * !WARNING! resulting Tree needs to be deleted with `deleteTreeNodes` to remove circular dependencies
 * @param data PanelData idealy only one Frame not entiere Paneldata
 */
export function buildTree(data: PanelData): ITree {
  const t: ITree = { roots: [], layerLaybels: [] };

  // *** ----- still hardcoded for our queries from here ----- ***

  const namespacePodContainerInfos = data.series
    .filter((df) => df.refId?.includes('namespace_pod_container_info'))
    .map((df) => fromPromtoJSON(df.name?.slice('kube_pod_container_info'.length)));
  const pod_owner = data.series.filter((df) => df.refId?.includes('pod_owner')).map((df) => fromPromtoJSON(df.name));
  const replicaset_owner = data.series
    .filter((df) => df.refId?.includes('replicaset_owner'))
    .map((df) => fromPromtoJSON(df.name));

  // get containers
  // container can occur duplicated when the cluster was restarted recently
  const containers: INode[] = namespacePodContainerInfos.map((npci): INode => {
    return {
      name: npci.container,
      data: {
        hasAppMetric: false, // TODO find in data
        hasInfMetric: false,
      },
    };
  });

  // get pods
  const pods: INode[] = [...new Set(namespacePodContainerInfos.map((npci) => npci.pod))].map((name): INode => {
    const childrenLabels = namespacePodContainerInfos
      .filter((npci) => npci.pod == name)
      .map((npci): string => npci.container);
    return {
      name: name,
      data: {
        hasAppMetric: false, // TODO find in data
        hasInfMetric: false,
      },
      children: containers.filter((cont) => childrenLabels.includes(cont.name)),
    };
  });

  // get deployments
  const deployments: INode[] = data.series
    .filter((df) => df.refId?.includes('deployment_info')) // contains deployment labels ({deployment="label"})
    .map((df) => fromPromtoJSON(df.name))
    .map((depl): INode => {
      const replicaSets = replicaset_owner
        .filter((ro) => ro.owner_name == depl.deployment)
        .map((ro): string => ro.replicaset);
      const childrenLabels = pod_owner.filter((po) => replicaSets.includes(po.owner_name)).map((po): string => po.pod);
      return {
        name: depl.deployment,
        data: {
          hasAppMetric: false, // TODO find in data
          hasInfMetric: false,
        },
        children: pods.filter((pod) => childrenLabels.includes(pod.name)),
      };
    });

  // get namespaces
  const namespaces: INode[] = [...new Set(namespacePodContainerInfos.map((npci) => npci.namespace))].map(
    (ns: string): INode => {
      const childrenLabels = replicaset_owner.filter((rso) => rso.namespace == ns).map((rso): string => rso.owner_name);
      return {
        name: ns,
        data: {
          hasAppMetric: false, // TODO find in data
          hasInfMetric: false,
        },
        children: deployments.filter((depl) => childrenLabels.includes(depl.name)),
      };
    }
  );

  [t.roots, t.layerLaybels] = [namespaces, ['Namespace', 'Deployment', 'Pod', 'Container']];

  // *** ----- till here should be build dynamic with change of the queries & queryIDs ----- ***

  linkParents(t.roots);
  return t;
}

/**
 * function to delete all references between Tree Nodes
 * needs to be called on tree for disposal to prevent memory leak due to circular references
 * @param t Tree to be deleted
 * @returns t empty Tree Object
 */
export function deleteTreeNodes(t: ITree): ITree {
  const unlinkNodes = (nodes: INode[]): void => {
    for (const node of nodes) {
      if (node.children != undefined) {
        unlinkNodes(node.children);
        delete node.children;
      }
      delete node.parent;
    }
  };
  unlinkNodes(t.roots);
  [t.roots, t.layerLaybels] = [[], []];
  return t;
}

/**
 * sets .parent attribute for child Nodes
 * from given Nodes recursivly to their parent nodes
 * !WARNING! creates circular dependencies - need special care for deletion
 * @param nodes Array of Nodes
 */
function linkParents(nodes: INode[]) {
  // TODO change recursive to iterative with queue
  nodes.forEach((n) => {
    n.children?.forEach((c) => {
      c.parent = n;
    });
    if (n.children != undefined) linkParents(n.children);
  });
}

// TODO maybe use grafana asyncselect if calculating this takes to long (on larger scale)
/**
 * returns selectoptions tha can be filtered for given a selected level for grafana select
 * @param t Tree
 * @param displayedLevel currently selected level
 * @returns possible filters
 */
export function getFilterOptions(
  t: ITree,
  displayedLevel: SelectableValue<string>,
  curFilter: SelectableValue<string>[]
): SelectableOptGroup<string>[] {
  let options: SelectableOptGroup<string>[] = [];
  const level = t.layerLaybels.findIndex((x) => x == displayedLevel.value);
  if (!curFilter.length) {
    // if no filter is selected find all possible levels and items that can be filtered for
    const availableLevels = t.layerLaybels.slice(0, level + 1);
    for (let [k, v] of availableLevels.entries()) {
      options.push({
        label: v,
        options: getLevel(t.roots, k).map(
          (node): SelectableValue => ({
            label: node.name,
            value: node.name,
            description: v,
          })
        ),
      });
    }
  } else {
    // if a filter is already set only other options are items on the same level
    const curFilterLevelLabel = curFilter[0].description;
    options.push({
      label: curFilterLevelLabel || '', // should never be undefined but could
      options: getLevel(
        t.roots,
        t.layerLaybels.findIndex((x) => x == curFilterLevelLabel)
      ).map(
        (node): SelectableValue => ({
          label: node.name,
          value: node.name,
          description: curFilterLevelLabel,
        })
      ),
    });
  }
  // TODO add advanced filterOptions (for INodeData: hasApp- Infmetric + dynamic properties)
  return options;
}

/**
 * returns possible groupoptions based on a Tree and selected level for grafana select
 * @param t Tree
 * @param displayedLevel currently selected level
 * @returns possible grouping options
 */
export function getGroupOptions(t: ITree, displayedLevel: SelectableValue<string>): SelectableValue<string>[] {
  return t.layerLaybels
    .slice(
      0,
      t.layerLaybels.findIndex((x) => x == displayedLevel.value)
    )
    .map(
      (label): SelectableValue<string> => ({
        label,
        value: label,
      })
    );
}

/**
 * gets the level of a tree and packs them with overview option as selectableValues
 * @param t Tree
 * @returns level of the tree for grafana select
 */
export function getLevelOptions(t: ITree): SelectableValue<string>[] {
  return [
    { label: 'Overview', value: 'Overview' },
    ...t.layerLaybels.map((label): SelectableValue => ({ label, value: label })),
  ];
}

interface IIsCopied {
  copy: INode;
}
const hasCopy = (n: INode): n is INode & IIsCopied => !!n.copy;

/**
 * this function should not change the original tree but creates an entirly new tree
 * @param t Tree containing the original data
 * @param level selected level
 * @param filter selected filter options
 * @param group selected group options
 * @returns new Tree with copied objects
 */
export function getShowTree(
  t: ITree,
  level: SelectableValue<string>,
  filter: SelectableValue<string>[],
  group: SelectableValue<string>[]
): ITree {
  let nodes: INode[];
  let newLayerLabels: string[] = [level.value || ''];
  // selectedLevel can be -1 if no level is selected (Overview)
  const selectedLevel = t.layerLaybels.indexOf(level.value || '');
  let sourceNodes = t.roots;
  let sourceLevel = 0;
  if (filter.length && filter[0].description) {
    const filterLabels = filter.map((v) => v.label);
    sourceLevel = t.layerLaybels.indexOf(filter[0].description);
    sourceNodes = getLevel(sourceNodes, sourceLevel).filter((node) => filterLabels.includes(node.name));
  }
  // get (filtered) nodes from the choosen level
  const selectedLevelNodes = getLevel(sourceNodes, selectedLevel, sourceLevel).map((node) => Object.assign({}, node));
  for (const node of selectedLevelNodes) {
    delete node.children;
  }
  nodes = selectedLevelNodes;

  // apply grouping if set
  // this will result in the new tree having multiple layers
  // one extra layer for each group connecting the selected layer with the choosen groups as parents
  if (group.length) {
    // how far up are the groups relative to their children
    newLayerLabels = [];
    for (let sv of group) {
      if (sv.value) newLayerLabels.push(sv.value);
    }

    const groupLevels = newLayerLabels.map((v): number => t.layerLaybels.indexOf(v));
    const diffToParentGroup = [...groupLevels.slice(1), selectedLevel].map((v, i) => v - groupLevels[i]);

    for (let up of diffToParentGroup.reverse()) {
      // nodes stores the top level of nodes
      /// stores referenz to the origninal nodes to delete temporary copy attribute, as soon as they are no longer needed
      let originalParents: INode[] = [];
      for (const node of nodes) {
        if (node.parent) {
          if (node.parent.copy) {
            node.parent.copy.children?.push(node);
          } else {
            originalParents.push(node.parent);
            node.parent.copy = Object.assign({}, node.parent, { children: [node] });
          }
          node.parent = node.parent.copy;
        }
      }
      nodes = originalParents.filter(hasCopy).map((n) => n.copy);
      for (const op of originalParents) delete op.copy; // this only delets the no longer needed referenz

      // collapsing layers between selected layer (or group) and group
      while (1 < up) {
        up = up - 1;
        originalParents = [];
        for (const node of nodes) {
          if (node.parent) {
            const parent = node.parent;
            if (parent.copy) {
              if (node.children) parent.copy.children?.push(...node.children);
            } else {
              originalParents.push(parent);
              // at this point every node should have children ↓ this ↓ is just a typescript thing to ensure attribute is not set undefined
              parent.copy = Object.assign({}, parent, node.children && { children: node.children });
            }
            node.children?.forEach((n) => (n.parent = parent.copy));
          }
        }
        nodes = originalParents.filter(hasCopy).map((n) => n.copy);
        for (const op of originalParents) delete op.copy;
      }
    }

    newLayerLabels.push(level.value || ''); // adding the selected level itself to the newLayerLabels for later use
  }

  // remove link to parents as they are still referenzes to the original tree
  for (const node of nodes) delete node.parent;

  return {
    roots: nodes,
    layerLaybels: newLayerLabels,
  };
}

/**
 * get the height of a node within a tree based on .parent attribute
 * @param node Node to get the hight from based on .parent attribute
 * @returns number - height from the node within a tree
 */
function getHeight(node: INode): number {
  let n = node,
    h = 0;
  while (n.parent) (h = h + 1), (n = n.parent);
  return h;
}

/**
 * find a node by given identifier in a tree
 * @param t tree
 * @param id node identifier
 * @returns INode if node is contained in t or undefined
 */
export function getNode(t: ITree, id: INodeID): INode | undefined {
  return getLevel(t.roots, t.layerLaybels.indexOf(id.layerLabel)).find((n) => n.name == id.name);
}

function getNodeID(t: ITree, n: INode): INodeID {
  return {
    name: n.name,
    layerLabel: t.layerLaybels[getHeight(n)],
  };
}

interface IHasChildren {
  children: INode[];
}
const hasChildren = (n: INode): n is INode & IHasChildren => !!n.children;

/**
 * findes relatives from the node in the tree used to extraction information displayed by Drilldown
 * @param t tree
 * @param node node to get info from
 * @returns INodeInfo containing information about the node relatives in the tree
 */
export function getNodeInformation(t: ITree, node: INode): INodeInfo {
  const relations: (INodeID | INodeID[])[] = [];
  // find relations to parents
  for (let x = node.parent; x; x = x?.parent) {
    relations.push(getNodeID(t, x));
  }
  relations.reverse();
  // find relations to children
  for (
    let arr = node.children;
    arr?.length;
    arr = arr.filter(hasChildren).reduce((p: INode[], c) => {
      p.push(...c.children);
      return p;
    }, [])
  ) {
    relations.push(arr.map((n: INode): INodeID => getNodeID(t, n)));
  }

  return {
    id: getNodeID(t, node),
    node,
    relations,
  };
}

/**
 * get a different level from nodes in a tree over their children
 * @param nodes array of nodes representing the entry point
 * @param reqLevel requested level of nodes to return
 * @param curLevel default = 0 define offset for param nodes in case they are not level 0
 * @returns Array of Nodes on the reqLevel relativ to curLevel
 */
function getLevel(nodes: INode[], reqLevel: number, curLevel = 0): INode[] {
  let res: INode[] = [];
  function getLayer(nodes: INode[], reqLevel: number, curLevel = 0) {
    if (reqLevel < 0) return;
    else if (reqLevel == curLevel) res.push(...nodes);
    else {
      nodes.forEach((n) => {
        if (n.children) getLayer(n.children, reqLevel, curLevel + 1);
      });
    }
  }
  getLayer(nodes, reqLevel, curLevel);
  return res;
}
