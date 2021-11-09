import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

/**
 * Styles for the node graph view
 * @param t GrafanaTheme2
 * @returns object of classNames for styling html components
 */
export const getStyles = (t: GrafanaTheme2) => {
  return {
    nodeGraph: css`
      width: 100%;
      display: flex;
      justify-content: center;1
    `,
  };
};
