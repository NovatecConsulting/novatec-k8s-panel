import React from 'react';
import { Element } from 'types';

// import { render } from 'react-dom';
import { Layer } from 'react-konva';
import { RectOverview } from 'canvasObjects/Overview/RectOverview';
import { TextOverview } from 'canvasObjects/Overview/TextOverview';
import { Node } from 'canvasObjects/Node/Node';
import { NodeText } from 'canvasObjects/Node/NodeText'
import { SelectableValue } from '@grafana/data';

type Props = {
    allInfos: Element[],
    setLevelOptionHandler: (value: string | undefined) => void;
    setGroupedOptionHandler: (value: SelectableValue) => void;

}


export const Overview = ({ allInfos, setLevelOptionHandler, setGroupedOptionHandler }: Props) => {

    return (
        <Layer>
            {allInfos.map((info) => (
                <RectOverview
                    position={info.position}
                    width={info.width}
                    height={info.height}
                    color={info.color}
                    option={info.text}
                    setLevelOptionHandler={setLevelOptionHandler}
                />
            ))}
            {allInfos.map((info) => (
                <TextOverview
                    position={info.position}
                    text={info.text}
                    width={info.width}
                />
            ))}
            <Node
                height={allInfos[allInfos.length - 1].position.y + allInfos[0].height}
                setLevelOptionHandler={setLevelOptionHandler}

            />
            <NodeText
                position={{ x: 40, y: (allInfos[allInfos.length - 1].position.y + allInfos[0].height) / 2 }}
                text={"Node"}

            />
        </Layer>
    );

}