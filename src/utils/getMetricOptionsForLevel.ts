import { PanelData, SelectableValue } from '@grafana/data';
import { SelectableOptGroup } from '@grafana/ui/components/Select/types';
import { EMetricType, TAvailableMetrics } from 'types';

/**
 * gets the available metrics for certain level grouped by metric type
 * @param data PanelData
 * @param levelOption Selected Level
 * @returns SelectableOptGroup for Grafana Select
 */
export function getMetricOptionsForLevel(
  data: PanelData,
  levelOption: SelectableValue<string>
): SelectableOptGroup<string>[] | undefined {
  const lvl = levelOption.value;
  if (lvl) {
    const metrics = getAvailableMetricsForLevel(data, lvl);
    const options: SelectableOptGroup<string>[] = [];
    for (const [k, v] of Object.entries(metrics)) {
      options.push({
        label: k,
        options: v.map((v) => ({ label: v, value: v, description: k })),
      });
    }
    return options.length ? options : undefined;
  } else return undefined;
}

function getAvailableMetricsForLevel(data: PanelData, level: string): TAvailableMetrics {
  return data.annotations
    ? data.annotations
        .map((df) => df.refId?.split('/'))
        .filter((arr) => arr?.length == 3 && arr[2] == level.toLowerCase())
        // reduce the available metrics to TAvailableMetrics
        .reduce((p: TAvailableMetrics, c) => {
          if (c !== undefined) {
            // convert c[0] to TAvailableMetrics // https://stackoverflow.com/a/41548441/13590313
            const metric = (Object.values(EMetricType) as unknown as string[]).includes(c[0])
              ? (c[0] as unknown as EMetricType)
              : undefined;
            if (metric != undefined) {
              if (metric in p) {
                p[metric]?.push(c[1]);
              } else {
                p[metric] = [c[1]];
              }
            }
          }
          return p;
        }, {})
    : {};
}
