/// <reference path="./index.d.ts" />

import axios from 'axios';
const CancelToken = axios.CancelToken;

const requestInstance = createInstance({
    baseURL: '//localhost:3000',
    responseEncoding: 'utf8',
    validateStatus: status => status >= 200 && status < 300
});
const regex = /(:\w+)/g;
function request(url, options = {}) {
    const baseOptions = {
        url,
        method: 'GET',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8'
        }
    };
    const mergedOptions = Object.assign({}, baseOptions, options);
    if (mergedOptions.body) {
        mergedOptions.data = mergedOptions.body;
        mergedOptions.url = url.replace(regex, $1 => {
            const ss = $1.replace(/:/, '');
            return mergedOptions.data[ss];
        });
        delete mergedOptions.body;
    }
    if (options.getCancel) {
        const source = CancelToken.source();
        mergedOptions.getCancel(source.cancel);
        mergedOptions.cancelToken = source.token;
    }
    return requestInstance(mergedOptions);
}

request.setHeader = function(headers) {
    if (!isObject(headers)) throw Error('参数必须是一个对象');
    for (const key in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, key)) {
            requestInstance.defaults.headers.common[key] = headers[key];
        }
    }
};
requestInstance.interceptors.response.use(response => ({ ...response.data.data }));

export default request;

function createInstance(option) {
    return axios.create(option);
}

function isObject(o) {
    return o && Object.prototype.toString.call(o) === '[object Object]';
}
