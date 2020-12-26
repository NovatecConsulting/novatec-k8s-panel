import React from 'react';
import { Rect } from 'react-konva';



type Props = {
    height: number;
}


export const Node = ({ height }: Props) => {

    return (
            <Rect
                perfectDrawEnabled={false}
                x={40}
                y={10}
                width={120}
                height={height - 10}
                fill={"#4d545e"}
                shadowBlur={5}
            />
    );
}
