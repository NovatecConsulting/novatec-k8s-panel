import React from 'react';
import { Position, Types } from 'types';
import { Text } from 'react-konva';
import { SelectableValue } from '@grafana/data';

type Props = {
  position: Position;
  text: string;
  option: string;
  setGroupedOption: (value: SelectableValue) => void;
  type: Types | undefined;
};

export const TextItem = ({ position, text, option, setGroupedOption, type }: Props) => {
  let optionValue: SelectableValue;
  if (type !== undefined) {
    optionValue = { label: option, description: type.toString() };
  } else {
    optionValue = { label: option };
  }

  return <Text data-testid="text" x={position.x + 10} y={position.y + 10} text={text} onClick={e => setGroupedOption(optionValue)} />;
};
