/* eslint-disable no-unused-vars */

import getFileMD5 from './md5';
import RequestDecorator from './requestDecorator';
const getPercent = (loaded, total) => +(loaded / total).toFixed(0);

export default class UploadService {
    constructor(opts) {
        this.options = Object.assign({ maxFileLimit: 10, autoUpload: true }, opts);
        this.addedFileNames = {};
        this.queueFiles = [];
    }
    addFile = files => {
        const { maxFileLimit, autoUpload } = this.options;
        if (this.queueFiles.length + files.length > maxFileLimit) {
            return Promise.reject('文件上传数量已超过本次上传最大数量限制');
        }
        return new Promise((resolve, reject) => {
            const notAddedFiles = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = file.name;
                if (!this.addedFileNames[fileName]) {
                    this.addedFileNames[fileName] = { progress: 0, progressOfChunks: [] };
                    file.uuid = uuid('file');
                    this.queueFiles.push(file);
                } else {
                    notAddedFiles.push(fileName);
                }
            }
            if (notAddedFiles.length) {
                reject(notAddedFiles);
            } else {
                resolve(this.queueFiles);
                if (autoUpload) {
                    this.uploadQueueFiles();
                }
            }
        });
    };
    uploadQueueFiles = () => {
        this.queueFiles.forEach(this.uploadFile);
    };
    uploadFile = file => {
        getFileMD5(file, async (err, { md5, chunks }) => {
            if (!err) {
                const chunkTotal = chunks.length;
                const fileName = file.name;
                const fileSize = file.size;
                const uuid = file.uuid;
                // 服务器已存在的chunk
                let existChunks = [];
                const { data: response } = await this.checkFile(md5, chunkTotal).catch(err => {
                    console.log(err);
                });
                if (response && (Array.isArray(response.existChunks) && response.existChunks.length)) {
                    existChunks = response.existChunks.map(c => +c);
                }
                const requestInstance = new RequestDecorator({
                    maxLimit: 5,
                    requestApi: this.upload
                });
                const promises = [];
                const data = {
                    uuid,
                    md5,
                    fileName,
                    fileSize,
                    chunkTotal
                };
                const thatFile = this.addedFileNames[fileName];
                for (const [index, chunk] of chunks.entries()) {
                    const chunkIndex = index + 1;
                    const chunkSize = chunk.size;
                    let p = 0;
                    if (!existChunks.includes(chunkIndex)) {
                        const request = requestInstance.request(chunk, { ...data, chunkIndex, chunkSize });
                        promises.push(request);
                    } else {
                        p = 100;
                    }
                    thatFile.progressOfChunks[index] = p;
                }
                thatFile.fileSize = fileSize;
                const loaded = thatFile.progressOfChunks.reduce((a, b) => a + b, 0);
                thatFile.progress = getPercent(loaded, chunkTotal);
                this.handlePromisedQueue(promises);
                console.log(thatFile);

                chunks = null;
            }
        });
    };
    handlePromisedQueue = async promises => {
        const data = await Promise.all(promises).catch(error => {
            console.log(error);
        });
        if (data) {
            console.log(data);
        }
    };
    onUploadSuccess = result => {
        console.log('result', result);
        return result;
    };
    onUploadError = (chunk, index, error) => {
        console.log('error', error);
        console.log('chunk', chunk);
        console.log('index', index);
    };
    upload = (blob, data) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        fd.append('blob', blob);
        Object.keys(data).forEach(key => {
            fd.append(key, data[key]);
        });
        xhr.multipart = true;
        const fileName = data.fileName;
        const fileSize = data.fileSize;
        const chunkIndex = data.chunkIndex;
        const chunkTotal = data.chunkTotal;
        const thatFile = this.addedFileNames[fileName];
        xhr.upload.onprogress = event => {
            if (event.lengthComputable) {
                const uuid = data.uuid;
                thatFile.progressOfChunks[chunkIndex - 1] = +((event.loaded / event.total) * 100).toFixed(0);
                const loaded = thatFile.progressOfChunks.reduce((a, b) => a + b, 0);
                thatFile.progress = getPercent(loaded, chunkTotal);
                document.getElementById(uuid).getElementsByClassName('progress')[0].innerText = thatFile.progress;
            }
        };
        xhr.onreadystatechange = () => {
            const { readyState, status } = xhr;
            if (readyState === 4) {
                const responseText = xhr.responseText;
                let jsonResponse;
                try {
                    jsonResponse = JSON.parse(responseText);
                } catch (error) {
                    jsonResponse = { code: status, message: '不能处理响应数据' };
                }
                if (status === 200 && jsonResponse && +jsonResponse.code === 200) {
                    resolve(jsonResponse.data);
                } else {
                    reject(jsonResponse);
                }
            }
        };
        xhr.open('POST', '//localhost:3000/api/sliceUpload', true);
        xhr.send(fd);
    });
    checkFile = async (md5, chunkTotal) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `//localhost:3000/api/sliceUpload/check?md5=${md5}&chunkTotal=${chunkTotal}`, true);
        xhr.onreadystatechange = () => {
            const { readyState, status } = xhr;
            if (readyState === 4) {
                const responseText = xhr.responseText;
                let jsonResponse;
                try {
                    jsonResponse = JSON.parse(responseText);
                } catch (error) {
                    jsonResponse = { code: status, message: '不能处理响应数据' };
                }
                if (status === 200 && jsonResponse && +jsonResponse.code === 200) {
                    resolve(jsonResponse);
                } else {
                    reject(jsonResponse);
                }
            }
        };
        xhr.send(null);
    });
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
