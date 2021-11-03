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

  let dataIndex = 0;
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].refId?.includes(metricType) &&
      data.series[i].refId?.includes(metric) &&
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

