import { PanelData } from '@grafana/data';
import { position, getOverview } from '../CanvasObjects/Calculation'
import { getNamespaceInformation, getServiceInformation, getContainerInformation, getPodInformation, getNamespaceCount, getServiceCount, getPodCount, getContainerCount } from './ConvertData'


export function handler(width: number, height: number, levelOption: string, data: PanelData) {
    if (levelOption === 'Overview') {


        // get all Count:
        const namespaceCount = getNamespaceCount(data);
        const serviceCount = getServiceCount(data);
        const podCount = getPodCount(data);
        const containerCount = getContainerCount(data);
        return getOverview(width, namespaceCount, serviceCount, podCount, containerCount);
    } else if (levelOption === 'Namespace') {
        let allElements = position(width, height, getNamespaceCount(data));
        allElements = getNamespaceInformation(data, allElements);
        return allElements;
    } else if (levelOption === 'Service') {
        let allElements = position(width, height, getServiceCount(data));
        allElements = getServiceInformation(data, allElements);
        return allElements;
    }
    else if (levelOption === 'Pod') {

        let allElements = position(width, height, getPodCount(data));
        allElements = getPodInformation(data, allElements);
        return allElements;
    } else if (levelOption === 'Container') {
        let allElements = position(width, height, getContainerCount(data));
        allElements = getContainerInformation(data, allElements);
        return allElements;
    }
    else {
        return position(width, height, 15);
    }
}