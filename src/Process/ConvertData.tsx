import { PanelData } from "@grafana/data";
import { Element, Types } from 'types';


// Count
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





// Name
// Namespace
export function getNamespaceInformation(data: PanelData, allElements: Element[]) {

    const allNames = data.series[6].fields[1].values;
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Namespace, container: "", pod: "", namespace: allNames.get(i), node: "", service: "" }
        allElements[i].elementInfo = elementInfo;
        allElements[i].text = allNames.get(i);
    }
    return allElements;
}

// Service
export function getServiceInformation(data: PanelData, allElements: Element[]) {

    const allNames = data.series[7].fields[1].values;
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Service, container: "", pod: "", namespace: "", node: "", service: allNames.get(i) }
        allElements[i].elementInfo = elementInfo;
        allElements[i].text = allNames.get(i);
    }
    return allElements;
}



// Pod
export function getPodInformation(data: PanelData, allElements: Element[]) {

    const allNames = data.series[4].fields[1].values;
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Pod, container: "", pod: allNames.get(i), namespace: "", node: "", service: "" }
        allElements[i].elementInfo = elementInfo;
        allElements[i].text = allNames.get(i);
    }
    return allElements;
}

// Container
export function getContainerInformation(data: PanelData, allElements: Element[]) {

    const allNames = data.series[5].fields[1].values;
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Container, container: allNames.get(i), pod: "", namespace: "", node: "", service: "" }
        allElements[i].elementInfo = elementInfo;
        allElements[i].text = allNames.get(i);
    }
    return allElements;
}
