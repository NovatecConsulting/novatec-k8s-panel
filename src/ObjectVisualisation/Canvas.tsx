import React, { useState } from 'react';
import { Stage } from 'react-konva';
import { Tuple } from 'types';
import { Overview } from 'ObjectVisualisation/Overview/Overview';
import { Item } from 'ObjectVisualisation/Item/Item';
import { Outside } from 'ObjectVisualisation/Outside/Outside';
import { SelectableValue } from '@grafana/data';
import { Element } from 'types';

interface StageProps {
  width: number;
  height: number;
  allRect: Tuple;
  levelOption: string;
  setLevelOptionHandler: (value: string | undefined) => void;
  setGroupedOptionHandler: (value: SelectableValue) => void;
  itemSelectHandler: (item: Element) => void;
}

/**
 * Canvas to display the objects.
 */
export const Canvas = ({
  width,
  height,
  allRect,
  levelOption,
  setLevelOptionHandler,
  setGroupedOptionHandler,
  itemSelectHandler,
}: StageProps) => {
  const [stageScale, setStageScale] = useState(1);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStageScale(newScale);
    setStageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
    setStageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);
  };
  return (
    <div>
      <Stage
        width={width - 20}
        height={height - 40}
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        draggable={true}
        style={{ background: '#30343a' }}
      >
        {levelOption === 'Overview' ? (
          <Overview
            allInfos={allRect.inside}
            setLevelOptionHandler={setLevelOptionHandler}
            setGroupedOptionHandler={setGroupedOptionHandler}
          />
        ) : allRect.outside === undefined ? (
          <Item
            allInfos={allRect.inside}
            setGroupedOptionHandler={setGroupedOptionHandler}
            itemSelectHandler={itemSelectHandler}
          />
        ) : (
          <Outside
            allInfos={allRect}
            setGroupedOptionHandler={setGroupedOptionHandler}
            itemSelectHandler={itemSelectHandler}
          />
        )}
      </Stage>
    </div>
  );
};
