import React from 'react';

import { Graph } from '@grafana/ui'
import { PanelData, GraphSeriesXY, TimeRange } from '@grafana/data';
import { DropdownUI } from 'uiElement/Dropdown';
import { getSeries } from './processMetric/ConvertGraphData'
import { Element } from './types'


// import { stylesFactory, useTheme } from '@grafana/ui';


type Props = {
    width: number;
    height: number;
    data: PanelData;
    timeRange: TimeRange;
    setShowGraph: (value: boolean) => void;
    focusItem: Element;

}

export const GraphUI = ({ width, height, data, timeRange, setShowGraph, focusItem }: Props) => {

    let series: GraphSeriesXY[] = getSeries(width, data, timeRange, focusItem.text);



    return (
        <div>
            <img src="https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/back2.png" onClick={() => setShowGraph(false)} className="graphBack" />
            <label className="graphName">{focusItem.text}</label>
            <div className="graph">
                <label className="graphHeader">Infrastructure Metrics</label>
                <div className="infrastructureDropdown">
                    <DropdownUI
                        id="infrastructurMetrics"
                        onChange={() => null}
                        options={[]}
                        value={"test"}
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
