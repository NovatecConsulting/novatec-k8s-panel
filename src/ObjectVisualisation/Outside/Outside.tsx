import React from 'react';
import { Tuple } from 'types';
import { Layer } from 'react-konva';
import { RectOutside } from 'ObjectVisualisation/Outside/RectOutside';
import { RectItem } from 'ObjectVisualisation/Item/RectItem';
import { TextOutside } from 'ObjectVisualisation/Outside/TextOutside';
import { TextItem } from 'ObjectVisualisation/Item/TextItem';
import { SelectableValue } from '@grafana/data';
import { MetricImage } from 'ObjectVisualisation/Item/MetricImage';
import {Element} from 'types';

type Props = {
    allInfos: Tuple,
    setGroupedOptionHandler: (value: SelectableValue) => void;
    itemSelectHandler: (item: Element) => void;
}

export const Outside = ({ allInfos, setGroupedOptionHandler, itemSelectHandler }: Props) => {
    return (
        <Layer>
            { allInfos.outside!.map((info) => (
                <RectOutside
                    position={info.position}
                    width={info.width}
                    height={info.height}
                    color={info.color}
                />
            ))}
            { allInfos.outside!.map((info) => (
                <TextOutside
                    position={info.position}
                    text={info.text}
                />
            ))}
            {allInfos.inside.map((info) => (
                <RectItem
                    position={info.position}
                    width={info.width}
                    height={info.height}
                    color={info.color}
                    option={info.text}
                    setGroupedOption={setGroupedOptionHandler}
                    type={info.elementInfo?.type}
                />
            ))}
            {allInfos.inside.map((info) => (
                <TextItem
                    position={info.position}
                    text={info.text}
                    option={info.text}
                    setGroupedOption={()=>{}}
                    type={info.elementInfo?.type}
                />
            ))}
            {allInfos.inside.map((info) => (
                <MetricImage
                    position={info.position}
                    itemWidth={info.width}
                    item={info}
                    itemSelectHandler={()=>itemSelectHandler(info)}
                />
            ))}
        </Layer>
    );
}
