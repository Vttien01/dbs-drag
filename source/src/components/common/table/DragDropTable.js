import { MenuOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './BaseTable.module.scss';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
const DragHandle = SortableHandle(() => (
    <MenuOutlined
        style={{
            cursor: 'grab',
            color: '#999',
        }}
    />
));
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);
const DragDropTable = (props) => {
    const { loading, rowKey = (record) => record.id, columns, dataSource, onChange, pagination, setDataSource } = props;
    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex);
            setDataSource(newData);
        }
    };
    const DraggableContainer = (props) => (
        <SortableBody useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />
    );
    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    return (
        <Table
            onChange={onChange}
            scroll={{ x: true }}
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            rowKey={rowKey}
            components={{
                body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                },
            }}
            className={classNames(styles.baseTable, props.className)}
            pagination={pagination ? { ...pagination, showSizeChanger: false, hideOnSinglePage: true } : false}
            {...props}
        />
    );
};
export default DragDropTable;
