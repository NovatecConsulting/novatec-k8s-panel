import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

/**
 * Styles for the SimplePanel
 * @param t GrafanaTheme2
 * @param height height of the Panel
 * @returns object of classNames for styling html components
 */
export const getStyles = (t: GrafanaTheme2, height: number) => {
  return {
    header: css`
      display: flex;
      flex-direction: row;
    `,
    dropdown: css`
      flex: 1;
    `,
    drilldown: css`
      position: absolute;
      height: ${height - 53}px;
      margin-top: 3.8rem;
      z-index: 9;
    `,
  };
};
