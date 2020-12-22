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
}


export enum Types {
  Namespace = "Namespace",
  Deployment = "Deployment",
  Pod = "Pod",
  Container = "Container",
  Node = "Node"
}






// new:


export interface Container {

  Name: string;
  Pod: string;
  Namespace: string;
}



export interface Pod {

  Name: string;
  Container: Container[];
  Namespace: string;
  Deployment: string;


}


export interface Namespace {

  Name: string;
  Pod: Pod[];


}


export interface Tuple {
  inside: Element[];
  outside?: Element [];
}