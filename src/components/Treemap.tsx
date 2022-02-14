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
  // FIXME using this fixed numbers might cause issues since fontSize is actually relative (rem)
  const fontSizeGroupLabel = 15; // relates to t.typography.body.fontSize
  const fontSizeElementLabel = 10; // relates to t.typography.bodySmall.fontSize
  const gradId = 'lgrad';
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
      <defs>
        <linearGradient id={gradId}>
          <stop offset="80%" stop-color="white" />
          <stop offset="100%" stop-color="black" />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill={t.colors.background.canvas || ''}></rect>
      <Treemap
        root={root}
        size={[xMax, yMax]}
        paddingTop={t.spacing.gridSize + fontSizeGroupLabel}
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
              const w = node.x1 - node.x0;
              const h = node.y1 - node.y0;
              const clipId = `clip-${i}`;
              const maskId = `mask-${i}`;
              return (
                <Group
                  key={`node-${i}`}
                  top={nodeIsElement ? node.y0 + margin.top : node.y0 + margin.top + fontSizeGroupLabel}
                  left={node.x0 + margin.left}
                  onClick={cb}
                >
                  {nodeIsElement ? (
                    // these are the elements/ leaves
                    <>
                      <clipPath id={clipId}>
                        <rect width={w} height={h} />
                      </clipPath>
                      <defs>
                        <mask id={maskId} x={0} y={0} width={w} height={h}>
                          <rect x={0} y={0} width={w} height={h} fill={`url(#${gradId})`} />
                        </mask>
                      </defs>
                      <rect
                        className={s.element}
                        fill={display ? display.color : t.colors.background.secondary}
                        width={w}
                        height={h}
                      />
                      <text
                        className={`${s.label} ${s.elementLabel}`}
                        x={2}
                        y={fontSizeElementLabel + 2}
                        clipPath={`url(#${clipId}`}
                        mask={`url(#${maskId})`}
                      >
                        {node.data.name}
                      </text>
                    </>
                  ) : (
                    // the root node need to be excluded since its an artificial group
                    node.depth !== 0 && (
                      // these are the groups/ containers
                      <>
                        <clipPath id={clipId}>
                          <rect x={0} y={-fontSizeGroupLabel} width={w} height={h} />
                        </clipPath>
                        <defs>
                          <mask id={maskId} x={0} y={-fontSizeGroupLabel} width={w} height={h}>
                            <rect x={0} y={-fontSizeGroupLabel} width={w} height={h} fill={`url(#${gradId})`} />
                          </mask>
                        </defs>
                        <text
                          className={s.label}
                          transform={`translate(0, ${-3})`}
                          clipPath={`url(#${clipId})`}
                          mask={`url(#${maskId})`}
                        >
                          {node.data.name}
                        </text>
                        <rect className={s.container} width={w} height={h - fontSizeGroupLabel} />
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
