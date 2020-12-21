import { PanelData, GraphSeriesXY, TimeRange, GraphSeriesValue } from '@grafana/data';

export function getSeries(width: number, data: PanelData, timeRange: TimeRange, name: string, level: string, metric: string) {

    let ser_ind: number = 0;
    let series: GraphSeriesXY[] = [];

    const metricName = convertMetricName(metric);
    // convert metric to promql metric name

    let dataIndex = 0;
    for (let i = 0; i < data.series.length; i++) {
        const temp = data.series[i].name?.split(" ");
        if (temp !== undefined) {
            if (temp[0] === name) {
                if (temp[1] === level) {
                    if (temp[2] === metricName) {
                        dataIndex = i;
                    }

                }

            }
        }
    }

    if (dataIndex === 0) {
        return series;
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
        label: metric,
    };
    series.push(ser);
    return series;
}


function convertMetricName(metric: string) {


    const allMetrics = [["CPU Usage", "cpu_usage"], ["Memory Usage", "container_memory_working_set_bytes"], ["Memory Saturation", "memory_saturation"]];

    for (let i = 0; i < allMetrics.length; i++) {

        if (metric === allMetrics[i][0]) {
            return allMetrics[i][1];
        }
    }
    return "";

}