import React from 'react';
import { Position } from 'types';

// import { render } from 'react-dom';
import { Rect } from 'react-konva';

type Props = {
    position: Position;
    width: number;
    height: number;
    color: string;
    option: string;
    setLevelOptionHandler: (value: string | undefined) => void;
}

export const RectOverview = ({ position, width, height, color, option, setLevelOptionHandler }: Props) => {

    return (
        <Rect
            x={position.x}
            y={position.y}
            width={width}
            height={height}
            fill={color}
            shadowBlur={5}
            onClick={(e) => setLevelOptionHandler(option)}
        />

    );
}
