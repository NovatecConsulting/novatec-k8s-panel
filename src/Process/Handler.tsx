import { PanelData } from '@grafana/data';
import { position, getOverview } from '../CanvasObjects/Calculation'
import { getNamespaceCount, getServiceCount, getPodCount, getContainerCount } from './ConvertData'

export function handler(width: number, height: number, levelOption: string, data: PanelData) {
    if (levelOption === 'Overview') {


        // get all Count:
        const namespaceCount = getNamespaceCount(data);
        const serviceCount = getServiceCount(data);
        const podCount = getPodCount(data);
        const containerCount = getContainerCount(data);
        return getOverview(width, namespaceCount, serviceCount, podCount, containerCount);
    } else if (levelOption === 'Namespace') {
        return position(width, height, getNamespaceCount(data));
    } else if (levelOption === 'Service') {
        return position(width, height, getServiceCount(data));
    }
    else if (levelOption === 'Pod') {
        return position(width, height, getPodCount(data));
    } else if (levelOption === 'Container') {
        return position(width, height, getContainerCount(data));
    }
    else {
        return position(width, height, 15);
    }
}