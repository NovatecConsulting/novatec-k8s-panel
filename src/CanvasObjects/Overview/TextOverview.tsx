import React from 'react';
import { Position } from 'types';
import { Text } from 'react-konva';

type Props = {
    position: Position;
    text: string;
    width: number;
}

export const TextOverview = ({ position, text, width }: Props) => {

    return (
        <Text
            x={position.x}
            y={position.y+30}
            text={text}
            fontSize={15}
            width= {width}
            align={"center"}
        />
    );
}
