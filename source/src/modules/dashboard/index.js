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
// import './index.css';
import styles from './index.module.scss';

const Dashboard = () => {
    const diagramRef = useRef(null);
    const instanceRef = useRef(null);
    const [ form ] = Form.useForm();
    const transtle = useTranslate();
    const [ buttons, setButtons ] = useState([]);
    const [ addNew, setAddNew ] = useState(true);
    const [ nodePositions, setNodePositions ] = useState([
        {
            id: 'card_0_root',
            left: 50,
            top: 50,
        },
    ]);
    const buttonsRef = useRef(buttons);
    const [ nodes, setNodes ] = useState([
        {
            id: 'card_0_root',
            left: 50,
            top: 50,
            buttons: buttonArray,
            position: [ 50, 50 ],
        },
    ]);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.game.question.update, {
        immediate: false,
    });
    const {
        execute: executeGetById,
        data: dataQuestion,
        loading,
    } = useFetch(apiConfig.game.question.getById, {
        immediate: false,
        mappingData: ({ data }) => {
            return {
                ...data,
            };
        },
    });

    const queryParameters = new URLSearchParams(window.location.search);
    const questionId = queryParameters.get('questionId');
    const accessToken = queryParameters.get('accessToken');
    const gameId = queryParameters.get('gameId');
    const zoomRef = useRef(1);

    const handleZoom = (direction) => {
        let newZoom = zoomRef.current;
        if (direction === 'in') {
            newZoom += 0.1;
        } else if (direction === 'out' && newZoom > 0.2) {
            newZoom -= 0.1;
        }

        zoomRef.current = newZoom;
        diagramRef.current.style.transform = `scale(${newZoom})`;
        diagramRef.current.style.transformOrigin = '0 0';
    };

    const instance = jsPlumb.jsPlumb.getInstance({
        Container: diagramRef.current,
    });
    const handleGetList = () => {
        executeGetById({
            pathParams: {
                id: questionId,
            },
            accessToken: accessToken,
            onCompleted: async ({ data }) => {
                let nodeArray = nodes;
                const content = data?.data;
                if (content?.length > 0) {
                    const topChild = 50;
                    const leftChild = 50;
                    nodeArray = content.map((item, index) => {
                        item?.buttons?.forEach((record) => {
                            if (record != null) {
                                const indexChild = content.findIndex(({ id }) => id == record.nodeId);
                                form.setFieldsValue({
                                    [`name${indexChild}`]: record?.name || item?.name,
                                });
                            }
                        });
                        setButtons((prev) => [ ...prev, item.buttons ]);
                        return {
                            id: item.id,
                            left: item.position[0] || leftChild,
                            top: item.position[1] || topChild,
                            buttons: item.buttons,
                            position: item.position,
                        };
                    });
                    const nodePlace = content.map((item, index) => {
                        return {
                            id: item.id,
                            left: item.position[0] || leftChild,
                            top: item.position[1] || topChild,
                        };
                    });
                    setNodePositions(nodePlace);
                    for (const [ index, item ] of data.data.entries()) {
                        form.setFieldsValue({
                            [`img_url${index}`]: item.img_url,
                            [`body_text${index}`]: item.body_text,
                            [`img_name${index}`]: item.img_name,
                        });
                    }
                }

                setNodes(nodeArray);
            },
        });
    };
    useEffect(() => {
        if (questionId) {
            handleGetList();
        }
    }, [ questionId ]);
    const bottomPositions = [
        [ 0.1, 1, 0, 1 ], // Cách trái 20%
        [ 0.36, 1, 0, 1 ], // Cách trái 40%
        [ 0.64, 1, 0, 1 ], // Cách trái 60%
        [ 0.9, 1, 0, 1 ], // Cách trái 80%
    ];

    useEffect(() => {
        instanceRef.current = instance;

        function addEndpoints(nodeId) {
            // Add one endpoint at the top
            instance.addEndpoint(nodeId, {
                endpoint: 'Dot',
                anchor: 'TopCenter',
                isSource: false,
                isTarget: true,
                maxConnections: -1,
                paintStyle: { fill: '#4a6298', stroke: '#4a6298' },
                connectorOverlays: [ [ 'Arrow', { width: 10, length: 10, location: 1 } ] ],
            });

            bottomPositions.forEach((pos) => {
                instance.addEndpoint(nodeId, {
                    endpoint: 'Dot',
                    anchor: pos, // Sử dụng tọa độ tùy chỉnh
                    isSource: true,
                    isTarget: true,
                    maxConnections: -1,
                    paintStyle: { fill: '#4a6298' },
                });
            });
        }

        if (nodes?.length > 0 && nodePositions?.length > 0) {
            nodes.forEach(({ id }) => {
                const instance = instanceRef.current;
                instance.draggable(id, {
                    stop: ({ finalPos }) => {
                        // const { left, top } = params.el.style;
                        const nodePlace = nodePositions.map((item, index) => {
                            if (item.id == id) {
                                return {
                                    id: item.id,
                                    left: finalPos[0],
                                    top: finalPos[1],
                                };
                            }
                            return item;
                        });
                        setNodePositions(nodePlace);
                    },
                });
                addEndpoints(id);
            });
            handleConect();
        }

        instance.bind('beforeDrop', function (info) {
            const sourceAnchor = info.connection.endpoints[0].anchor.x;
            const sourceIndex = bottomPositions.findIndex((pos) => pos[0] == sourceAnchor);

            const sourceNumber = nodes.findIndex((item) => item.id == info?.sourceId);
            const targetNumber = nodes.findIndex((item) => item.id == info?.targetId);
            const buttons = buttonsRef.current;
            const buttonArrays = buttons[sourceNumber].map((item, index) => {
                if (index == sourceIndex) {
                    return {
                        name: form.getFieldValue(`name${targetNumber}`) || 'computer',
                        nodeId: info.targetId,
                    };
                } else return item;
            });
            setButtons((prev) => {
                const newButtons = [ ...prev ];
                newButtons[sourceNumber] = buttonArrays;
                return newButtons;
            });
            return (
                info.dropEndpoint.anchor.type === 'TopCenter' &&
                bottomPositions.includes(info.targetEndpoint.anchor.type)
            );
        });

        instance.bind('click', function (connection) {
            if (window.confirm('Bạn có muốn xóa đường nối này không?')) {
                const sourceNumber = nodes.findIndex((item) => item.id == connection.sourceId);
                const sourceAnchor = connection.endpoints[0].anchor.x;
                const sourceIndex = bottomPositions.findIndex((pos) => pos[0] == sourceAnchor);
                const buttonArrays = buttons[sourceNumber].map((item, index) => {
                    if (index == sourceIndex) {
                        return null;
                    } else return item;
                });
                setButtons((prev) => {
                    const newButtons = [ ...prev ];
                    newButtons[sourceNumber] = buttonArrays;
                    return newButtons;
                });
                instance.deleteConnection(connection);
            }
        });

        instance.importDefaults({
            Connector: [ 'Straight' ],
            PaintStyle: {
                stroke: '#4a6298',
                strokeWidth: 6,
            },
        });

        return () => {
            instance.reset(); // Cleanup khi unmount
        };
    }, [ nodes, nodePositions ]);
    useEffect(() => {
        buttonsRef.current = buttons;
    }, [ buttons ]);

    const addNode = async () => {
        const newId = `card_${nodes.length}`;
        const innerWidth = Math.random() * (window.innerWidth - 200);
        const innerHeight = Math.random() * 300;
        const maxValues = nodePositions.reduce(
            (acc, item) => ({
                maxLeft: Math.max(acc.maxLeft, item.left),
                maxTop: Math.max(acc.maxTop, item.top),
            }),
            { maxLeft: -Infinity, maxTop: -Infinity },
        );
        setAddNew(false);
        const newNode = {
            id: newId,
            left: Math.round(maxValues.maxLeft + 220),
            top: maxValues.maxLeft > innerWidth ? Math.round(innerHeight) : 50,
            buttons: buttonArray,
        };
        setNodes((prevNodes) => [ ...prevNodes, newNode ]);
        setButtons((prevNodes) => [ ...prevNodes, buttonArray ]);
        setNodePositions((prevNodes) => [ ...prevNodes, newNode ]);

        await new Promise((resolve) => setTimeout(resolve, 100)); // Chờ node render xong

        // const instance = instanceRef.current;
        // const element = document.getElementById(newId);

        // if (element && instance) {
        //     instance.draggable(newId);
        //     addEndpoints(newId);
        // }
    };

    const addEndpoints = (nodeId) => {
        const instance = instanceRef.current;
        const element = document.getElementById('card_0');
        instance.addEndpoint(nodeId, {
            endpoint: 'Dot',
            anchor: 'TopCenter',
            isSource: true,
            isTarget: true,
            maxConnections: -1,
            paintStyle: { fill: '#4a6298', stroke: '#4a6298' },
            connectorOverlays: [ [ 'Arrow', { width: 10, length: 10, location: 1 } ] ],
        });

        bottomPositions.forEach((pos) => {
            instance.addEndpoint(nodeId, {
                endpoint: 'Dot',
                anchor: pos, // Sử dụng tọa độ tùy chỉnh
                isSource: true,
                isTarget: true,
                maxConnections: -1,
                paintStyle: { fill: '#4a6298' },
            });
        });
    };

    const handleConect = () => {
        const instance = instanceRef.current;
        const connect = () => {
            for (let i = 0; i < nodes.length; i++) {
                const currentNode = nodes[i].id;
                if (buttons[i]?.[0] != null) {
                    const nextNode = nodes.find((node) => node.id === buttons[i][0].nodeId)?.id;
                    instance.connect({
                        source: currentNode,
                        target: nextNode,
                        anchors: [ bottomPositions[0], 'TopCenter' ],
                        connector: [ 'Straight' ],
                        paintStyle: { fill: '#4a6298', stroke: '#4a6298', strokeWidth: 6 },
                        overlays: [ [ 'Arrow', { width: 10, length: 10, location: 1 } ] ],
                    });
                }
                if (buttons[i]?.[1] != null) {
                    const nextNode = nodes.find((node) => node.id === buttons[i]?.[1]?.nodeId)?.id;
                    instance.connect({
                        source: currentNode,
                        target: nextNode,
                        anchors: [ bottomPositions[1], 'TopCenter' ],
                        connector: [ 'Straight' ],
                        paintStyle: { fill: '#4a6298', stroke: '#4a6298', strokeWidth: 6 },
                        overlays: [ [ 'Arrow', { width: 10, length: 10, location: 1 } ] ],
                    });
                }
                if (buttons[i]?.[2] != null) {
                    const nextNode = nodes.find((node) => node.id === buttons[i]?.[2]?.nodeId)?.id;
                    instance.connect({
                        source: currentNode,
                        target: nextNode,
                        anchors: [ bottomPositions[2], 'TopCenter' ],
                        connector: [ 'Straight' ],
                        paintStyle: { fill: '#4a6298', stroke: '#4a6298', strokeWidth: 6 },
                        overlays: [ [ 'Arrow', { width: 10, length: 10, location: 1 } ] ],
                    });
                }
                if (buttons[i]?.[3] != null) {
                    const nextNode = nodes.find((node) => node.id === buttons[i]?.[3]?.nodeId)?.id;
                    instance.connect({
                        source: currentNode,
                        target: nextNode,
                        anchors: [ bottomPositions[3], 'TopCenter' ],
                        connector: [ 'Straight' ],
                        paintStyle: { fill: '#4a6298', stroke: '#4a6298', strokeWidth: 6 },
                        overlays: [ [ 'Arrow', { width: 10, length: 10, location: 1 } ] ],
                    });
                }
            }
        };
        if (addNew) {
            setTimeout(() => {
                connect();
            }, 20);
        } else connect();
    };
    function getAllNodePositions() {
        if (!instanceRef.current) return;

        const instance = instanceRef.current;
        const positions = nodes.map(({ id }) => {
            const offset = instance.getOffset(id); // Lấy vị trí top, left của node
            return { id, left: offset.left, top: offset.top };
        });
        return positions;
    }

    const DragTable = useCallback(() => {
        if (nodes?.length > 0 && nodePositions?.length > 0) {
            return nodes.map(({ id }) => {
                const match = id.match(/(card_)(\d+)/);
                const [ , field, index ] = match;
                const left = nodePositions[index]?.left;
                const top = nodePositions[index]?.top;
                return (
                    <div key={id} id={id} className={styles.node} style={{ left, top }}>
                        <ChildrenItem index={index} key={id} id={id} left={left} top={top} />
                    </div>
                );
            });
        }
        return <></>;
    }, [ nodes, nodePositions ]);

    const handleSubmit = (values) => {
        const data = [];

        const offset = getAllNodePositions();
        Object.entries(values).forEach(([ key, value ]) => {
            const match = key.match(/(body_text|img_name|img_url|name)(\d+)/);
            if (match) {
                const [ , field, index ] = match;
                const buttonArray = buttons[index].map((item) => {
                    if (item != null) {
                        const indexChild = dataQuestion?.data?.findIndex(({ id }) => id === item.nodeId);
                        return {
                            name: values[`name${indexChild}`],
                            nodeId: item.nodeId,
                        };
                    }
                    return item;
                });
                if (!data[index]) data[index] = {};
                data[index][field] = value;
                data[index].id = nodes[index].id;
                data[index].buttons = buttonArray;
                data[index].position = [ offset[index].left, offset[index].top ];
            }
        });

        executeUpdate({
            pathParams: { id: questionId },
            data: {
                data,
                languageId: dataQuestion.languageId,
                title: dataQuestion.title,
                type: dataQuestion.type,
            },
            onCompleted: (res) => {
                showSucsessMessage('Update success');
            },
            onError: (res) => {
                showErrorMessage('Update failed');
            },
        });
    };

    const { execute: executeUpFile } = useFetch(apiConfig.file.image, {
        immediate: false,
    });
    const uploadFile = ({ file }, index) => {
        executeUpFile({
            data: {
                image: file,
            },
            accessToken: accessToken,
            onCompleted: ({ data }) => {
                form.setFieldValue(`img_url${index}`, data.url);
            },
            onError: () => {
                // onError();
            },
        });
    };
    const ChildrenItem = ({ index, id }) => {
        return (
            <Flex gap={4} vertical style={{ paddingTop: index == 0 ? '12px' : 0 }}>
                {index > 0 && (
                    <Flex style={{ width: '100%' }} justify="end">
                        <CloseSquareFilled
                            style={{
                                color: 'red',
                                fontSize: 24,
                                marginTop: '-8px',
                                marginRight: '-10px',
                            }}
                            onClick={() => {
                                const array = getAllConnections(instanceRef.current);
                                if (Object.keys(array).length > 0 && array[id]) {
                                    const { incoming, outgoing } = array[id];
                                    if (incoming.length > 0) {
                                        incoming.forEach((item) => {
                                            const { source, sourceAnchor } = item;
                                            const sourceNumber = nodes.findIndex((item) => item.id == source);
                                            const sourceIndex = bottomPositions.findIndex(
                                                (pos) => pos[0] == sourceAnchor.x,
                                            );
                                            const buttons = buttonsRef.current;
                                            const buttonArrays = buttons[sourceNumber].map((item, index) => {
                                                if (index == sourceIndex) {
                                                    return null;
                                                } else return item;
                                            });
                                            setButtons((prev) => {
                                                const newButtons = [ ...prev ];
                                                newButtons[sourceNumber] = buttonArrays;
                                                return newButtons;
                                            });
                                        });
                                    }
                                }
                                form.setFieldsValue({
                                    [`name${index}`]: '',
                                    [`img_url${index}`]: null,
                                    [`body_text${index}`]: '',
                                    [`img_name${index}`]: '',
                                });
                                setButtons((prevNodes) => prevNodes.filter((item, i) => i != index));
                                setNodes((prevNodes) => prevNodes.filter((item, i) => item.id !== id));
                            }}
                        />
                    </Flex>
                )}
                <TextField name={`name${index}`} style={{ width: '100%' }} />
                <TextField name={`body_text${index}`} style={{ width: '100%', flex: 1 }} type="textarea" />
                <Flex style={{ width: '100%' }} justify="center" align="center" gap={4}>
                    <TextField
                        name={`img_url${index}`}
                        style={{
                            width: '100%',
                            padding: 0,
                            backgroundColor: 'transparent',
                            border: '1px solid #6c6c6c',
                            color: 'white',
                            fontSize: 12,
                            display: 'none',
                        }}
                        initialValue={''}
                        readOnly
                    />
                    <span className={styles.text}>
                        {form.getFieldValue(`img_url${index}`) || 'Format: .JPG Maximum Size: 720 x 350 pixels'}
                    </span>
                    <Upload
                        style={{ width: '30px', height: '30px' }}
                        showUploadList={false}
                        customRequest={(file) => uploadFile(file, index)}
                    >
                        <Button type="primary" style={{ backgroundColor: 'red', fontSize: 12 }} size="small">
                            Upload
                        </Button>
                    </Upload>
                </Flex>
                <TextField name={`img_name${index}`} style={{ width: '100%' }} />
            </Flex>
        );
    };

    return (
        <div
            id="diagram"
            className={styles.diagram}
            ref={diagramRef}
            style={{ width: '100%', border: '2px solid lightgrey', position: 'relative' }}
        >
            <Loading show={loading || loadingUpdate} />
            <Form form={form} onFinish={handleSubmit}>
                <Button onClick={addNode}>Add Node</Button>
                <Button htmlType="submit" disabled={nodes.length <= 1}>
                    Save
                </Button>
                <Button onClick={() => handleZoom('in')}>Zoom In</Button>
                <Button onClick={() => handleZoom('out')}>Zoom Out</Button>
                <DragTable />
            </Form>
        </div>
    );
};

