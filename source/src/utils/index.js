import qs from 'query-string';
import { DATE_SHORT_MONTH_FORMAT, DEFAULT_FORMAT, THEMES } from '@constants';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import moment from 'moment/moment';
import axios from 'axios';
import { showErrorMessage } from '@services/notifyService';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const convertGlobImportToObject = (modules) =>
    modules
        .filter((module) => !!module.default)
        .reduce(
            (rs, cur) => ({
                ...rs,
                [cur.default.name]: cur.default,
            }),
            {},
        );

export const convertGlobImportToArray = (modules) =>
    modules.filter((module) => !!module.default).map((module) => module.default);

export const destructCamelCaseString = (string) => {
    const arrString = [ ...string ];
    const newArrString = [];
    arrString.forEach((char, index) => {
        if (char.charCodeAt(0) > 90) {
            newArrString.push(char);
        } else {
            index && newArrString.push('-');
            newArrString.push(char.toLowerCase());
        }
    });
    return newArrString.join('');
};

export const getBrowserTheme = () => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return isDark ? THEMES.DARK : THEMES.LIGHT;
};

export const makeURL = (baseURL, params, pathParams) => {
    for (let key of Object.keys(pathParams || {})) {
        const keyCompare = `:${key}`;
        if (baseURL.indexOf(keyCompare) !== -1) {
            baseURL = baseURL.replace(keyCompare, pathParams[key]);
        }
    }

    if (params) {
        baseURL = baseURL + '?' + qs.stringify(params);
    }

    return baseURL;
};

export const parseURL = (url) => {
    try {
        return new URL(url);
    } catch (error) {
        return '';
    }
};

export const getYTEmbedLinkFromYTWatchLink = (watchLink) => {
    if (!watchLink) {
        return '';
    }

    const { v } = qs.parse(parseURL(watchLink).search);
    return v ? `https://www.youtube.com/embed/${v}?autoplay=1&mute=1` : watchLink;
};

export const getYoutubeVideoID = (url) => {
    let pattern = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    return pattern.exec(url)?.[3];
};

export const formatNumber = (value, setting) => {
    if (value) {
        const decimalPosition = value.toString().indexOf('.');
        if (decimalPosition > 0) {
            const intVal = value.toString().substring(0, decimalPosition);
            const decimalVal = value.toString().substring(decimalPosition + 1);
            return `${intVal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimalVal}`;
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (value === 0) return 0;
    return '';
};

export const formatDateString = (dateString, formatDate = DATE_SHORT_MONTH_FORMAT) => {
    if (!dateString) return '';
    return dayjs(dateString).format(formatDate);
};

export const removeAccents = (str) => {
    if (str)
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    return str;
};

export const validateUsernameForm = (rule, username) => {
    return /^[a-z0-9_]+$/.exec(username)
        ? Promise.resolve()
        : Promise.reject('Username chỉ bao gồm các ký tự a-z, 0-9, _');
};

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

export const moveArrayElement = (arr = [], from, to) => {
    if (!Array.isArray(arr)) throw new Error('The first argument must be an array.');

    const copy = arr.slice();
    copy.splice(to, 0, copy.splice(from, 1)[0]);

    return copy;
};

export const parseHostAndPort = (url) => {
    if (!url) return { host: '', port: '' };

    const urlObj = new URL(url);
    const port = urlObj.port;
    urlObj.port = '';
    const host = urlObj.toString();

    return { host, port };
};

export const mergeHostAndPort = (host, port) => {
    if (!host) return '';

    const urlObj = new URL(host);
    urlObj.port = port;

    return urlObj.toString();
};

export const filterLanguage = (dataRow = []) => {
    if (!dataRow?.length) return '';

    let renderItem;
    dataRow.filter((item) => {
        if (item.languageId === '1') renderItem = item;
    });
    return renderItem || {};
};

export const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

export function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}

export function getStatusValue(initValue, publishDate, endDate) {
    const now = dayjs();
    const isPublicDateBeforeNow = publishDate && dayjs(publishDate).isSameOrBefore(now);
    const isEndDateAfterNow = endDate && dayjs(endDate).isSameOrAfter(now);
    if (initValue == 1 && (!publishDate || isPublicDateBeforeNow) && (!endDate || isEndDateAfterNow)) {
        return 1;
    }
    return 0;
}
export const convertUtcToLocalTime = (
    utcTime,
    inputFormat = DATE_SHORT_MONTH_FORMAT,
    format = DATE_SHORT_MONTH_FORMAT,
) => {
    try {
        if (utcTime) return moment(moment.utc(utcTime, inputFormat).toDate()).format(format);
        return '';
    } catch (err) {
        return '';
    }
};
export function convertUtcToIso(date) {
    return dayjs(convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT), DEFAULT_FORMAT);
}

export function downloadCSV(fileUrl, filename) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (xhr.status === 200) {
            var blob = xhr.response;
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }
    };
    xhr.send();
}

