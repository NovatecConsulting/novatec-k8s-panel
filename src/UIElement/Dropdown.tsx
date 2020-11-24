import React from 'react';
import { LegacyForms} from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

const { Select } = LegacyForms;

interface SelectProps {
    id: string,
    options: Array<SelectableValue>;
    onChange: (value: string | undefined) => void; 
    value: string;
}

export const DropdownUI = ({ id, options, onChange, value }: SelectProps) => {
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

            />
        </div>
    )
}