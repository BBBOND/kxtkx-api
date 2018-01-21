/**
 * 增
 * @param schema
 * @param doc
 * @return {Promise<any>}
 */
const insert = (schema, doc) => {
    return new Promise((resolve, reject) => {
        let s = new schema(doc);
        s.save((err, result) => {
            err && reject(err);
            resolve(result);
        });
    });
};

/**
 * 增（list）
 * @param schema
 * @param docs
 * @return {Promise<any>}
 */
const insertList = (schema, docs) => {
    return new Promise(async (resolve, reject) => {
        try {
            await docs.forEach(async (doc) => {
                await new schema(doc).save();
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * 删
 * @param schema
 * @param query
 */
const del = (schema, query) => {
    return new Promise(async (resolve, reject) => {
        schema.findOneAndRemove(query, (err, result) => {
            err && reject(err);
            resolve(result);
        })
    });
};

/**
 * 改
 * @param schema
 * @param query
 * @param doc
 */
const update = (schema, query, doc) => {
    return new Promise(async (resolve, reject) => {
        schema.findOneAndUpdate(query, doc, (err, result) => {
            err && reject(err);
            resolve(result);
        })
    });
};

/**
 * 查
 * @param schema
 * @param projection
 * @param query
 * @param groupBy
 * @param orderBy
 * @param limit
 */
const query = (schema, projection, query, groupBy, orderBy, limit) => {
    return new Promise(async (resolve, reject) => {
        // schema.find(query, projection);
        //
        // schema.find(query, (err, result) => {
        //     err && reject(err);
        //     resolve(result);
        // })
    });
};

module.exports = {
    insert,
    insertList,
    del,
    update,
    query,
};