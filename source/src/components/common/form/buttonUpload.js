import React, { useEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import useFormField from '@hooks/useFormField';
import useTranslate from '@hooks/useTranslate';
import { Button, Form, Tooltip, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

const messages = defineMessages({
    required: '',
});
function ButtonUpload({
    label,
    fileList,
    disabled,
    name,
    valuePropName,
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
    imgUploadedSizeAuto,
    titleToolTip,
    setImageUrl,
    ...props
}) {
    const translate = useTranslate();
    const { rules } = useFormField(props);
    const updatedRules = useMemo(() => {
        if (required) {
            return [
                ...(rules || []),
                {
                    required: !imageUrl && !fileList?.length,
                    message: translate.formatMessage(messages.required),
                },
            ];
        }
        return rules;
    }, [ required, rules, label, imageUrl, fileList ]);

    const onUploadFile = ({ file, onSuccess, onError }) => {
        const { uploadFile } = props;
        uploadFile(file, onSuccess, onError);
    };

    const getContent = () => {
        if (imageUrl && !loading) {
            return (
                <Tooltip title={titleToolTip}>
                    <img
                        style={{
                            ...style,
                            maxWidth: '100%',
                            objectFit: 'contain',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            cursor: 'pointer',
                        }}
                        // className="img-uploaded"
                        src={imageUrl}
                        alt="field-upload"
                        onError={() => setImageUrl(null)}
                    />
                </Tooltip>
            );
        } else {
            return (
                <Tooltip title={titleToolTip}>
                    <Button type="primary" style={style} shape="circle">
                        <UploadOutlined />
                    </Button>
                </Tooltip>
            );
        }
    };

    const renderUploadButton = () => {
        return (
            // <div className="upload-wrapper">
            //     {!showUploadList && loading ? <LoadingOutlined /> : <PlusOutlined />}
            //     <div className="ant-upload-text">{loading ? 'uploading' : 'upload'}</div>
            // </div>
            <Button
                type="primary"
                style={
                    {
                        // marginTop: '30px',
                    }
                }
                shape="circle"
            >
                <PlusOutlined />
            </Button>
        );
    };

    const uploadClass = useMemo(() => {
        return [ 'avatar-uploader', imgUploadedSizeAuto && 'img-uploaded-size-auto' ].filter(Boolean).join(' ');
    }, []);

    return (
        <ImgCrop aspect={aspect}>
            <Upload
                disabled={disabled}
                accept={accept}
                valuePropName={valuePropName}
                listType="picture-circle"
                // style={{ width: '100%' }}
                showUploadList={false}
                customRequest={onUploadFile}
                beforeUpload={beforeUpload}
                onChange={onChange}
                className={uploadClass}
            >
                {getContent()}
            </Upload>
        </ImgCrop>
    );
}

export default ButtonUpload;
