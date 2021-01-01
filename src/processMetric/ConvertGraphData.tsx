import { PanelData, GraphSeriesXY, TimeRange, GraphSeriesValue } from '@grafana/data';
import { getAllContainer, getAllElementInfo } from './ConvertData';



/**
 * Calculate objects of the series.
 */
export function getSeries(width: number, data: PanelData, timeRange: TimeRange, name: string, level: string, metric: string) {

    if (level === "Deployment") {
        const pods = findPod(data, name);
        name = pods[0];
        level = "Pod";
        let allSeries = new Array();
        // If deployment consists of one pod.
        if (pods.length === 1) {
            return getOneSeries(width, data, timeRange, pods[0], level, metric)
        } else {
            for (let i = 0; i < pods.length; i++) {
                allSeries.push(getOneSeries(width, data, timeRange, pods[i], level, metric));
            }
            // Addition when deployment consists of multiple pods.
            let allData = allSeries[0][0].data;
            for (let i = 0; i < allSeries[0].length; i++) {
                if (i != 0) {
                    allData = allData[1].map(function (num: number, idx: number) {
                        return num + allSeries[0][i].data[1][idx];
                    });
                }
            }
            allSeries[0][0].data = allData;
            return allSeries[0];
        }

    } else {
        return getOneSeries(width, data, timeRange, name, level, metric)
    }
}



export function getApplicationSeries(width: number, data: PanelData, timeRange: TimeRange, name: string, level: string, metric: string) {

    if (level === 'Container') {
        return getOneSeries(width, data, timeRange, name, level, metric);
    } else {
        const allContainer = getAllContainer(data);
        let container = new Array();
        if (level === 'Pod') {

            for (let i = 0; i < allContainer.length; i++) {
                if (allContainer[i].pod === name) {
                    container.push(allContainer[i].container);
                }
            }
        } else if (level === 'Deployment') {

            for (let i = 0; i < allContainer.length; i++) {
                if (allContainer[i].deployment === name) {
                    container.push(allContainer[i].container);
                }
            }
        } else if (level === 'Namespace') {

            for (let i = 0; i < allContainer.length; i++) {
                if (allContainer[i].namespace === name) {
                    container.push(allContainer[i].container);
                }
            }
        }

        let allSeries = new Array();
        for (let i = 0; i < container.length; i++) {
            allSeries.push(getOneSeries(width, data, timeRange, container[i], "Container", metric));
        }

        let notEmpty = new Array();
        for (let i = 0; i < allSeries.length; i++) {
            if (allSeries[i].length !== 0) {
                notEmpty.push(allSeries[i]);
            }

        }

        allSeries = notEmpty;
        if (container.length === 1) {
            return allSeries[0];
        }

        let allData = allSeries[0][0].data;
        for (let i = 0; i < allSeries[0].length; i++) {
            if (i != 0) {
                allData = allData[1].map(function (num: number, idx: number) {
                    return num + allSeries[0][i].data[1][idx];
                });
            }
        }
        allSeries[0][0].data = allData;
        return allSeries[0];
    }
}


/**
 * Get the metic. 
 */
function convertMetricName(metric: string) {

    const infrastructureMetrics = [["CPU Usage", "cpu_usage"],
    ["Memory Usage", "container_memory_working_set_bytes"],
    ["Memory Saturation", "memory_saturation"],
    ["Network receive total", "network_receive"],
    ["Network transmit total", "network_transmit"],
    ["Network receive saturation", "network_receive_dropped"],
    ["Network transmit saturation", "network_transmit_dropped"],
    ["Network receive errors", "network_receive_errors"],
    ["Network transmit errors", "network_transmit_errors"]];


    const applicationMetrics = [["Service in count", "service_in_count"],
    ["Service out count", "service_out_count"],
    ["Service in responsetime sum", "service_in_responsetime_sum"],
    ["Service out responsetime sum", "service_out_responsetime_sum"],
    ["http in responsetime sum", "http_in_responsetime_sum"],
    ["http out responsetime sum", "http_out_responsetime_sum"]];


    const allMetrics = infrastructureMetrics.concat(applicationMetrics);

    for (let i = 0; i < allMetrics.length; i++) {

        if (metric === allMetrics[i][0]) {
            return allMetrics[i][1];
        }
    }
    return "";

}

/**
 * If the metrics are displayed from a deployment, the affected pods must be found.
 * @param data 
 * @param name 
 */
function findPod(data: PanelData, name: string) {
    const allElements = getAllElementInfo(data);
    let podsOfDeployment = new Array();

    for (let i = 0; i < allElements.length; i++) {
        for (let l = 0; l < allElements[i].Deployment.length; l++) {
            if (allElements[i].Deployment[l].Name === name) {
                for (let j = 0; j < allElements[i].Deployment[l].Pod.length; j++) {
                    podsOfDeployment.push(allElements[i].Deployment[l].Pod[j].Name);
                }

            }
        }
    }
    return podsOfDeployment;
}



/**
 * Calculates a series.
 */
function getOneSeries(width: number, data: PanelData, timeRange: TimeRange, name: string, level: string, metric: string) {

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