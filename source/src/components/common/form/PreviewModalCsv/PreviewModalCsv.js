import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useQueryParams from '@hooks/useQueryParams';
import { Modal, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
export default function PreviewModalCsv({
    isModalOpen,
    title = 'Preview modal',
    className,
    footer,
    width,
    okText = 'Download',
    zIndex,
    onOk,
    onCancel,
    top,
    csvData,
    columns,
    handleGetList,
    ...props
}) {
    const [ pagination, setPagination ] = useState({
        pageSize: 10,
        total: csvData?.count,
        current: 1,
    });
    const { params: queryParams, setQueryParams, serializeParams, deserializeParams } = useQueryParams();
    const queryFilter = useMemo(() => deserializeParams(queryParams), [ queryParams ]);
    const { pathname: pagePath } = useLocation();

    useEffect(() => {
        const page = parseInt(queryFilter.page);
        if (page > 0 && page !== pagination.current) {
            setPagination((p) => ({ ...p, current: page }));
            handleGetList(page);
        } else if (page < 1) {
            setPagination((p) => ({ ...p, current: 1 }));
        }
    }, [ queryParams, pagePath ]);
    function changePagination(pagination, filters, sorter) {
        queryParams.set('page', pagination.current);
        setQueryParams(queryParams);
    }
    return (
        <Modal
            style={{ top: top }}
            width={width}
            zIndex={zIndex}
            title={title}
            open={isModalOpen}
            onOk={onOk}
            onCancel={() => {
                queryParams.delete('page');
                setQueryParams(queryParams);
                onCancel();
            }}
            className={className}
            footer={footer}
            okText={okText}
            maskClosable={false}
        >
            <div style={{ minHeight: '660px' }}>
                <BaseTable
                    onChange={changePagination}
                    dataSource={csvData?.rows}
                    columns={columns}
                    pagination={pagination}
                />
            </div>
        </Modal>
    );
}
