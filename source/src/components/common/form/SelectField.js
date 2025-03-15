import React from 'react';

import { Form, Select } from 'antd';
import { removeAccents } from '@utils';
import useFormField from '@hooks/useFormField';

function SelectField({
    loading,
    disabled,
    key,
    label = '',
    mode,
    name = '',
    options = [],
    optionValue = 'value',
    allowClear = true,
    showSearch = true,
    showArrow = true,
    onSelect,
    onChange,
    onDeselect,
    onSearch,
    onBlur,
    defaultValue,
    renderCustomOption,
    optionLabelProp,
    autoComplete,
    formItemProps,
    fieldProps,
    initialValue,
    hidden,
    width,
    height,
    ...props
}) {
    const { placeholder, rules } = useFormField(props);

    const onFilterOption = (input, option) =>
        removeAccents(option.label.toLowerCase()).indexOf(removeAccents(input.toLowerCase())) >= 0;

    return (
        <Form.Item
            hidden={hidden}
            initialValue={initialValue}
            key={key}
            {...formItemProps}
            label={label}
            name={name}
            rules={rules}
        >
            {
                <Select
                    {...fieldProps}
                    optionLabelProp={optionLabelProp}
                    showSearch={showSearch}
                    defaultValue={defaultValue}
                    allowClear={allowClear}
                    disabled={disabled}
                    placeholder={placeholder}
                    loading={loading}
                    defaultActiveFirstOption={false}
                    showArrow={showArrow}
                    onSearch={onSearch}
                    // filterOption={onSearch ? false : onFilterOption}
                    onChange={onChange}
                    onSelect={onSelect}
                    onDeselect={onDeselect}
                    onBlur={onBlur}
                    mode={mode}
                    style={{ width, height }}
                    autoComplete={autoComplete}
                    options={options?.map(
                        (option) => renderCustomOption?.(option[optionValue], option[optionValue], option) ?? option,
                    )}
                    optionFilterProp="label"
                />
            }
        </Form.Item>
    );
}

export default SelectField;
