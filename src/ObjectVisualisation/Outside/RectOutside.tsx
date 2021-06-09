import React from 'react';
import { Position } from 'types';
import { Rect } from 'react-konva';

type Props = {
  position: Position;
  width: number;
  height: number;
  color: string;
};

export const RectOutside = ({ position, width, height, color }: Props) => {
  return (
    <Rect
      perfectDrawEnabled={false}
      x={position.x}
      y={position.y}
      width={width}
      height={height}
      fill={'transparent'}
      shadowBlur={5}
      strokeWidth={4}
      stroke={'#33B5E5'}
    />
  );
};
