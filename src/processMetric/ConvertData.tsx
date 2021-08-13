import { PanelData } from '@grafana/data';
import { Types, Container, Pod, Namespace, Deployment } from 'types';

export function getData(data: PanelData) {
  return data.series;
}

export function getDeploymentCount(data: PanelData) {
  let temp = 0;
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].name?.includes("{deployment=")) {
      temp = temp + 1;
    }
  }
  return temp;
}
/*export function getDeploymentCount(data: PanelData) {
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].name === "{deployment=\"coredns\"}") {
      return data.series[i].fields[1].values.get(0);
    }
  }
  return data.series[2].fields[1].values.get(0);
}*/
/**
 * Fetches all the deployment names.
 */
export function getDeploymentNames(data: PanelData) {
  let names = [];

  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].name?.includes("{deployment=")) {
      let name = data.series[i].name;
      if (name != undefined) {
        names.push(name.slice(name.indexOf('"') + 1, name.lastIndexOf('"')));
      }
    }
  }
  return names;
}
/**
 * Returns an object array of every deployment
 */
export function getDeploymentInformation(data: PanelData) {
  const allNames = getDeploymentNames(data);
  let allElementInfo = [];
  for (let i = 0; i < allNames.length; i++) {
    let elementInfo = {
      type: Types.Deployment,
      container: '',
      pod: '',
      namespace: '',
      node: '',
      deployment: allNames,
    };
    allElementInfo.push(elementInfo);
  }
  return allElementInfo;
}

/**
 * Returns the data.series[i] of the Kube_pod_container_info command.
 */
// function getContainerInfoArray(data: PanelData) {
//   for (let i = 0; i < data.series.length; i++) {
//     for (let j = 0; i < data.series[i].fields.length; j++) {
//       if (data.series[i].fields[j].name === "container" == undefined) {
//         console.log(data.series);
//       }
//       if (data.series[i].fields[j].name === "container") {
//         return data.series[i];
//       }
//     }
//   }
//   //this have to be replaced with an error notifier
//   return data.series[0];
// }
// function getContainerVector(data: PanelData) {
//   const containerInfoArray = getContainerInfoArray(data);
//   for (let i = 0; i < containerInfoArray.fields.length; i++) {
//     if (containerInfoArray.fields[i].name === "container") {
//       return containerInfoArray.fields[i];
//     }
//   }
//   console.log("container vector not reached ");
//   return containerInfoArray.fields[9];
// }

// function getPodVector(data: PanelData) {
//   const containerInfoArray = getContainerInfoArray(data);
//   for (let i = 0; i < containerInfoArray.fields.length; i++) {
//     if (containerInfoArray.fields[i].name === "pod") {
//       return containerInfoArray.fields[i];
//     }
//   }
//   console.log("pod Vector not found");
//   return containerInfoArray.fields[9];
// }

// function getNamespaceVector(data: PanelData) {
//   const containerInfoArray = getContainerInfoArray(data);
//   for (let i = 0; i < containerInfoArray.fields.length; i++) {
//     if (containerInfoArray.fields[i].name === "namespace") {
//       return containerInfoArray.fields[i];
//     }
//   }
//   console.log("namespace vector not found")
//   return containerInfoArray.fields[9];
// }
// function getNodeVector(data: PanelData) {
//   const containerInfoArray = getContainerInfoArray(data);
//   for (let i = 0; i < containerInfoArray.fields.length; i++) {
//     if (containerInfoArray.fields[i].name === "kubernetes_node") {
//       return containerInfoArray.fields[i];
//     }
//   }
//   console.log("node vector not found");
//   return containerInfoArray.fields[9];
// }
/**
 * Returns all containers.
 */
