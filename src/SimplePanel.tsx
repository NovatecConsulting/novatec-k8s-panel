import React, { useState } from 'react';
import { PanelProps, SelectableValue } from '@grafana/data';
import { SimpleOptions, Tuple } from 'types';
// import { css, cx } from 'emotion';
// import { stylesFactory, useTheme } from '@grafana/ui';

import { Canvas } from 'CanvasObjects/Canvas';
import { DropdownUI, DropdownFilter } from 'UIElement/Dropdown';
import { dropdownGroupedOptions, dropdownOptions, dropdownOptionsFilter } from 'UIElement/DropdownOptions';
import 'Style/SimplePanel.css';
import { handler, filterHandler, groupedHandler, groupedHandler2 } from 'Process/Handler';

const levelOptions = ["Overview", "Namespace", "Service", "Pod", "Container"];
const groupedOptions = ["Namespace", "Service", "Pod", "Container"]
const metricOptions = ["-", "CPU Nutzung", "Speicher Nutzung", "CPU Limits", "Memory Limits", "CPU Requests", "Memory Requests"];

interface Props extends PanelProps<SimpleOptions> { }


export const SimplePanel: React.FC<Props> = ({ options, data, width, height, }) => {

  let firstFilterOption: SelectableValue = { label: "-", description: "Overview" };
  const [levelOption, setLevelOption] = useState("Overview");
  const [filterOption, setFilterOption] = useState(firstFilterOption)
  const [groupedOption, setGroupedOption] = useState("-");
  const [metricOption, setMetricOption] = useState("-");

  // Todo
  const grouped = false;

  // Dropdown Handler
  const setLevelOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      try {
        setLevelOption(label.split(' ')[0]);
      } catch {
        setLevelOption(label);
      }

    }
  }

  const setFilterOptionHandler = (option: SelectableValue) => {
    if (option.label !== undefined) {
      setFilterOption(option);
    }
  }

  const setGroupedOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      setGroupedOption(label);
    }
  }

  const setMetricOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      setMetricOption(label);
    }
  }





  //call handler to get the level elements


  let allElements: Tuple = handler(width, height, levelOption, data);
  let showElements = allElements;

  // call filter handler to get f
  if (filterOption.label !== "-") {
    showElements = filterHandler(width, height, allElements, levelOption, filterOption, data);
  }

  if (groupedOption !== "-" && filterOption.label === "-") {
    showElements = groupedHandler2(data, levelOption, groupedOption, width, height);
  } else if (groupedOption !== "-") {
    showElements = groupedHandler(showElements, levelOption, groupedOption, data);
  }

  return (
    <div>
      <div className="header">
        <div className="test">
          <label>Level:</label>
          <div><DropdownUI id={"left"} options={dropdownOptions(levelOptions, levelOption)} onChange={setLevelOptionHandler} value={levelOption} /></div>
        </div>
        <div className="test">
          <label>Filter:</label>
          <div><DropdownFilter id={"center-left"} options={dropdownOptionsFilter(data)} onChange={setFilterOptionHandler} value={filterOption} /></div>
        </div>
        <div className="test">
          <label>Grouped by:</label>
          <div><DropdownUI id={"center-right"} options={dropdownGroupedOptions(groupedOptions, groupedOption, levelOption)} onChange={setGroupedOptionHandler} value={groupedOption} /></div>
        </div>
        <div className="test">
          <label>Metric:</label>
          <div><DropdownUI id={"right"} options={dropdownOptions(metricOptions, metricOption)} onChange={setMetricOptionHandler} value={metricOption} /></div>
        </div>
      </div>
      <Canvas width={width} height={height} allRect={showElements} levelOption={levelOption} setLevelOptionHandler={setLevelOptionHandler} setGroupedOptionHandler={setFilterOptionHandler} grouped={grouped} />
    </div>
  )



}