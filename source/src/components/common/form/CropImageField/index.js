import React from 'react';

import { Form, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import useFormField from '@hooks/useFormField';

function CropImageField({
    label,
    fileList,
    disabled,
    name,
    accept,
    onChange,
    beforeUpload,
    showUploadList,
    aspect = 1,
    maxFile,
    imageUrl,
    loading,
    style,
    required,
    formItemProps,
    ...props
}) {
    const { rules } = useFormField(props);

    const onUploadFile = ({ file, onSuccess, onError }) => {
        const { uploadFile } = props;
        uploadFile(file, onSuccess, onError);
    };

    const getContent = () => {
        if (imageUrl && !loading) {
            return <img className="img-uploaded" src={imageUrl} alt="field-upload" />;
        } else if (showUploadList && fileList && fileList.length === maxFile) {
            return null;
        } else {
            return renderUploadButton();
        }
    };

    const renderUploadButton = () => {
        return (
            <div style={style}>
                {!showUploadList && loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">{loading ? 'uploading' : 'upload'}</div>
            </div>
        );
    };

    return (
        <Form.Item {...formItemProps} required={required} label={label} name={name} rules={rules} valuePropName={name}>
            <ImgCrop aspect={aspect}>
                <Upload
                    disabled={disabled}
                    accept={accept}
                    valuePropName={showUploadList ? name : false}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={showUploadList}
                    customRequest={onUploadFile}
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                >
                    {getContent()}
                </Upload>
            </ImgCrop>
        </Form.Item>
    );
}

export default CropImageField;
