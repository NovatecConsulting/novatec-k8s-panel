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
}


export interface Position {

  x: number;
  y: number;

}