export function resizeImage(settings) {
    var file = settings.file;
    var maxSize = settings.maxSize;
    var targetSize = 500 * 1024; //500kb
    var reader = new FileReader();
    var image = new Image();
    var canvas = document.createElement('canvas');
    var dataURItoBlob = function (dataURI) {
        var bytes =
            dataURI.split(',')[0].indexOf('base64') >= 0
                ? atob(dataURI.split(',')[1])
                : unescape(dataURI.split(',')[1]);
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var max = bytes.length;
        var ia = new Uint8Array(max);
        for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
        return new Blob([ ia ], { type: mime });
    };

    var resize = function () {
        var width = image.width;
        var height = image.height;
        var currentSize = file.size;

        if (currentSize > targetSize) {
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        return dataURItoBlob(dataUrl);
    };
    return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
            no(new Error('Not an image'));
            return;
        }
        if (file.size < 1024) {
            // Ví dụ: 1KB là kích thước tối thiểu cho một ảnh hợp lệ
            no(new Error('The file is too small to be a valid image.'));
            return;
        }
        reader.onload = function (readerEvent) {
            image.onload = function () {
                return ok(resize());
            };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
}

export const generateVideoThumbnail = (file) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const video = document.createElement('video');

        // this is important
        video.autoplay = true;
        video.muted = true;
        video.src = URL.createObjectURL(file);

        video.onloadeddata = () => {
            const ctx = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            video.pause();

            setTimeout(() => {
                resolve(canvas.toDataURL('image/png'));
            }, 100);
        };
    });
};

export async function urlToFile(url, fileName = 'file') {
    try {
        const response = await axios.get(url, { responseType: 'blob' });

        // Tạo một đối tượng File từ dữ liệu Blob và tên tệp
        const file = new File([ response.data ], fileName, { type: response.data.type });

        return file;
    } catch (error) {
        console.error('Error converting URL to File:', error);
        throw error;
    }
}

export const handleGenThumbnail = async (videoUrl) => {
    try {
        const file = await urlToFile(videoUrl);
        const thumbnail = await generateVideoThumbnail(file);
        const response = await fetch(thumbnail);
        const thumbnailBlob = await response.blob();
        return thumbnailBlob;
    } catch (error) {
        console.error('Error generating or uploading thumbnail:', error);
        throw error; // Rethrow the error to propagate it further if needed
    }
};

export function getYoutubeThumbnail(url, quality) {
    if (url) {
        var video_id, result;
        if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
            video_id = result.pop();
        } else if ((result = url.match(/youtu.be\/(.{11})/))) {
            video_id = result.pop();
        }

        if (video_id) {
            if (typeof quality == 'undefined') {
                quality = 'high';
            }

            var quality_key = 'maxresdefault'; // Max quality
            if (quality == 'low') {
                quality_key = 'sddefault';
            } else if (quality == 'medium') {
                quality_key = 'mqdefault';
            } else if (quality == 'high') {
                quality_key = 'hqdefault';
            }

            var thumbnail = 'http://img.youtube.com/vi/' + video_id + '/' + quality_key + '.jpg';
            return thumbnail;
        }
    }
    return false;
}

export const fitString = (text = '', length) => {
    if (!text) return text;

    if (text.length < length) return text;
    else return `${text.slice(0, length)}...`;
};

export const sortArray = (array, key) => {
    return array.sort((a, b) => {
        if (a[key] < b[key]) {
            return -1;
        }
        if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });
};

export const checkEmpty = (_, value) => {
    if (value.trim() == 0) {
        return Promise.reject('The string contains invalid spaces.');
    }
    return Promise.resolve();
};

export function removeNullValues(obj) {
    // Duyệt qua tất cả các thuộc tính của đối tượng
    for (const key in obj) {
        // Nếu giá trị của thuộc tính là null, xóa thuộc tính đó
        if (obj[key] === null) {
            obj[key] = '';
        }
    }
    return obj;
}

export const beforeUpload = (file, size = 1) => {
    const maxFileSize = size * 1024 * 1024;
    const formatFile = [ 'png', 'jpg', 'jpeg' ];
    const lastDotIndex = file.name.lastIndexOf('.');

    const fileExtension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex + 1) : '';
    if (!formatFile.includes(fileExtension)) {
        showErrorMessage('Image should be in format JPEG, JPG, PNG!');
        return false;
    }
    if (file.size > maxFileSize) {
        showErrorMessage(`File must be less than ${size}MB!`);
        return false;
    }
    return true;
};

export const beforeUploadFile = (file, size = 1, formatFile = [ 'png', 'jpg', 'jpeg' ]) => {
    const maxFileSize = size * 1024 * 1024;
    const lastDotIndex = file.name.lastIndexOf('.');

    const fileExtension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex + 1) : '';
    const formattedString = formatFile.map((ext) => ext.toUpperCase()).join(', ');
    if (!formatFile.includes(fileExtension)) {
        showErrorMessage(`File should be in format ${formattedString}!`);
        return false;
    }
    if (file.size > maxFileSize) {
        showErrorMessage(`File must be less than ${size}MB!`);
        return false;
    }
    return true;
};

export const calculateMinute = (value) => {
    const minute = Math.round(value / 60);
    if (minute > 1) return `${minute} minute(s)`;
    else return `${value} second(s)`;
    // return true;
};
