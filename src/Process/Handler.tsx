import { PanelData, SelectableValue } from '@grafana/data';
import { positionOutside, positionGrouped, position, getOverview } from '../CanvasObjects/Calculation'
import { getAllElementInfo, getNamespaceInformation, getServiceInformation, getContainerInformation, getPodInformation, getNamespaceCount, getServiceCount, getPodCount, getContainerCount } from './ConvertData'
import { Element, Position } from 'types';


// Returns the elements considering the level.
export function handler(width: number, height: number, levelOption: string, data: PanelData) {

    if (levelOption === 'Overview') {
        // Overview
        const namespaceCount = getNamespaceCount(data);
        const serviceCount = getServiceCount(data);
        const podCount = getPodCount(data);
        const containerCount = getContainerCount(data);
        return getOverview(width, namespaceCount, serviceCount, podCount, containerCount);
    } else if (levelOption === 'Namespace') {
        //Namespace
        let allElements = position(width, height, getNamespaceCount(data));
        const allElementInfo = getNamespaceInformation(data);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].namespace;
        }
        return allElements;
    } else if (levelOption === 'Service') {
        // Service
        let allElements = position(width, height, getServiceCount(data));
        const allElementInfo = getServiceInformation(data);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].service;
        }
        return allElements;
    }
    else if (levelOption === 'Pod') {
        // Pod
        let allElements = position(width, height, getPodCount(data));
        const allElementInfo = getPodInformation(data);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].pod;
        }
        return allElements;
    } else if (levelOption === 'Container') {
        //Container
        let allElements = position(width, height, getContainerCount(data));
        const allElementInfo = getContainerInformation(data);
        for (let i = 0; i < allElementInfo.length; i++) {
            allElements[i].elementInfo = allElementInfo[i];
            allElements[i].text = allElementInfo[i].container;
        }
        return allElements;
    }
    else {
        return position(width, height, 15);
    }
}



