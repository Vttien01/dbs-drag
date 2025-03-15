import { Button, Dropdown, Form, Input, Modal, Space, Upload } from 'antd';
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

function FileUploadField({
    required,
    label,
    name,
    formItemProps,
    objectName = '',
    description = '',
    children,
    apiConfig,
    requestBody,
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
            >
                {children}
            </Implement>
        </Form.Item>
    );
}

function Implement({ objectName, onChange, value, children, apiConfig, requestBody }) {
    const { execute: executeUploadFile, loading, error } = useFetch(apiConfig);
    const notification = useNotification();
    const [ showModal, setShowModal ] = useState(false);
    const [ fileLink, setFileLink ] = useState();

    const uploadFile = ({ file, onSuccess, onError }) => {
        executeUploadFile({
            data: {
                ...requestBody(file),
            },
            onCompleted: (res) => {
                onSuccess();
                onChange(res.data.url);
                notification({ type: 'success', message: 'Uploaded successfully' });
            },
            onError: () => {
                onError();
                notification({ type: 'error', message: 'Upload failed.' });
            },
        });
    };

    const uploadDropdownItems = [
        {
            key: '1',
            label: (
                <Upload accept=".jpg, .jpeg, .png" showUploadList={false} customRequest={uploadFile}>
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

    return (
        <>
            <Dropdown trigger={[ 'click' ]} menu={{ items: uploadDropdownItems }}>
                <Space>
                    <Button loading={loading} icon={<UploadOutlined />}>
                        {children}
                    </Button>
                </Space>
            </Dropdown>

            <Modal
                title={`Upload ${objectName}`}
                open={showModal}
                onOk={() => {
                    setShowModal(false);
                    onChange(fileLink);
                }}
                maskClosable={false}
                onCancel={() => setShowModal(false)}
            >
                <div>Key in URL or Link</div>
                <Input value={fileLink} onChange={(e) => setFileLink(e.target.value)} />
            </Modal>
        </>
    );
}

export default FileUploadField;
