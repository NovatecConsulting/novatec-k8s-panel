import { GrafanaTheme2 } from '@grafana/data';
import { css } from 'emotion';

/**
 * Styles for the drilldown menu
 * @param t GrafanaTheme2
 * @returns object of classNames for styling html components
 */
const getStyles = (t: GrafanaTheme2) => {
  return {
    main: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 10px;
      background-color: ${t.colors.background.secondary};
      box-shadow: ${t.shadows.z3};
      clip-path: inset(0px -20px 0px 0px);
    `,
    head: css`
      display: flex;
      width: 100%;
      justify-content: space-between;
    `,
    title: css`
      margin-right: 0.5em;
    `,
    subTitle: css`
      color: ${t.colors.text.secondary};
      font-size: ${t.typography.size.sm};
    `,
    header: css`
      color: ${t.colors.text.primary};
      display: flex;
      align-items: center;
      font-size: ${t.typography.size.md};
      margin-block-end: 0;
    `,
    table: css`
      display: block;
      overflow-y: auto;
    `,
    trName: css`
      border-top: 1px solid black;
      border-bottom: 1px solid black;
      background-color: #505050;
      color: #33b5e5;
    `,
    thName: css`
      padding: 5px;
    `,
    thValue: css`
      padding: 3px 5px;
    `,
    tr: css`
      text-align: left;
    `,
    td: css`
      padding: 5px;
      border-bottom: 1px solid black;
    `,
  };
};

export default getStyles;
