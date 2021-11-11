import React from 'react';
import { Element } from 'types';

import { Layer } from 'react-konva';
import { RectItem } from 'ObjectVisualisation/Item/RectItem';
import { TextItem } from 'ObjectVisualisation/Item/TextItem';
import { SelectableValue } from '@grafana/data';
import { MetricImage } from 'ObjectVisualisation/Item/MetricImage';
import { AppMetricInfo } from 'ObjectVisualisation/Item/AppMetricInfo';
import { InfMetricInfo } from 'ObjectVisualisation/Item/InfMetricInfo';
import { useTheme2 } from '@grafana/ui';
type Props = {
  allInfos: Element[];
  setGroupedOptionHandler: (value: SelectableValue) => void;
  itemSelectHandler: (item: Element) => void;
};

export const Item = ({ allInfos, setGroupedOptionHandler, itemSelectHandler }: Props) => {
  const t = useTheme2();
  return (
    <Layer>
      {allInfos.map((info) => (
        <RectItem
          position={info.position}
          width={info.width}
          height={info.height}
          color={
            info.color === "r" ? t.colors.error.main :
              info.color === "y" ? t.colors.warning.main :
                info.color === "g" ? t.colors.success.main :
                  info.color === "p" ? t.colors.primary.main :
                    info.color
          }
          option={info.text}
          setGroupedOption={setGroupedOptionHandler}
          type={info.elementInfo?.type}
        />
      ))}
      {allInfos.map((info) => (
        <TextItem
          position={info.position}
          text={info.text}
          option={info.text}
          setGroupedOption={setGroupedOptionHandler}
          type={info.elementInfo?.type}
        />
      ))}
      {allInfos.map((info) => (
        <MetricImage
          position={info.position}
          itemWidth={info.width}
          item={info}
          itemSelectHandler={itemSelectHandler}
        />
      ))}
      {allInfos.map(info => (
        info.elementInfo.withAppMetrics ?
          <AppMetricInfo
            position={info.position}
            itemWidth={info.width}
            item={info}
          /> : undefined

      ))}
      {allInfos.map(info => (
        info.elementInfo.withInfMetrics ?
          <InfMetricInfo
            position={info.position}
            itemWidth={info.width}
            item={info}
          /> : undefined
      ))}
    </Layer>
  );
};
