import { PanelData } from '@grafana/data';
import { Types, Container, Pod, Namespace, Deployment } from 'types';

export function getData(data: PanelData) {
  return data.series;
}

export function getDeploymentCount(data: PanelData) {
  let count = 0;
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].refId?.includes("deployment_info")) {
      count++;
    }
  }
  return count;
}

/**
 * Fetches all the deployment names.
 */
export function getDeploymentNames(data: PanelData) {
  let names = [];
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].refId?.includes("deployment_info")) {
      let name = data.series[i].name;
      if (name != undefined) {
        names.push(name.slice(name.indexOf('"') + 1, name.lastIndexOf('"')));
      }
    }
  }
  return names;
}


/**
 * converts the prometheus querie to JSON
 */
function fromPromtoJSON(str: any) {
  let newStr = str.replaceAll('=', ':');
  let newNewStr = newStr.replaceAll(', ', ', "');
  let thirdOne = newNewStr.replaceAll(':"', '":"');
  let fourthOne = thirdOne.replaceAll('{', '{"');
  let fifthOne = JSON.parse(fourthOne);
  return fifthOne;
}

/**
 * Returns an array of all the object containers
 */
export function getAllContainer( data: PanelData){
  const allDeployment = getDeploymentInfo(data);
  let allContainers = [];
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].refId?.includes("namespace_pod_container_info")) {
      let tempStr = data.series[i].name?.slice("kube_pod_container_info".length);
      let smth = fromPromtoJSON(tempStr);
      let container = { type: Types.Container, container: '', pod: '', namespace: '', node: '', deployment: '' };
      container.container = smth.container;
      container.pod = smth.pod;
      container.namespace = smth.namespace;
      container.node = smth.kubernetes_node;
      for (let l = 0; l < allDeployment.length; l++) {
        if (allDeployment[l].pod === container.pod) {
          container.deployment = allDeployment[l].deployment;
        }
      }
      allContainers.push(container);
    }
  }
  return allContainers;
}

/**
 * Returns all Elements
 */
export function getAllElementInfo(data: PanelData) {
  const allElementInfo = getAllContainer(data);
  let allContainers: Container[] = [];

  for (let i = 0; i < allElementInfo.length; i++) {
    let container: Container = {
      Name: allElementInfo[i].container,
      Pod: allElementInfo[i].pod,
      Namespace: allElementInfo[i].namespace,
      Deployment: '',
      Node: allElementInfo[i].node,
    };
    allContainers.push(container);
  }

  let allPods: Pod[] = [];
  let podSet = new Set();
  for (let i = 0; i < allElementInfo.length; i++) {
    podSet.add(allElementInfo[i].pod);
  }
  let allElementPod = Array.from(podSet);
  for (let i = 0; i < allElementPod.length; i++) {
    let pod: Pod = { Name: '' + allElementPod[i], Container: [], Namespace: '', Deployment: '', Node: '' };
    for (let l = 0; l < allContainers.length; l++) {
      if (allContainers[l].Pod === pod.Name) {
        pod.Container.push(allContainers[l]);
        pod.Namespace = allContainers[l].Namespace;
        pod.Node = allContainers[l].Node;
      }
    }
    allPods.push(pod);
  }
  const allDeployments = getDeploymentInfo(data);
  let allDeploymentObjects: Deployment[] = [];

  for (let i = 0; i < allDeployments.length; i++) {
    let podsInDeployment: Pod[] = [];
    let containerInDeployment: Container[] = [];
    for (let l = 0; l < allPods.length; l++) {
      if (allPods[l].Name === allDeployments[i].pod) {
        allPods[l].Deployment = allDeployments[i].deployment;
        for (let j = 0; j < allPods[l].Container.length; j++) {
          allPods[l].Container[j].Deployment = allDeployments[i].deployment;
          containerInDeployment.push(allPods[l].Container[j]);
        }
        podsInDeployment.push(allPods[l]);
      }
    }
    let deployment: Deployment = {
      Name: allDeployments[i].deployment,
      Namespace: allDeployments[i].namespace,
      Pod: podsInDeployment,
      Container: containerInDeployment,
    };
    allDeploymentObjects.push(deployment);
  }

  let allNamespaces: Namespace[] = [];
  let namespaceSet = new Set();
  for (let i = 0; i < allElementInfo.length; i++) {
    namespaceSet.add(allElementInfo[i].namespace);
  }
  let allElementNamespace = Array.from(namespaceSet);
  for (let i = 0; i < allElementNamespace.length; i++) {
    let namespace: Namespace = { Name: '' + allElementNamespace[i], Pod: [], Deployment: [] };
    for (let l = 0; l < allPods.length; l++) {
      if (allPods[l].Namespace === namespace.Name) {
        namespace.Pod.push(allPods[l]);
      }
    }

    for (let j = 0; j < allDeploymentObjects.length; j++) {
      if (allDeploymentObjects[j].Namespace === namespace.Name) {
        namespace.Deployment.push(allDeploymentObjects[j]);
      }
    }

    allNamespaces.push(namespace);
  }
  return allNamespaces;
}


/**
 * Returns the deployments with their specific namespace,name, and pod replicasets
 */
export function getDeploymentInfo(data: PanelData) {
  let kube_pod_ownerObject = {
    owner_name: new Array(),
    pod: new Array(),
  }
  let kube_replicaset_ownerObject = {
    namespace: new Array(),
    deployment: new Array(),
    replicaset: new Array(),
  };
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].refId?.includes("pod_owner")) {
      let smth = fromPromtoJSON(data.series[i].name);
      kube_pod_ownerObject.owner_name.push(smth.owner_name);
      kube_pod_ownerObject.pod.push(smth.pod);
    }
    if (data.series[i].refId?.includes("replicaset_owner")) {
      let smth = fromPromtoJSON(data.series[i].name);
      kube_replicaset_ownerObject.deployment.push(smth.owner_name);
      kube_replicaset_ownerObject.namespace.push(smth.namespace);
      kube_replicaset_ownerObject.replicaset.push(smth.replicaset);
    }
  }
  let allDeployments = [];
  if (
    kube_replicaset_ownerObject.replicaset !== undefined &&
    kube_replicaset_ownerObject.deployment !== undefined &&
    kube_replicaset_ownerObject.namespace !== undefined &&
    kube_pod_ownerObject.pod !== undefined &&
    kube_pod_ownerObject.owner_name !== undefined
  ) {
    for (let i = 0; i < kube_replicaset_ownerObject.replicaset?.length; i++) {
      for (let l = 0; l < kube_pod_ownerObject.owner_name.length; l++) {
        if (kube_replicaset_ownerObject.replicaset[i] === kube_pod_ownerObject.owner_name[l]) {
          let element = {
            namespace: kube_replicaset_ownerObject.namespace[i],
            deployment: kube_replicaset_ownerObject.deployment[i],
            pod: kube_pod_ownerObject.pod[l],
          };
          allDeployments.push(element);
        }
      }
    }
  }
  return allDeployments;
}
