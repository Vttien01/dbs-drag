import { Button, Form, Tooltip, Upload } from 'antd';
import React from 'react';
import { UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import useFormField from '@hooks/useFormField';

const FileUploadField = (props) => {
    const {
        label,
        fileList,
        disabled,
        fieldName,
        accept,
        onChange,
        beforeUpload,
        content,
        type,
        showUploadList,
        loading,
        tooltip = false,
        typeUpload,
    } = props;

    const uploadFile = ({ file, onSuccess }) => {
        const { uploadFile } = props;
        if (uploadFile) {
            uploadFile(file, onSuccess);
        } else {
            setTimeout(() => {
                onSuccess('ok');
            }, 0);
        }
    };

    const { rules } = useFormField(props);

    return (
        <Form.Item label={label} name={fieldName} rules={rules} valuePropName={fieldName}>
            <Upload
                fileList={fileList}
                disabled={disabled}
                accept={accept}
                customRequest={uploadFile}
                beforeUpload={beforeUpload}
                onChange={onChange}
                showUploadList={showUploadList}
            >
                {tooltip ? (
                    <Tooltip placement="bottom" title={`Upload ${typeUpload}`}>
                        <Button
                            loading={loading}
                            type={type}
                            icon={typeUpload === 'background' ? <UploadOutlined /> : <FileImageOutlined />}
                        >
                            {content}
                        </Button>
                    </Tooltip>
                ) : (
                    <Button loading={loading} type={type} icon={<UploadOutlined />}>
                        {content}
                    </Button>
                )}
            </Upload>
        </Form.Item>
    );
};

export default FileUploadField;
