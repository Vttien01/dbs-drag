import { storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import { removeItem } from '@utils/localStorage';
import axios from 'axios';
import {
    getCacheAccessToken,
    getCacheUserEmail,
    getCacheRefreshToken,
    removeCacheToken,
    setCacheToken,
} from './userService';

// Handle refresh token
const axiosInstance = axios.create();
let isRefreshing = false;
let subscribers = [];

const onRefreshed = (newAccessToken) => {
    subscribers.map((cb) => cb(newAccessToken));
};

const subscribeTokenRefresh = (cb) => {
    subscribers.push(cb);
};

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalConfig = err.config;
        let replaceUrl = window.location.origin;
        const param = new URLSearchParams(window.location.search);
        if (originalConfig.url !== apiConfig.account.login.baseURL && err.response) {
            // Access Token was expired
            if (err.response?.status === 401 && !originalConfig._retry) {
                const handleExpireAll = () => {
                    removeCacheToken();
                    if (param.get('accessToken')) {
                        window.location.replace(replaceUrl);
                    } else {
                        window.location.reload();
                    }
                };

                // if (!getCacheRefreshToken()) {
                //     handleExpireAll();
                // }
                handleExpireAll();

                // originalConfig._retry = true;
                // if (!isRefreshing) {
                //     isRefreshing = true;
                //     const email = getCacheUserEmail();
                //     axiosInstance
                //         .post(apiConfig.account.refreshToken.baseURL, {
                //             refreshToken: getCacheRefreshToken(),
                //             email,
                //         })
                //         .then((rs) => {
                //             const { accessToken, refreshToken } = rs.data.data;
                //             setCacheToken(accessToken, refreshToken);
                //             isRefreshing = false;
                //             onRefreshed(accessToken);
                //             subscribers = [];
                //         })
                //         .catch((_error) => {
                //             handleExpireAll();
                //             return Promise.reject(_error);
                //         });
                // }

                return new Promise((resolve) => {
                    subscribeTokenRefresh((newAccessToken) => {
                        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                        return resolve(axiosInstance(originalConfig));
                    });
                });
            }
        }
        return Promise.reject(err);
    },
);

const sendRequest = (options, payload, cancelToken) => {
    let { params = {}, pathParams = {}, data = {}, disableHandleMultipart, accessToken } = payload;
    let { method, baseURL, headers, ignoreAuth, responseType } = options;
    const userAccessToken = getCacheAccessToken();
    if (!ignoreAuth && userAccessToken) {
        headers.Authorization = `Bearer ${userAccessToken}`;
    }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    // update path params
    for (let key of Object.keys(pathParams)) {
        const keyCompare = `:${key}`;
        if (baseURL.indexOf(keyCompare) !== -1) {
            baseURL = baseURL.replace(keyCompare, pathParams[key]);
        }
    }

    // handle multipart
    if (!disableHandleMultipart) {
        if (options.headers['Content-Type'] === 'multipart/form-data') {
            let formData = new FormData();
            Object.keys(data).map((item) => {
                formData.append(item, data[item]);
            });

            data = formData;
        }
    }
    // ...
    return axiosInstance.request({
        method,
        baseURL,
        headers,
        params,
        data,
        cancelToken,
        responseType,
    });
};

export { sendRequest };
