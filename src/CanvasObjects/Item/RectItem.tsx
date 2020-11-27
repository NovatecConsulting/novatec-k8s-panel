import React from 'react';
import { Position } from 'types';
import { Rect } from 'react-konva';

type Props = {
    position: Position;
    width: number;
    height: number;
    color: string;
    option: string;
    setGroupedOption: (value: string | undefined) => void;
}

export const RectItem = ({ position, width, height, color, option, setGroupedOption }: Props) => {

    return (
        <Rect
            x={position.x}
            y={position.y}
            width={width}
            height={height}
            fill={color}
            shadowBlur={5}
            onClick={(e) => setGroupedOption(option)}
        />
    );
}
