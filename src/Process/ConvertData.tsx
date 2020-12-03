import { PanelData } from "@grafana/data";
import { Types } from 'types';


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
export function getNamespaceInformation(data: PanelData) {

    const allNames = data.series[6].fields[1].values;
    let allElementInfo = new Array();

    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Namespace, container: "", pod: "", namespace: allNames.get(i), node: "", service: "" }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;
}

// Service
export function getServiceInformation(data: PanelData) {

    const allNames = data.series[7].fields[1].values;
    let allElementInfo = new Array();
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Service, container: "", pod: "", namespace: "", node: "", service: allNames.get(i) }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;
}



// Pod
export function getPodInformation(data: PanelData) {

    const allNames = data.series[4].fields[1].values;
    let allElementInfo = new Array();
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Pod, container: "", pod: allNames.get(i), namespace: "", node: "", service: "" }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;
}

// Container
export function getContainerInformation(data: PanelData) {

    const allNames = data.series[5].fields[1].values;
    let allElementInfo = new Array();
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Container, container: allNames.get(i), pod: "", namespace: "", node: "", service: "" }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;
}





export function getAllElementInfo(data: PanelData) {

    let allElementInfo = new Array();
    for (let i = 0; i < data.series[8].fields[5].values.length; i++) {
        let elementInfo = { type: Types.Container, container: "", pod: "", namespace: "", node: "", service: "" };
        
        elementInfo.container = data.series[8].fields[5].values.get(i);
        elementInfo.pod = data.series[8].fields[16].values.get(i);
        elementInfo.namespace = data.series[8].fields[15].values.get(i);
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;

}