import React, { useState } from 'react';
import { PanelProps, SelectableValue } from '@grafana/data';
import { SimpleOptions } from 'types';
// import { css, cx } from 'emotion';
// import { stylesFactory, useTheme } from '@grafana/ui';

import { Canvas } from 'CanvasObjects/Canvas';
import { DropdownUI, DropdownGrouped } from 'UIElement/Dropdown';
import { dropdownOptions, newTest } from 'UIElement/DropdownOptions';
import 'Style/SimplePanel.css';
import { handler, handlerDetail, handlerGrouped } from 'Process/Handler';

const levelOptions = ["Overview", "Namespace", "Service", "Pod", "Container"];
const metricOptions = ["-", "CPU Nutzung", "Speicher Nutzung", "CPU Limits", "Memory Limits", "CPU Requests", "Memory Requests"];

interface Props extends PanelProps<SimpleOptions> { }


export const SimplePanel: React.FC<Props> = ({ options, data, width, height, }) => {

  let firstGroupedOption: SelectableValue = { label: "-", description: "Overview" };

  const [levelOption, setLevelOption] = useState("Overview");
  const [groupedOption, setGroupedOption] = useState(firstGroupedOption);
  const [metricOption, setMetricOption] = useState("-");

  const setLevelOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      try {
        setLevelOption(label.split(' ')[0]);
      } catch {
        setLevelOption(label);
      }

    }
  }

  const setGroupedOptionHandler = (option: SelectableValue) => {
    if (option.label !== undefined) {
      setGroupedOption(option);
    }
  }

  const setMetricOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      setMetricOption(label);
    }
  }


  //call handler to get 
  let allElements = handler(width, height, levelOption, data);
  let showElements = allElements;
  if (groupedOption.label !== "-") {
    if (groupedOption.description === levelOption) {
      showElements = handlerDetail(width, height, groupedOption, data, allElements);
    } else {
      handlerGrouped(levelOption, groupedOption, data);
    }
  }

  return (
    <div>
      <div className="header">
        <div className="test">
          <label>Level:</label>
          <div><DropdownUI id={"left"} options={dropdownOptions(levelOptions, levelOption)} onChange={setLevelOptionHandler} value={levelOption} /></div>
        </div>
        <div className="test">
          <label>Grouped by:</label>
          <div><DropdownGrouped id={"center"} options={newTest(data)} onChange={setGroupedOptionHandler} value={groupedOption} /></div>
        </div>
        <div className="test">
          <label>Metric:</label>
          <div><DropdownUI id={"right"} options={dropdownOptions(metricOptions, metricOption)} onChange={setMetricOptionHandler} value={metricOption} /></div>
        </div>
      </div>
      <Canvas width={width} height={height} allRect={showElements} levelOption={levelOption} setLevelOptionHandler={setLevelOptionHandler} setGroupedOptionHandler={setGroupedOptionHandler} />
    </div>
  )

}