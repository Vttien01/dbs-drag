import React from 'react';

import { Form, Checkbox } from 'antd';

import useFormField from '@hooks/useFormField';

function CheckboxField({
    label,
    name,
    required,
    labelAlign,
    optionLabel,
    onChange,
    formItemProps,
    fieldProps,
    hidden,
    initialValue,
    style,
    ...props
}) {
    const { rules } = useFormField(props);
    return (
        <Form.Item
            initialValue={initialValue}
            hidden={hidden}
            labelAlign={labelAlign}
            required={required}
            label={label}
            name={name}
            rules={rules}
            valuePropName="checked"
            style={style}
            {...formItemProps}
        >
            <Checkbox {...fieldProps} onChange={onChange}>
                {optionLabel}
            </Checkbox>
        </Form.Item>
    );
}

export default CheckboxField;
