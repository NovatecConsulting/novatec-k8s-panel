import React from 'react';
import { Position } from 'types';
import { Text } from 'react-konva';

type Props = {
    position: Position;
    text: string
}

export const TextItem = ({ position, text }: Props) => {

    return (
        <Text
            x={position.x+10}
            y={position.y+10}
            text={text}
        />
    );
}
