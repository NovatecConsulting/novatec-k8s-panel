import { PanelData } from '@grafana/data';
import { EMetricType, INodeID } from 'types';

/**
 * check in the data whether metrics of given type for a node are available or not
 * @param data Paneldata
 * @param nodeId INodeID to check
 * @param metricType metricType to check for
 * @returns boolean
 */
export function hasMetricType(data: PanelData, nodeId: INodeID, metricType: EMetricType): boolean {
  return data.series.some(
    (df) =>
      df.refId?.endsWith(nodeId.layerLabel.toLowerCase()) &&
      df.refId?.startsWith(metricType) &&
      df.name?.includes(nodeId.name)
  );
}
