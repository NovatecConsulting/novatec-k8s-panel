import React from 'react';
import { Element } from '../types'

import 'style/SimplePanel.css'

type Props = {

    closeDrilldown: () => void;
    drilldownItem: Element;
    setShowGraph: (value: boolean) => void;
}
export const Drilldown = ({ closeDrilldown, drilldownItem, setShowGraph }: Props) => {

    return (
        <div className="drilldown--main">
            <div className="drilldown--back">
                <img src="https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/back2.png" onClick={closeDrilldown} style={{ width: "25px", height: "25px", float: "right", marginRight: "1rem" }} />
            </div>
            <label style={{ color: "white", fontSize: 17, paddingTop: "1.5rem" }}>{drilldownItem.text}</label>
            <img src="https://raw.githubusercontent.com/fylip97/Thesis/main/src/img/metricsWhite.png" style={{ width: "25px", height: "25px", marginLeft: "1rem", marginBottom: "0.55rem" }} onClick={() => setShowGraph(true)} />
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
                        {drilldownItem.elementInfo.namespace}
                    </td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Deployment
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        {drilldownItem.elementInfo.deployment}
                    </td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Pod
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        {drilldownItem.elementInfo.pod}
                    </td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Container
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        {drilldownItem.elementInfo.container}
                    </td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        Node
                    </td>
                    <td style={{ padding: "5px 5px", borderBottom: "1px solid black" }}>
                        {drilldownItem.elementInfo.node}
                    </td>
                </tr>
            </table>

        </div>
    );

}