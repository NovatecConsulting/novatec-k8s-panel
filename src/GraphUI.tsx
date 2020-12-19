import React, { useState } from 'react';

import { Graph } from '@grafana/ui'
import { PanelData, GraphSeriesXY, TimeRange } from '@grafana/data';
import { DropdownUI } from 'uiElement/Dropdown';
import { getSeries } from './processMetric/ConvertGraphData';
import { Element } from './types';
import { dropdownInfrastructureOption } from './uiElement/DropdownOptions';


// import { stylesFactory, useTheme } from '@grafana/ui';


type Props = {
    width: number;
    height: number;
    data: PanelData;
    timeRange: TimeRange;
    setShowGraph: (value: boolean) => void;
    focusItem: Element;
    level: string

}

export const GraphUI = ({ width, height, data, timeRange, setShowGraph, focusItem, level }: Props) => {

    const [infrastructureMetric, setInfrastructureMetric] = useState("cpu_usage");
    let series: GraphSeriesXY[] = getSeries(width, data, timeRange, focusItem.text, level, infrastructureMetric);


    const dropdownChange = (label: string | undefined) => {
        if (label !== undefined) {
            setInfrastructureMetric(label)
        }

    }

    return (
        <div>
            <img src="https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/back2.png" onClick={() => setShowGraph(false)} className="graphBack" />
            <label className="graphName">{focusItem.text}</label>
            <div className="graph">
                <label className="graphHeader">Infrastructure Metrics</label>
                <div className="infrastructureDropdown">
                    <DropdownUI
                        id="infrastructurMetrics"
                        onChange={dropdownChange}
                        options={dropdownInfrastructureOption()}
                        value={infrastructureMetric}
                    />
                </div>

                <Graph
                    width={width / 2}
                    height={height / 3}
                    series={series}
                    timeRange={data.timeRange}
                    showLines={true}

                />
            </div>
            <hr className="graphHr"></hr>
        </div>
    );

}
