import { Element, Position } from 'types';
import { SelectableValue } from '@grafana/data';



export function getOverview(width: number, namespaceCount: number, serviceCount: number, podCount: number, containerCount: number) {

    let allRect: Element[] = new Array();
    const namespaceRect = { position: { x: (width / 2) - ((width / 2) / 2), y: 10 }, width: width / 2, height: 80, color: 'white', text: "Namespace Count:" + namespaceCount };
    const serviceRect = { position: { x: (width / 2) - ((width / 2) / 2), y: 100 }, width: width / 2, height: 80, color: 'white', text: "Service Count:" + serviceCount };
    const podRect = { position: { x: (width / 2) - ((width / 2) / 2), y: 190 }, width: width / 2, height: 80, color: 'white', text: "Pod Count: " + podCount };
    const containerRect = { position: { x: (width / 2) - ((width / 2) / 2), y: 280 }, width: width / 2, height: 80, color: 'white', text: "Container Count:" + containerCount };

    allRect.push(namespaceRect);
    allRect.push(serviceRect);
    allRect.push(podRect);
    allRect.push(containerRect);

    return allRect;
}

export function position(width: number, height: number, count: number) {

    const rectWidth = 350;
    const rectHeight = 70;

    let position: Position = { x: -350, y: 40 };
    let oneRect: Element;
    let allRect: Element[] = new Array();


    
    for (let i = 0; i < count; i++) {

        // hier wird die Position berechnet
        position = calculation(width, rectWidth, rectHeight, position);
        oneRect = { position, width: rectWidth, height: rectHeight, color: 'white', text: "" }

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








