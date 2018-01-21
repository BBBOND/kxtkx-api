let mongoose = require('mongoose');

let User = mongoose.model('User', new mongoose.Schema({
    openId: String,
    nickName: String,
    gender: Number,
    language: String,
    city: String,
    province: String,
    country: String,
    avatarUrl: String,
    timestamp: Number,
    firstAuthTime: Number,

    k_name: String,
    k_signature: String,
    k_birthday: String
}));

module.exports = User;