import React, { useState } from 'react';
import { Graph, useStyles2, Button, Select } from '@grafana/ui';
import { PanelData, GraphSeriesXY, TimeRange, SelectableValue } from '@grafana/data';
import { getInfrastructureSeries, getApplicationSeries } from './processMetric/ConvertGraphData';
import { Element } from './types';
import getStyles from 'styles/component/GraphStyle';
import getGraphUIStyles from 'styles/component/GraphUIStyle';

type Props = {
  width: number;
  height: number;
  data: PanelData;
  timeRange: TimeRange;
  setShowGraph: (value: boolean) => void;
  focusItem: Element;
  level: string;
};

/**
 * Infrastructure and application metrics component.
 */
export const GraphUI = ({ width, height, data, timeRange, setShowGraph, focusItem, level }: Props) => {
  const [infrastructureMetric, setInfrastructureMetric] = useState('choose metric..');
  const [applicationMetric, setApplicationMetric] = useState('choose metric..');
  let seriesInfrastructure: GraphSeriesXY[] = getInfrastructureSeries(
    width,
    data,
    timeRange,
    focusItem.text,
    level,
    infrastructureMetric
  );
  let seriesApplication: GraphSeriesXY[] = getApplicationSeries(
    width,
    data,
    timeRange,
    focusItem.text,
    level,
    applicationMetric
  );
  const styles = useStyles2(getStyles);
  const graphUIStyles = useStyles2(getGraphUIStyles);

  // is undefined if no application metrics are available
  if (seriesApplication === undefined) {
    seriesApplication = [];
  }

  const dropdownInfrastructureChange = (label: string | undefined) => {
    if (label !== undefined) {
      setInfrastructureMetric(label);
    }
  };

  const dropdownApplicationChange = (label: string | undefined) => {
    if (label !== undefined) {
      setApplicationMetric(label);
    }
  };

  function availableMetrics(data: PanelData, level: string, metricType: string) {
    let options: SelectableValue[] = [];
    for (let i = 0; i < data.series.length; i++) {
      if (data.series[i].refId?.includes(metricType) && data.series[i].refId?.includes(level.toLowerCase())) {
        if (data.series[i].refId !== undefined) {
          let str: SelectableValue = { label: data.series[i].refId };
          str.label = str.label?.substring(str.label?.indexOf('/') + 1, str.label?.lastIndexOf('/'));
          let found = false;
          for (let i = 0; i < options.length; i++) {
            if (options[i].label === str.label) {
              found = true;
              break;
            }
          }
          if (found === false) {
            options.push(str);
          }
        }
      }
    }
    return options;
  }

  return (
    <div>
      <Button variant="secondary" size="sm" icon="arrow-left" onClick={() => setShowGraph(false)}>
        Back
      </Button>
      <div>
        <label className={styles.graphName}>{focusItem.text}</label>
        <div className={styles.graph}>
          <label className={styles.graphHeader}>Infrastructure Metrics</label>
          <div className={styles.infrastructureDropdown}>
            <Select
              id="infrastructurMetrics"
              onChange={(item) => dropdownInfrastructureChange(item.value)}
              options={availableMetrics(data, level, 'infra')}
              value={{ label: infrastructureMetric }}
              disabled={false}
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
              onChange={(item) => dropdownApplicationChange(item.value)}
              options={availableMetrics(data, level, 'app')}
              value={{ label: applicationMetric }}
              disabled={false}
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
