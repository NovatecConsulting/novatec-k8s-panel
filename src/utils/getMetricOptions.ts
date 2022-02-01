import { PanelData, SelectableValue } from '@grafana/data';
import { EMetricType, INodeID } from 'types';

/**
 * finds available metrics for a node and pack them into selectable options for grafana Select component
 * @param data PanelData
 * @param nodeId INodeID to find metric options
 * @param metricType application or infrastructure
 * @returns SelectableValue<string>[] available metrics from data for given node
 */
export function getMetricOptions(
  data: PanelData,
  nodeId: INodeID,
  metricType: EMetricType | ''
): SelectableValue<string>[] {
  return [
    ...new Set(
      data.series
        .filter(
          (df) =>
            df.refId?.startsWith(metricType) &&
            df.refId?.endsWith(nodeId.layerLabel.toLowerCase()) &&
            df.name?.includes(nodeId.name)
        )
        .map(({ refId }) => refId?.split('/')[1])
    ),
  ].map((s) => ({
    label: s,
    value: s,
  }));
}
