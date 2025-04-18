import { Form, Input, Radio } from 'antd';
import React from 'react';
import useFormField from '@hooks/useFormField';
import TextArea from 'antd/es/input/TextArea';

const TextField = (props) => {
    const {
        type,
        size,
        label,
        name,
        disabled,
        onBlur,
        validateStatus,
        help,
        style,
        className,
        onChange,
        readOnly,
        formItemProps,
        fieldProps,
        colon,
        labelCol,
        initialValue,
    } = props;

    const getMaxLengthMsg = () => {
        const { maxLength, maxLengthMsg } = props;
        return maxLengthMsg || `Số ký tự không thể nhiều hơn ${maxLength}`;
    };

    const getMinLengthMsg = () => {
        const { minLength, minLengthMsg } = props;
        return minLengthMsg || `Số ký tự không thể ít hơn ${minLength}`;
    };

    const getTextFieldRules = () => {
        const { maxLength, minLength, type, invalidEmailMsg } = props;
        const rules = [];
        if (maxLength) {
            rules.push({ max: maxLength, message: getMaxLengthMsg() });
        }
        if (minLength) {
            rules.push({ min: minLength, message: getMinLengthMsg() });
        }
        if (type === 'email') {
            rules.push({
                type,
                message: invalidEmailMsg || 'Định dạng email không hợp lệ',
            });
        }

        return rules;
    };

    const { rules, placeholder } = useFormField(props);
    return (
        <Form.Item
            className={className}
            label={label}
            name={name}
            validateStatus={validateStatus}
            help={help}
            rules={[ ...rules, getTextFieldRules() ]}
            colon={colon}
            labelCol={labelCol}
            {...formItemProps}
            style={{ margin: 0 }}
            initialValue={initialValue}
        >
            {type === 'textarea' ? (
                <TextArea
                    onChange={onChange}
                    style={style}
                    placeholder={placeholder}
                    disabled={disabled}
                    onBlur={onBlur}
                    {...fieldProps}
                />
            ) : (
                <Input
                    onChange={onChange}
                    style={style}
                    size={size}
                    placeholder={placeholder}
                    disabled={disabled}
                    type={type}
                    onBlur={onBlur}
                    readOnly={readOnly}
                    {...fieldProps}
                />
            )}
        </Form.Item>
    );
};

export default TextField;
