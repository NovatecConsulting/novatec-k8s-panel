import { PanelData } from "@grafana/data";
import { Types, Container, Pod, Namespace } from 'types';



export function getDeploymentCount(data: PanelData) {

    return data.series[1].fields[1].values.get(0);
}

// Deployment
export function getDeploymentInformation(data: PanelData) {
    const allNames = data.series[2].fields[1].values;
    let allElementInfo = new Array();
    for (let i = 0; i < allNames.length; i++) {
        let elementInfo = { type: Types.Deployment, container: "", pod: "", namespace: "", node: "", deployment: allNames.get(i) }
        allElementInfo.push(elementInfo);
    }
    return allElementInfo
}

export function getAllContainer(data: PanelData) {

    let allElementInfo = new Array();
    for (let i = 0; i < data.series[0].fields[5].values.length; i++) {
        let elementInfo = { type: Types.Container, container: "", pod: "", namespace: "", node: "", deployment: "" };

        elementInfo.container = data.series[0].fields[5].values.get(i);
        elementInfo.pod = data.series[0].fields[16].values.get(i);
        elementInfo.namespace = data.series[0].fields[15].values.get(i);
        allElementInfo.push(elementInfo);
    }
    return allElementInfo;
}



export function getAllElementInfo(data: PanelData) {

    const allElementInfo = getAllContainer(data);
    let allContainers: Container[] = [];

    for (let i = 0; i < allElementInfo.length; i++) {
        let container: Container = { Name: allElementInfo[i].container, Pod: allElementInfo[i].pod, Namespace: allElementInfo[i].namespace };
        allContainers.push(container)
    }

    let allPods: Pod[] = [];

    let podSet = new Set();
    for (let i = 0; i < allElementInfo.length; i++) {
        podSet.add(allElementInfo[i].pod);
    }
    let allElementPod = Array.from(podSet);
    console.log(allElementPod);
    for (let i = 0; i < allElementPod.length; i++) {
        let pod: Pod = { Name: "" + allElementPod[i], Container: [], Namespace: "" }
        for (let l = 0; l < allContainers.length; l++) {
            if (allContainers[l].Pod === pod.Name) {
                pod.Container.push(allContainers[l]);
                pod.Namespace = allContainers[l].Namespace
            }
        }
        allPods.push(pod);
    }

    let allNamespaces: Namespace[] = [];

    let namespaceSet = new Set();
    for (let i = 0; i < allElementInfo.length; i++) {
        namespaceSet.add(allElementInfo[i].namespace);
    }
    let allElementNamespace = Array.from(namespaceSet);
    for (let i = 0; i < allElementNamespace.length; i++) {
        let namespace: Namespace = { Name: "" + allElementNamespace[i], Pod: [] }
        for (let l = 0; l < allPods.length; l++) {
            if (allPods[l].Namespace === namespace.Name) {
                namespace.Pod.push(allPods[l])
            }
        }
        allNamespaces.push(namespace);
    }
    return allNamespaces;
}