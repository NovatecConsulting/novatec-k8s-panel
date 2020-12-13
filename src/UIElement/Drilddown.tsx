import React, { useState, useEffect } from 'react';

type Props = {


}
export const Drilldown = ({ }: Props) => {


    const [image, setImage] = useState(new window.Image);

    useEffect(() => {
        const temp = new window.Image;
        temp.src = "https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/back.png";
        temp.onload = () => {
            setImage(temp)

        };
    });



    return (
        <div style={{ textAlign: "center" }}>
            <img src={image.src} width={10} height={10} />
            <label style={{ color: "white", fontSize: 17, paddingTop: "2rem" }}>Container</label>
            <hr style={{ borderTop: "1px solid black", width: "75%", marginTop: "-0.1rem" }}></hr>
            <table style={{ width: "99%" }}>
                <tr style={{ borderTop: "1px solid black", borderBottom: "1px solid black", backgroundColor: "#505050", color: "#33b5e5" }}>
                    <th style={{ padding: "5px 5px" }}>Name</th>
                    <th style={{ padding: "3px 5px" }}>Value</th>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Namespace
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        -
                    </td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Deployment
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        -
                    </td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Pod
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        -
                    </td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Container
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        -
                    </td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Node
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        -
                    </td>
                </tr>
            </table>

        </div>
    );

}