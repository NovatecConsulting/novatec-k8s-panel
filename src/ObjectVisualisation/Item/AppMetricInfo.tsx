import React from 'react';
import { Circle } from 'react-konva';
import { Position, Element } from 'types';


type Props = {
  position: Position;
  itemWidth: number;
  item: Element;

};

export const AppMetricInfo = ({ position, itemWidth, item }: Props) => {
  return (
    <Circle
      x={position.x + itemWidth - 35}
      y={position.y + 55}
      width={7}
      height={7}
      fill='#9932cc'
      radius={7} />
  );
};
