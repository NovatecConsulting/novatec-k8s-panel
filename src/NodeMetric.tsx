import React, { useState } from 'react';
import { Button, Graph, Select, useStyles2 } from '@grafana/ui';
import { PanelData, GraphSeriesXY, TimeRange } from '@grafana/data';
import { Element } from './types';
import { dropdownNodeOption } from './Menu/DropdownOptions';
import { getInfrastructureSeries } from './processMetric/ConvertGraphData';
import { getStyles } from 'styles/component/GraphStyle';
import { getStyles as getNodeStyle } from 'styles/component/NodeMetricStyle';

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
 * Component to display the node metrics.
 */
export const NodeMetric = ({ width, height, data, timeRange, setShowGraph, focusItem, level }: Props) => {
  const [nodeMetric, setNodeMetric] = useState('Write total');
  let seriesInfrastructure: GraphSeriesXY[] = getInfrastructureSeries(
    width,
    data,
    timeRange,
    focusItem.text,
    level,
    nodeMetric
  );
  const styles = useStyles2(getStyles);
  const nodeStyles = useStyles2(getNodeStyle);

  const dropdownInfrastructureChange = (label: string | undefined) => {
    if (label !== undefined) {
      setNodeMetric(label);
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
          <label className={styles.graphHeader}>Node Metrics</label>
          <div className={styles.infrastructureDropdown}>
            <Select
              id="infrastructurMetrics"
              onChange={(item) => dropdownInfrastructureChange(item.value)}
              options={dropdownNodeOption(nodeMetric)}
              value={{ label: nodeMetric }}
              disabled={false}
            />
          </div>
        </div>
        <div className={nodeStyles.nodeGraph}>
          <Graph
            width={width / 1.5}
            height={height / 1.5}
            series={seriesInfrastructure}
            timeRange={data.timeRange}
            showLines={true}
          />
        </div>
      </div>
    </div>
  );
};
