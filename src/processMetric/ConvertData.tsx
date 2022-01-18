import { PanelData, GraphSeriesXY, TimeRange, GraphSeriesValue, SelectableValue } from '@grafana/data';
import { INodeID } from 'types';

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
  metricType: string
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

/**
 * finds available metrics for a node and pack them into selectable options for grafana Select component
 * @param data PanelData
 * @param nodeId INodeID to find metric options
 * @param metricType application or infrastructure
 * @returns SelectableValue<string>[] available metrics from data for given node
 */
export function getMetricOptions(data: PanelData, nodeId: INodeID, metricType: string): SelectableValue<string>[] {
  return data.series
    .filter(
      (df) =>
        df.refId?.startsWith(metricType) &&
        df.refId?.endsWith(nodeId.layerLabel.toLowerCase()) &&
        df.name?.includes(nodeId.name)
    )
    .map(({ refId }): SelectableValue<string> => {
      const metric = refId?.split('/')[1];
      return {
        label: metric,
        value: metric,
      };
    });
}

/**
 * check in the data whether metrics of given type for a node are available or not
 * @param data Paneldata
 * @param nodeId INodeID to check
 * @param metricType metricType to check for
 * @returns boolean
 */
export function hasMetricType(data: PanelData, nodeId: INodeID, metricType: string): boolean {
  return data.series.some(
    (df) =>
      df.refId?.endsWith(nodeId.layerLabel.toLowerCase()) &&
      df.refId?.startsWith(metricType) &&
      df.name?.includes(nodeId.name)
  );
}

/**
 * converts the prometheus query to JSON
 */
export function fromPromtoJSON(str: any): any {
  let newStr = str.replaceAll('=', ':');
  let newNewStr = newStr.replaceAll(', ', ', "');
  let thirdOne = newNewStr.replaceAll(':"', '":"');
  let fourthOne = thirdOne.replaceAll('{', '{"');
  let fifthOne = JSON.parse(fourthOne);
  return fifthOne;
}
