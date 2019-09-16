export function validator(files, accept, maxFileSize = 0) {
    let error = null;
    for (const file of files) {
        const { type, name, size } = file;
        if (accept && accept !== '') {
            const fileExt = name.split('.').pop();
            const accepts = accept.replace(/\s+/g, '').split(',');
            if (!accepts.includes(type) && !accepts.includes(`.${fileExt}`)) {
                error = new Error('选中的文件类型, 不在允许文件类型范围内');
                break;
            }
        }
        if (maxFileSize > 0 && size > maxFileSize) {
            error = new Error('选中的文件尺寸, 不在允许上传的尺寸范围内');
            break;
        }
    }
    return error;
}

export function uuid(prefix = 'uuid') {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') d += performance.now();
    return `${prefix}-xxxxxxxx-xxxx-9xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
        const r = ((d + Math.random()) * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

export const delay = ms =>
    new Promise(res => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            res();
        }, ms);
    });

export class RequestThrottle {
    constructor({ maxLimit = 5, maxRetry, requestApi }) {
        this.maxLimit = maxLimit;
        this.maxRetry = maxRetry;
        this.retryCounts = {};
        this.requestQueue = [];
        this.currentRequestCount = 0;
        this.requestApi = requestApi;
    }
    async request(...args) {
        if (this.currentRequestCount >= this.maxLimit) await this.blockRequesting();
        const uuid = args[0].uuid;
        if (!this.retryCounts[uuid]) this.retryCounts[uuid] = 1;
        try {
            this.currentRequestCount++;
            const result = await this.requestApi(...args);
            delete this.retryCounts[uuid];
            return Promise.resolve(result);
        } catch (error) {
            if (this.maxRetry && this.retryCounts[uuid] < this.maxRetry) {
                this.retryCounts[uuid]++;
                await delay(5000);
                return this.request(...args);
            }
            return Promise.reject(error);
        } finally {
            await delay(1500);
            this.currentRequestCount--;
            this.nextTick();
        }
    }
    blockRequesting() {
        let theResolve;
        const thePromise = new Promise(resolve => (theResolve = resolve));
        this.requestQueue.push(theResolve);
        return thePromise;
    }
    nextTick() {
        if (this.requestQueue.length <= 0) return;
        const theResolve = this.requestQueue.shift();
        theResolve();
    }
}

export function xhrUpload(endPoint, data, onCreate, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.multipart = true;
        onCreate && onCreate(xhr);
        const uploadStartTime = Date.now();
        if (onProgress) xhr.upload.onprogress = onProgress.bind(null, uploadStartTime);
        xhr.onreadystatechange = () => {
            const { readyState, status, statusText } = xhr;
            if (readyState === 4) {
                const response = safeJsonParser(xhr.responseText, status, statusText);
                response.status = status;
                if (response.status === 200 && +response.code === 200) {
                    resolve(response.data);
                } else {
                    reject(response);
                }
            }
        };
        xhr.open('POST', endPoint, true);
        xhr.send(data);
    });
}
export function safeJsonParser(res, status, statusText) {
    let jsonResponse;
    try {
        jsonResponse = JSON.parse(res);
    } catch (error) {
        const errorInfo = { code: status };
        if (status && status >= 500) {
            errorInfo.message = statusText;
        } else {
            errorInfo.message = '不能处理响应数据';
        }
        jsonResponse = errorInfo;
    }
    return jsonResponse;
}

export function updateFileById(id, list = [], data) {
    for (const item of list) {
        if (item.uuid === id) {
            Object.assign(item, data);
            break;
        }
    }
    return list;
}

export function fileSizeFormat(bytes, si = true) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) return `${bytes} B`;
    const units = si
        ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return `${bytes.toFixed(1)} ${units[u]}`;
}

export function timeFormat(time) {
    const hour = ~~(time / 3600);
    const minute = ~~((time % 3600) / 60);
    const seconds = ~~time % 60;
    let result = '';
    if (hour > 0) result += `${hour} 小时 `;
    if (minute > 0) result += `${minute} 分钟 `;
    if (hour < 1 && minute < 1) result += `${seconds} 秒`;
    return result;
}

export const templates = {
    uploadProgress: '{{speed}}/s - {{loaded}} of {{total}}, 还剩 {{estimated}}',
    parse(template, data = {}) {
        const output =
            this[template] &&
            this[template].replace(/({{[a-zA-Z]*}})/g, function($1) {
                const key = $1.replace(/[{{}}]/g, '');
                return data[key];
            });
        return output;
    }
};
