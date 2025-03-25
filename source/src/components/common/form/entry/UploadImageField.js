import { Dropdown, Form, Modal, Space, Input, Upload, Spin } from 'antd';
import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';

import { FileAddOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';

import styles from './UploadField.module.scss';
import classNames from 'classnames';
import CropImageLink from '../CropImageField/CropImageLink';
import useNotification from '@hooks/useNotification';
import { beforeUpload, resizeImage } from '@utils';
import { MAX_WIDTH_IMAGE_DEFAULT } from '@constants';
import { showErrorMessage } from '@services/notifyService';

function UploadImageField({
    required,
    cropShape,
    label,
    name,
    formItemProps,
    aspect,
    objectName = '',
    description = '',
    uploadApi = apiConfig.file.image,
    size = 5,
    accessToken,
}) {
    const checkFileLink = (_, value) => {
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('This field is required!'));
    };

    return (
        <Form.Item
            {...formItemProps}
            required={required}
            label={label}
            name={name}
            style={{ margin: 0 }}
            rules={[
                {
                    ...(required ? { validator: checkFileLink } : {}),
                },
            ]}
        >
            <ImageField
                uploadApi={uploadApi}
                cropShape={cropShape}
                objectName={objectName}
                aspect={aspect}
                description={description}
                size={size}
                accessToken={accessToken}
            />
        </Form.Item>
    );
}

function ImageField({
    value = '',
    cropShape,
    onChange,
    objectName = '',
    aspect,
    description,
    uploadApi,
    size,
    accessToken,
}) {
    const { execute: executeUpFile } = useFetch(uploadApi);
    const [ uploadLoading, setUploadLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const notification = useNotification();

    const uploadError = () => {
        setErrorMessage('Error');
        notification({ type: 'error', message: 'Upload image error' });
        setUploadLoading(false);
    };

    const uploadFile = ({ file, onSuccess, onError }) => {
        const formatFile = [ 'image/png', 'image/jpg', 'image/jpeg' ];
        if (!formatFile.includes(file?.type)) {
            return;
        }
        const maxFileSize = size * 1024 * 1024;
        if (file.size > maxFileSize) {
            return;
        }
        if (accessToken) {
            setUploadLoading(true);
            resizeImage({ file: file, maxSize: MAX_WIDTH_IMAGE_DEFAULT })
                .then(function (resizedImageBlob) {
                    executeUpFile({
                        data: {
                            image: file,
                        },
                        accessToken: accessToken,
                        onCompleted: (result) => {
                            setErrorMessage('');
                            onChange(result.data.url);
                            onSuccess();
                            setUploadLoading(false);
                        },
                        onError: () => {
                            onError();
                            uploadError();
                        },
                    });
                })
                .catch(function (error) {
                    console.error('Error resizing image:', error);
                });
        } else showErrorMessage('Please update Access Token to upload photos');
    };

    const renderContent = () => {
        if (uploadLoading) {
            return <Spin />;
        }
        if (errorMessage) {
            return <div style={{ color: 'red' }}>{errorMessage}</div>;
        }
        if (value) {
            return (
                <>
                    <div className={styles.imageText}>Update</div>
                    <img
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: cropShape == 'round' ? '50%' : 'none',
                        }}
                        src={value}
                    />
                </>
            );
        }
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: 12, color: 'gray' }}>
                    Click to add image <br />
                    Supported jpg and png only <br /> 5mb max <br />
                    Recommended 720x350
                </div>
            </div>
        );
    };

    return (
        <>
            {' '}
            <ImgCrop cropShape={cropShape} aspect={aspect} beforeCrop={(file) => beforeUpload(file, size)}>
                <Upload accept=".jpg, .jpeg, .png" showUploadList={false} customRequest={uploadFile}>
                    <div
                        style={{
                            display: 'flex',
                            gap: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            borderRadius: 10,
                        }}
                    >
                        <div
                            className={classNames(
                                styles.uploadBtn,
                                styles.border,
                                // errorMessage || value ? styles.border : styles.borderHover,
                            )}
                            style={{ padding: 6 }}
                        >
                            {renderContent()}
                        </div>
                    </div>
                </Upload>
            </ImgCrop>
        </>
    );
}

export default UploadImageField;
