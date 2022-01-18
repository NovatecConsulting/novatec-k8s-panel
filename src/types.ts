type SeriesSize = 'sm' | 'md' | 'lg';

export interface PanelOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
  theOptions: {
    red: string;
    orange: string;
    green: string;
    dropdownOption: string;
  };
}

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
