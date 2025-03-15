import { sendRequest } from '@services/api';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const useFetch = (
    apiConfig,
    { immediate = false, dataIsTextPlain = false, mappingData, params = {}, pathParams = {}, accesToken = null } = {},
) => {
    const { site } = useParams();
    const [ loading, setLoading ] = useState(false);
    const [ data, setData ] = useState(null);
    const [ error, setError ] = useState(null);

    const execute = useCallback(
        async ({ onCompleted, onError, ...payload } = {}) => {
            setLoading(true);
            setError(null);
            try {
                // payload.params = {
                //     ...payload.params,
                //     siteId: site,
                // };

                const { data } = await sendRequest(apiConfig, { params, pathParams, accesToken, ...payload });

                if (data instanceof Blob) {
                    onCompleted && onCompleted(data);
                    return data;
                }
                if (!data.result && data.statusCode !== 200 && !dataIsTextPlain) {
                    throw data;
                }

                setData(mappingData ? mappingData(data) : data);
                onCompleted && onCompleted(data);
                return data;
            } catch (error) {
                setError(error);
                onError && onError(error);
                return error;
            } finally {
                setLoading(false);
            }
        },
        [ apiConfig ],
    );

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [ execute, immediate ]);

    return { loading, execute, data, error, setData };
};

export default useFetch;
