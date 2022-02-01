import { PanelData, GraphSeriesXY, TimeRange, GraphSeriesValue } from '@grafana/data';
import { EMetricType, INodeID } from 'types';

/**
 * finds a serie within the paneldata and packs it as GraphSeriesXY[]
 * @param width width of the graph in px
 * @param data PanelData
 * @param timeRange
 * @param nodeId node identifier
 * @param metric name of the metric to find
 * @param metricType metric type (infrastructure|application)
 * @returns GraphSeriesXY[] with one element if series is found else empty
 */
export function getOneSeries(
  width: number,
  data: PanelData,
  timeRange: TimeRange,
  nodeId: INodeID,
  metric: string,
  metricType: EMetricType
): GraphSeriesXY[] {
  const gs: GraphSeriesXY[] = [];
  const refId = `${metricType}/${metric}/${nodeId.layerLabel.toLowerCase()}`;
  let df = data.series.find((s) => s.refId === refId && s.name?.includes(nodeId.name));
  if (!df) return gs;

  const timeVals: GraphSeriesValue[] = df.fields[0].values.toArray();
  const yVals: GraphSeriesValue[] = df.fields[1].values.toArray();
  const data1: GraphSeriesValue[][] = [];
  for (let i = 0; i < timeVals.length; i++) {
    data1.push([timeVals[i], yVals[i]]);
  }
  const unixTimeRange = timeRange.to.unix() - timeRange.from.unix();
  gs.push({
    data: data1,
    isVisible: true,
    label: metric,
    seriesIndex: 0,
    timeField: df.fields[0],
    timeStep: width / unixTimeRange,
    valueField: df.fields[1],
    yAxis: { index: 0 },
  });
  return gs;
}
