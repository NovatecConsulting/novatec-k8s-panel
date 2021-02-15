import React, { useState } from 'react';

import { Graph } from '@grafana/ui'
import { PanelData, GraphSeriesXY, TimeRange } from '@grafana/data';
import { DropdownComponent } from 'Menu/Dropdown';
import { Element } from './types';
import { dropdownNodeOption } from './Menu/DropdownOptions';
import { getSeries } from './processMetric/ConvertGraphData';

type Props = {
    width: number;
    height: number;
    data: PanelData;
    timeRange: TimeRange;
    setShowGraph: (value: boolean) => void;
    focusItem: Element;
    level: string

}

export const NodeMetric = ({ width, height, data, timeRange, setShowGraph, focusItem, level }: Props) => {

    const [nodeMetric, setNodeMetric] = useState("Write total");
    let seriesInfrastructure: GraphSeriesXY[] = getSeries(width, data, timeRange, focusItem.text, level, nodeMetric);
  

    const dropdownInfrastructureChange = (label: string | undefined) => {
        if (label !== undefined) {
            setNodeMetric(label)
        }
    }

    return (
        <div>
            <img src="https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/back2.png" onClick={() => setShowGraph(false)} className="graphBack" />
            <div>
                <label className="graphName">{focusItem.text}</label>
                <div className="graph">
                    <label className="graphHeader">Node Metrics</label>
                    <div className="infrastructureDropdown">
                        <DropdownComponent
                            id="infrastructurMetrics"
                            onChange={dropdownInfrastructureChange}
                            options={dropdownNodeOption(nodeMetric)}
                            value={nodeMetric}
                            isDisabled={false}
                        />
                    </div>
                </div>
                <div className="NodeGraph">
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

}
