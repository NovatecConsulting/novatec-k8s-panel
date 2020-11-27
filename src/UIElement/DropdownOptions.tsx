import { PanelData, SelectableValue } from '@grafana/data';
import { Element } from 'types';

import { getNamespaceInformation, getServiceInformation, getContainerInformation, getPodInformation, } from '../Process/ConvertData'




export function dropdownOptions(allOptions: string[], value: string) {

    var copy = allOptions.slice(0);
    for (let i = 0; i < copy.length; i++) {
        if (copy[i] === value) {
            copy.splice(i, 1);
        }
    }

    let options: Array<SelectableValue> = [];
    for (let i = 0; i < copy.length; i++) {
        let element: SelectableValue = {};
        element.label = copy[i];
        options.push(element);
    }
    return options;
}



export function dropdownOptionsGrouped(allElements: Element[], value: string, levelOption: string) {


    let option: Array<SelectableValue> = [];
    let firstElement: SelectableValue = {};
    firstElement.label = "-";
    option.push(firstElement);
    for (let i = 0; i < allElements.length; i++) {
        let element: SelectableValue = {};
        element.label = allElements[i].text;
        element.description = levelOption;
        option.push(element);
    }

    for (let i = 0; i < option.length; i++) {
        if (option[i].label === value) {
            option.splice(i, 1);
        }
    }

    return option;
}




export function newTest(data: PanelData) {

    let option: Array<SelectableValue> = [];
    let firstElement: SelectableValue = {};
    firstElement.label = "-";
    option.push(firstElement);


    //all Namespaces
    let item = getNamespaceInformation(data);

    for (let i = 0; i < item.length; i++) {
        let element: SelectableValue = {};
        element.label = item[i].namespace;
        element.description = "Namespace";
        option.push(element);
    }


    //all Services
    item = getServiceInformation(data);

    for (let i = 0; i < item.length; i++) {
        let element: SelectableValue = {};
        element.label = item[i].service;
        element.description = "Service";
        option.push(element);
    }
    //all Pods
    item = getPodInformation(data);

    for (let i = 0; i < item.length; i++) {
        let element: SelectableValue = {};
        element.label = item[i].pod;
        element.description = "Pod";
        option.push(element);
    }

    //all Containers
    item = getContainerInformation(data);

    for (let i = 0; i < item.length; i++) {
        let element: SelectableValue = {};
        element.label = item[i].container
        element.description = "Container";
        option.push(element);
    }
    return option;
}



