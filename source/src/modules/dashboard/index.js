import Loading from '@components/common/loading';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import {
    addEdge,
    Background,
    Controls,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Form, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CustomNode from './CustomNode';
import Header from './Header';
import styles from './index.module.scss';

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
    const [ nodeToDelete, setNodeToDelete ] = useState(null); // Lưu edge cần xóa
    const [ isModalDeleteNote, setIsModalDeleteNote ] = useState(false);

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
    const handleGetList = (id) => {
        executeGetById({
            pathParams: {
                id: id || questionId,
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
        let initialArray = [
            {
                id: 'card_0_root',
                name: '',
                buttons: [ null, null, null, null ],
                img_url: null,
                img_name: '',
                position: [ 222, 41 ],
                body_text: '',
            },
        ];
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
                        isError: false,
                        onUpdate: (updatedData) => {
                            setNodes((nds) =>
                                nds.map((node) =>
                                    node.id === item.id ? { ...node, data: { ...node.data, ...updatedData } } : node,
                                ),
                            );
                        },
                        onDelete: () => {
                            setIsModalDeleteNote(true);
                            setNodeToDelete(item.id);
                        },
                    },
                };
            });
            const initialValues = {};
            initialNodes.forEach((node) => {
                initialValues[`id-${node.id}`] = node.id;
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
                                id: `${item.id}-${Math.random() * 500}`,
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
        } else {
            const initialNodes = initialArray.map((item) => {
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
                        isError: false,
                        onUpdate: (updatedData) => {
                            setNodes((nds) =>
                                nds.map((node) =>
                                    node.id === item.id ? { ...node, data: { ...node.data, ...updatedData } } : node,
                                ),
                            );
                        },
                        onDelete: () => {
                            setIsModalDeleteNote(true);
                            setNodeToDelete(item.id);
                        },
                    },
                };
            });
            const initialValues = {};
            initialNodes.forEach((node) => {
                initialValues[`id-${node.id}`] = node.id;
                initialValues[`name-${node.id}`] = node.data.name;
                initialValues[`body_text-${node.id}`] = node.data.body_text;
                initialValues[`img_url-${node.id}`] = node.data.img_url;
                initialValues[`img_name-${node.id}`] = node.data.img_name;
            });
            form.setFieldsValue(initialValues);
            setNodes(initialNodes);
            setEdges([]);
        }
    }, [ setNodes, setEdges, dataExp ]);
    const onConnect = useCallback(
        (params) => {
            const { source, target, sourceHandle } = params;
            const values = form.getFieldsValue();
            if (source != target) {
                setEdges((eds) => {
                    // Tìm edge hiện tại từ sourceHandle
                    const existingEdge = eds.find(
                        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle,
                    );

                    let updatedEdges = eds;
                    if (existingEdge) {
                        updatedEdges = eds.filter((edge) => edge.id !== existingEdge.id);
                    }

                    return addEdge({ ...params, style: { stroke: '#1890ff', strokeWidth: 3 } }, updatedEdges);
                });
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
            }
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
                isError: false,
                onUpdate: (updatedData) => {
                    setNodes((nds) =>
                        nds.map((node) =>
                            node.id === newNodeId ? { ...node, data: { ...node.data, ...updatedData } } : node,
                        ),
                    );
                },
                onDelete: () => {
                    setIsModalDeleteNote(true);
                    setNodeToDelete(`card_${newNodeId}`);
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
                if (item.id == edgeToDelete.source) {
                    return {
                        ...item,
                        data: {
                            ...item.data,
                            buttons: buttonArray,
                        },
                    };
                }
                return {
                    ...item,
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

    const updatedEdges = edges.map((edge) => ({
        ...edge,
        style: {
            ...edge.style,
            stroke: '#1890ff',
            strokeWidth: hoveredEdgeId === edge.id ? 5 : 3, // Tăng strokeWidth khi hover
        },
    }));

    const handleDeleteNode = () => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete));
        const fieldsToRemove = [
            `name_${nodeToDelete}`,
            `body_text_${nodeToDelete}`,
            `img_url_${nodeToDelete}`,
            `img_name_${nodeToDelete}`,
        ];
        form.setFields(fieldsToRemove.map((field) => ({ name: field, value: '' })));
        setNodeToDelete(null);
        setIsModalDeleteNote(false);
    };

    return (
        <div className={styles.app}>
            <Loading show={loading} />
            <ReactFlowProvider>
                <Header
                    addNode={addNode}
                    form={form}
                    nodes={nodes}
                    dataExp={dataExp}
                    edges={edges}
                    handleGetList={handleGetList}
                    setNodes={setNodes}
                />
                <Form form={form} onValuesChange={onValuesChange} style={{ marginTop: 24 }}>
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
                            // fitView
                            defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
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
            <Modal
                title={<FormattedMessage defaultMessage={'Confirm delete node'} />}
                open={isModalDeleteNote}
                onOk={handleDeleteNode}
                onCancel={() => {
                    setIsModalDeleteNote(false);
                }}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this node?</p>
            </Modal>
        </div>
    );
};

export default FlowEditor;
