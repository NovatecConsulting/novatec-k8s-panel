import React, { useState } from 'react';
import { PanelProps, SelectableValue } from '@grafana/data';
import { MultiSelect, Select, useTheme2 } from '@grafana/ui';
import { getStyles } from 'styles/component/SimplePanelStyle';
import { ITree, PanelOptions, Tuple, Types } from 'types';
import { Canvas } from 'ObjectVisualisation/Canvas';
import { DropdownComponent, DropdownComponentFilter } from 'Menu/Dropdown';
import { dropdownGroupedOptions, dropdownOptions, dropdownOptionsFilter } from 'Menu/DropdownOptions';
import { handler, filterHandler, groupedWithFilterHandler, groupedHandler, metricHandler } from 'processMetric/Handler';
import { Element } from 'types';
import { Drilldown } from './Menu/Drilddown';
import { GraphUI } from './GraphUI';
import { NodeMetric } from './NodeMetric';
import {
  buildTree,
  deleteTreeNodes,
  getFilterOptions,
  getGroupOptions,
  getLevelOptions,
} from 'processMetric/TreeHelper';
import { SelectOptions } from '@grafana/ui/components/Select/types';

const levelOptions = ['Overview', 'Namespace', 'Deployment', 'Pod', 'Container'];
const groupedOptions = ['Namespace', 'Deployment', 'Pod', 'Container'];
export const metricOptions = [
  '-',
  'cpu_usage',
  'memory_usage',
  'cpu_limits',
  'memory_limits',
  'cpu_requests',
  'memory_requests',
];

interface Props extends PanelProps<PanelOptions> {}

export const NovatecK8SPanel: React.FC<Props> = ({ options, data, width, height, timeRange }) => {
  // FIXME check `data.state` for 'Error' and show `data.state.error.message` instead of trying to render components

  const { theOptions } = options;
  const [levelOption, setLevelOption] = useState<SelectableValue<string>>({ label: 'Overview', value: 'Overview' });
  const [filterOption, setFilterOption] = useState<SelectableValue<string>[]>([]);
  const [groupedOption, setGroupedOption] = useState<SelectableValue<string>[]>([]);
  const [metricOption, setMetricOption] = useState('-');

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
  const theme = useTheme2();
  const styles = getStyles(theme, height);

  const dataTree = buildTree(data); // needs to be deleted manually (with `deleteTreeNodes`)
  // deleteTreeNodes(dataTree);

  const [groupedOptions, setGroupedOptions] = useState<SelectOptions<string>[]>([]);

  const [displayTree, setDisplayTree] = useState<ITree>(dataTree);

  /**
   * The value of the Level dropdown is set. Then the appropriate handler is called.
   */
  const setLevelOptionHandler = (v: SelectableValue<string>) => {
    setLevelOption(v);

    // selelctedLevel will be -1 for the 'Overview'
    const selectedLevel = dataTree.layerLaybels.findIndex((x) => x == v.value);
    if (filterOption.length) {
      // reset filter options if level doens´t fit with set filter
      const filteredLevel = dataTree.layerLaybels.findIndex((x) => x == filterOption[0].description);
      if (selectedLevel < filteredLevel) setFilterOption([]);
    }

    // TODO filter Filteroption and Groupedoptions
    if (v.value != 'Overview') {
      // setGroupedOptions(getGroupOptions(dataTree, levelOption, filterOption));
    }

    /* 
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
     */
  };

  /**
   * The value of the Filter dropdown is set. Then the appropriate handler is called.
   */
  const setFilterOptionHandler = (options: SelectableValue<string>[]) => {
    if (options.length) {
      options[0].description;
    }
    setFilterOption(options);
    /* 
    if (option.label !== undefined && levelOption.value !== 'Node') {
      setFilterOption(option);
      setGroupedOption('-');
      callHandlers(levelOption, option, '-', metricOption);
      setShowDrilldown(false);
    }
     */
  };

  /**
   * The value of the Grouped by dropdown is set. Then the appropriate handler is called.
   */
  const setGroupedOptionHandler = (label: SelectableValue<string>[]) => {
    /*  
    if (label !== undefined) {
      setGroupedOption(label);
      callHandlers(levelOption, filterOption, label, metricOption);
      setShowDrilldown(false);
    }
    */
  };

  /**
   * ToDo
   */
  const setMetricOptionHandler = (label: string | undefined) => {
    if (label !== undefined) {
      //not the final solution
      /*
      setGroupedOption('-');
      setFilterOption(firstFilterOption);
      setMetricOption(label);
      callHandlers(levelOption, filterOption, groupedOption, label);
      setShowDrilldown(false);
      */
    }
  };

  /**
   * Is called to display the drilldown menu.
   */
  const itemSelectHandler = (item: Element) => {
    setShowDrilldown(!showDrilldown);

    if (levelOption.value !== 'Node') {
      setDrilldownItem(item);
    } else {
      setShowGraph(true);
    }
  };

  return (
    <div>
      {!showGraph ? (
        <div>
          <div className={styles.header}>
            <div className={styles.dropdown}>
              <label>Level:</label>
              <Select value={levelOption} options={getLevelOptions(dataTree)} onChange={setLevelOptionHandler} />
            </div>
            <div className={styles.dropdown}>
              <label>Filter:</label>
              <MultiSelect
                options={getFilterOptions(dataTree, levelOption, filterOption)}
                value={filterOption}
                onChange={setFilterOptionHandler}
                disabled={levelOption.label == 'Overview' ? true : false}
              />
            </div>
            <div className={styles.dropdown}>
              <label>Grouped by:</label>
              <MultiSelect
                options={getGroupOptions(dataTree, levelOption, filterOption)}
                value={groupedOption}
                onChange={setGroupedOptionHandler}
                disabled={levelOption.label == 'Overview' ? true : false}
              />
            </div>
            <div className={styles.dropdown}>
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
              <div className={styles.drilldown}>
                <Drilldown
                  closeDrilldown={() => setShowDrilldown(false)}
                  drilldownItem={drilldownItem}
                  setShowGraph={setShowGraph}
                />
              </div>
            ) : null}
          </div>
          {/* <Canvas
            width={width}
            height={height}
            allRect={showElements} // showElements state contained all items to be displayed this should be derived from states (dataTree, filterOption, groupOption)
            levelOption={levelOption}
            setLevelOptionHandler={setLevelOptionHandler}
            setGroupedOptionHandler={setFilterOptionHandler}
            itemSelectHandler={itemSelectHandler}
          /> */}
        </div>
      ) : levelOption.value !== 'Node' && showGraph ? (
        <GraphUI
          width={width}
          height={height}
          data={data}
          timeRange={timeRange}
          setShowGraph={setShowGraph}
          focusItem={drilldownItem}
          level={levelOption.value ? levelOption.value : ''}
        />
      ) : (
        <NodeMetric
          width={width}
          height={height}
          data={data}
          timeRange={timeRange}
          setShowGraph={setShowGraph}
          focusItem={drilldownItem}
          level={levelOption.value ? levelOption.value : ''}
        />
      )}
    </div>
  );
};
