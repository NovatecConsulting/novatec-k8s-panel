import React, { useState, useEffect } from 'react';
import { Image } from "react-konva";
import { Position, Element } from 'types';

type Props = {
    position: Position;
    itemWidth: number;
    item: Element;
    itemSelectHandler: (item: Element) => void;
}

export const MetricImage = ({ position, itemWidth, item, itemSelectHandler }: Props) => {

    const [image, setImage] = useState(new window.Image);

    useEffect(() => {
        const temp = new window.Image;
        temp.src = "https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/metrics.png";
        temp.onload = () => {
            setImage(temp)

        };
    });

    const itemClicked = () => {
        itemSelectHandler(item);
    }

    return <Image
        x={position.x + itemWidth - 40}
        y={position.y + 10}
        width={30}
        height={30}
        image={image}
        onClick={itemClicked}
    />
}