import React from 'react';
import { Position } from 'types';
import { Text } from 'react-konva';

type Props = {
  position: Position;
  text: string;
  setLevelOptionHandler: (value: string | undefined) => void;
};

export const NodeText = ({ position, text, setLevelOptionHandler }: Props) => {
  return (
    <Text
      x={position.x}
      y={position.y}
      text={text}
      fill={'white'}
      align={'center'}
      width={120}
      fontSize={15}
      onClick={() => setLevelOptionHandler('Node')}
    />
  );
};
