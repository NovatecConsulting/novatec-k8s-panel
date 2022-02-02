import { GrafanaTheme2 } from '@grafana/data';
import { css } from 'emotion';

/**
 * Styles for the SimplePanel
 * @param t GrafanaTheme2
 * @param height height of the Panel
 * @returns object of classNames for styling html components
 */
const getStyles = (t: GrafanaTheme2, width: number, height: number) => {
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
    placeholder: css`
      display: flex;
      width: ${width};
      height: ${height - 53}px;
      justify-content: center;
      align-items: center;
    `,
    placeholderText: css`
      color: ${t.colors.text.disabled};
    `,
  };
};

export default getStyles;