export function filterHandler(width: number, height: number, allElements: Element[], levelOption: string, filterOption: SelectableValue, data: PanelData) {

    let filterElement: Element[] = new Array();

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
    return filterElement;
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








export function handlerDetail(width: number, height: number, groupedOption: SelectableValue, data: PanelData, allElements: Element[]) {

    let groupedElement: Element[] = new Array()

    for (let i = 0; i < allElements.length; i++) {
        if (groupedOption.label === allElements[i].text) {
            groupedElement.push(allElements[i])
        }
    }

    if (groupedElement.length === 1) {
        groupedElement[0].width *= 3;
        groupedElement[0].height *= 3;
        const elementWidth = groupedElement[0].width;
        const elementHeight = groupedElement[0].height;
        groupedElement[0].position = { x: width / 2 - (elementWidth / 2), y: height / 2 - (elementHeight / 2) }


    }
    return groupedElement;
}



/*

export function handlerGrouped(levelOption: string, groupedOption: SelectableValue, data: PanelData, width: number, height: number) {


    const allElementInfo = groupPodContainer(data);
    let inside: any[] = new Array();
    let allElements: Element[] = new Array();

    // level: pod  Grouped by:  Container X
    if (levelOption === "Pod" && groupedOption.description === "Container") {

        for (let i = 0; i < allElementInfo.length; i++) {
            if (allElementInfo[i].container === groupedOption.label) {
                inside.push(allElementInfo[i]);
            }
        }
        // inside
        let insidePosition: Position[] = positionGrouped(width, height, inside.length);
        for (let i = 0; i < insidePosition.length; i++) {
            let element: Element = { position: insidePosition[i], width: 350 * 3, height: 70 * 3, color: "white", text: inside[i].container, outside: false }
            allElements.push(element)
        }
        //outside
        let outsideElement = positionOutside(allElements);
        outsideElement.outside = true;
        outsideElement.text = inside[0].pod;
        allElements.push(outsideElement);
    }

    // level: container Grouped by: Pod X
    if (levelOption === "Container" && groupedOption.description === "Pod") {

        for (let i = 0; i < allElementInfo.length; i++) {
            if (allElementInfo[i].pod === groupedOption.label) {
                inside.push(allElementInfo[i]);
            }
        }

        // inside
        let insidePosition: Position[] = positionGrouped(width, height, inside.length);
        for (let i = 0; i < insidePosition.length; i++) {
            let element: Element = { position: insidePosition[i], width: 350 * 3, height: 70 * 3, color: "white", text: inside[i].container, outside: false }
            allElements.push(element)
        }

        // outside
        let outsideElement = positionOutside(allElements);
        outsideElement.outside = true;
        outsideElement.text = inside[0].pod;
        allElements.push(outsideElement);
    }



    // level Namespace Grouped by Pod:
    if (levelOption === "Namespace" && groupedOption.description === "Pod") {

        for (let i = 0; i < allElementInfo.length; i++) {
            if (allElementInfo[i].pod === groupedOption.label) {
                inside.push(allElementInfo[i]);
            }
        }

        // inside
        let insidePosition: Position[] = positionGrouped(width, height, inside.length);
        for (let i = 0; i < insidePosition.length; i++) {
            let element: Element = { position: insidePosition[i], width: 350 * 3, height: 70 * 3, color: "white", text: inside[i].pod, outside: false }
            allElements.push(element)
        }

        // outside
        let outsideElement = positionOutside(allElements);
        outsideElement.outside = true;
        outsideElement.text = inside[0].namespace;
        allElements.push(outsideElement);
    }


    // level Pod grouped by Namespace
    if (levelOption === "Pod" && groupedOption.description === "Namespace") {

        for (let i = 0; i < allElementInfo.length; i++) {
            if (allElementInfo[i].namespace === groupedOption.label) {
                inside.push(allElementInfo[i]);
            }
        }
        // inside
        let insidePosition: Position[] = positionGrouped(width, height, inside.length);

        for (let i = 0; i < insidePosition.length; i++) {
            let element: Element = { position: insidePosition[i], width: 350 * 3, height: 70 * 3, color: "white", text: inside[i].pod, outside: false }
            allElements.push(element)
        }
        // outside
        let outsideElement = positionOutside(allElements);
        outsideElement.outside = true;
        outsideElement.text = inside[0].namespace;
        allElements.push(outsideElement);

    }


    // level Namespace Grouped Container :
    if (levelOption === "Namespace" && groupedOption.description === "Container") {

        for (let i = 0; i < allElementInfo.length; i++) {
            if (allElementInfo[i].container === groupedOption.label) {
                inside.push(allElementInfo[i]);
            }
        }

        // inside
        let insidePosition: Position[] = positionGrouped(width, height, inside.length);
        for (let i = 0; i < insidePosition.length; i++) {
            let element: Element = { position: insidePosition[i], width: 350 * 3, height: 70 * 3, color: "white", text: inside[i].container, outside: false }
            allElements.push(element)
        }

        // outside
        let outsideElement = positionOutside(allElements);
        outsideElement.outside = true;
        outsideElement.text = inside[0].namespace;
        allElements.push(outsideElement);
    }

    if (levelOption === "Container" && groupedOption.description === "Namespace") {

        for (let i = 0; i < allElementInfo.length; i++) {
            if (allElementInfo[i].namespace === groupedOption.label) {
                inside.push(allElementInfo[i]);
            }
        }

        // inside
        let insidePosition: Position[] = positionGrouped(width, height, inside.length);
        for (let i = 0; i < insidePosition.length; i++) {
            let element: Element = { position: insidePosition[i], width: 350 * 3, height: 70 * 3, color: "white", text: inside[i].container, outside: false }
            allElements.push(element)
        }

        // outside
        let outsideElement = positionOutside(allElements);
        outsideElement.outside = true;
        outsideElement.text = inside[0].namespace;
        allElements.push(outsideElement);
    }


    return allElements;
}

*/