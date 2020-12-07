import { PanelData, SelectableValue } from '@grafana/data';
import { positionTest, position, getOverview, positionOutside2 } from '../CanvasObjects/Calculation'
import { getAllElementInfo2, getAllElementInfo, getNamespaceInformation, getServiceInformation, getContainerInformation, getPodInformation, getNamespaceCount, getServiceCount, getPodCount, getContainerCount } from './ConvertData'
import { Element, Tuple } from 'types';



// Returns the elements considering the level.
export function handler(width: number, height: number, levelOption: string, data: PanelData) {

    let allElements: Element[] = new Array();

    if (levelOption === 'Overview') {
        // Overview
        const namespaceCount = getNamespaceCount(data);
        const serviceCount = getServiceCount(data);
        const podCount = getPodCount(data);
        const containerCount = getContainerCount(data);
        return getOverview(width, namespaceCount, serviceCount, podCount, containerCount);
    } else if (levelOption === 'Namespace') {
        //Namespace
        allElements = position(width, height, getNamespaceCount(data));
        const allElementInfo = getNamespaceInformation(data);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].namespace;
        }
    } else if (levelOption === 'Service') {
        // Service
        allElements = position(width, height, getServiceCount(data));
        const allElementInfo = getServiceInformation(data);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].service;
        }
    }
    else if (levelOption === 'Pod') {
        // Pod
        allElements = position(width, height, getPodCount(data));
        const allElementInfo = getPodInformation(data);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].pod;
        }

    } else if (levelOption === 'Container') {
        //Container
        allElements = position(width, height, getContainerCount(data));
        const allElementInfo = getContainerInformation(data);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].container;
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

    let allElementInfo = getAllElementInfo(data);
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



export function groupedHandler(showInfo: Tuple, levelOption: string, groupedOption: string, data: PanelData) {

    let allElementInfo = getAllElementInfo(data);
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

    const outsideInfo = positionOutside2(showElements);
    const outsideElement: Element = { position: outsideInfo.outisdePosition, width: outsideInfo.width, height: outsideInfo.height, text: outside, color: "green" }

    let allOutside = new Array();
    allOutside.push(outsideElement);
    const tuple: Tuple = { outside: allOutside, inside: showElements };
    return tuple;
}


/**
 * Grouping if filter is not set.
 * @param data 
 * @param levelOption 
 * @param groupedOption 
 * @param width 
 * @param height 
 */
export function groupedHandler2(data: PanelData, levelOption: string, groupedOption: string, width: number, height: number) {

    const allInformation = getAllElementInfo2(data);
    let tuple = new Array();
    let insideElements: string[] = [];

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
    return positionTest(tuple, width, height);
}
