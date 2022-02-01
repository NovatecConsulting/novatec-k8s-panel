import React from 'react';
import { Group } from '@visx/group';
import { Treemap, treemapSquarify, hierarchy } from '@visx/hierarchy';
import { INodeID, ITree } from 'types';
import { useTheme2 } from '@grafana/ui';
import getStyles from '../styles/components/TreemapStyle';
import { DisplayValue, getActiveThreshold, PanelData, SelectableValue, ThresholdsMode } from '@grafana/data';

export interface ITreemapProps {
  data: PanelData;
  width: number;
  height: number;
  tree: ITree;
  onClick?: (id: INodeID) => void;
  metric?: SelectableValue<string>;
}

const margin = { top: 10, right: 10, bottom: 10, left: 10 };

function CustomTreemap({ data, width, height, tree, onClick, metric }: ITreemapProps) {
  // TODO maybe use custom hook for width and heigth: https://stackoverflow.com/a/60978633/13590313
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const textHeight = 15;
  const t = useTheme2();
  const s = getStyles(t);
  const root = hierarchy({ name: 'root', children: tree.roots }).sum((_) => 1);

  /**
   * get the DisplayValue for given NodeId
   * @param nodeId INodeId
   * @returns corresponding DisplayValue for the node with current metric or undefined
   */
  const getDisplay = (nodeId: INodeID): DisplayValue | undefined => {
    const refId = `${metric?.description}/${metric?.value}/${nodeId.layerLabel.toLowerCase()}`;
    const field = data.series
      .find((s) => s.refId == refId && s.name?.includes(nodeId.name))
      ?.fields.find((f) => f.name == 'Value');
    if (field == undefined || field.config.thresholds == undefined) return undefined;

    const dv = field.display!(nodeId.name);
    let value = field.values.get(field.values.length - 1);
    if (field.config.thresholds?.mode === ThresholdsMode.Percentage) {
      let min = field.config.min ?? 0;
      let max = field.config.max ?? 100;
      value = ((value - min) / (max - min)) * 100;
    }

    const th = getActiveThreshold(value, field.config.thresholds.steps);
    const c = t.visualization.getColorByName(th.color);

    // override displayValue color because display function apparently doesn´t apply thresholds
    if (dv && c) dv.color = c;
    return dv;
  };

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill={t.colors.background.canvas || ''}></rect>
      <Treemap
        root={root}
        size={[xMax, yMax]}
        paddingTop={t.spacing.gridSize + textHeight}
        paddingInner={t.spacing.gridSize}
        paddingLeft={t.spacing.gridSize}
        paddingRight={t.spacing.gridSize}
        paddingBottom={t.spacing.gridSize}
        tile={treemapSquarify}
      >
        {(treemap) => (
          <Group>
            {treemap.descendants().map((node, i) => {
              // node can be element (leaves) or container
              const nodeIsElement = node.depth == tree.layerLaybels.length;
              const nodeId: INodeID = { name: node.data.name, layerLabel: tree.layerLaybels[node.depth - 1] };
              const cb = () => {
                if (onClick != undefined && nodeId.layerLabel) onClick(nodeId);
              };
              const display = nodeIsElement && nodeId.layerLabel ? getDisplay(nodeId) : undefined;
              return (
                <Group
                  key={`node-${i}`}
                  top={nodeIsElement ? node.y0 + margin.top : node.y0 + margin.top + textHeight}
                  left={node.x0 + margin.left}
                  onClick={cb}
                >
                  {nodeIsElement ? (
                    <rect
                      className={s.element}
                      fill={display ? display.color : t.colors.background.secondary}
                      width={node.x1 - node.x0}
                      height={node.y1 - node.y0}
                    />
                  ) : (
                    node.depth !== 0 && (
                      <>
                        <text className={s.containerText} transform={`translate(0, ${-3})`}>
                          {node.data.name}
                        </text>
                        <rect
                          className={s.container}
                          width={node.x1 - node.x0}
                          height={node.y1 - node.y0 - textHeight}
                        />
                      </>
                    )
                  )}
                </Group>
              );
            })}
          </Group>
        )}
      </Treemap>
    </svg>
  );
}

export default CustomTreemap;
