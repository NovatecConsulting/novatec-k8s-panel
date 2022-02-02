/**
 * PanelOptions
 * currently no Options are passed to our panel so this is empty
 */
export interface PanelOptions {}

/**
 * stores root Nodes from treeshaped data and the layerLabels
 */
export interface ITree {
  // root nodes from the tree
  roots: INode[];
  // stores the Labels of each layer/ depth (eg. [Namespace, Deployment,...])
  layerLaybels: string[];
}

/**
 * nessesary information to identify a node (INode) inside a tree (ITree) or in the data
 */
export interface INodeID {
  name: string;
  layerLabel: string;
}

/**
 * represents an element with links to its parent and childs
 */
export interface INode {
  name: string;
  // parent node this link can be used to figure out the layer of the Node
  parent?: INode;
  children?: INode[];
  copy?: INode; // used temporarly in getShowTree
  data: INodeData;
}

/**
 * stores information about a Node
 */
interface INodeData {
  hasAppMetric: boolean;
  hasInfMetric: boolean;
  // can store addition information to filter (e.g. Node)
  properties?: Map<string, string>;
}

/**
 * Information to be displayed by drillDown
 */
export interface INodeInfo {
  id: INodeID;
  node: INode;
  relations: Array<INodeID | Array<INodeID>>;
}

/**
 * the possible metric types. Also used to search for in grafana query refIds.
 * if this should be changed to accept shortcuts 'app' or 'inf' the values can be changed here.
 */
export enum EMetricType {
  inf = 'infrastructure',
  app = 'application',
}

/**
 * computed type from EmetricType keys. Used to find what metric(name)s are availabe for each metric
 * [metricType]: metricNames[]
 */
export type TAvailableMetrics = {
  [key in EMetricType]?: string[];
};
