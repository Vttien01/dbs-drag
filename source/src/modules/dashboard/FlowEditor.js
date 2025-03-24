import React, { useCallback, useEffect, useState } from 'react';
import {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
    Controls,
    ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from './FlowEditor.module.scss';
import Sidebar from './Sidebar';
import CustomNode from './CustomNode';
// import { dataExp } from './dataExp';
import { Form, Modal } from 'antd';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import Loading from '@components/common/loading';
import { FormattedMessage } from 'react-intl';

const nodeTypes = {
    custom: CustomNode,
};

const directionDot = [ 'bottom0', 'bottom1', 'bottom2', 'bottom3' ];

const FlowEditor = () => {
    const [ nodes, setNodes, onNodesChange ] = useNodesState([]);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState([]);
    const [ form ] = Form.useForm();
    const queryParameters = new URLSearchParams(window.location.search);
    const questionId = queryParameters.get('questionId');
    const accessToken = queryParameters.get('accessToken');
    const [ hoveredEdgeId, setHoveredEdgeId ] = useState(null); // Theo dõi edge đang hover
    const [ isModalVisible, setIsModalVisible ] = useState(false); // Điều khiển popup
    const [ edgeToDelete, setEdgeToDelete ] = useState(null); // Lưu edge cần xóa
    const {
        execute: executeGetById,
        data: dataExp,
        loading,
    } = useFetch(apiConfig.game.question.getById, {
        immediate: false,
        mappingData: ({ data }) => {
            return {
                ...data,
            };
        },
    });
    const handleGetList = () => {
        executeGetById({
            pathParams: {
                id: questionId,
            },
            accessToken: accessToken,
        });
    };
    useEffect(() => {
        if (questionId) {
            handleGetList();
        }
    }, [ questionId ]);

    useEffect(() => {
        if (dataExp?.data?.length > 0) {
            const initialNodes = dataExp.data.map((item) => {
                return {
                    id: item.id,
                    type: 'custom',
                    position: { x: item.position[0], y: item.position[1] },
                    data: {
                        id: item.id,
                        name: item.name,
                        body_text: item.body_text,
                        img_url: item.img_url,
                        img_name: item.img_name,
                        buttons: item.buttons,
                        onUpdate: (updatedData) => {
                            setNodes((nds) =>
                                nds.map((node) =>
                                    node.id === item.id ? { ...node, data: { ...node.data, ...updatedData } } : node,
                                ),
                            );
                        },
                    },
                };
            });
            const initialValues = {};
            initialNodes.forEach((node) => {
                initialValues[`name-${node.id}`] = node.data.name;
                initialValues[`body_text-${node.id}`] = node.data.body_text;
                initialValues[`img_url-${node.id}`] = node.data.img_url;
                initialValues[`img_name-${node.id}`] = node.data.img_name;
            });
            form.setFieldsValue(initialValues);
            const initialEdges = dataExp.data.flatMap(
                (item) =>
                    item.buttons
                        .map((btn, index) => {
                            // Nếu btn là null, không tạo edge
                            if (!btn) return null;

                            return {
                                id: `${item.id}-${btn.nodeId}`,
                                source: item.id,
                                target: btn.nodeId,
                                sourceHandle: `bottom${index}`, // Đảm bảo khớp với bottom1, bottom2, bottom3, bottom4
                                targetHandle: 'top',
                                // type: 'straight',
                                style: { stroke: '#1890ff', strokeWidth: 3 },
                            };
                        })
                        .filter((edge) => edge !== null), // Lọc bỏ các edge null sau khi map
            );
            setNodes(initialNodes);
            setEdges(initialEdges);
        }
    }, [ setNodes, setEdges, dataExp ]);
    const onConnect = useCallback(
        (params) => {
            const { source, target, sourceHandle } = params;
            const values = form.getFieldsValue();
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        // type: 'straight',4
                        style: { stroke: '#1890ff', strokeWidth: 3 }, // Màu xanh, độ dày 3px
                    },
                    eds,
                ),
            );
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === source) {
                        const index = directionDot.findIndex((dot) => dot === sourceHandle); // Lấy index từ sourceHandle
                        const newButtons = [ ...(node.data.buttons || [ null, null, null, null ]) ];
                        newButtons[index] = { name: values[`name-${target}`] || '', nodeId: target }; // Thêm button mới
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                buttons: newButtons,
                            },
                        };
                    }
                    return node;
                }),
            );
        },
        [ setEdges ],
    );

    // Xử lý sự kiện kéo qua canvas
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Xử lý khi thả node vào canvas
    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            const position = {
                x: event.clientX - 100,
                y: event.clientY - 50,
            };

            const newNodeId = `${type}-${Date.now()}`;
            const newNode = {
                id: newNodeId,
                type: 'custom',
                position,
                data: {
                    name: `${type} Node`,
                    body_text: '',
                    img_url: '',
                    img_name: '',
                    buttons: [ null, null, null, null ],
                    onUpdate: (updatedData) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === newNodeId ? { ...node, data: { ...node.data, ...updatedData } } : node,
                            ),
                        );
                    },
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [ setNodes ],
    );

    const addNode = () => {
        let newNodeId = 0;
        if (nodes?.length >= 10) {
            const key = nodes.slice(-1)[0].id;
            const [ field, lastChild ] = key.split('_');
            newNodeId = parseInt(lastChild) + 1;
        } else {
            newNodeId = nodes?.length + 1;
        }
        const innerWidth = Math.random() * (window.innerWidth - 200);
        const innerHeight = Math.random() * 300;
        const maxPosition = nodes.reduce(
            (max, node) => ({
                x: Math.max(max.x, node.position.x),
                y: Math.max(max.y, node.position.y),
            }),
            { x: 100, y: 100 }, // Giá trị khởi tạo
        );
        const newNode = {
            id: `card_${newNodeId}`,
            type: 'custom',
            position: { x: Math.round(maxPosition.x + 240), y: Math.random() * 500 },
            data: {
                id: `card_${newNodeId}`,
                name: '',
                body_text: '',
                img_url: '',
                img_name: '',
                buttons: [ null, null, null, null ],
                onUpdate: (updatedData) => {
                    setNodes((nds) =>
                        nds.map((node) =>
                            node.id === newNodeId ? { ...node, data: { ...node.data, ...updatedData } } : node,
                        ),
                    );
                },
            },
        };
        form.setFieldsValue({
            [`name-card_${newNodeId}`]: '',
            [`body_text-card_${newNodeId}`]: '',
            [`img_url-card_${newNodeId}`]: '',
            [`img_name-card_${newNodeId}`]: '',
        });
        setNodes((nds) => nds.concat(newNode));
    };
    const onValuesChange = (changedValues) => {
        Object.keys(changedValues).forEach((key) => {
            const [ field, nodeId ] = key.split('-');
            const node = nodes.find((n) => n.id === nodeId);
            if (node) {
                node.data.onUpdate({ [field]: changedValues[key] });
            }
        });
    };

    const onEdgeMouseEnter = useCallback((event, edge) => {
        setHoveredEdgeId(edge.id);
    }, []);

    const onEdgeMouseLeave = useCallback(() => {
        setHoveredEdgeId(null);
    }, []);

    // Xử lý click vào edge để hiển thị popup
    const onEdgeClick = useCallback((event, edge) => {
        setEdgeToDelete(edge);
        setIsModalVisible(true);
    }, []);

    // Xác nhận xóa edge
    const handleDeleteEdge = () => {
        if (edgeToDelete) {
            const indexDelete = directionDot.findIndex((dot) => dot === edgeToDelete.sourceHandle);
            setEdges((eds) => eds.filter((e) => e.id !== edgeToDelete.id));
            const dataSend = nodes.map((item, index) => {
                const buttons = item.data.buttons;
                let buttonArray = [ null, null, null, null ];
                if (buttons) {
                    buttonArray = buttons.map((itemButton, index) => {
                        if (index == indexDelete) {
                            return null;
                        }
                        return itemButton;
                    });
                }
                return {
                    ...item,
                    data: {
                        ...item.data,
                        buttons: buttonArray,
                    },
                };
            });
            setNodes(dataSend);
        }
        setIsModalVisible(false);
        setEdgeToDelete(null);
    };

    // Hủy popup
    const handleCancel = () => {
        setIsModalVisible(false);
        setEdgeToDelete(null);
    };

    // Cập nhật style động cho edges
    const updatedEdges = edges.map((edge) => ({
        ...edge,
        style: {
            ...edge.style,
            strokeWidth: hoveredEdgeId === edge.id ? 5 : 3, // Tăng strokeWidth khi hover
        },
    }));

    return (
        <div className={styles.app}>
            <Loading show={loading} />
            <ReactFlowProvider>
                <Sidebar addNode={addNode} form={form} nodes={nodes} dataExp={dataExp} edges={edges} />
                <Form form={form} onValuesChange={onValuesChange}>
                    <div className={styles.reactflowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={updatedEdges} // Sử dụng edges với style động
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onEdgeMouseEnter={onEdgeMouseEnter} // Xử lý hover
                            onEdgeMouseLeave={onEdgeMouseLeave} // Xử lý rời hover
                            onEdgeClick={onEdgeClick} // Xử lý click
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </div>
                </Form>
            </ReactFlowProvider>
            <Modal
                title={<FormattedMessage defaultMessage={'Confirm delete connection'} />}
                open={isModalVisible}
                onOk={handleDeleteEdge}
                onCancel={handleCancel}
                okText={<FormattedMessage defaultMessage={'Delete'} />}
                cancelText={<FormattedMessage defaultMessage={'Cancel'} />}
            >
                <p>Are you sure you want to delete this connection?</p>
            </Modal>
        </div>
    );
};

export default FlowEditor;
