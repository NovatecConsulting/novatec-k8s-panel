import { Element, Position, Tuple, Types } from 'types';
import { SelectableValue } from '@grafana/data';
var _ = require('lodash');



export function getOverview(width: number, namespaceCount: number, serviceCount: number, podCount: number, containerCount: number) {

    let element: Element[] = new Array();
    const namespaceRect = { position: { x: (width / 2) - ((width / 2) / 2), y: 10 }, width: width / 2, height: 80, color: 'white', text: "Namespace Count:" + namespaceCount, elementInfo: { namespace: "", deployment: "", pod: "", container: "", type: Types.Namespace } };
    const deploymentElement = { position: { x: (width / 2) - ((width / 2) / 2), y: 100 }, width: width / 2, height: 80, color: 'white', text: "Deployment Count:" + serviceCount, elementInfo: { namespace: "", deployment: "", pod: "", container: "", type: Types.Namespace } };
    const podRect = { position: { x: (width / 2) - ((width / 2) / 2), y: 190 }, width: width / 2, height: 80, color: 'white', text: "Pod Count: " + podCount, elementInfo: { namespace: "", deployment: "", pod: "", container: "", type: Types.Namespace } };
    const containerRect = { position: { x: (width / 2) - ((width / 2) / 2), y: 280 }, width: width / 2, height: 80, color: 'white', text: "Container Count:" + containerCount, elementInfo: { namespace: "", deployment: "", pod: "", container: "", type: Types.Namespace } };

    element.push(namespaceRect);
    element.push(deploymentElement);
    element.push(podRect);
    element.push(containerRect);

    const tuple: Tuple = { outside: undefined, inside: element }
    return tuple;
}

export function position(width: number, height: number, count: number) {

    const rectWidth = 350;
    const rectHeight = 70;

    let position: Position = { x: -350, y: 40 };
    let oneRect: Element;
    let allRect: Element[] = new Array();



    for (let i = 0; i < count; i++) {
        position = calculation(width, rectWidth, rectHeight, position);
        oneRect = { position, width: rectWidth, height: rectHeight, color: 'white', text: "", elementInfo: { namespace: "", deployment: "", pod: "", container: "", type: Types.Namespace } }
        allRect.push(oneRect);
    }

    return allRect;
}


// berechnet die Position 
function calculation(width: number, rectWidth: number, rectHeight: number, oldPosition: Position) {

    const distance = 20;
    let position: Position = { x: oldPosition.x + rectWidth + distance, y: oldPosition.y };

    if (position.x > width) {
        position.x = 0 + distance;
        position.y += rectHeight + distance;
    }
    return position;
}

// Hier werden die Informationen für das Dropdown erstell.
export function calcDropdownOptions() {

    let options: Array<SelectableValue> = [];
    let pod: SelectableValue = {};
    pod.label = "Pod";
    options.push(pod);

    for (let i = 0; i < 10; i++) {
        let element: SelectableValue = {};
        element.label = "Pod" + i;
        element.description = "id: " + i;

        options.push(element);
    }
    return options;
}

/**
 * Calculates position outside level and grouped.
 * @param insideElements 
 */
export function positionOutside2(insideElements: Element[]) {

    let xMax = _.maxBy(insideElements, function (o: Element) {
        return o.position.x
    }).position.x;

    let yMax = _.maxBy(insideElements, function (o: Element) {
        return o.position.y
    }).position.y;

    let xMin = _.minBy(insideElements, function (o: Element) {
        return o.position.x
    }).position.x;

    let yMin = _.minBy(insideElements, function (o: Element) {
        return o.position.y
    }).position.y;

    xMax += insideElements[0].width;
    yMax += insideElements[0].height;

    let outisdePosition: Position = { x: (xMin - 10), y: (yMin - 10) }

    let width = xMax - outisdePosition.x + 10;
    let height = yMax - outisdePosition.y + 10;

    return { outisdePosition, width, height }

}



/**
 * Defines the position for grouping when the filter is not triggered. Returns a tuple of elements.
 * @param allInfos 
 * @param width 
 * @param height 
 */
export function positionOnlyGrupped(allInfos: any[], width: number, height: number) {

    let test = new Array();
    let insidePosition = new Array();
    const distance = 100;
    for (let i = 0; i < allInfos.length; i++) {
        if (allInfos[i].inside.length !== 0) {
            test.push(allInfos[i]);
        }
    }

    for (let i = 0; i < test.length; i++) {
        let element = position(width, height, test[i].inside.length);
        for (let l = 0; l < test[i].inside.length; l++) {
            element[l].text = test[i].inside[l];
        }

        insidePosition.push(element);
    }

    for (let i = 0; i < insidePosition.length; i++) {
        if (i !== 0) {
            let highestY = insidePosition[i - 1][(insidePosition[i - 1].length - 1)].position.y;
            highestY += distance;
            for (let l = 0; l < insidePosition[i].length; l++) {
                insidePosition[i][l].position.y = insidePosition[i][l].position.y + highestY;
            }
        }
    }
    let outside = new Array();
    for (let i = 0; i < test.length; i++) {
        let outsideInfo = positionOutside2(insidePosition[i]);
        const outsideElement: Element = { position: outsideInfo.outisdePosition, width: outsideInfo.width, height: outsideInfo.height, text: test[i].outside, color: "green", elementInfo: { namespace: "", deployment: "", pod: "", container: "", type: Types.Namespace } }
        outside.push(outsideElement);
    }

    //alles zusammenbauen 
    let allInside = new Array();

    for (let i = 0; i < insidePosition.length; i++) {
        for (let l = 0; l < insidePosition[i].length; l++) {
            allInside.push(insidePosition[i][l]);
        }

    }

    let tuple: Tuple = { outside: outside, inside: allInside };
    return tuple;

}




















