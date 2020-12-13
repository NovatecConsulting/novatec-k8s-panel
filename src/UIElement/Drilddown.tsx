import React from 'react';

type Props = {


}
export const Drilldown = ({ }: Props) => {


    return (
        <div style={{ textAlign: "center" }}>
            <div style={{width: "99%", paddingTop:"1rem"}}>
                <img src="https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/back2.png" style={{ width: "25px", height: "25px" , float:"right", marginRight: "1rem"}} />
            </div>
            <label style={{ color: "white", fontSize: 17, paddingTop: "1.5rem" }}>Container</label>
            <img src="https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/metrics.png" style={{width: "25px", height: "25px", marginLeft:"1rem", marginBottom: "0.55rem"}}/>
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