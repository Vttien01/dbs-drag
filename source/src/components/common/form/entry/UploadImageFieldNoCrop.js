import { Button, Dropdown, Form, Input, Modal, Space, Spin, Upload } from 'antd';
import {
    UploadOutlined,
    FileAddOutlined,
    LinkOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import classNames from 'classnames';
import styles from './UploadField.module.scss';
import apiConfig from '@constants/apiConfig';
import { showErrorMessage } from '@services/notifyService';

function UploadImageFieldNoCrop({
    required,
    label,
    name,
    formItemProps,
    objectName = '',
    description = '',
    children,
    apiConfig,
    requestBody,
    accept = '.jpg, .jpeg, .png',
    beforeUpload,
    formatFile,
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
            <Implement
                objectName={objectName}
                description={description}
                apiConfig={apiConfig}
                requestBody={requestBody}
                accept={accept}
                beforeUpload={beforeUpload}
                formatFile={formatFile}
                size={size}
            >
                {children}
            </Implement>
        </Form.Item>
    );
}

function Implement({ objectName, onChange, value, accept, beforeUpload, description, formatFile, size }) {
    const { execute: executeUploadFile, loading } = useFetch(apiConfig.file.image);
    const notification = useNotification();
    const [ showModal, setShowModal ] = useState(false);
    const [ fileLink, setFileLink ] = useState();
    const [ errorMessage, setErrorMessage ] = useState();

    const uploadFile = ({ file, onSuccess, onError }) => {
        executeUploadFile({
            data: {
                image: file,
            },
            onCompleted: (res) => {
                onSuccess();
                onChange(res.data.url);
            },
            onError: () => {
                onError();
                setErrorMessage(`Error`);
            },
        });
    };

    const uploadDropdownItems = [
        {
            key: '1',
            label: (
                <Upload
                    accept={accept}
                    showUploadList={false}
                    customRequest={uploadFile}
                    beforeUpload={(file) => {
                        if (formatFile) {
                            const lastDotIndex = file.name.lastIndexOf('.');
                            const fileExtension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex + 1) : '';
                            const maxFileSize = size * 1024 * 1024;
                            if (!formatFile.includes(fileExtension)) {
                                const upperCaseString = formatFile.map((item) => item.toUpperCase()).join(', ');
                                showErrorMessage(`Image should be in format ${upperCaseString}`);
                                return false;
                            }
                            if (file.size > maxFileSize) {
                                showErrorMessage(`File must be less than ${size}MB !`);
                                return false;
                            }
                        }
                        return true;
                    }}
                >
                    <Space>
                        <FileAddOutlined />
                        From File ...
                    </Space>
                </Upload>
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
        if (loading) {
            return <Spin />;
        }
        if (errorMessage) {
            return <div style={{ color: 'red' }}>{errorMessage}</div>;
        }
        if (value) {
            return (
                <>
                    <div className={styles.imageText}>Update</div>
                    <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={value} />
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
                maskClosable={false}
                open={showModal}
                onOk={() => {
                    setShowModal(false);
                    onChange(fileLink);
                }}
                onCancel={() => setShowModal(false)}
            >
                <div>Key in URL or Link</div>
                <Input value={fileLink} onChange={(e) => setFileLink(e.target.value)} />
            </Modal>
        </>
    );
}

export default UploadImageFieldNoCrop;
