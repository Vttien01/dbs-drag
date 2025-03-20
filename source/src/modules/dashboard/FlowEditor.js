import { Button, Flex, Form, Upload } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CloseSquareFilled } from '@ant-design/icons';
import TextField from '@components/common/form/TextField';
import Loading from '@components/common/loading';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import jsPlumb from 'jsplumb';
import styles from './index.module.scss';
import UploadImageField from '@components/common/form/entry/UploadImageField';
import { Background, Controls, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const FlowEditor = () => {
    const CustomNode = ({ data }) => {
        return (
            <div className={styles.node}>
                {data.label} {/* Render ChildrenItem trực tiếp */}
            </div>
        );
    };

    // Định nghĩa các node type
    const nodeTypes = {
        // custom: CustomNode,
    };
    const ChildrenItem = ({ index, id }) => {
        return (
            <div key={id} id={id} className={styles.node} style={{ left: 0, top: 0 }}>
                <Flex gap={6} vertical style={{ paddingTop: index == 0 ? '12px' : 0 }}>
                    {index > 0 && (
                        <Flex style={{ width: '100%' }} justify="end">
                            <CloseSquareFilled
                                style={{
                                    color: 'red',
                                    fontSize: 24,
                                    marginTop: '-8px',
                                    marginRight: '-10px',
                                }}
                            />
                        </Flex>
                    )}
                    <TextField style={{ width: '100%' }} placeholder={'Name'} />
                    <TextField style={{ width: '100%', flex: 1 }} type="textarea" placeholder={'Description'} />
                    <UploadImageField
                        objectName="image"
                        aspect={16 / 9}
                        // accessToken={accessToken}
                    />
                    <TextField style={{ width: '100%' }} placeholder={'Image Name'} />
                </Flex>
            </div>
        );
    };
    const nodes = [
        {
            id: '1',
            data: { label: 'Hello' },
            position: { x: 0, y: 0 },
            type: 'input',
        },
        {
            id: '2',
            data: { label: 'World' },
            position: { x: 100, y: 100 },
        },
    ];

    const edges = [ { id: '1-2', source: '1', target: '2' } ];

    return (
        <div style={{ height: '100vh' }}>
            <ReactFlow nodes={nodes} edges={edges}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};
export default FlowEditor;
