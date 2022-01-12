import React from 'react';
import { Element, INodeInfo } from '../types';
import { BiStats } from 'react-icons/bi';
import { Button, useTheme2 } from '@grafana/ui';
import getStyles from 'styles/component/DrilldownStyle';

type Props = {
  closeDrilldown: () => void;
  drilldownItem: INodeInfo | undefined;
  setShowGraph: (value: boolean) => void;
};

/**
 * Component for the drilldown menu.
 */
export const Drilldown = ({ closeDrilldown, drilldownItem, setShowGraph }: Props) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <div className={styles.main}>
      <div className={styles.head}>
        <div className={styles.title}>
          <h1 className={styles.header}>{drilldownItem ? drilldownItem.node.name : '-'}</h1>
          {drilldownItem && <span className={styles.subTitle}>{drilldownItem.id.layerLabel}</span>}
        </div>
        <Button variant="secondary" size="sm" icon="arrow-left" onClick={closeDrilldown}>
          Back
        </Button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.trName}>
            <th className={styles.thName}>Name</th>
            <th className={styles.thValue}>Value</th>
          </tr>
        </thead>
        <tbody>
          {drilldownItem && (
            <>
              {drilldownItem.relations.map((v) => (
                <tr className={styles.tr}>
                  <td className={styles.td}>{Array.isArray(v) ? v[0].layerLabel : v.layerLabel}</td>
                  <td className={styles.td}>{Array.isArray(v) ? v.length : v.name}</td>
                </tr>
              ))}
              <tr className={styles.tr}>
                <td className={styles.td}>{'hasAppMetric'}</td>
                <td className={styles.td}>{drilldownItem.node.data.hasAppMetric}</td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.td}>{'hasInfMetric'}</td>
                <td className={styles.td}>{drilldownItem.node.data.hasInfMetric}</td>
              </tr>
              {drilldownItem.node.data.properties &&
                drilldownItem.node.data.properties.forEach((v, k) => (
                  <tr className={styles.tr}>
                    <td className={styles.td}>{k}</td>
                    <td className={styles.td}>{v}</td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
      <Button variant="primary" size="md" onClick={() => setShowGraph(true)}>
        <BiStats /> Metrics
      </Button>
    </div>
  );
};
