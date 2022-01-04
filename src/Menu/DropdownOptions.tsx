import { SelectableValue } from '@grafana/data';

export function dropdownOptions(allOptions: string[], value: string) {
  var copy = allOptions.slice(0);
  for (let i = 0; i < copy.length; i++) {
    if (copy[i] === value) {
      copy.splice(i, 1);
    }
  }

  let options: SelectableValue[] = [];
  for (let i = 0; i < copy.length; i++) {
    let element: SelectableValue = {};
    element.label = copy[i];
    options.push(element);
  }
  return options;
}

/**
 * Returns the list of options without the chosen option (which is the param value)
 */
export function dropdownNodeOption(value: string) {
  let option: SelectableValue[] = [];
  const all = [
    'Write total',
    'Read total',
    'Alloctable CPU Cores',
    'Alloctable Memory Bytes',
    'Active Memory',
    'Inactive Memory',
  ];

  for (let i = 0; i < all.length; i++) {
    let oneElement: SelectableValue = { label: all[i] };

    if (value !== oneElement.label) {
      option.push(oneElement);
    }
  }
  return option;
}