const buttonArray = [ null, null, null, null ];

function getCardLevels(cards) {
    const cardMap = new Map(); // Lưu trữ card theo id
    const levels = {}; // Kết quả lưu cấp độ của từng card

    // Tạo ánh xạ ID => Card
    cards.forEach((card) => {
        cardMap.set(card.id, card);
    });

    // Khởi tạo hàng đợi BFS với card gốc (root)
    const queue = [ { id: 'card_0_root', level: 0 } ];
    levels['card_0_root'] = 0; // Root có level = 0

    while (queue.length > 0) {
        const { id, level } = queue.shift(); // Lấy phần tử đầu tiên trong queue
        const card = cardMap.get(id);

        if (card && card.buttons) {
            card.buttons.forEach((button) => {
                if (button && button.nodeId && !(button.nodeId in levels)) {
                    levels[button.nodeId] = level + 1; // Gán cấp độ
                    queue.push({ id: button.nodeId, level: level + 1 }); // Đưa vào queue để duyệt tiếp
                }
            });
        }
    }

    return levels;
}

function countLevel(cardLevels, targetCard, levelCard) {
    const entries = Object.entries(cardLevels);

    // Tìm vị trí của targetCard trong mảng
    const targetIndex = entries.findIndex(([ key ]) => key == targetCard);

    // Lọc các phần tử trước targetCard có level = 2
    const count = entries.slice(0, targetIndex).filter(([ _, level ]) => level === levelCard).length;

    return count;
}

const getAllConnections = (instance) => {
    const connections = instance.getConnections();
    const nodeConnections = {};

    connections.forEach((conn) => {
        const sourceId = conn.sourceId;
        const targetId = conn.targetId;

        // Thêm kết nối vào source node
        if (!nodeConnections[sourceId]) {
            nodeConnections[sourceId] = { outgoing: [], incoming: [] };
        }
        nodeConnections[sourceId].outgoing.push({
            target: targetId,
            sourceAnchor: conn.endpoints[0].anchor,
            targetAnchor: conn.endpoints[1].anchor,
        });

        // Thêm kết nối vào target node
        if (!nodeConnections[targetId]) {
            nodeConnections[targetId] = { outgoing: [], incoming: [] };
        }
        nodeConnections[targetId].incoming.push({
            source: sourceId,
            sourceAnchor: conn.endpoints[0].anchor,
            targetAnchor: conn.endpoints[1].anchor,
        });
    });
    return nodeConnections;
};

export default Dashboard;
