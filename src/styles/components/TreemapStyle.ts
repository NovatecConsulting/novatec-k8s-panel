import { GrafanaTheme2 } from '@grafana/data';
import { css } from 'emotion';

/**
 * Styles for the Treemap
 * @param t GrafanaTheme2
 * @returns object of classNames for styling html components
 */
const getStyles = (t: GrafanaTheme2) => {
  const transition = `
    fill ${t.transitions.easing.easeInOut} ${t.transitions.duration.short}ms,
    fill-opacity ${t.transitions.easing.easeInOut} ${t.transitions.duration.short}ms
  `;
  return {
    element: css({
      stroke: t.colors.border.weak,
      strokeWidth: 1,
      transition,
      ':hover': {
        fillOpacity: 0.84,
        stroke: t.colors.primary.border,
        transition,
      },
    }),
    container: css({
      stroke: t.colors.border.medium,
      strokeWidth: 2,
      fill: 'transparent',
      transition,
      ':hover': {
        stroke: t.colors.primary.border,
        fill: t.colors.action.hover,
        transition,
      },
    }),
    containerText: css({
      fill: t.colors.text.primary,
    }),
  };
};

export default getStyles;
