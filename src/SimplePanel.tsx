import React, { useState } from 'react';
import { PanelProps, SelectableValue } from '@grafana/data';
import { SimpleOptions, Tuple, Types } from 'types';
import { Canvas } from 'ObjectVisualisation/Canvas';
import { DropdownComponent, DropdownComponentFilter } from 'Menu/Dropdown';
import { dropdownGroupedOptions, dropdownOptions, dropdownOptionsFilter } from 'Menu/DropdownOptions';
import 'style/SimplePanel.css';
import { handler, filterHandler, groupedWithFilterHandler, groupedHandler, metricHandler } from 'processMetric/Handler';
import { Element } from 'types';
import { Drilldown } from './Menu/Drilddown';
import { GraphUI } from './GraphUI';
import { NodeMetric } from './NodeMetric';

const levelOptions = ['Overview', 'Namespace', 'Deployment', 'Pod', 'Container'];
const groupedOptions = ['Namespace', 'Deployment', 'Pod', 'Container'];
export const metricOptions = [
  '-',
  'CPU Usage',
  'Memory Usage',
  'CPU Limits',
  'Memory Limits',
  'CPU Requests',
  'Memory Requests',
];

interface Props extends PanelProps<SimpleOptions> { }

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, timeRange }) => {
  const { theOptions } = options;
  let firstFilterOption: SelectableValue = { label: '-', description: 'Overview' };
  const [levelOption, setLevelOption] = useState('Overview');
  const [filterOption, setFilterOption] = useState(firstFilterOption);
  const [groupedOption, setGroupedOption] = useState('-');
  const [metricOption, setMetricOption] = useState('-');
  const [showElements, setShowElements] = useState(handler(width, height, 'Overview', data, timeRange));
  const [showDrilldown, setShowDrilldown] = useState(false);
  const [drilldownItem, setDrilldownItem] = useState({
    position: { x: 0, y: 0 },
    width: 0,
    height: 0,
    color: '',
    text: '-',
    elementInfo: { type: Types.Namespace },
  });
  const [showGraph, setShowGraph] = useState(false);

  /**
   * The value of the Level dropdown is set. Then the appropriate handler is called.
   */
  const setLevelOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      try {
        setShowDrilldown(false);
        let value = label.split(' ')[0];
        setLevelOption(value);

        if (value === 'Overview') {
          setFilterOption({ label: '-' });
          setGroupedOption('-');
          callHandlers(value, { label: '-' }, '-', metricOption);
        } else {
          callHandlers(value, filterOption, groupedOption, metricOption);
        }
      } catch {
        setLevelOption(label);
        callHandlers(label, filterOption, groupedOption, metricOption);
      }
    }
  };

  /**
   * The value of the Filter dropdown is set. Then the appropriate handler is called.
   */
  const setFilterOptionHandler = (option: SelectableValue) => {
    if (option.label !== undefined && levelOption !== 'Node') {
      setFilterOption(option);
      setGroupedOption('-');
      callHandlers(levelOption, option, '-', metricOption);
      setShowDrilldown(false);
    }
  };

  /**
   * The value of the Grouped by dropdown is set. Then the appropriate handler is called.
   */
  const setGroupedOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      setGroupedOption(label);
      callHandlers(levelOption, filterOption, label, metricOption);
      setShowDrilldown(false);
    }
  };

  /**
   * ToDo
   */
  const setMetricOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      //not the final solution
      setGroupedOption('-');
      setFilterOption(firstFilterOption);
      setMetricOption(label);
      callHandlers(levelOption, filterOption, groupedOption, label);
      setShowDrilldown(false);
    }
  };

  /**
   * Calls the matching handlers.
   */
  const callHandlers = (level: string, filter: SelectableValue, grouped: string, metric: string) => {
    let allElements: Tuple = handler(width, height, level, data, timeRange);
    setShowElements(allElements);
    if (filter.label !== '-') {
      setShowElements(filterHandler(width, height, allElements, level, filter, data));
    }
    if (grouped !== '-' && filter.label === '-') {
      setShowElements(groupedHandler(data, showElements, level, filter, grouped, width, height, false, timeRange));
    } else if (grouped !== '-') {
      setShowElements(groupedWithFilterHandler(showElements, level, filter, grouped, data, width, height, timeRange));
    }
    if (metric !== '-') {
      setShowElements(metricHandler(width, height, allElements, level, filter, data, metric, theOptions.dropdownOption, parseFloat(theOptions.red), parseFloat(theOptions.orange), parseFloat(theOptions.green)));
    }
  };

  /**
   * Is called to display the drilldown menu.
   */
  const itemSelectHandler = (item: Element) => {
    setShowDrilldown(!showDrilldown);


    if (levelOption !== 'Node') {
      setDrilldownItem(item);
    }
    else {
      setShowGraph(true);

    }

  };

  /**
   * Is called to close the drilldown menu.
   */
  const closeDrilldown = () => {
    setShowDrilldown(false);
  };

  return (
    <div>
      {!showGraph ? (
        <div>
          <div className="header--simple">
            <div className="dropdown--simple">
              <label>Level:</label>
              <div>
                <DropdownComponent
                  id={'left'}
                  options={dropdownOptions(levelOptions, levelOption)}
                  onChange={setLevelOptionHandler}
                  value={levelOption}
                  isDisabled={false}
                />
              </div>
            </div>
            <div className="dropdown--simple">
              <label>Filter:</label>
              <div>
                <DropdownComponentFilter
                  id={'center-left'}
                  options={dropdownOptionsFilter(data, filterOption.label, levelOption)}
                  onChange={setFilterOptionHandler}
                  value={filterOption}
                  isDisabled={levelOption === 'Node'}
                />
              </div>
            </div>
            <div className="dropdown--simple">
              <label>Grouped by:</label>
              <div>
                <DropdownComponent
                  id={'center-right'}
                  options={dropdownGroupedOptions(groupedOptions, groupedOption, levelOption)}
                  onChange={setGroupedOptionHandler}
                  value={groupedOption}
                  isDisabled={false}
                />
              </div>
            </div>
            <div className="dropdown--simple">
              <label>Metric:</label>
              <div>
                <DropdownComponent
                  id={'right'}
                  options={dropdownOptions(metricOptions, metricOption)}
                  onChange={setMetricOptionHandler}
                  value={metricOption}
                  isDisabled={false}
                />
              </div>
            </div>
            {showDrilldown ? (
              <div className="drilldown--simple" style={{ height: height - 40 }}>
                <Drilldown closeDrilldown={closeDrilldown} drilldownItem={drilldownItem} setShowGraph={setShowGraph} />
              </div>
            ) : null}
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
        </div>
      ) : levelOption !== 'Node' && showGraph ? (
        <GraphUI
          width={width}
          height={height}
          data={data}
          timeRange={timeRange}
          setShowGraph={setShowGraph}
          focusItem={drilldownItem}
          level={levelOption}
        />
      ) : (
        <NodeMetric
          width={width}
          height={height}
          data={data}
          timeRange={timeRange}
          setShowGraph={setShowGraph}
          focusItem={drilldownItem}
          level={levelOption}
        />
      )}
    </div>
  );
};
