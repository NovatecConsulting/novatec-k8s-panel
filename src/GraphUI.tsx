import React, { useState } from 'react';
import { Graph, useStyles2, Button, Select } from '@grafana/ui';
import { PanelData, GraphSeriesXY, TimeRange, SelectableValue } from '@grafana/data';
import { getOneSeries, getMetricOptions } from './processMetric/ConvertData';
import getStyles from 'styles/component/GraphStyle';
import getGraphUIStyles from 'styles/component/GraphUIStyle';
import { INodeID } from 'types';

type Props = {
  width: number;
  height: number;
  data: PanelData;
  timeRange: TimeRange;
  setShowGraph: (value: boolean) => void;
  nodeId: INodeID;
};

/**
 * Infrastructure and application metrics component.
 */
export const GraphUI = ({ width, height, data, timeRange, setShowGraph, nodeId }: Props) => {
  const styles = useStyles2(getStyles);
  const graphUIStyles = useStyles2(getGraphUIStyles);
  const [infrastructureMetric, setInfrastructureMetric] = useState<SelectableValue<string>>();
  const [applicationMetric, setApplicationMetric] = useState<SelectableValue<string>>();

  const infraMetricOptions = getMetricOptions(data, nodeId, 'infrastructure');
  const appMetricOptions = getMetricOptions(data, nodeId, 'application');

  let seriesInfrastructure: GraphSeriesXY[] =
    infrastructureMetric && infrastructureMetric.label
      ? getOneSeries(width, data, timeRange, nodeId, infrastructureMetric.label, 'infrastructure')
      : [];
  let seriesApplication: GraphSeriesXY[] =
    applicationMetric && applicationMetric.label
      ? getOneSeries(width, data, timeRange, nodeId, applicationMetric.label, 'application')
      : [];

  return (
    <div data-testid="graphUI">
      <Button data-testid="graphUI-button" variant="secondary" size="sm" icon="arrow-left" onClick={() => setShowGraph(false)}>
        Back
      </Button>
      <div>
        <label className={styles.graphName}>{nodeId.name}</label>
        <div className={styles.graph}>
          <label className={styles.graphHeader}>Infrastructure Metrics</label>
          <div className={styles.infrastructureDropdown}>
            <Select
              id="infrastructurMetrics"
              onChange={setInfrastructureMetric}
              options={infraMetricOptions}
              value={infrastructureMetric}
              disabled={infraMetricOptions.length ? false : true}
              menuShouldPortal={true}
              placeholder={infraMetricOptions.length ? 'select metric' : 'non available'}
            />
          </div>

          <Graph
            width={width / 2}
            height={height / 3.5}
            series={seriesInfrastructure}
            timeRange={data.timeRange}
            showLines={true}
          />
        </div>
        <hr className={graphUIStyles.graphHr}></hr>
      </div>
      <div>
        <div className={styles.graph}>
          <label className={styles.graphHeader}>Application Metrics</label>
          <div className={styles.infrastructureDropdown}>
            <Select
              id="applicationMetrics"
              onChange={setApplicationMetric}
              options={appMetricOptions}
              value={applicationMetric}
              disabled={appMetricOptions.length ? false : true}
              menuShouldPortal={true}
              placeholder={appMetricOptions.length ? 'select metric' : 'non available'}
            />
          </div>
          <Graph
            width={width / 2}
            height={height / 3.5}
            series={seriesApplication}
            timeRange={data.timeRange}
            showLines={true}
          />
        </div>
      </div>
    </div>
  );
};
