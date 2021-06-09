import React from 'react';
import { Rect } from 'react-konva';

type Props = {
  height: number;
  setLevelOptionHandler: (value: string | undefined) => void;
};

export const Node = ({ height, setLevelOptionHandler }: Props) => {
  return (
    <Rect
      perfectDrawEnabled={false}
      x={70}
      y={10}
      width={120}
      height={height - 10}
      fill={'#4d545e'}
      shadowBlur={5}
      onClick={() => setLevelOptionHandler('Node')}
    />
  );
};
