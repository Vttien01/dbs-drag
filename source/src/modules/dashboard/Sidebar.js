import React from 'react';
import styles from './Sidebar.module.scss';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { showErrorMessage, showSucsessMessage, showWarningMessage } from '@services/notifyService';
import { isError, set } from 'lodash';
// import { dataExp } from './dataExp';

const Sidebar = ({ addNode, form, nodes, dataExp, handleGetList, edges, setNodes }) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };
    const queryParameters = new URLSearchParams(window.location.search);
    const questionId = queryParameters.get('questionId');
    const accessToken = queryParameters.get('accessToken');
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.game.question.update, {
        immediate: false,
    });
    const handleCheckDot = () => {
        return nodes;
    };
    const handleSubmit = () => {
        const values = form.getFieldsValue();
        const check = edges.map((item) => item.target);
        const uniqueSources = [ ...new Set(check) ];
        if (uniqueSources.length < nodes.length - 1) {
            const number = nodes.length - uniqueSources.length;
            showWarningMessage(`There are currently ${number} root nodes`);
            const arrayRoot = nodes.map((item) => {
                if (!uniqueSources.includes(item.id))
                    return {
                        ...item,
                        data: {
                            ...item.data,
                            isError: true,
                        },
                    };
                return {
                    ...item,
                    data: {
                        ...item.data,
                        isError: false,
                    },
                };
            });
            setNodes(arrayRoot);
            return;
        }
        const dataSend = nodes.map((item, index) => {
            const buttons = item.data.buttons;
            let buttonArray = [ null, null, null, null ];
            if (buttons) {
                buttonArray = buttons.map((itemButton) => {
                    if (itemButton != null) {
                        const child = nodes?.find(({ id }) => id === itemButton.nodeId);
                        if (child)
                            return {
                                name: values[`name-${child.id}`] || child?.data?.name || '',
                                nodeId: itemButton.nodeId,
                            };
                    }
                    return null;
                });
            }
            return {
                id: item.id,
                buttons: buttonArray,
                body_text: values[`body_text-${item.id}`] || item?.data.body_text,
                img_url: values[`img_url-${item.id}`] || item?.data.img_url,
                img_name: values[`img_name-${item.id}`] || item?.data.img_name,
                position: [ item.position.x, item.position.y ],
                name: values[`name-${item.id}`] || item?.data.name,
            };
        });

        executeUpdate({
            pathParams: { id: questionId },
            data: {
                data: dataSend,
                languageId: dataExp.languageId,
                title: dataExp.title,
                type: dataExp.type,
            },
            accessToken: accessToken,
            onCompleted: (res) => {
                showSucsessMessage('Update success');
                handleGetList();
            },
            onError: (res) => {
                showErrorMessage('Update failed');
            },
        });
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.dndnode} onClick={addNode}>
                Add Node
            </div>
            <div className={styles.dndnode} onClick={handleSubmit}>
                Save
            </div>
        </aside>
    );
};

export default Sidebar;
