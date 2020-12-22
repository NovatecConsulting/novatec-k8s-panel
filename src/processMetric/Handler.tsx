import { PanelData, SelectableValue } from '@grafana/data';
import { positionOnlyGrupped, position, getOverview, positionOutside } from '../canvasObjects/Calculation'
import { getAllElementInfo, getAllContainer, getDeploymentInformation, getDeploymentCount } from './ConvertData'
import { Element, Namespace, Tuple, Types } from 'types';



// Returns the elements considering the level.
export function handler(width: number, height: number, levelOption: string, data: PanelData) {

    let allElements: Element[] = new Array();
    const allElementInfo = getAllElementInfo(data);
    const namespaceCount = allElementInfo.length;

    let podCount = 0;
    let containerCount = 0;
    for (let i = 0; i < allElementInfo.length; i++) {
        podCount += allElementInfo[i].Pod.length;
        for (let l = 0; l < allElementInfo[i].Pod.length; l++) {
            containerCount += allElementInfo[i].Pod[l].Container.length;
        }

    }


    if (levelOption === 'Overview') {
        // Overview
        const deploymentCount = getDeploymentCount(data);
        return getOverview(width, namespaceCount, deploymentCount, podCount, containerCount);
    } else if (levelOption === 'Namespace') {
        //Namespace
        allElements = position(width, height, namespaceCount);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo.namespace = allElementInfo[i].Name;
            allElements[i].text = allElementInfo[i].Name;
            allElements[i].elementInfo.pod = "Count: " + allElementInfo[i].Pod.length;
            allElements[i].elementInfo.type = Types.Namespace;

            let podcount = 0;
            for (let l = 0; l < allElementInfo[i].Pod.length; l++) {
                podcount += allElementInfo[i].Pod[l].Container.length;
            }
            allElements[i].elementInfo.container = "Count: " + podcount;
        }
    } else if (levelOption === 'Deployment') {
        // Deployment
        allElements = position(width, height, getDeploymentCount(data));
        const allElementInfo = getDeploymentInformation(data);
        console.log("hello world");
        console.log(allElementInfo);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].deployment;
            allElements[i].elementInfo.type = Types.Deployment;
        }
    }
    else if (levelOption === 'Pod') {
        // Pod
        allElements = position(width, height, podCount);

        let temp = 0;
        for (let i = 0; i < allElementInfo.length; i++) {
            for (let l = 0; l < allElementInfo[i].Pod.length; l++) {
                allElements[temp].text = allElementInfo[i].Pod[l].Name;
                allElements[temp].elementInfo.pod = allElementInfo[i].Pod[l].Name;
                allElements[temp].elementInfo.namespace = allElementInfo[i].Pod[l].Namespace;
                allElements[temp].elementInfo.container = "Count: " + allElementInfo[i].Pod[l].Container.length;
                allElements[temp].elementInfo.type = Types.Pod;
                allElements[temp].elementInfo.deployment = allElementInfo[i].Pod[l].Deployment;
                temp += 1;

            }
        }

    } else if (levelOption === 'Container') {
        //Container
        allElements = position(width, height, containerCount);

        let temp = 0;
        for (let i = 0; i < allElementInfo.length; i++) {
            for (let l = 0; l < allElementInfo[i].Pod.length; l++) {
                for (let j = 0; j < allElementInfo[i].Pod[l].Container.length; j++) {
                    allElements[temp].text = allElementInfo[i].Pod[l].Container[j].Name;
                    allElements[temp].elementInfo.pod = allElementInfo[i].Pod[l].Container[j].Pod;
                    allElements[temp].elementInfo.namespace = allElementInfo[i].Pod[l].Container[j].Namespace;
                    allElements[temp].elementInfo.container = allElementInfo[i].Pod[l].Container[j].Name;
                    allElements[temp].elementInfo.type = Types.Container;
                    allElements[temp].elementInfo.deployment = allElementInfo[i].Pod[l].Deployment;
                    temp += 1;
                }
            }
        }
    }
    const tuple: Tuple = { outside: undefined, inside: allElements }
    return tuple;
}


export function filterHandler(width: number, height: number, allInfo: Tuple, levelOption: string, filterOption: SelectableValue, data: PanelData) {

    let filterElement: Element[] = new Array();
    const allElements = allInfo.inside;
    // focus one
    if (levelOption === filterOption.description) {

        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].text === filterOption.label) {
                filterElement.push(allElements[i]);
            }
        }
    } else {
        let filterInfo = filterDiffLevel(data, levelOption, filterOption);
        filterElement = position(width, height, filterInfo.length);

        for (let i = 0; i < filterElement.length; i++) {
            filterElement[i].text = "" + filterInfo[i];
        }
    }
    const tuple: Tuple = { outside: undefined, inside: filterElement }
    return tuple;
}



// Filter with diffrent Level
export function filterDiffLevel(data: PanelData, levelOption: string, filterOption: SelectableValue) {

    let allElementInfo = getAllContainer(data);
    let filterElements: any[] = new Array();

    for (let i = 0; i < allElementInfo.length; i++) {
        if (filterOption.description === "Namespace") {
            if (allElementInfo[i].namespace === filterOption.label) {
                filterElements.push(allElementInfo[i]);
            }
        } else if (filterOption.description === "Pod") {
            if (allElementInfo[i].pod === filterOption.label) {
                filterElements.push(allElementInfo[i]);
            }

        } else if (filterOption.description === "Container") {
            if (allElementInfo[i].container === filterOption.label) {
                filterElements.push(allElementInfo[i]);
            }

        }
    }
    let filterToLevel = new Set();

    for (let i = 0; i < filterElements.length; i++) {

        if (levelOption === "Namespace") {
            filterToLevel.add(filterElements[i].namespace);
        } else if (levelOption === "Pod") {
            filterToLevel.add(filterElements[i].pod);
        } else if (levelOption === "Container") {
            filterToLevel.add(filterElements[i].container);
        }
    }
    return Array.from(filterToLevel);
}


