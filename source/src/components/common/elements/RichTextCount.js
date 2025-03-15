import React, { useEffect, useState } from 'react';

import RichTextField from '../form/RichTextField';

const RichTextCount = ({ maxTitleLength, placeholder, required, rules, label, name, countDefault, labelAlign }) => {
    return (
        <RichTextField
            name={name}
            formItemProps={{
                style: { marginBottom: 40 },
            }}
            maxLength={maxTitleLength}
            placeholder={placeholder}
            required={required}
            rules={rules}
            label={label}
            labelAlign={labelAlign}
        />
    );
};

export default RichTextCount;
