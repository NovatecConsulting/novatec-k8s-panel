type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}


export interface Element {
  position: Position;
  width: number;
  height: number;
  color: string;
  text: string;
  elementInfo?: ElementInfo;
}

export interface Position {

  x: number;
  y: number;

}

export interface ElementInfo {
  type: Types;
  pod?: String;
  namespace?: String;
  container?: String;
  node?: String;
  service?: String;
}


export enum Types {
  Namespace = "Namespace",
  Service = "Service",
  Pod = "Pod",
  Container = "Container",
  Node = "Node"
}