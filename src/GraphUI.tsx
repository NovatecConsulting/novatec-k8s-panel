import React, { useState } from 'react';

import { Graph } from '@grafana/ui'
import { PanelData, GraphSeriesXY, TimeRange } from '@grafana/data';
import { DropdownUI } from 'uiElement/Dropdown';
import { getSeries, getApplicationSeries } from './processMetric/ConvertGraphData';
import { Element } from './types';
import { dropdownInfrastructureOption } from './uiElement/DropdownOptions';
import { dropdownApplicationOption } from './uiElement/DropdownOptions';

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

    const [infrastructureMetric, setInfrastructureMetric] = useState("CPU Usage");
    const [applicationMetric, setApplicationMetric] = useState("Service in count");
    let seriesInfrastructure: GraphSeriesXY[] = getSeries(width, data, timeRange, focusItem.text, level, infrastructureMetric);
    let seriesApplication: GraphSeriesXY[] = getApplicationSeries(width, data, timeRange, focusItem.text, level, applicationMetric);

    // Is undefined if there are no agents in the container.
    if (seriesApplication === undefined) {
        seriesApplication = [];
    }


    const dropdownInfrastructureChange = (label: string | undefined) => {
        if (label !== undefined) {
            setInfrastructureMetric(label)
        }
    }

    const dropdownApplicationChange = (label: string | undefined) => {
        if (label !== undefined) {
            setApplicationMetric(label);
        }
    }

    return (
        <div>
            <img src="https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/back2.png" onClick={() => setShowGraph(false)} className="graphBack" />
            <div>
                <label className="graphName">{focusItem.text}</label>
                <div className="graph">
                    <label className="graphHeader">Infrastructure Metrics</label>
                    <div className="infrastructureDropdown">
                        <DropdownUI
                            id="infrastructurMetrics"
                            onChange={dropdownInfrastructureChange}
                            options={dropdownInfrastructureOption(infrastructureMetric)}
                            value={infrastructureMetric}
                            isDisabled={false}
                        />
                    </div>

                    <Graph
                        width={width / 2}
                        height={height / 3}
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
                        <DropdownUI
                            id="applicationMetrics"
                            onChange={dropdownApplicationChange}
                            options={dropdownApplicationOption(applicationMetric)}
                            value={applicationMetric}
                            isDisabled={false}
                        />
                    </div>
                    <Graph
                        width={width / 2}
                        height={height / 3}
                        series={seriesApplication}
                        timeRange={data.timeRange}
                        showLines={true}
                    />
                </div>
            </div>
        </div>
    );

}
