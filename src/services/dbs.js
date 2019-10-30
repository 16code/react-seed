import DatabaseFactory from 'services/db.create';

const DB = new DatabaseFactory('Datebase', 1);

const history = DB.init('play_history', {
    storeConfig: {
        keyPath: 'id',
        autoIncrement: false
    },
    indexConfig: {
        indexName: 'idIndex',
        indexKey: 'id',
        unique: false
    }
});

export default { history };
