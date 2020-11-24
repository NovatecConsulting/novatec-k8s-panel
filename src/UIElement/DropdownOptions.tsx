import { SelectableValue } from '@grafana/data';
import { Element } from 'types';


export function dropdownOptions(allOptions: string[]) {

    let options: Array<SelectableValue> = [];
    for (let i = 0; i < allOptions.length; i++) {
        let element: SelectableValue = {};
        element.label = allOptions[i];
        options.push(element);
    }
    return options;
}



export function dropdownOptionsGrouped(allElements: Element[]) {

    let option: Array<SelectableValue> = [];
    for (let i = 0; i < allElements.length; i++) {
        let element: SelectableValue = {};
        element.label = allElements[i].text;
        option.push(element);
    }
    return option;
}



