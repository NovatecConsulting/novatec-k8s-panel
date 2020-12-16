import { PanelData, GraphSeriesXY, TimeRange, GraphSeriesValue } from '@grafana/data';

export function getSeries(width: number, data: PanelData, timeRange: TimeRange, name: string) {

    let ser_ind: number = 0;
    let series: GraphSeriesXY[] = [];

    let dataIndex = 0;

    for (let i = 0; i < data.series.length; i++) {
        const temp = data.series[i].name?.split(" ");

        if (temp !== undefined) {
            if (temp[0] === name) {
                dataIndex = i;
            }
        }
    }

    const timeVals: Array<GraphSeriesValue> = data.series[dataIndex].fields[0].values.toArray();
    const yVals: Array<GraphSeriesValue> = data.series[dataIndex].fields[1].values.toArray();
    const data1: GraphSeriesValue[][] = [];
    for (let i = 0; i < timeVals.length; i++) {
        data1.push([timeVals[i], yVals[i]]);
    }
    const unixTimeRange = timeRange.to.unix() - timeRange.from.unix();
    const ser: GraphSeriesXY = {
        seriesIndex: ser_ind++,
        yAxis: { index: 0 },
        isVisible: true,
        timeField: data.series[dataIndex].fields[0],
        valueField: data.series[dataIndex].fields[1],
        timeStep: width / unixTimeRange,
        data: data1,
        label: 'some label',
    };
    series.push(ser);
    return series;
}