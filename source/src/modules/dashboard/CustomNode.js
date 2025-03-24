import React from 'react';
import { Handle } from '@xyflow/react';
import styles from './CustomNode.module.scss';
import { Flex, Form } from 'antd';
import TextField from '@components/common/form/TextField';
import UploadImageField from '@components/common/form/entry/UploadImageField';

const CustomNode = ({ data }) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const questionId = queryParameters.get('questionId');
    const accessToken = queryParameters.get('accessToken');
    return (
        <div className={styles.customNode}>
            {/* Handle trên cùng (1 nút) */}
            <Handle
                type="target"
                position="top"
                id="top"
                style={{
                    width: '20px', // Đường kính lớn hơn (khoảng 4px mỗi bên)
                    height: '20px',
                    background: '#1890ff', // Màu xanh
                    borderRadius: '50%', // Hình tròn
                }}
            />

            <Flex gap={6} vertical>
                <TextField name={`name-${data.id}`} style={{ width: '100%' }} placeholder={'Name'} />
                <TextField
                    name={`body_text-${data.id}`}
                    style={{ width: '100%', flex: 1 }}
                    type="textarea"
                    placeholder={'Description'}
                />
                <UploadImageField
                    name={`img_url-${data.id}`}
                    objectName="image"
                    aspect={16 / 9}
                    accessToken={accessToken}
                />
                <TextField name={`img_name-${data.id}`} style={{ width: '100%' }} placeholder={'Image Name'} />
                {/* </Form> */}
            </Flex>

            {/* 4 handle dưới cùng */}
            <Handle
                type="source"
                position="bottom"
                id="bottom0"
                style={{
                    left: '10%',
                    width: '20px', // Đường kính lớn hơn (khoảng 4px mỗi bên)
                    height: '20px',
                    background: '#1890ff',
                    borderRadius: '50%',
                }}
            />
            <Handle
                type="source"
                position="bottom"
                id="bottom1"
                style={{
                    left: '36.33%',
                    width: '20px', // Đường kính lớn hơn (khoảng 4px mỗi bên)
                    height: '20px',
                    background: '#1890ff',
                    borderRadius: '50%',
                }}
            />
            <Handle
                type="source"
                position="bottom"
                id="bottom2"
                style={{
                    left: '63.6%',
                    width: '20px', // Đường kính lớn hơn (khoảng 4px mỗi bên)
                    height: '20px',
                    background: '#1890ff',
                    borderRadius: '50%',
                }}
            />
            <Handle
                type="source"
                position="bottom"
                id="bottom3"
                style={{
                    left: '90%',
                    width: '20px', // Đường kính lớn hơn (khoảng 4px mỗi bên)
                    height: '20px',
                    background: '#1890ff',
                    borderRadius: '50%',
                }}
            />
        </div>
    );
};

export default CustomNode;
