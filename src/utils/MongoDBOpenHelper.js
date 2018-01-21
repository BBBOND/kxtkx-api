let f = require('util').format;
let {mongoConfig} = require('../../config');
let mongoose = require('mongoose');
let URL = f('mongodb://%s:%s@%s:27017/kxtkx?authMechanism=%s', mongoConfig.user, mongoConfig.password, mongoConfig.url, mongoConfig.authMechanism);
let options = {
    promiseLibrary: require('bluebird'),
    useMongoClient: true,
    server: {
        autoReconnect: true,
        poolSize: 10
    }
};
mongoose.Promise = global.Promise;

class MongoDBOpenHelper {
    constructor() {
        this.connect();
    }

    /**
     * 连接数据库
     * @param url
     */
    connect(url = URL) {
        mongoose.connect(url, options);
    }

    /**
     * 断开连接
     */
    close() {
        mongoose.disconnect();
    }
}

module.exports = new MongoDBOpenHelper();