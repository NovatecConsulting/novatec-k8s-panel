import { GrafanaTheme2 } from '@grafana/data';
import { css } from 'emotion';

/**
 * Styles for the graph view
 * @param t GrafanaTheme2
 * @returns object of classNames for styling html components
 */
export const getStyles = (t: GrafanaTheme2) => {
  return {
    graph: css`
      margin: auto;
      width: 50%;
      align-items: center;
    `,
    graphName: css`
      width: 100%;
      text-align: center;
      font-size: 1.1rem;
    `,
    graphHeader: css`
      color: #33b5e5;
      text-align: center;
      width: 100%;
      font-size: 1rem;
    `,
    infrastructureDropdown: css`
      width: 30%;
    `,
  };
};
