import { PanelData, GraphSeriesXY, TimeRange, GraphSeriesValue } from '@grafana/data';
import { getAllContainer, getAllElementInfo } from './ConvertData';

/**
 * Calculate infrastructure series.
 */
export function getInfrastructureSeries(
  width: number,
  data: PanelData,
  timeRange: TimeRange,
  name: string,
  level: string,
  metric: string
) {
  const metricType = "infra";
  if (level === 'Deployment') {
    const pods = findPod(data, name);
    name = pods[0];
    level = 'Pod';
    let allSeries: any = [];
    for (let i = 0; i < pods.length; i++) {
      allSeries.push(getOneSeries(width, data, timeRange, pods[i], level, metric, metricType));
    }
    // Addition when deployment consists of multiple pods.
    let allData = allSeries[0][0].data;
    for (let i = 0; i < allSeries[0].length; i++) {
      if (i !== 0) {
        allData = allData[1].map(function (num: number, idx: number) {
          return num + allSeries[0][i].data[1][idx];
        });
      }
    }
    allSeries[0][0].data = allData;
    return allSeries[0];

  } else {
    return getOneSeries(width, data, timeRange, name, level, metric, metricType);
  }
}

/**
 * Calculate application series.
 */
export function getApplicationSeries(
  width: number,
  data: PanelData,
  timeRange: TimeRange,
  name: string,
  level: string,
  metric: string
) {
  const metricType = "app";
  if (level === 'Container') {
    return getOneSeries(width, data, timeRange, name, level, metric, metricType);
  } else {
    const allContainer = getAllContainer(data);
    let container = [];
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

    let allSeries = [];
    for (let i = 0; i < container.length; i++) {
      allSeries.push(getOneSeries(width, data, timeRange, container[i], 'Container', metric, metricType));
    }

    let notEmpty: any = [];
    for (let i = 0; i < allSeries.length; i++) {
      if (allSeries[i].length !== 0) {
        notEmpty.push(allSeries[i]);
      }
    }

    allSeries = notEmpty;
    if (container.length === 1) {
      return allSeries[0];
    }

    if (allSeries.length === 0) {
      return [];
    }
    for (let i = 0; i < allSeries.length; i++) {
      if (i !== 0) {
        for (let l = 0; l < allSeries[0][0].data.length; l++) {
          allSeries[0][0].data[l][1] += allSeries[i][0].data[l][1];
          allSeries[0][0].valueField.values.set(l, allSeries[0][0].data[l][1]);
        }
      }
    }
    return allSeries[0];
  }
}

/**
 * Return the name of the metric.
 */
function convertMetricName(metric: string) {
  const infrastructureMetrics = [
    ['CPU Usage', 'cpu_usage'],
    ['Memory Usage', 'container_memory_working_set_bytes'],
    ['Memory Saturation', 'memory_saturation'],
    ['Network receive total', 'network_receive'],
    ['Network transmit total', 'network_transmit'],
    ['Network receive saturation', 'network_receive_dropped'],
    ['Network transmit saturation', 'network_transmit_dropped'],
    ['Network receive errors', 'network_receive_errors'],
    ['Network transmit errors', 'network_transmit_errors'],
  ];

  const applicationMetrics = [
    ['Service in count', 'service_in_count'],
    ['Service out count', 'service_out_count'],
    ['Service in responsetime sum', 'service_in_responsetime_sum'],
    ['Service out responsetime sum', 'service_out_responsetime_sum'],
    ['http in responsetime sum', 'http_in_responsetime_sum'],
    ['http out responsetime sum', 'http_out_responsetime_sum'],
    ['jvm memory heap', 'jvm_memory_used_heap'],
    ['jvm memory non heap', 'jvm_memory_used_nonheap'],
  ];

  const nodeMetrics = [
    ['Write total', 'container_fs_writes_total'],
    ['Read total', 'container_fs_reads_total'],
    ['Alloctable CPU Cores', 'kube_node_status_allocatable_cpu_cores'],
    ['Alloctable Memory Bytes', 'kube_node_status_allocatable_memory_bytes'],
    ['Active Memory', 'node_memory_Active_bytes'],
    ['Inactive Memory', 'node_memory_Inactive_bytes'],
  ];

  const allMetrics = infrastructureMetrics.concat(applicationMetrics).concat(nodeMetrics);
  for (let i = 0; i < allMetrics.length; i++) {
    if (metric === allMetrics[i][0]) {
      return allMetrics[i][1];
    }
  }
  return '';
}

/**
 * Returns an array of all pods in a given deployment
 * If the metrics are displayed from a deployment, the affected pods must be found.
 */
function findPod(data: PanelData, name: string) {
  const allElements = getAllElementInfo(data);
  let podsOfDeployment = [];

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
 * Calculates one series.
 */
// export function getOneSeries(
//   width: number,
//   data: PanelData,
//   timeRange: TimeRange,
//   name: string,
//   level: string,
//   metric: string
// ) {
//   let ser_ind = 0;
//   let series: GraphSeriesXY[] = [];

//   const metricName = convertMetricName(metric);
//   // convert metric to promql metric name

//   let dataIndex = 0;
//   for (let i = 0; i < data.series.length; i++) {
//     const temp = data.series[i].name?.split(' ');
//     if (temp !== undefined) {
//       if (temp[0] === name) {
//         if (temp[1] === level) {
//           if (temp[2] === metricName) {
//             dataIndex = i;
//           }
//         }
//       }
//     }
//   }

//   if (dataIndex === 0) {
//     return series;
//   }

//   const timeVals: GraphSeriesValue[] = data.series[dataIndex].fields[0].values.toArray();
//   const yVals: GraphSeriesValue[] = data.series[dataIndex].fields[1].values.toArray();
//   const data1: GraphSeriesValue[][] = [];
//   for (let i = 0; i < timeVals.length; i++) {
//     data1.push([timeVals[i], yVals[i]]);
//   }
//   const unixTimeRange = timeRange.to.unix() - timeRange.from.unix();
//   const ser: GraphSeriesXY = {
//     seriesIndex: ser_ind++,
//     yAxis: { index: 0 },
//     isVisible: true,
//     timeField: data.series[dataIndex].fields[0],
//     valueField: data.series[dataIndex].fields[1],
//     timeStep: width / unixTimeRange,
//     data: data1,
//     label: metric,
//   };
//   series.push(ser);
//   return series;
// }

export function getOneSeries(
  width: number,
  data: PanelData,
  timeRange: TimeRange,
  name: string,
  level: string,
  metric: string,
  metricType: string
) {
  let ser_ind = 0;
  let series: GraphSeriesXY[] = [];

  const metricName = convertMetricName(metric);
  // convert metric to promql metric name

  let dataIndex = 0;
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].refId?.includes(metricType) &&
      data.series[i].refId?.includes(metricName) &&
      data.series[i].refId?.includes(level.toLowerCase()) &&
      data.series[i].name?.includes(name)) {
      dataIndex = i;
    }
  }

  if (dataIndex === 0) {
    return series;
  }

  const timeVals: GraphSeriesValue[] = data.series[dataIndex].fields[0].values.toArray();
  const yVals: GraphSeriesValue[] = data.series[dataIndex].fields[1].values.toArray();
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