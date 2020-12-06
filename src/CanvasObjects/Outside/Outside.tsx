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
    console.log("Ich werde aufgerufen");
    console.log(allInfos)

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
                />
            ))}
        </Layer>
    );
}
