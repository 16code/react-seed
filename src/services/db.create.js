const toString = Object.prototype.toString;
const idObject = o => toString.call(o) === '[object Object]';
export class Database {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.request = indexedDB.open(this.dbName, version);
    }
    init = (storeName, option) => {
        this.storeName = storeName;
        option = idObject(option) ? option : { storeConfig: {}, indexConfig: { unique: true } };
        this.request.onerror = () => {
            console.log('打开数据库失败');
        };
        this.request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(this.storeName)) {
                const store = db.createObjectStore(this.storeName, { ...option.storeConfig });
                const { indexName, indexKey, unique } = option.indexConfig || {};
                if (indexName && indexKey) {
                    store.createIndex(indexName, indexKey, { unique });
                }
                console.log('创建对象仓库成功');
            } else {
                console.log('已找到对象仓库', this.storeName);
            }
        };
        this.request.onsuccess = event => {
            console.log('连接数据库成功');
            this.db = event.target.result;
        };
        return this;
    };
    put = data => {
        const req = this.store.put(data);
        return new Promise((resolve, reject) => {
            req.onsuccess = resolve;
            req.onerror = reject;
        });
    };
    get = key => {
        const idIndex = this.store.index('idIndex');
        const req = key ? idIndex.get(key) : idIndex.getAll();
        return new Promise((resolve, reject) => {
            req.onsuccess = event => {
                resolve(event.target.result);
            };
            req.onerror = reject;
        });
    };
    delete = id => {
        const req = this.store.delete(id);
        return new Promise((resolve, reject) => {
            req.onsuccess = resolve;
            req.onerror = reject;
        });
    };
    close = () => {
        this.db.close();
    };
    clear = () => {
        this.store.clear();
    };
    deleteDB = () => {
        indexedDB.deleteDatabase(this.dbName);
    };
    get store() {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        return store;
    }
}

export default Database;
