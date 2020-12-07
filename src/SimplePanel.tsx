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
  const [showElements, setShowElements] = useState(handler(width, height, "Overview", data));


  /**
   * The value of the Level dropdown is set. Then the appropriate handler is called.
   * 
   * For reasons of asynchrony the handler is not called with the state.
   */
  const setLevelOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      try {
        setLevelOption(label.split(' ')[0]);
        callHandlers(label.split(' ')[0], filterOption, groupedOption);
      } catch {
        setLevelOption(label);
        callHandlers(label, filterOption, groupedOption);
      }

    }

  }

  /**
   * The value of the Filter dropdown is set. Then the appropriate handler is called.
   * 
   * For reasons of asynchrony the handler is not called with the state.
   */
  const setFilterOptionHandler = (option: SelectableValue) => {
    if (option.label !== undefined) {
      setFilterOption(option);
      callHandlers(levelOption, option, groupedOption);
    }

  }

  /**
   * The value of the Grouped by dropdown is set. Then the appropriate handler is called.
   * 
   * For reasons of asynchrony the handler is not called with the state.
   */
  const setGroupedOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      setGroupedOption(label);
      callHandlers(levelOption, filterOption, label);
    }

  }


  const setMetricOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      setMetricOption(label);
    }
  }


  /**
   * Calls the matching handlers.
   */
  const callHandlers = (level: string, filter: SelectableValue, grouped: string) => {
    let allElements: Tuple = handler(width, height, level, data);
    setShowElements(allElements);
    if (filter.label !== "-") {
      setShowElements(filterHandler(width, height, allElements, level, filter, data));
    }
    if (grouped !== "-" && filter.label === "-") {

      setShowElements(groupedHandler2(data, level, grouped, width, height));
    } else if (grouped !== "-") {
      setShowElements(groupedHandler(showElements, level, grouped, data));
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
      <Canvas width={width} height={height} allRect={showElements} levelOption={levelOption} setLevelOptionHandler={setLevelOptionHandler} setGroupedOptionHandler={setFilterOptionHandler} />
    </div>
  )
}