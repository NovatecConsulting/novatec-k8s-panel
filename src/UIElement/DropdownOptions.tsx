import { SelectableValue } from '@grafana/data';


export function dropdownOptions(allOptions: string[]) {

    let options: Array<SelectableValue> = [];
    for (let i = 0; i < allOptions.length; i++) {
        let element: SelectableValue = {};
        element.label = allOptions[i];
        options.push(element);
    }
    return options;
}



