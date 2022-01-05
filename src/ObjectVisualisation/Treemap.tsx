import React from 'react';
import { Group } from '@visx/group';
import { Treemap, treemapSquarify, hierarchy } from '@visx/hierarchy';
import { INode, ITree } from 'types';
import { useTheme2 } from '@grafana/ui';
import { rearg } from 'lodash';

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
  const t = useTheme2();
  const root = hierarchy({ name: 'root', children: data.roots }).sum((_) => 1);
  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill={t.colors.background.canvas || ''}></rect>
      <Treemap
        root={root}
        size={[xMax, yMax]}
        paddingTop={25}
        paddingInner={5}
        paddingLeft={5}
        paddingRight={5}
        paddingBottom={5}
      >
        {(treemap) => (
          <Group>
            {treemap
              .descendants()
              .reverse()
              .map((node, i) => {
                // node can be element (leaves) or container
                const nodeIsElement = node.depth == data.layerLaybels.length;
                return (
                  <Group
                    key={`node-${i}`}
                    top={nodeIsElement ? node.y0 + margin.top : node.y0 + margin.top + 20}
                    left={node.x0 + margin.left}
                  >
                    {nodeIsElement ? (
                      <rect width={node.x1 - node.x0} height={node.y1 - node.y0} fill={t.colors.background.secondary} />
                    ) : (
                      node.depth !== 0 && (
                        <>
                          <text transform={`translate(0, ${-3})`} fill={t.colors.text.primary}>
                            {node.data.name}
                          </text>
                          <rect
                            width={node.x1 - node.x0}
                            height={node.y1 - node.y0 - 20}
                            stroke={t.colors.primary.main}
                            strokeWidth={2}
                            fill="transparent"
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