/*export function getAllContainer(data: PanelData) {
  let allContainers = [];
  const allDeployment = addDeployment(data);
  const containerVector = getContainerVector(data);
  const podVector = getPodVector(data);
  const namespaceVector = getNamespaceVector(data);
  const nodeVector = getNodeVector(data);
  //for every container inside the "container" array-element
  for (let i = 0; i < containerVector.values.length; i++) {
    let container = { type: Types.Container, container: '', pod: '', namespace: '', node: '', deployment: '' };

    container.container = containerVector.values.get(i);
    container.pod = podVector.values.get(i);
    container.namespace = namespaceVector.values.get(i);
    container.node = nodeVector.values.get(i);

    for (let l = 0; l < allDeployment.length; l++) {
      if (allDeployment[l].pod === container.pod) {
        container.deployment = allDeployment[l].deployment;
      }
    }
    allContainers.push(container);
  }
  return allContainers;
}*/

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
export function getAllContainer(data: PanelData) {
  const allDeployment = addDeployment(data);
  let allContainers = [];
  for (let i = 0; i < data.series.length; i++) {
    if (data.series[i].name?.includes("kube_pod_container_info")) {
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

// export function getAllContainer(data: PanelData) {
//   let allContainers = [];
//   const allDeployment = addDeployment(data);
//   //for every container inside the "container" array-element
//   for (let i = 0; i < data.series[0].fields[5].values.length; i++) {
//     let container = { type: Types.Container, container: '', pod: '', namespace: '', node: '', deployment: '' };
//     container.container = data.series[0].fields[5].values.get(i);
//     container.pod = data.series[0].fields[16].values.get(i);
//     container.namespace = data.series[0].fields[15].values.get(i);
//     container.node = data.series[0].fields[14].values.get(i);
//     for (let l = 0; l < allDeployment.length; l++) {
//       if (allDeployment[l].pod === container.pod) {
//         container.deployment = allDeployment[l].deployment;
//       }
//     }
//     allContainers.push(container);
//   }
//   return allContainers;
// }
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
  const allDeployments = addDeployment(data);
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
 * Deployment is added to the element.
 * @param data
 */
// export function addDeployment(data: PanelData) {
//   let kube_pod_owner;
//   let kube_replicaset_owner;
//   for (let i = 0; i < data.series.length; i++) {
//     if (data.series[i].refId === 'D') {
//       kube_pod_owner = data.series[i];
//     } else if (data.series[i].refId === 'E') {
//       kube_replicaset_owner = data.series[i];
//     }
//   }

//   const kube_replicaset_ownerObject = {
//     namespace: kube_replicaset_owner?.fields[1].values.toArray(),
//     deployment: kube_replicaset_owner?.fields[2].values.toArray(),
//     replicaset: kube_replicaset_owner?.fields[3].values.toArray(),
//   };
//   const kube_pod_ownerObject = {
//     owner_name: kube_pod_owner?.fields[1].values.toArray(),
//     pod: kube_pod_owner?.fields[2].values.toArray(),
//   };
//   let allDeployments = [];

//   if (
//     kube_replicaset_ownerObject.replicaset !== undefined &&
//     kube_replicaset_ownerObject.deployment !== undefined &&
//     kube_replicaset_ownerObject.namespace !== undefined &&
//     kube_pod_ownerObject.pod !== undefined &&
//     kube_pod_ownerObject.owner_name !== undefined
//   ) {
//     for (let i = 0; i < kube_replicaset_ownerObject.replicaset?.length; i++) {
//       for (let l = 0; l < kube_pod_ownerObject.owner_name.length; l++) {
//         if (kube_replicaset_ownerObject.replicaset[i] === kube_pod_ownerObject.owner_name[l]) {
//           let element = {
//             namespace: kube_replicaset_ownerObject.namespace[i],
//             deployment: kube_replicaset_ownerObject.deployment[i],
//             pod: kube_pod_ownerObject.pod[l],
//           };
//           allDeployments.push(element);
//         }
//       }
//     }
//   }
//   return allDeployments;
// }

/**
 * Returns the deployments with their specific namespace,name, and pod replicasets
 */
export function addDeployment(data: PanelData) {
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
    if (data.series[i].name?.includes("{owner_name=")) {
      let smth = fromPromtoJSON(data.series[i].name);
      kube_pod_ownerObject.owner_name.push(smth.owner_name);
      kube_pod_ownerObject.pod.push(smth.pod);
    }
    if (data.series[i].name?.includes("replicaset=")) {
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