/**
 * Is called if all dropdowns have a value.
 * @param showInfo 
 * @param levelOption 
 * @param groupedOption 
 * @param data 
 */
export function groupedWithFilterHandler(showInfo: Tuple, levelOption: string, filterOption: SelectableValue, groupedOption: string, data: PanelData, width: number, height: number) {

    if (hasHigherLevel(filterOption, groupedOption)) {
        return groupedHandler(data, levelOption, filterOption, groupedOption, width, height, true)
    } else {
        let allElementInfo = getAllContainer(data);
        let outside: string = "";
        const showElements = showInfo.inside;

        if (levelOption === "Pod" && groupedOption === "Namespace") {
            for (let i = 0; i < showElements.length; i++) {
                for (let l = 0; l < allElementInfo.length; l++) {
                    if (allElementInfo[l].pod === showElements[i].text) {
                        outside = allElementInfo[l].namespace;

                    }
                }
            }
        }

        if (levelOption === "Container" && groupedOption === "Namespace") {
            for (let i = 0; i < showElements.length; i++) {
                for (let l = 0; l < allElementInfo.length; l++) {
                    if (allElementInfo[l].container === showElements[i].text) {
                        outside = allElementInfo[l].namespace;

                    }
                }
            }
        }

        if (levelOption === "Container" && groupedOption === "Pod") {
            for (let i = 0; i < showElements.length; i++) {
                for (let l = 0; l < allElementInfo.length; l++) {
                    if (allElementInfo[l].container === showElements[i].text) {
                        outside = allElementInfo[l].pod;
                    }
                }
            }

        }

        const outsideInfo = positionOutside(showElements);
        const outsideElement: Element = { position: outsideInfo.outisdePosition, width: outsideInfo.width, height: outsideInfo.height, text: outside, color: "green", elementInfo: { namespace: "", deployment: "", pod: "", container: "", type: Types.Namespace } }

        let allOutside = new Array();
        allOutside.push(outsideElement);
        const tuple: Tuple = { outside: allOutside, inside: showElements };
        return tuple;

    }



}


/**
 * Calculates if the filter has a higher level than the grouping.
 * @param filterOption 
 * @param groupedOption 
 */
function hasHigherLevel(filterOption: SelectableValue, groupedOption: string) {

    const ref = ["Container", "Pod", "Deployment", "Namespace"];
    let filterNumber = -1;
    let groupedNumber = -1;
    for (let i = 0; i < ref.length; i++) {
        if (filterOption.description === ref[i]) {
            filterNumber = i;
        }
        if (groupedOption === ref[i]) {
            groupedNumber = i;
        }
    }
    if (filterNumber > groupedNumber) {
        return true;
    } else {
        return false;
    }
}


/**
 * Grouping if filter is not set.
 * @param data 
 * @param levelOption 
 * @param groupedOption 
 * @param width 
 * @param height 
 */
export function groupedHandler(data: PanelData, levelOption: string, filterOption: SelectableValue, groupedOption: string, width: number, height: number, filter: boolean) {

    let allInformation = getAllElementInfo(data);
    let tuple = new Array();
    let insideElements: string[] = [];

    // if filter has higher level than grouped by
    if (filter) {
        let remember: Namespace[] = new Array();
        if (filterOption.description === "Namespace") {
            for (let i = 0; i < allInformation.length; i++) {
                if (allInformation[i].Name === filterOption.label) {
                    remember.push(allInformation[i]);
                }
            }
        }
        allInformation = [];
        for (let i = 0; i < remember.length; i++) {
            allInformation.push(remember[i])
        }
    }

    for (let i = 0; i < allInformation.length; i++) {
        if (levelOption === "Container" && groupedOption === "Namespace") {
            insideElements = [];
        }
        if (levelOption === "Pod" && groupedOption === "Namespace") {
            insideElements = [];
        }
        for (let l = 0; l < allInformation[i].Pod.length; l++) {
            if (levelOption === "Container" && groupedOption === "Pod") {
                insideElements = [];
            }
            if (levelOption === "Pod") {
                insideElements.push(allInformation[i].Pod[l].Name);
            }
            for (let j = 0; j < allInformation[i].Pod[l].Container.length; j++) {
                if (levelOption === "Container") {
                    insideElements.push(allInformation[i].Pod[l].Container[j].Name);
                }

            }
            if (levelOption === "Container" && groupedOption === "Pod") {
                tuple.push({ outside: allInformation[i].Pod[l].Name, inside: insideElements })
            }
        }
        if (levelOption === "Pod") {
            tuple.push({ outside: allInformation[i].Name, inside: insideElements })
        }
        if (levelOption === "Container" && groupedOption === "Namespace") {
            tuple.push({ outside: allInformation[i].Name, inside: insideElements })
        }
    }
    return positionOnlyGrupped(tuple, width, height);
}
