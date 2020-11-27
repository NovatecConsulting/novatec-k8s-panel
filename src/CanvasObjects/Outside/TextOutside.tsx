import React from 'react';
import { Position } from 'types';
import { Text } from 'react-konva';

type Props = {
    position: Position;
    text: string
}

export const TextOutside = ({ position, text }: Props) => {

    return (
        <Text
            x={position.x}
            y={position.y}
            text={text}
        />
    );
}
