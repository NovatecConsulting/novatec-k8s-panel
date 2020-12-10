import { PanelData, SelectableValue } from '@grafana/data';
import { getNamespaceInformation, getDeploymentInformation, getContainerInformation, getPodInformation, } from '../processMetric/ConvertData'

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


export function dropdownGroupedOptions(allOptions: string[], value: string, levelOption: string) {

    let options: string[] = new Array();

    if (value !== "-") {
        options.push("-");
    }

    if (levelOption !== "Overview") {
        for (let i = 0; i < allOptions.length; i++) {

            if (allOptions[i] === levelOption) {
                break;
            } else {
                options.push(allOptions[i]);
            }
        }
    }

    let test: Array<SelectableValue> = [];
    for (let i = 0; i < options.length; i++) {
        let element: SelectableValue = {};
        element.label = options[i];
        test.push(element);
    }

    return test;
}


export function dropdownOptionsFilter(data: PanelData, value: string | undefined, levelOption: String) {

    let option: Array<SelectableValue> = [];
    let firstElement: SelectableValue = {};

    if (value !== "-") {
        firstElement.label = "-";
        option.push(firstElement);
    }

    if (levelOption !== "Overview") {
        //all Namespaces
        let item = getNamespaceInformation(data);

        for (let i = 0; i < item.length; i++) {
            let element: SelectableValue = {};
            element.label = item[i].namespace;
            element.description = "Namespace";
            option.push(element);
        }

        //all Services
        item = getDeploymentInformation(data);

        for (let i = 0; i < item.length; i++) {
            let element: SelectableValue = {};
            element.label = item[i].deployment;
            element.description = "Deployment";
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
    }
    return option;
}



