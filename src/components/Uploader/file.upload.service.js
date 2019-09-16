import { RequestThrottle, xhrUpload, fileSizeFormat, timeFormat, delay } from './util';
import getFileMD5 from './md5';

export default class UploadService {
    instances = {};
    constructor(config = {}) {        
        this.option = config;        
        this.requestThrottle = new RequestThrottle({
            maxLimit: config.threads,
            maxRetry: config.maxRetry,
            requestApi: config.chunked ? this.sliceUpload : this.singleUpload
        });
    }
    throttledRequest(data) {
        const { onError, onSuccess } = this.option;
        this.requestThrottle.request(data).then(response => {
            onSuccess && onSuccess(data.uuid, response);
        }).catch(error => {
            onError(data.uuid, error);
        });
    }
    reUpload(file) {
        this.remove(file.uuid);
        this.throttledRequest(file);
    }
    addFile(files) {
        const { autoUpload, onFileAdded } = this.option;
        files.forEach(file => {
            const uuid = file.uuid;
            onFileAdded && onFileAdded(uuid);
            if (autoUpload) this.throttledRequest(file);
        });
    }
    singleUpload = async file => {
        await delay(500);
        const { fieldName, onProgress } = this.option;
        const fd = new FormData();
        const uuid = file.uuid;
        fd.append(fieldName, file);
        const url = `/api/upload?uuid=${uuid}`;
        const total = fileSizeFormat(file.size);
        let prevTime = Date.now();
        let prevLoadedSize = 0;
        return xhrUpload(url, fd, instance => {
            this.onCreate(uuid, instance);
        }, (uploadStartTime, event) => {            
            if (event.lengthComputable) {
                const loadedSize = event.loaded;
                const totalSize = event.total;
                const dataNow = Date.now();
                const useTime = (dataNow - prevTime) / 1000;   
                const speed = (loadedSize - prevLoadedSize) / useTime; // 每秒下载速度
                const estimated = ((totalSize - loadedSize) / speed); // 剩余时间
                const percent = parseFloat(((loadedSize / totalSize) * 100).toPrecision(2)); // 百分比    
                const correctedPercent = percent >= 100 ? 99.9 : percent; 
                prevTime = dataNow;
                prevLoadedSize = loadedSize;                
                onProgress && onProgress(uuid, {
                    percent: correctedPercent < 10 ? parseFloat((correctedPercent).toFixed(1)) : correctedPercent,
                    progressInfo: {
                        total,
                        loaded: fileSizeFormat(loadedSize),
                        speed: fileSizeFormat(speed),
                        estimated: timeFormat(estimated < 1 ? 1 : estimated)
                    }
                });
            }
        });
    }
    onCreate = (fileId, instance) => {
        if (!this.instances[fileId]) this.instances[fileId] = instance;
    }
    remove = fileId => {
        if (this.instances[fileId]) {
            this.instances[fileId].abort();
            delete this.instances[fileId];
        }
    }
    sliceUpload = file => {
        const { chunkSize } = this.option;
        console.log(chunkSize);
        
        getFileMD5(file, chunkSize, (err, { md5, chunks }) => {
            if (!err) {
                console.log(md5, chunks);
            }
        });
    }
}
