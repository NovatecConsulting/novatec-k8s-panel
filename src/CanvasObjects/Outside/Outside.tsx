import React from 'react';
import { Element } from 'types';

// import { render } from 'react-dom';
import { Layer } from 'react-konva';
import { RectOutside } from 'CanvasObjects/Outside/RectOutside';
import { RectItem } from 'CanvasObjects/Item/RectItem';
import { TextOutside } from 'CanvasObjects/Outside/TextOutside';
import { SelectableValue } from '@grafana/data';

type Props = {
    allInfos: Element[],
    setGroupedOptionHandler: (value: SelectableValue) => void;
}

export const Outside = ({ allInfos, setGroupedOptionHandler }: Props) => {

    return (
        <Layer>
            {allInfos.map((info) => (info.outside ? (
                <RectOutside
                    position={info.position}
                    width={info.width}
                    height={info.height}
                    color={info.color}
                />
            ) :
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
            {allInfos.map((info) => (
                <TextOutside
                    position={info.position}
                    text={info.text}
                />
            ))}
        </Layer>
    );
}
