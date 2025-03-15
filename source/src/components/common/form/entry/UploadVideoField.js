import { Dropdown, Form, Modal, Space, Input, Upload, Spin, Button, notification, Alert } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FileAddOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import styles from './UploadField.module.scss';
import classNames from 'classnames';
import defaultUploadVideo from '@assets/images/defaul-upload-video.png';
import ReactPlayer from 'react-player';
import { beforeUploadFile } from '@utils';
import { SIZE_FILE_1000 } from '@constants';
function UploadVideoField({
    required,
    label,
    name,
    formItemProps,
    objectName = '',
    onChange,
    description,
    size = SIZE_FILE_1000,
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
            rules={[
                {
                    ...(required ? { validator: checkFileLink } : {}),
                },
            ]}
            required={required}
            label={label}
            name={name}
        >
            <VideoField objectName={objectName} onChange={onChange} description={description} size={size} />
        </Form.Item>
    );
}

function VideoField({ value = '', onChange, objectName = '', description, size }) {
    const [ showModal, setShowModal ] = useState(false);
    const [ fileLink, setFileLink ] = useState(value);
    const { execute: executeUpFile } = useFetch(apiConfig.file.video);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ uploadLoading, setUploadLoading ] = useState(false);
    const [ showTestVideo, setShowTestVideo ] = useState(false);
    const [ isValidVideo, setIsValidVideo ] = useState(null);

    const uploadFile = ({ file, onSuccess, onError }) => {
        setUploadLoading(true);

        executeUpFile({
            data: {
                video: file,
            },
            onCompleted: async (result) => {
                onSuccess();
                setUploadLoading(false);
                onChange(result.data.url);
                setErrorMessage('');
            },
            onError: (error) => {
                onError();
                setErrorMessage('Error');
                setUploadLoading(false);
            },
        });
    };

    const uploadDropdownItems = [
        {
            key: '1',
            label: (
                <Upload
                    accept=".mp4"
                    showUploadList={false}
                    customRequest={uploadFile}
                    beforeUpload={(file) => beforeUploadFile(file, size, [ 'mp4' ])}
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
                    <img style={{ width: 102, height: 102 }} src={defaultUploadVideo} />
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

    const handleOkModal = () => {
        if (fileLink) {
            setErrorMessage('');
            onChange(fileLink);
        }
        setShowModal(false);
    };

    const handleCancelModal = () => {
        setShowModal(false);
        setShowTestVideo(false);
        setIsValidVideo(null);
        setFileLink('');
    };

    const handleTestVideo = () => {
        if (ReactPlayer.canPlay(fileLink)) {
            setIsValidVideo(true);
        }
    };

    const setValidVideo = () => {
        if (!isValidVideo) {
            setIsValidVideo(true);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Dropdown trigger={[ 'click' ]} menu={{ items: uploadDropdownItems }}>
                    <div
                        className={classNames(
                            styles.uploadBtn,
                            errorMessage || value ? styles.border : styles.borderHover,
                        )}
                    >
                        {renderContent()}
                    </div>
                </Dropdown>
                <span style={{ marginLeft: 30 }}>{description}</span>
            </div>
            <Modal
                title={`Upload ${objectName}`}
                key={showModal}
                open={showModal}
                onOk={handleOkModal}
                onCancel={handleCancelModal}
                width={685}
                maskClosable={false}
                footer={[
                    <Button key="cancel" onClick={handleCancelModal}>
                        Cancel
                    </Button>,
                    <Button
                        disabled={showTestVideo}
                        key="test video"
                        type="primary"
                        onClick={() => {
                            setShowTestVideo(true);
                            setIsValidVideo(null);
                            // handleTestVideo();
                        }}
                    >
                        Test Video
                    </Button>,
                    <Button disabled={!isValidVideo} key="ok" type="primary" onClick={handleOkModal}>
                        OK
                    </Button>,
                ]}
            >
                <div>Video URL</div>
                <Input
                    value={fileLink}
                    onChange={(e) => {
                        setFileLink(e.target.value);
                        setShowTestVideo(false);
                        setIsValidVideo(null);
                    }}
                />
                {showTestVideo && (
                    <>
                        {isValidVideo != null && (
                            <Alert
                                style={{ marginTop: 12 }}
                                showIcon
                                type={isValidVideo ? 'success' : 'error'}
                                message={isValidVideo ? 'Video is valid' : 'Video is invalid'}
                            />
                        )}
                        <ReactPlayer
                            onReady={setValidVideo}
                            onPlay={setValidVideo}
                            onProgress={setValidVideo}
                            style={{ overflow: 'hidden', marginTop: 12 }}
                            width={640}
                            height={360}
                            controls
                            playing
                            onError={() => {
                                if (isValidVideo == null || isValidVideo) {
                                    setIsValidVideo(false);
                                }
                            }}
                            url={fileLink}
                        />
                    </>
                )}
            </Modal>
        </>
    );
}

export default UploadVideoField;
