import React from 'react';

import { Form, DatePicker } from 'antd';
import { DATE_SHORT_MONTH_FORMAT } from '@constants';
import useFormField from '@hooks/useFormField';
import { range } from '@utils';

const defaultDisabledTime = () => {

    return {
        disabledHours: () => range(0,0),
        disabledMinutes: () => range(0,0),
        disabledSeconds: () => range(0,0),
    };
};

function DatePickerField({
    format = DATE_SHORT_MONTH_FORMAT,
    size,
    key,
    label = '',
    name = '',
    disabledDate,
    onChange,
    allowClear = true,
    formItemProps,
    fieldProps,
    labelAlign,
    showTime,
    disabledTime = defaultDisabledTime,
    ...props
}) {
    const { rules, placeholder } = useFormField(props);

    return (
        <Form.Item labelAlign={labelAlign} key={key} {...formItemProps} label={label} name={name} rules={rules}>
            <DatePicker
                {...fieldProps}
                size={size}
                showTime={showTime}
                // disabledTime={disabledTime}
                disabledDate={disabledDate}
                allowClear={allowClear}
                style={{ ...fieldProps?.style }}
                format={format}
                onChange={onChange}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

export default DatePickerField;
