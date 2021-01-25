import React from 'react';
import { Position, Types  } from 'types';
import { Text } from 'react-konva';
import { SelectableValue } from '@grafana/data';

type Props = {
    position: Position;
    text: string;
    option: string;
    setGroupedOption: (value: SelectableValue) => void;
    type: Types | undefined;
}

export const TextItem = ({ position, text, option,setGroupedOption, type }: Props) => {

    let option1: SelectableValue;
    if (type != undefined) {
        option1 = { label: option, description: type.toString() };
    } else {
        option1 = { label: option }
    }
    

    return (
        <Text
            x={position.x+10}
            y={position.y+10}
            text={text}
            onClick={(e) => setGroupedOption(option1)}
            
        />
    );
}
