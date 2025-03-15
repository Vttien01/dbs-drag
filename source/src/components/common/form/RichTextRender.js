import React from 'react';
import ReactQuill, { Quill } from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

const RichTextRender = ({ data, ...props }) => {
    return <ReactQuill value={data} readOnly={true} theme={'bubble'} {...props} />;
};

export default RichTextRender;
