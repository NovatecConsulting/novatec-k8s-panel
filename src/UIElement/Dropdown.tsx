import React from 'react';
import { LegacyForms} from '@grafana/ui';
import { SelectableValue } from '@grafana/data';


const { Select } = LegacyForms;

interface SelectProps {
    id: string,
    options: Array<SelectableValue>;
    onChange: (value: string | undefined) => void; 
    value: string;
    isDisabled: boolean
}

export const DropdownUI = ({ id, options, onChange, value, isDisabled }: SelectProps) => {
    let value1: SelectableValue = {};
    value1.label = value;
    return (
        <div>
            <Select
                key={id}
                placeholder="-"
                isSearchable={true}
                options={options}
                onChange={item=> onChange(item.label)}
                value = {value1}
                isDisabled= {isDisabled}

            />
        </div>
    )
}


// Dropdown Filter has its own object

interface SelectPropsGrouped {
    id: string;
    options: Array<SelectableValue>;
    onChange: (value: SelectableValue) => void;
    value: SelectableValue;
}

export const DropdownFilter = ({ id, options, onChange, value }: SelectPropsGrouped) => {
    return (
        <div>
            <Select
                key={id}
                placeholder="-"
                isSearchable={true}
                options={options}
                onChange={item=> onChange(item)}
                value = {value}
            />
        </div>
    )
}