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
