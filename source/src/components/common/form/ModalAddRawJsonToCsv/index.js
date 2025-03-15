import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useQueryParams from '@hooks/useQueryParams';
import { Form, Modal, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TextField from '../TextField';
import useBasicForm from '@hooks/useBasicForm';
import useNotification from '@hooks/useNotification';
export default function ModalAddRawJsonToCsv({
    isModalOpen,
    title = 'Create modal',
    className,
    footer,
    width,
    okText = 'Create',
    zIndex,
    onOk,
    onCancel,
    top,
    setIsChangedFormValues,
    onSubmit,
    ...props
}) {
    const notification = useNotification();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        try {
            if (JSON.parse(values?.uiTranslation))
                return mixinFuncs.handleSubmit({ uiTranslation: values?.uiTranslation });
        } catch (error) {
            notification({ type: 'error', message: 'Not a valid json' });
        }
    };
    return (
        <Modal
            style={{ top: top }}
            width={width}
            zIndex={zIndex}
            title={title}
            open={isModalOpen}
            onOk={onOk}
            onCancel={() => {
                onCancel();
            }}
            className={className}
            footer={footer}
            okText={okText}
            maskClosable={false}
        >
            <div style={{ minHeight: '500px' }}>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item>
                        <TextField
                            fieldProps={{ placeholder: 'Add Raw Json' }}
                            type="textarea"
                            style={{ height: '500px' }}
                            validateStatus
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}
