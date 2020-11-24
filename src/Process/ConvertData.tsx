import { PanelData } from "@grafana/data";

export function getPodCount(data: PanelData) {
    return data.series[0].fields[1].values.get(0);
}

export function getContainerCount(data: PanelData) {
    return data.series[1].fields[1].values.get(0);
}

export function getNamespaceCount(data: PanelData) {
    return data.series[2].fields[1].values.get(0);;
}

export function getServiceCount(data: PanelData) {
    return data.series[3].fields[1].values.get(0);
}
