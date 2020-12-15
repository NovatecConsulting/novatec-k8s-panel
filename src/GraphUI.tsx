import React from 'react';

import { Graph } from '@grafana/ui'
import { PanelData, GraphSeriesXY, TimeRange, GraphSeriesValue } from '@grafana/data';
import { DropdownUI } from 'uiElement/Dropdown';

// import { stylesFactory, useTheme } from '@grafana/ui';


type Props = {
    width: number,
    height: number,
    data: PanelData
    timeRange: TimeRange

}

export const GraphUI = ({ width, height, data, timeRange }: Props) => {

    let ser_ind: number = 0;

    let series: GraphSeriesXY[] = [];

    const timeVals: Array<GraphSeriesValue> = data.series[0].fields[0].values.toArray();
    const yVals: Array<GraphSeriesValue> = data.series[0].fields[1].values.toArray();

    const data1: GraphSeriesValue[][] = [];
    for (let i = 0; i < timeVals.length; i++) {
        data1.push([timeVals[i], yVals[i]]);
    }

    const unixTimeRange = timeRange.to.unix() - timeRange.from.unix();
    const ser: GraphSeriesXY = {
        seriesIndex: ser_ind++,
        yAxis: { index: 0 },
        isVisible: true,
        timeField: data.series[0].fields[0],
        valueField: data.series[0].fields[1],
        timeStep: width / unixTimeRange,
        data: data1,
        label: 'some label',
    };
    series.push(ser);


    return (
        <div>
            <label className="graphName">[Name]</label>
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
