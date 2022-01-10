import React from 'react';
import { Element } from '../types';
import { BiStats } from 'react-icons/bi';
import { Button, useTheme2 } from '@grafana/ui';
import getStyles from 'styles/component/DrilldownStyle';

type Props = {
  closeDrilldown: () => void;
  drilldownItem: Element;
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
        <h1 className={styles.header}>{drilldownItem.text}</h1>
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
          {Object.entries(drilldownItem.elementInfo).map((kv, i) => (
            <tr className={styles.tr}>
              <td className={styles.td}>{kv[0]}</td>
              <td className={styles.td}>{kv[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="primary" size="md" onClick={() => setShowGraph(true)}>
        <BiStats /> Metrics
      </Button>
    </div>
  );
};
