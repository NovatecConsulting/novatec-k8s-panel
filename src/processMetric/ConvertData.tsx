import { PanelData } from "@grafana/data";
import { Types, Container, Pod, Namespace } from 'types';


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


export function getDeploymentCount(data: PanelData) {

    return data.series[3].fields[1].values.get(0);
}




// Name
// Namespace
export function getNamespaceInformation(data: PanelData) {

    const allNames = data.series[6].fields[1].values;
    let allElementInfo = new Array();

    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Namespace, container: "", pod: "", namespace: allNames.get(i), node: "", deployment: "" }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;
}


// Deployment
export function getDeploymentInformation(data: PanelData) {
    const allNames = data.series[7].fields[1].values;
    let allElementInfo = new Array();
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Deployment, container: "", pod: "", namespace: "", node: "", deployment: allNames.get(i) }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo
}


// Pod
export function getPodInformation(data: PanelData) {

    const allNames = data.series[4].fields[1].values;
    let allElementInfo = new Array();
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Pod, container: "", pod: allNames.get(i), namespace: "", node: "", deployment: "" }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;
}

// Container
export function getContainerInformation(data: PanelData) {

    const allNames = data.series[5].fields[1].values;
    let allElementInfo = new Array();
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Container, container: allNames.get(i), pod: "", namespace: "", node: "", deployment: "" }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;
}





export function getAllElementInfo(data: PanelData) {

    let allElementInfo = new Array();
    for (let i = 0; i < data.series[8].fields[5].values.length; i++) {
        let elementInfo = { type: Types.Container, container: "", pod: "", namespace: "", node: "", deployment: "" };

        elementInfo.container = data.series[8].fields[5].values.get(i);
        elementInfo.pod = data.series[8].fields[16].values.get(i);
        elementInfo.namespace = data.series[8].fields[15].values.get(i);
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;

}



export function getAllElementInfo2(data: PanelData) {


    let allElementInfo = new Array();

    for (let i = 0; i < data.series[8].fields[5].values.length; i++) {
        let elementInfo = { type: Types.Container, container: "", pod: "", namespace: "", node: "", deployment: "" };

        elementInfo.container = data.series[8].fields[5].values.get(i);
        elementInfo.pod = data.series[8].fields[16].values.get(i);
        elementInfo.namespace = data.series[8].fields[15].values.get(i);
        allElementInfo.push(elementInfo);
    }


    let allContainers: Container[] = [];

    for (let i = 0; i < allElementInfo.length; i++) {
        let container: Container = { Name: allElementInfo[i].container, Pod: allElementInfo[i].pod, Namespace: allElementInfo[i].namespace };
        allContainers.push(container)
    }

    let allPods: Pod[] = [];

    let allElementPod = getPodInformation(data);
    for (let i = 0; i < allElementPod.length; i++) {
        let pod: Pod = { Name: allElementPod[i].pod, Container: [], Namespace: "" }
        for (let l = 0; l < allContainers.length; l++) {
            if (allContainers[l].Pod === pod.Name) {
                pod.Container.push(allContainers[l]);
                pod.Namespace = allContainers[l].Namespace
            }
        }
        allPods.push(pod);
    }


    let allNamespaces: Namespace[] = [];

    let allElementNamespace = getNamespaceInformation(data);


    for (let i = 0; i < allElementNamespace.length; i++) {
        let namespace: Namespace = { Name: allElementNamespace[i].namespace, Pod: [] }
        for (let l = 0; l < allPods.length; l++) {
            if (allPods[l].Namespace === namespace.Name) {
                namespace.Pod.push(allPods[l])
            }
        }
        allNamespaces.push(namespace);
    }


    return allNamespaces;

}