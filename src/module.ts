import { FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { NovatecK8SPanel } from './NovatecK8SPanel';

export const plugin = new PanelPlugin<PanelOptions>(NovatecK8SPanel).useFieldConfig({
  // only config we need is standard FieldConfigProperty.Thresholds and Min, Max
  // TODO consider supporting further configurations
  disableStandardOptions: [
    FieldConfigProperty.Color,
    FieldConfigProperty.Decimals,
    FieldConfigProperty.DisplayName,
    FieldConfigProperty.Links,
    FieldConfigProperty.Mappings,
    FieldConfigProperty.NoValue,
    FieldConfigProperty.Unit,
  ],
});
