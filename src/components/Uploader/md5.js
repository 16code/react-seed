import SparkMD5 from 'spark-md5';

export default function getFileMD5(file, cb) {
    let chunkIndex = 0;
    const blobSlice = File.prototype.slice;
    const chunkSize = 5 * 1024 * 1024;                
    const chunkTotal = Math.ceil(file.size / chunkSize);
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const chunks = [];
    fileReader.onload = e => {
        // console.log('read chunk nr', chunkIndex + 1, 'of', chunkTotal);
        spark.append(e.target.result);  
        chunkIndex++;
        if (chunkIndex < chunkTotal) {
            loadNext();
        } else {
            cb(null, {
                md5: spark.end(),
                chunks
            });
        }
    };
    fileReader.onerror = function () {
        cb('oops, something went wrong.');
    };
    function loadNext() {
        const startByts = chunkIndex * chunkSize;
        const endByts = ((startByts + chunkSize) >= file.size) ? file.size : startByts + chunkSize;
        const chunk = blobSlice.call(file, startByts, endByts);
        chunks.push(chunk);
        fileReader.readAsArrayBuffer(chunk);
    }
    loadNext();
}
