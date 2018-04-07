let Programme = require('../model/Programme');

const insertProgramme = (doc) => {
    return new Promise((resolve, reject) => {
        let programme = new Programme(doc);
        programme.save((err, result) => {
            err && reject(err);
            resolve(result);
        });
    });
};

const insertProgrammes = (docs) => {
    return new Promise(async (resolve, reject) => {
        try {
            await docs.forEach(async (doc) => {
                await new Programme(doc).save();
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

const getProgramme = (query) => {
    return new Promise(async (resolve, reject) => {
        Programme.findOne(query, (err, result) => {
            err && reject(err);
            resolve(result);
        });
    });
};

const getAllProgramme = (query, projection, sort, page = 1, size = 10) => {
    return new Promise(async (resolve, reject) => {
        Programme
            .find(query || {}, {__v: 0, ...projection})
            .sort({pubDate: -1, ...(sort || {})})
            .skip(Number((page - 1) * size))
            .limit(Number(size))
            .exec((err, result) => {
                err && reject(err);
                resolve(result);
            });
    });
};

const getCount = (query) => {
    return new Promise(async (resolve, reject) => {
        Programme
            .where(query)
            .count((err, result) => {
                err && reject(err);
                resolve(result);
            });
    });
};

module.exports = {
    insertProgramme,
    insertProgrammes,
    getAllProgramme,
    getProgramme,
    getCount,
};