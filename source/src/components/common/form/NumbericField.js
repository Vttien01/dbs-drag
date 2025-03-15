import { Form, InputNumber } from 'antd';
import React from 'react';
import useFormField from '@hooks/useFormField';
import { formatNumber } from '@utils';

const NumbericField = ({
    label,
    name,
    disabled,
    required,
    min,
    max,
    width,
    onChange,
    onBlur,
    formatter,
    parser,
    className,
    defaultValue,
    size,
    controls,
    hidden,
    formItemProps,
    fieldProps,
    labelAlign,
    initialValue,
    ...props
}) => {
    const fieldParser = (value) => {
        return value.replace(/\$\s?|(,*)/g, '');
    };

    const fieldFormatter = (value) => {
        return formatNumber(value);
    };

    const { rules, placeholder } = useFormField(props);

    return (
        <Form.Item
            {...formItemProps}
            labelAlign={labelAlign}
            hidden={hidden}
            label={label}
            name={name}
            rules={rules}
            className={className}
            initialValue={initialValue}
            required={required}
        >
            <InputNumber
                {...fieldProps}
                placeholder={placeholder}
                max={max}
                min={min}
                disabled={disabled}
                style={{ width: width }}
                formatter={formatter}
                parser={parser}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={defaultValue}
                size={size}
                controls={controls}
            />
        </Form.Item>
    );
};

export default NumbericField;
