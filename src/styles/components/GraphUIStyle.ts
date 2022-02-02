import { GrafanaTheme2 } from '@grafana/data';
import { css } from 'emotion';

/**
 * Styles for the graphUI
 * @param t GrafanaTheme2
 * @returns object of classNames for styling html components
 */
const getStyles = (t: GrafanaTheme2) => {
  return {
    graphHr: css`
      border-top: 2px solid black;
      width: 100%;
    `,
  };
};

export default getStyles;
