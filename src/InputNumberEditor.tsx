import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { FaCircle } from 'react-icons/fa';
import { Input, useTheme2 } from '@grafana/ui';



export const InputRedEditor: React.FC<StandardEditorProps<string>> = ({ value, onChange }) => {
    const t = useTheme2();
    return <Input width={20} prefix={<FaCircle color={t.colors.error.text} />} value={value} onChange={(evt) => onChange(evt.currentTarget.value)} type="number" />
};

export const InputOrangeEditor: React.FC<StandardEditorProps<string>> = ({ value, onChange }) => {
    const t = useTheme2();
    return <Input width={20} prefix={<FaCircle color={t.colors.warning.text} />} value={value} onChange={(evt) => onChange(evt.currentTarget.value)} type="number" />
};

export const InputGreenEditor: React.FC<StandardEditorProps<string>> = ({ value, onChange }) => {
    const t = useTheme2();
    return <Input width={20} prefix={<FaCircle color={t.colors.success.text} />} value={value} onChange={(evt) => onChange(evt.currentTarget.value)} type="number" />
};