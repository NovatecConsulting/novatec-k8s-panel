import React from 'react';
import { Tuple } from 'types';

// import { render } from 'react-dom';
import { Layer } from 'react-konva';
import { RectOutside } from 'CanvasObjects/Outside/RectOutside';
import { RectItem } from 'CanvasObjects/Item/RectItem';
import { TextOutside } from 'CanvasObjects/Outside/TextOutside';
import { TextItem } from 'CanvasObjects/Item/TextItem';
import { SelectableValue } from '@grafana/data';

type Props = {
    allInfos: Tuple,
    setGroupedOptionHandler: (value: SelectableValue) => void;
}

export const Outside = ({ allInfos, setGroupedOptionHandler }: Props) => {

    return (
        <Layer>
            {allInfos !== undefined ? (
                <RectOutside
                    position={allInfos.outside!.position}
                    width={allInfos.outside!.width}
                    height={allInfos.outside!.height}
                    color={allInfos.outside!.color}
                />
            ) : null}
            <TextOutside
                position={allInfos.outside!.position}
                text={allInfos.outside!.text}
            />
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
                />
            ))}
        </Layer>
    );
}
