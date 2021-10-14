import React, { useState } from 'react';
import { Button, Graph, useStyles2 } from '@grafana/ui';
import { PanelData, GraphSeriesXY, TimeRange } from '@grafana/data';
import { css } from '@emotion/css';
import { DropdownComponent } from 'Menu/Dropdown';
import { getInfrastructureSeries, getApplicationSeries } from './processMetric/ConvertGraphData';
import { Element } from './types';
import { dropdownInfrastructureOption } from './Menu/DropdownOptions';
import { dropdownApplicationOption } from './Menu/DropdownOptions';
import { getStyles } from 'styles/component/GraphStyle';

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
  const [infrastructureMetric, setInfrastructureMetric] = useState('CPU Usage');
  const [applicationMetric, setApplicationMetric] = useState('Service in count');
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
            <DropdownComponent
              id="infrastructurMetrics"
              onChange={dropdownInfrastructureChange}
              options={dropdownInfrastructureOption(infrastructureMetric, level)}
              value={infrastructureMetric}
              isDisabled={false}
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
        <hr
          className={css`
            border-top: 2px solid black;
            width: 100%;
          `}
        ></hr>
      </div>
      <div>
        <div className={styles.graph}>
          <label className={styles.graphHeader}>Application Metrics</label>
          <div className={styles.infrastructureDropdown}>
            <DropdownComponent
              id="applicationMetrics"
              onChange={dropdownApplicationChange}
              options={dropdownApplicationOption(applicationMetric)}
              value={applicationMetric}
              isDisabled={false}
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
