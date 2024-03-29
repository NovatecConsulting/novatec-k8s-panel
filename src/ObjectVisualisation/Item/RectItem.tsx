import React from 'react';
import { Position, Types } from 'types';
import { Rect } from 'react-konva';
import { SelectableValue } from '@grafana/data';

type Props = {
  position: Position;
  width: number;
  height: number;
  color: string;
  option: string;
  setGroupedOption: (value: SelectableValue) => void;
  type: Types | undefined;
};

export const RectItem = ({ position, width, height, color, option, setGroupedOption, type }: Props) => {
  let option1: SelectableValue;
  if (type !== undefined) {
    option1 = { label: option, description: type.toString() };
  } else {
    option1 = { label: option };
  }

  return (
    <Rect
      perfectDrawEnabled={false}
      x={position.x}
      y={position.y}
      width={width}
      height={height}
      fill={color}
      shadowBlur={5}
      onClick={e => setGroupedOption(option1)}
    />
  );
};
