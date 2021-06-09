import React from 'react';
import { Element } from '../types';
import 'style/SimplePanel.css';

type Props = {
  closeDrilldown: () => void;
  drilldownItem: Element;
  setShowGraph: (value: boolean) => void;
};

/**
 * Component for the drilldown menu.
 */
export const Drilldown = ({ closeDrilldown, drilldownItem, setShowGraph }: Props) => {
  return (
    <div className="main--drilldown">
      <div className="imageBack--drilldown">
        <button onClick={closeDrilldown} className="back--drilldown">
          back
        </button>
      </div>
      <label className="header--drilldown">{drilldownItem.text}</label>
      <button className="metricImage--drilldown" onClick={() => setShowGraph(true)}>
        metrics
      </button>
      <hr className="hr--drilldown"></hr>
      <table className="table--drilldown">
        <tr className="trName--drilldown">
          <th className="thName--drilldown">Name</th>
          <th className="thValue--drilldown">Value</th>
        </tr>
        <tr className="tr--drilldown">
          <td className="td--drilldown">Namespace</td>
          <td className="td--drilldown">{drilldownItem.elementInfo.namespace}</td>
        </tr>
        <tr className="tr--drilldown">
          <td className="td--drilldown">Deployment</td>
          <td className="td--drilldown">{drilldownItem.elementInfo.deployment}</td>
        </tr>
        <tr className="tr--drilldown">
          <td className="td--drilldown">Pod</td>
          <td className="td--drilldown">{drilldownItem.elementInfo.pod}</td>
        </tr>
        <tr className="tr--drilldown">
          <td className="td--drilldown">Container</td>
          <td className="td--drilldown">{drilldownItem.elementInfo.container}</td>
        </tr>
        <tr className="tr--drilldown">
          <td className="td--drilldown">Node</td>
          <td className="td--drilldown">{drilldownItem.elementInfo.node}</td>
        </tr>
      </table>
    </div>
  );
};
