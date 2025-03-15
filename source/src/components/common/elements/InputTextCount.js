import React, { useEffect, useState } from 'react';
import InputTextField from '../form/InputTextField';
import TextAreaField from '../form/TextAreaField';

const InputTextCount = ({
    maxTitleLength,
    placeholder,
    formItemProps,
    inputProps,
    required,
    rules,
    label,
    name,
    countDefault,
    type,
    labelCol,
}) => {
    const [ count, setCount ] = useState(countDefault);
    useEffect(() => {
        if (!countDefault) {
            setCount('');
        } else {
            setCount(countDefault);
        }
    }, [ countDefault ]);
    const formatter = ({ count, maxLength }) => (
        <p
            style={
                type != 'textarea'
                    ? {
                        position: 'absolute',
                        right: 0,
                        bottom: '-24px',
                    }
                    : {}
            }
        >
            Remaining characters: {maxLength - count} characters.
        </p>
    );

    return (
        <>
            {type == 'textarea' ? (
                <TextAreaField
                    formItemProps={{
                        labelAlign: 'left',
                        style: { marginBottom: 40 },
                        // help: `Remaining characters: ${maxTitleLength - count?.length} characters.`,
                    }}
                    inputProps={{
                        maxLength: maxTitleLength,
                        // onChange: (e) => setCount(e.target.value),
                    }}
                    placeholder={placeholder}
                    required={required}
                    rules={rules}
                    label={label}
                    name={name}
                    showCount={{ formatter }}
                    labelCol={labelCol}
                />
            ) : (
                <InputTextField
                    formItemProps={{
                        labelAlign: 'left',
                        style: { marginBottom: 40 },
                        // help: `Remaining characters: ${maxTitleLength - count?.length} characters.`,
                    }}
                    inputProps={{
                        maxLength: maxTitleLength,
                    }}
                    placeholder={placeholder}
                    required={required}
                    rules={rules}
                    label={label}
                    name={name}
                    showCount={{ formatter }}
                    labelCol={labelCol}
                />
            )}
        </>
    );
};

export default InputTextCount;
