/// <reference path="./index.d.ts" />

import axios from 'axios';

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

export default request;

function createInstance(option) {
    return axios.create(option);
}

function isObject(o) {
    return o && Object.prototype.toString.call(o) === '[object Object]';
}
