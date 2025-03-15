import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import AntdImgCrop from 'antd-img-crop';
import React, { useEffect } from 'react';

function CropImageLink({ url, type, blob, cropShape, onCompleted, onError, aspect, onModalCancel, show }) {
    return (
        <AntdImgCrop cropShape={cropShape} aspect={aspect} onModalCancel={onModalCancel}>
            <Component show={show} url={url} onError={onError} onFinish={onCompleted} type={type} blob={blob} />
        </AntdImgCrop>
    );
}

function Component({ onFinish, url, show, beforeUpload, onError, type, blob }) {
    const { execute: executeDownloadImage } = useFetch(apiConfig.file.dowloadImage);

    const handleDownloadImage = ({ url }) => {
        return new Promise((resolve, reject) => {
            executeDownloadImage({
                params: {
                    url,
                },
                onCompleted: (result) => {
                    resolve(result);
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    };

    useEffect(async () => {
        if (!show) return;
        try {
            if (type == 'file') {
                const file = await beforeUpload(blob, []);
                onFinish?.(file);
            } else {
                const blob = await handleDownloadImage({ url });
                const file = await beforeUpload(blob, []);
                onFinish?.(file);
            }
        } catch (error) {
            onError?.();
        }
    }, [ url, show ]);

    return <></>;
}

export default CropImageLink;
