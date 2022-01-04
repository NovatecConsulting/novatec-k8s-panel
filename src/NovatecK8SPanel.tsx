import React, { useState } from 'react';
import { PanelProps, SelectableValue } from '@grafana/data';
import { MultiSelect, Select, useTheme2 } from '@grafana/ui';
import { getStyles } from 'styles/component/SimplePanelStyle';
import { PanelOptions, Types } from 'types';
import { Canvas } from 'ObjectVisualisation/Canvas';
import { dropdownOptions } from 'Menu/DropdownOptions';
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
  getShowTree,
} from 'processMetric/TreeHelper';

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
  const [drilldownItem, setDrilldownItem] = useState<Element>({
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

  const [groupedOptions, setGroupedOptions] = useState<SelectableValue<string>[]>([]);

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
    if (groupedOption.length) {
      // filter 'groupedOption' to fit to selected level
      setGroupedOption(
        groupedOption.filter((opt) => dataTree.layerLaybels.findIndex((x) => x == opt.label) < selectedLevel)
      );
    }
  };

  /**
   * called for setting the 'groupedOption'
   * sorts the selected values hierarchical
   */
  const setGroupedOptionHandler = (v: SelectableValue<string>[]) => {
    setGroupedOption(
      v
        .map((v) => ({
          v,
          i: dataTree.layerLaybels.findIndex((label) => label == v.label),
        }))
        .sort((a, b) => (a.i < b.i ? -1 : a.i == b.i ? 0 : 1))
        .map((x) => x.v)
    );
  };

  // TODO setMetricOptionHandler
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
    // TODO to display full Drilldowninformation drilldownItem has to be from DataTree

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
              <Select
                value={levelOption}
                options={getLevelOptions(dataTree)}
                onChange={setLevelOptionHandler}
                menuShouldPortal={true}
              />
            </div>
            <div className={styles.dropdown}>
              <label>Filter:</label>
              <MultiSelect
                options={getFilterOptions(dataTree, levelOption, filterOption)}
                value={filterOption}
                onChange={setFilterOption}
                disabled={levelOption.label == 'Overview' ? true : false}
                menuShouldPortal={true}
              />
            </div>
            <div className={styles.dropdown}>
              <label>Grouped by:</label>
              <MultiSelect
                options={getGroupOptions(dataTree, levelOption)}
                value={groupedOption}
                onChange={setGroupedOptionHandler}
                disabled={levelOption.label == 'Overview' ? true : false}
                menuShouldPortal={true}
              />
            </div>
            <div className={styles.dropdown}>
              <label>Metric:</label>
              <div>
                <Select
                  key={'right'}
                  placeholder="-"
                  isSearchable={true}
                  options={dropdownOptions(metricOptions, metricOption)}
                  onChange={(item) => setMetricOptionHandler(item.label)}
                  value={{ label: metricOption }}
                  disabled={true}
                  menuShouldPortal={true}
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
            setGroupedOptionHandler={setFilterOption}
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
