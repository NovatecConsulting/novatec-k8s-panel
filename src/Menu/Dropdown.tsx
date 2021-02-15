import React from 'react';
import { LegacyForms } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

const { Select } = LegacyForms;



interface SelectProps {
    id: string,
    options: Array<SelectableValue>;
    onChange: (value: string | undefined) => void;
    value: string;
    isDisabled: boolean
}

/**
 * Component for the dropdown menu.
 * Value is a String
 */
export const DropdownComponent = ({ id, options, onChange, value, isDisabled }: SelectProps) => {
    const selectableValue: SelectableValue = {label: value};
    return (
        <div>
            <Select
                key={id}
                placeholder="-"
                isSearchable={true}
                options={options}
                onChange={item => onChange(item.label)}
                value={selectableValue}
                isDisabled={isDisabled}

            />
        </div>
    )
}




interface SelectPropsFilter {
    id: string;
    options: Array<SelectableValue>;
    onChange: (value: SelectableValue) => void;
    value: SelectableValue;
    isDisabled: boolean
}

/**
 * Component for the dropdown menu.
 * Value is a "SelectableValue".
 */
export const DropdownComponentFilter = ({ id, options, onChange, value, isDisabled }: SelectPropsFilter) => {
    return (
        <div>
            <Select
                key={id}
                placeholder="-"
                isSearchable={true}
                options={options}
                onChange={item => onChange(item)}
                value={value}
                isDisabled={isDisabled}
            />
        </div>
    )
}