import React from 'react';
import { Element } from 'types';

// import { render } from 'react-dom';
import { Layer } from 'react-konva';
import { RectItem } from 'CanvasObjects/Item/RectItem';
import { TextItem } from 'CanvasObjects/Item/TextItem';

type Props = {
    allInfos: Element[],
}

export const Item = ({ allInfos }: Props) => {

    return (
        <Layer>
            {allInfos.map((info) => (
                <RectItem
                    position={info.position}
                    width={info.width}
                    height={info.height}
                    color={info.color}
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
