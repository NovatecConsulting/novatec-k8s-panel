type SeriesSize = 'sm' | 'md' | 'lg';

export enum DropdownOption {
  AlphaAsc = 1,
  AlphaDesc,
  Importance,
  TimeAsc,
  TimeDesc,
}

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
 * represents an element with links to its parent and childs
 */
export interface INode {
  label: string;
  // parent node this link can be used to figure out the layer of the Node
  parent?: INode;
  children?: INode[];
  info: INodeInfo;
}

/**
 * stores information about a Node
 */
interface INodeInfo {
  hasAppMetric: boolean;
  hasInfMetric: boolean;
  // can store addition information to filter (e.g. Node)
  properties?: Map<string, string>;
}

// ab hier alt
export interface Element {
  position: Position;
  width: number;
  height: number;
  color: string;
  text: string;
  elementInfo: ElementInfo;
  outside?: Boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface ElementInfo {
  type: Types;
  pod?: string;
  namespace?: string;
  container?: string;
  node?: string;
  deployment?: string;
  withAppMetrics?: boolean;
  withInfMetrics?: boolean;
}

export enum Types {
  Namespace = 'Namespace',
  Deployment = 'Deployment',
  Pod = 'Pod',
  Container = 'Container',
  Node = 'Node',
}

export interface Container {
  Name: string;
  Pod: string;
  Namespace: string;
  Deployment: string;
  Node: string;
}

export interface Pod {
  Name: string;
  Container: Container[];
  Namespace: string;
  Deployment: string;
  Node: string;
}

export interface Namespace {
  Name: string;
  Pod: Pod[];
  Deployment: Deployment[];
}

export interface Deployment {
  Name: string;
  Namespace: string;
  Pod: Pod[];
  Container: Container[];
}

export interface Tuple {
  inside: Element[];
  outside?: Element[];
}
