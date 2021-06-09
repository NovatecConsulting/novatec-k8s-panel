import React, { useState } from 'react';
import { Graph } from '@grafana/ui';
import { PanelData, GraphSeriesXY, TimeRange } from '@grafana/data';
import { DropdownComponent } from 'Menu/Dropdown';
import { getInfrastructureSeries, getApplicationSeries } from './processMetric/ConvertGraphData';
import { Element } from './types';
import { dropdownInfrastructureOption } from './Menu/DropdownOptions';
import { dropdownApplicationOption } from './Menu/DropdownOptions';

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
      <button onClick={() => setShowGraph(false)} className="graphBack">
        back
      </button>
      <div>
        <label className="graphName">{focusItem.text}</label>
        <div className="graph">
          <label className="graphHeader">Infrastructure Metrics</label>
          <div className="infrastructureDropdown">
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
        <hr className="graphHr"></hr>
      </div>
      <div>
        <div className="graph">
          <label className="graphHeader">Application Metrics</label>
          <div className="infrastructureDropdown">
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
