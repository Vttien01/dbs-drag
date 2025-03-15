import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js';

import { Modal } from 'antd';
export const BasicModalPdf = ({
    isModalOpen,
    handleOk,
    handleCancel,
    title = 'Basic modal',
    className,
    children,
    footer,
    width,
    okText = 'Download',
    zIndex,
    pdfUrl,
    onOk,
    onCancel,
    top,
    ...props
}) => {
    return (
        <Modal
            style={{ top: top }}
            width={width}
            zIndex={zIndex}
            title={title}
            open={isModalOpen}
            onOk={onOk}
            onCancel={onCancel}
            className={className}
            footer={footer}
            okText={okText}
            maskClosable={false}
        >
            <div style={{ width: '100%' }}>
                <Document file={pdfUrl}>
                    <Page width={1023} key={1} pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} />
                </Document>
            </div>
        </Modal>
    );
};
