import { PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { NovatecK8SPanel } from './NovatecK8SPanel';
import { InputOrangeEditor, InputGreenEditor, InputRedEditor } from 'InputNumberEditor';
import { metricOptions } from './NovatecK8SPanel';

export const plugin = new PanelPlugin<PanelOptions>(NovatecK8SPanel).setPanelOptions(builder => {
  return builder
    .addSelect({
      name: 'Threshold',
      path: 'theOptions.dropdownOption',
      settings: {
        options: metricOptions.map(option => {
          return { label: option, value: option };
        }),
      },
    })
    .addCustomEditor({
      id: 'index1',
      path: 'theOptions.red',
      name: 'High:',
      editor: InputRedEditor,
    })
    .addCustomEditor({
      id: 'index2',
      path: 'theOptions.orange',
      name: 'Medium:',
      editor: InputOrangeEditor,
    })
    .addCustomEditor({
      id: 'index3',
      path: 'theOptions.green',
      name: 'Low:',
      editor: InputGreenEditor,
    });
});
