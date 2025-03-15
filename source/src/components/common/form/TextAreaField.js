import React from 'react';

import useFormField from '@hooks/useFormField';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const TextAreaField = ({
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
            <TextArea
                maxLength={maxLength}
                prefix={prefix}
                allowClear={allowClear}
                placeholder={placeholder}
                size={size}
                type={type}
                rows={4}
                showCount={showCount}
                {...inputProps}
            />
        </Form.Item>
    );
};

export default TextAreaField;
