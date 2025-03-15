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
    size = 1,
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
            />
        </Form.Item>
    );
}

function ImageField({ value = '', cropShape, onChange, objectName = '', aspect, description, uploadApi, size }) {
    const [ showModal, setShowModal ] = useState(false);
    const [ fileLink, setFileLink ] = useState();
    const { execute: executeUpFile } = useFetch(uploadApi);
    const [ uploadLoading, setUploadLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ showCropImageLink, setShowCropimageLink ] = useState(false);
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
        setUploadLoading(true);
        resizeImage({ file: file, maxSize: MAX_WIDTH_IMAGE_DEFAULT })
            .then(function (resizedImageBlob) {
                executeUpFile({
                    data: {
                        image: resizedImageBlob,
                    },
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
    };

    const uploadFileLink = (file) => {
        setShowCropimageLink(false);
        resizeImage({ file: file, maxSize: MAX_WIDTH_IMAGE_DEFAULT })
            .then(function (resizedImageBlob) {
                executeUpFile({
                    data: {
                        image: resizedImageBlob,
                    },
                    onCompleted: (result) => {
                        setErrorMessage('');
                        onChange(result.data.url);
                        setUploadLoading(false);
                    },
                    onError: () => {
                        setUploadLoading(false);
                        uploadError();
                    },
                });
            })
            .catch(function (error) {
                setUploadLoading(false);
                uploadError();
                console.error('Error resizing image:', error);
            });
    };

    const uploadDropdownItems = [
        {
            key: '1',
            label: (
                <ImgCrop cropShape={cropShape} aspect={aspect} beforeCrop={(file) => beforeUpload(file, size)}>
                    <Upload accept=".jpg, .jpeg, .png" showUploadList={false} customRequest={uploadFile}>
                        <Space>
                            <FileAddOutlined />
                            From File ...
                        </Space>
                    </Upload>
                </ImgCrop>
            ),
        },
        {
            key: '2',
            label: (
                <Space onClick={() => setShowModal(true)}>
                    <LinkOutlined />
                    From Link ...
                </Space>
            ),
        },
    ];

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
                            objectFit: 'contain',
                            borderRadius: cropShape == 'round' ? '50%' : 'none',
                        }}
                        src={value}
                    />
                </>
            );
        }
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div>
                    <UploadOutlined style={{ fontSize: 16 }} />
                </div>
                <div style={{ fontSize: 12 }}>Upload {objectName}</div>
            </div>
        );
    };

    return (
        <>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Dropdown trigger={[ 'click' ]} menu={{ items: uploadDropdownItems }}>
                    <div
                        className={classNames(
                            styles.uploadBtn,
                            errorMessage || value ? styles.border : styles.borderHover,
                        )}
                        style={{ padding: 8 }}
                    >
                        {renderContent()}
                    </div>
                </Dropdown>
                <span style={{ marginLeft: 20 }}>{description}</span>
            </div>
            <Modal
                title={`Upload ${objectName}`}
                open={showModal}
                onOk={() => {
                    setUploadLoading(true);
                    fileLink && setShowCropimageLink(true);
                    setShowModal(false);
                }}
                maskClosable={false}
                onCancel={() => setShowModal(false)}
            >
                <div>Key in URL or Link</div>
                <Input value={fileLink} onChange={(e) => setFileLink(e.target.value)} />
            </Modal>

            <CropImageLink
                cropShape={cropShape}
                aspect={aspect}
                url={fileLink}
                show={showCropImageLink}
                onCompleted={uploadFileLink}
                onError={() => {
                    uploadError();
                    setShowCropimageLink(false);
                }}
                onModalCancel={() => {
                    setShowCropimageLink(false);
                    setUploadLoading(false);
                }}
            />
        </>
    );
}

export default UploadImageField;
