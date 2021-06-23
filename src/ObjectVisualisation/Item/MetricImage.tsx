import React, { useState, useEffect } from 'react';
import { Image } from 'react-konva';
import { Position, Element } from 'types';
const blackIcon = require("../../img/metrics.png");
const whiteIcon = require("../../img/metricsWhite.png");

type Props = {
  position: Position;
  itemWidth: number;
  item: Element;
  itemSelectHandler: (item: Element) => void;
};

export const MetricImage = ({ position, itemWidth, item, itemSelectHandler }: Props) => {
  const [image, setImage] = useState(new window.Image());
  const [isMousedOver, setIsMousedOver] = useState(false);

  useEffect(() => {
    const temp = new window.Image();
    if (!isMousedOver) {
      temp.src = blackIcon;
    }
    else {
      temp.src = whiteIcon
    }
    temp.onload = () => {
      setImage(temp);
    };

  }, [isMousedOver]);

  const handleMouseOver = () => {
    setIsMousedOver(true);
  }
  const handleMouseOut = () => {
    setIsMousedOver(false);
  }
  const itemClicked = () => {
    itemSelectHandler(item);
  };

  return (

    <Image
      x={position.x + itemWidth - 40}
      y={position.y + 10}
      width={30}
      height={30}
      image={image}
      onClick={itemClicked}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />

  );
};
