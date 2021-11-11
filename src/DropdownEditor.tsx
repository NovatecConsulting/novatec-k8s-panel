import React, { useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { DropdownComponent } from 'Menu/Dropdown';
import { dropdownOptions } from 'Menu/DropdownOptions';
import { metricOptions } from 'NovatecK8SPanel';

interface Settings {
  red: number;
  orange: number;
  green: number;
}

export const DropdownEditor: React.FC<StandardEditorProps<Settings>> = ({ item, value, onChange }) => {
  const [chosenOption, setChosenOption] = useState(metricOptions[0]);
  const handleChange = (label: string | undefined) => {
    if (label !== undefined) {
      setChosenOption(label);
    }
  };

  return (
    <DropdownComponent
      id={'option metric dropdown'}
      options={dropdownOptions(metricOptions, chosenOption)}
      onChange={handleChange}
      value={chosenOption}
      isDisabled={false}
    />
  );
};
