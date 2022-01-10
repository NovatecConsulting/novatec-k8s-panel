import React from 'react';
import { Group } from '@visx/group';
import { Treemap, treemapSquarify, hierarchy } from '@visx/hierarchy';
import { INode, ITree } from 'types';
import { useTheme2 } from '@grafana/ui';
import getStyles from '../styles/TreemapStyle';

export interface ITreemapProps {
  width: number;
  height: number;
  data: ITree;
}

const margin = { top: 10, right: 10, bottom: 10, left: 10 };

function CustomTreemap({ width, height, data }: ITreemapProps) {
  // TODO maybe use custom hook for width and heigth: https://stackoverflow.com/a/60978633/13590313
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const textHeight = 15;
  const t = useTheme2();
  const s = getStyles(t);
  const root = hierarchy({ name: 'root', children: data.roots }).sum((_) => 1);
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
              const nodeIsElement = node.depth == data.layerLaybels.length;
              return (
                <Group
                  key={`node-${i}`}
                  top={nodeIsElement ? node.y0 + margin.top : node.y0 + margin.top + textHeight}
                  left={node.x0 + margin.left}
                >
                  {nodeIsElement ? (
                    <rect className={s.element} width={node.x1 - node.x0} height={node.y1 - node.y0} />
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
