import React from 'react';

import useFormField from '@hooks/useFormField';
import { Form, Input } from 'antd';

const InputTextField = ({
    label = '',
    name = '',
    formItemProps,
    inputProps,
    size,
    type,
    labelAlign,
    prefix,
    allowClear,
    hidden,
    labelCol,
    maxLength,
    initialValue,
    showCount,
    onChange,
    ...props
}) => {
    const { rules, placeholder } = useFormField(props);

    return (
        <Form.Item
            hidden={hidden}
            label={label}
            name={name}
            validateFirst
            rules={rules}
            labelAlign={labelAlign}
            labelCol={labelCol}
            initialValue={initialValue}
            {...formItemProps}
        >
            <Input
                maxLength={maxLength}
                prefix={prefix}
                allowClear={allowClear}
                placeholder={placeholder}
                size={size}
                type={type}
                showCount={showCount}
                onChange={onChange}
                {...inputProps}
            />
        </Form.Item>
    );
};

export default InputTextField;
