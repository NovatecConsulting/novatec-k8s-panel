import React from 'react';
import { Element } from 'types';

// import { render } from 'react-dom';
import { Layer } from 'react-konva';
import { RectItem } from 'CanvasObjects/Item/RectItem';
import { TextItem } from 'CanvasObjects/Item/TextItem';

type Props = {
    allInfos: Element[],
    setGroupedOptionHandler: (value: string | undefined) => void;
}

export const Item = ({ allInfos, setGroupedOptionHandler }: Props) => {

    return (
        <Layer>
            {allInfos.map((info) => (
                <RectItem
                    position={info.position}
                    width={info.width}
                    height={info.height}
                    color={info.color}
                    option={info.text}
                    setGroupedOption={setGroupedOptionHandler}
                />
            ))}
            {allInfos.map((info) => (
                <TextItem
                    position={info.position}
                    text={info.text}
                />
            ))}
        </Layer>
    );
}
