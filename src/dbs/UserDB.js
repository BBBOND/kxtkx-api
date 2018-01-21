let User = require('../model/User');

const getUser = ({openId, id}) => {
    return new Promise((resolve, reject) => {
        let query = {};
        if (openId) query.openId = openId;
        if (id) query._id = id;
        User
            .findOne(query, {__v: 0, openId: 0}, (err, result) => {
                err && reject(err);
                resolve(result);
            });
    });
};

const addUser = (user) => {
    return new Promise((resolve, reject) => {
        let query = {};
        if (user.openId) query.openId = user.openId;
        if (user._id) query._id = user._id;
        User
            .where(query)
            .count((err, count) => {
                err && reject(err);
                if (count > 0) {
                    User
                        .findOneAndUpdate(query, user, (err, result) => {
                            err && reject(err);
                            resolve(result);
                        });
                } else {
                    user.firstAuthTime = user.timestamp;
                    let u = new User(user);
                    u.save((err, result) => {
                        err && reject(err);
                        resolve(result);
                    });
                }
            })
    });
};

const updateProfile = (id, user) => {
    return new Promise((resolve, reject) => {
        User
            .where({_id: id})
            .count((err, count) => {
                err && reject(err);
                if (count > 0) {
                    User.findOneAndUpdate({_id: id}, user, (err, result) => {
                        err && reject(err);
                        resolve(result);
                    });
                } else {
                    reject(new Error('不存在此用户'))
                }
            })
    });
};

module.exports = {
    getUser,
    addUser,
    updateProfile,
};