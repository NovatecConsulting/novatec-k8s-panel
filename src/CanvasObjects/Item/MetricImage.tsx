
import React from 'react';
import { Image } from "react-konva";


export class MetricImgae extends React.Component {
    state = {
        image: undefined,
    }

    componentDidMount() {
        const image = new window.Image;
        image.src = "metrics.png";
        console.log("huhu");
        console.log(image)
        image.onload = () => {
            this.setState({
                image: image,
            });
        };
    }

    render() {

        return <Image image={this.state.image} />
    }

}