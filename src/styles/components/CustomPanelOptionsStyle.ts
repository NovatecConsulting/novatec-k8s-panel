import { GrafanaTheme2 } from '@grafana/data';
import { css } from 'emotion';

/**
 * Styles for the CustomPanelOptions
 * @param t GrafanaTheme2
 * @returns object of classNames for styling html components
 */
const getStyles = (t: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
    `,
    select: css`
      margin-bottom: ${t.v1.spacing.sm};
    `,
  };
};

export default getStyles;
