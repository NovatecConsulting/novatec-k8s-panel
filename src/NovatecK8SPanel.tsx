import React, { useState } from 'react';
import { PanelProps, SelectableValue } from '@grafana/data';
import { MultiSelect, Select, useTheme2 } from '@grafana/ui';
import getStyles from './styles/components/NovatecK8SPanel';
import { INode, INodeID, PanelOptions } from './types';
import { getMetricOptionsForLevel } from './utils';
import { Drilldown, GraphUI, Treemap } from './components';
import {
  buildTree,
  getNode,
  getFilterOptions,
  getGroupOptions,
  getLevelOptions,
  getShowTree,
  getNodeInformation,
  getNodeID,
} from './treeutils';

interface Props extends PanelProps<PanelOptions> {}

export const NovatecK8SPanel: React.FC<Props> = ({ options, data, width, height, timeRange }) => {
  // FIXME check `data.state` for 'Error' and show `data.state.error.message` instead of trying to render components
  // or rather use similar error handling as grafanas original plugins

  const [levelOption, setLevelOption] = useState<SelectableValue<string>>({ label: 'Overview', value: 'Overview' });
  const [filterOption, setFilterOption] = useState<SelectableValue<string>[]>([]);
  const [groupedOption, setGroupedOption] = useState<SelectableValue<string>[]>([]);
  const [metricOption, setMetricOption] = useState<SelectableValue<string> | null>(null);

  const [showDrilldown, setShowDrilldown] = useState(false);
  const [selectedNode, setSelectedNode] = useState<INode | undefined>();

  const [showGraph, setShowGraph] = useState(false);
  const theme = useTheme2();
  const styles = getStyles(theme, width, height);

  // TODO buildTree could return undefined -> Panel has to show error
  // maybe on level Overview
  const dataTree = buildTree(data);

  const metricOptions = getMetricOptionsForLevel(data, levelOption);

  /**
   * calls affected setters when level is changed
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
    // reset selected metric because it might not be available with an other level
    setMetricOption(null);
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

  /**
   * Is called to display the drilldown menu.
   */
  const clickHandler = (id: INodeID) => {
    setSelectedNode(getNode(dataTree, id));
    setShowDrilldown(true);
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
                menuShouldPortal
              />
            </div>
            <div className={styles.dropdown}>
              <label>Filter:</label>
              <MultiSelect
                options={getFilterOptions(dataTree, levelOption, filterOption)}
                value={filterOption}
                onChange={setFilterOption}
                disabled={levelOption.label == 'Overview' ? true : false}
                menuShouldPortal
              />
            </div>
            <div className={styles.dropdown}>
              <label>Grouped by:</label>
              <MultiSelect
                options={getGroupOptions(dataTree, levelOption)}
                value={groupedOption}
                onChange={setGroupedOptionHandler}
                disabled={levelOption.label == 'Overview' ? true : false}
                menuShouldPortal
              />
            </div>
            <div className={styles.dropdown}>
              <label>Metric:</label>
              <div>
                <Select
                  key={'right'}
                  options={metricOptions}
                  value={metricOption}
                  placeholder="-"
                  isSearchable={true}
                  onChange={setMetricOption}
                  disabled={metricOptions ? !metricOptions.length : true}
                  menuShouldPortal
                  isClearable
                />
              </div>
            </div>
            {showDrilldown ? (
              <div className={styles.drilldown}>
                <Drilldown
                  closeDrilldown={() => setShowDrilldown(false)}
                  drilldownItem={selectedNode && getNodeInformation(dataTree, selectedNode)}
                  setShowGraph={setShowGraph}
                />
              </div>
            ) : null}
          </div>
          {levelOption.value !== 'Overview' ? (
            <Treemap
              data={data}
              width={width}
              height={height - 53}
              tree={getShowTree(dataTree, levelOption, filterOption, groupedOption)}
              onClick={clickHandler}
              metric={metricOption || undefined}
            />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.placeholderText}>select a level to get started</span>
            </div>
          )}
        </div>
      ) : (
        selectedNode && (
          <GraphUI
            width={width}
            height={height}
            data={data}
            timeRange={timeRange}
            setShowGraph={setShowGraph}
            nodeId={getNodeID(dataTree, selectedNode)}
          />
        )
      )}
    </div>
  );
};
