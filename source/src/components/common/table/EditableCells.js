import React, { useEffect, useRef } from 'react';
import { Form, Input, Table } from 'antd';
import classNames from 'classnames';
import styles from './BaseTable.module.scss';
const EditableContext = React.createContext(null);
const EditableRow = ({ index, form, ...props }) => {
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({ title, editable, children, dataIndex, record, idActive, rules, ...restProps }) => {
    const inputRef = useRef(null);
    useEffect(() => {
        if (idActive) {
            inputRef.current?.focus();
        }
    }, [ idActive ]);

    let childNode = children;
    if (editable) {
        childNode =
            idActive == record.id ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                        rules,
                    ]}
                >
                    <Input ref={inputRef} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                >
                    {children}
                </div>
            );
    }
    return <td {...restProps}>{childNode}</td>;
};
const EditableCells = ({
    dataSource,
    onChange,
    rowSelection,
    defaultColumns,
    loading,
    pagination,
    rowKey = (record) => record.id,
    idActive,
    isEdit,
    form,
    rules,
    ...props
}) => {
    const components = {
        body: {
            row: (rowProps) => <EditableRow {...rowProps} form={form} />,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable && isEdit,
                dataIndex: col.dataIndex,
                title: col.title,
                idActive: idActive,
                rules: rules,
            }),
        };
    });
    return (
        <div>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                onChange={onChange}
                scroll={{ x: true }}
                loading={loading}
                rowKey={rowKey}
                rowSelection={rowSelection}
                {...props}
                className={classNames(styles.baseTable, props.className)}
                pagination={pagination ? { ...pagination, showSizeChanger: false, hideOnSinglePage: true } : false}
            />
        </div>
    );
};
export default EditableCells;
