import { SelectableValue } from '@grafana/data';

// FIXME replace this Function with general purpose one in convertData
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
