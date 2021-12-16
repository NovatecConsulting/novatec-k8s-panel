import { PanelData, SelectableValue } from '@grafana/data';
import { SelectableOptGroup, SelectOptions } from '@grafana/ui/components/Select/types';
import { ITree, INode } from 'types';
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
      label: npci.container,
      info: {
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
      label: name,
      info: {
        hasAppMetric: false, // TODO find in data
        hasInfMetric: false,
      },
      children: containers.filter((cont) => childrenLabels.includes(cont.label)),
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
        label: depl.deployment,
        info: {
          hasAppMetric: false, // TODO find in data
          hasInfMetric: false,
        },
        children: pods.filter((pod) => childrenLabels.includes(pod.label)),
      };
    });

  // get namespaces
  const namespaces: INode[] = [...new Set(namespacePodContainerInfos.map((npci) => npci.namespace))].map(
    (ns: string): INode => {
      const childrenLabels = replicaset_owner.filter((rso) => rso.namespace == ns).map((rso): string => rso.owner_name);
      return {
        label: ns,
        info: {
          hasAppMetric: false, // TODO find in data
          hasInfMetric: false,
        },
        children: deployments.filter((depl) => childrenLabels.includes(depl.label)),
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
  nodes.forEach((n) => {
    n.children?.forEach((c) => {
      c.parent = n;
    });
    if (n.children != undefined) linkParents(n.children);
  });
}

// TODO maybe use grafana asyncselect if calculating this takes to long (on larger scale)
/**
 * returns selectoptions tha can be filtered for given a selected level
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
            label: node.label,
            value: node.label,
            description: v,
          })
        ),
      });
    }
  } else {
    // if a filter is already set only other options are items on the same level
    const curFilterLevelLabel = curFilter[0].description;
    options.push({
      label: curFilterLevelLabel ? curFilterLevelLabel : '',
      options: getLevel(
        t.roots,
        t.layerLaybels.findIndex((x) => x == curFilterLevelLabel)
      ).map(
        (node): SelectableValue => ({
          label: node.label,
          value: node.label,
          description: curFilterLevelLabel,
        })
      ),
    });
  }
  // TODO add advanced filterOptions (for INodeInfo: hasApp- Infmetric + dynamic properties)
  return options;
}

export function getGroupOptions(t: ITree, displayedLevel: SelectableValue<string>): SelectableValue<string>[] {
  return t.layerLaybels.slice(0, t.layerLaybels.findIndex((x) => x == displayedLevel.value) + 1).map(
    (label): SelectableValue<string> => ({
      label,
      value: label,
    })
  );
}

export function getLevelOptions(t: ITree): SelectableValue<string>[] {
  return [
    { label: 'Overview', value: 'Overview' },
    ...t.layerLaybels.map((label): SelectableValue => ({ label, value: label })),
  ];
}

function getLevel(nodes: INode[], reqLevel: number, curLevel = 0): INode[] {
  let res: INode[] = [];
  function getLayer(nodes: INode[], reqLevel: number, curLevel = 0) {
    if (reqLevel == curLevel) res.push(...nodes);
    else {
      nodes.forEach((n) => {
        if (n.children) getLayer(n.children, reqLevel, curLevel + 1);
      });
    }
  }
  getLayer(nodes, reqLevel, curLevel);
  return res;
}
