import { PanelData } from "@grafana/data";
import { Types, Container, Pod, Namespace, Deployment } from 'types';

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
    const allDeployment = addDeployment(data);

    for (let i = 0; i < data.series[0].fields[5].values.length; i++) {
        let elementInfo = { type: Types.Container, container: "", pod: "", namespace: "", node: "", deployment: "" };

        elementInfo.container = data.series[0].fields[5].values.get(i);
        elementInfo.pod = data.series[0].fields[16].values.get(i);
        elementInfo.namespace = data.series[0].fields[15].values.get(i);
        elementInfo.node = data.series[0].fields[14].values.get(i);

        for (let l = 0; l < allDeployment.length; l++) {
            if (allDeployment[l].pod === elementInfo.pod) {
                elementInfo.deployment = allDeployment[l].deployment;
            }
        }
        allElementInfo.push(elementInfo);
    }

    return allElementInfo;
}



export function getAllElementInfo(data: PanelData) {

    const allElementInfo = getAllContainer(data);

    let allContainers: Container[] = [];

    for (let i = 0; i < allElementInfo.length; i++) {
        let container: Container = { Name: allElementInfo[i].container, Pod: allElementInfo[i].pod, Namespace: allElementInfo[i].namespace, Deployment: "", Node: allElementInfo[i].node };
        allContainers.push(container)
    }

    let allPods: Pod[] = [];

    let podSet = new Set();
    for (let i = 0; i < allElementInfo.length; i++) {
        podSet.add(allElementInfo[i].pod);
    }
    let allElementPod = Array.from(podSet);
    for (let i = 0; i < allElementPod.length; i++) {
        let pod: Pod = { Name: "" + allElementPod[i], Container: [], Namespace: "", Deployment: "", Node: "" }
        for (let l = 0; l < allContainers.length; l++) {
            if (allContainers[l].Pod === pod.Name) {
                pod.Container.push(allContainers[l]);
                pod.Namespace = allContainers[l].Namespace;
                pod.Node = allContainers[l].Node;
            }
        }
        allPods.push(pod);
    }

    const allDeployments = addDeployment(data);

    let allDeploymentObjects: Deployment[] = [];

    for (let i = 0; i < allDeployments.length; i++) {
        let podsInDeployment: Pod[] = []
        let containerInDeployment: Container[] = [];
        for (let l = 0; l < allPods.length; l++) {
            if (allPods[l].Name === allDeployments[i].pod) {
                allPods[l].Deployment = allDeployments[i].deployment;
                for (let j = 0; j < allPods[l].Container.length; j++) {
                    allPods[l].Container[j].Deployment = allDeployments[i].deployment;
                    containerInDeployment.push(allPods[l].Container[j])
                }
                podsInDeployment.push(allPods[l])
            }
        }
        let deployment: Deployment = { Name: allDeployments[i].deployment, Namespace: allDeployments[i].namespace, Pod: podsInDeployment, Container: containerInDeployment }
        allDeploymentObjects.push(deployment);
    }

    let allNamespaces: Namespace[] = [];
    let namespaceSet = new Set();
    for (let i = 0; i < allElementInfo.length; i++) {
        namespaceSet.add(allElementInfo[i].namespace);
    }
    let allElementNamespace = Array.from(namespaceSet);
    for (let i = 0; i < allElementNamespace.length; i++) {
        let namespace: Namespace = { Name: "" + allElementNamespace[i], Pod: [], Deployment: [] }
        for (let l = 0; l < allPods.length; l++) {
            if (allPods[l].Namespace === namespace.Name) {
                namespace.Pod.push(allPods[l])
            }
        }

        for (let j = 0; j < allDeploymentObjects.length; j++) {
            if (allDeploymentObjects[j].Namespace === namespace.Name) {
                namespace.Deployment.push(allDeploymentObjects[j])
            }
        }

        allNamespaces.push(namespace);
    }
    return allNamespaces;
}



function addDeployment(data: PanelData) {

    let kube_pod_owner;
    let kube_replicaset_owner;
    for (let i = 0; i < data.series.length; i++) {

        if (data.series[i].refId === "D") {
            kube_pod_owner = data.series[i];
        } else if (data.series[i].refId === "E") {
            kube_replicaset_owner = data.series[i];
        }
    }

    const kube_replicaset_ownerObject = { namespace: kube_replicaset_owner?.fields[1].values.toArray(), deployment: kube_replicaset_owner?.fields[2].values.toArray(), replicaset: kube_replicaset_owner?.fields[3].values.toArray() }
    const kube_pod_ownerObject = { owner_name: kube_pod_owner?.fields[1].values.toArray(), pod: kube_pod_owner?.fields[2].values.toArray() }

    let allDeployments = new Array();

    if (kube_replicaset_ownerObject.replicaset !== undefined &&
        kube_replicaset_ownerObject.deployment !== undefined &&
        kube_replicaset_ownerObject.namespace !== undefined &&
        kube_pod_ownerObject.pod !== undefined &&
        kube_pod_ownerObject.owner_name !== undefined) {

        for (let i = 0; i < kube_replicaset_ownerObject.replicaset?.length; i++) {

            for (let l = 0; l < kube_pod_ownerObject.owner_name.length; l++) {
                if (kube_replicaset_ownerObject.replicaset[i] === kube_pod_ownerObject.owner_name[l]) {
                    let element = { namespace: kube_replicaset_ownerObject.namespace[i], deployment: kube_replicaset_ownerObject.deployment[i], pod: kube_pod_ownerObject.pod[l] }
                    allDeployments.push(element);
                }
            }
        }
    }
    return allDeployments;
}