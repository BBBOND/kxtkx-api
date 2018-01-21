let mongoose = require('mongoose');

let Programme = mongoose.model('Programme', new mongoose.Schema({
    title: String,
    description: String,
    summary: String,
    pubDate: Date,
    link: String,
    author: String,
    categories: String,
    duration: String,
    mediaUrl: String,
    size: Number,
    type: String,
}));

module.exports = Programme;