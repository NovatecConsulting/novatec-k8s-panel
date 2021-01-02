import React, { useState } from 'react';
import { PanelProps, SelectableValue } from '@grafana/data';
import { SimpleOptions, Tuple, Types } from 'types';
// import { css, cx } from 'emotion';
// import { stylesFactory, useTheme } from '@grafana/ui';

import { Canvas } from 'canvasObjects/Canvas';
import { DropdownUI, DropdownFilter } from 'uiElement/Dropdown';
import { dropdownGroupedOptions, dropdownOptions, dropdownOptionsFilter } from 'uiElement/DropdownOptions';
import 'style/SimplePanel.css';
import { handler, filterHandler, groupedWithFilterHandler, groupedHandler } from 'processMetric/Handler';
import { Element } from 'types';
import { Drilldown } from './uiElement/Drilddown';

import { GraphUI } from './GraphUI';
import { NodeMetric } from './NodeMetric';


const levelOptions = ["Overview", "Namespace", "Deployment", "Pod", "Container"];
const groupedOptions = ["Namespace", "Deployment", "Pod", "Container"]
const metricOptions = ["-", "CPU Nutzung", "Speicher Nutzung", "CPU Limits", "Memory Limits", "CPU Requests", "Memory Requests"];

interface Props extends PanelProps<SimpleOptions> { }


export const SimplePanel: React.FC<Props> = ({ options, data, width, height, timeRange }) => {

  let firstFilterOption: SelectableValue = { label: "-", description: "Overview" };
  const [levelOption, setLevelOption] = useState("Overview");
  const [filterOption, setFilterOption] = useState(firstFilterOption)
  const [groupedOption, setGroupedOption] = useState("-");
  const [metricOption, setMetricOption] = useState("-");
  const [showElements, setShowElements] = useState(handler(width, height, "Overview", data));
  const [showDrilldown, setShowDrilldown] = useState(false);
  const [drilldownItem, setDrilldownItem] = useState({ position: { x: 0, y: 0 }, width: 0, height: 0, color: "", text: "-", elementInfo: { type: Types.Namespace } });
  const [showGraph, setShowGraph] = useState(false)

  /**
   * The value of the Level dropdown is set. Then the appropriate handler is called.
   * 
   * For reasons of asynchrony the handler is not called with the state.
   */
  const setLevelOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      try {
        let value = label.split(' ')[0];
        setLevelOption(value);

        if (value === "Overview") {
          setFilterOption({ label: "-" });
          setGroupedOption("-")
          callHandlers(value, { label: "-" }, "-")
        } else {
          callHandlers(value, filterOption, groupedOption);
        }
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
      setGroupedOption("-")
      callHandlers(levelOption, option, "-");
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

      setShowElements(groupedHandler(data, showElements, level, filter, grouped, width, height, false));
    } else if (grouped !== "-") {
      setShowElements(groupedWithFilterHandler(showElements, level, filter, grouped, data, width, height));
    }

  }

  /**
   * 
   */
  const itemSelectHandler = (item: Element) => {
    setShowDrilldown(true);
    setDrilldownItem(item);
  }


  const closeDrilldown = () => {
    setShowDrilldown(false);
  }


  return (
    <div>
      {!showGraph ? (<div>
        <div className="header">
          <div className="test">
            <label>Level:</label>
            <div>
              <DropdownUI
                id={"left"}
                options={dropdownOptions(levelOptions, levelOption)}
                onChange={setLevelOptionHandler}
                value={levelOption}
                isDisabled={false}
              />
            </div>
          </div>
          <div className="test">
            <label>Filter:</label>
            <div>
              <DropdownFilter
                id={"center-left"}
                options={dropdownOptionsFilter(data, filterOption.label, levelOption)}
                onChange={setFilterOptionHandler}
                value={filterOption} />
            </div>
          </div>
          <div className="test">
            <label>Grouped by:</label>
            <div>
              <DropdownUI
                id={"center-right"}
                options={dropdownGroupedOptions(groupedOptions, groupedOption, levelOption)}
                onChange={setGroupedOptionHandler}
                value={groupedOption}
                isDisabled={false}
              />
            </div>
          </div>
          <div className="test">
            <label>Metric:</label>
            <div>
              <DropdownUI
                id={"right"}
                options={dropdownOptions(metricOptions, metricOption)}
                onChange={setMetricOptionHandler}
                value={metricOption}
                isDisabled={true}
              />
            </div>
          </div>
          {showDrilldown ? (
            <div className="drilldown">
              <Drilldown
                closeDrilldown={closeDrilldown}
                drilldownItem={drilldownItem}
                setShowGraph={setShowGraph}

              />
            </div>) : null}
        </div>
        <Canvas
          width={width}
          height={height}
          allRect={showElements}
          levelOption={levelOption}
          setLevelOptionHandler={setLevelOptionHandler}
          setGroupedOptionHandler={setFilterOptionHandler}
          itemSelectHandler={itemSelectHandler}
        />
      </div>) : levelOption != "Node" && showGraph ? (
        <GraphUI
          width={width}
          height={height}
          data={data}
          timeRange={timeRange}
          setShowGraph={setShowGraph}
          focusItem={drilldownItem}
          level={levelOption}
        />) : <NodeMetric
            width={width}
            height={height}
            data={data}
            timeRange={timeRange}
            setShowGraph={setShowGraph}
            focusItem={drilldownItem}
            level={levelOption}
          />}

    </div>
  )
}