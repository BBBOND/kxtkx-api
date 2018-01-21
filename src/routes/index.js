require('../utils/MongoDBOpenHelper');

let express = require('express');
let router = express.Router();
let debug = require('debug')('kxtkx:server');
let ProgrammeDB = require('../dbs/ProgrammeDB');
let UserDB = require('../dbs/UserDB');
let moment = require('moment');
let WXBizDataCrypt = require('../utils/WXBizDataCrypt');
let {wxConfig} = require('../../config');
let request = require('request');

const parseData2User = (date) => ({
    openId: date.openId,
    nickName: date.nickName,
    gender: date.gender,
    language: date.language,
    city: date.city,
    province: date.province,
    country: date.country,
    avatarUrl: date.avatarUrl,
    timestamp: date.watermark.timestamp
});

const sendResponse = async (data, res) => {
    try {
        if (typeof data === 'function') {
            res.send(await data());
        } else {
            res.send(await data);
        }
    } catch (e) {
        res.send({code: 500, msg: e.message})
    }
};

/** ================== router ================== **/

/**
 * 条件搜索
 */
router.get('/search', async (req, res) => {
    debug(req.method, req.url, moment().format('YYYY-MM-DD HH:mm:ss:SS'));
    let {search, page = 1, size = 10, categories, type, dateSort = -1} = req.query;
    let query = {};
    if (search) query['$or'] = [{title: {$regex: search || ''}}, {description: {$regex: search || ''}}];
    if (categories) query['categories'] = {$regex: categories || ''};
    if (type) query['type'] = {$regex: type || ''};
    try {
        let data = await ProgrammeDB.getAllProgramme(query, {}, {pubDate: dateSort}, page, size);
        let count = await ProgrammeDB.getCount(query);
        await sendResponse(async () => ({
            isLast: page * size >= count,
            page,
            size: data.length,
            count: count,
            data: data
        }), res);
    } catch (e) {
        debug('e: ', e.message);
        await sendResponse({code: 500, msg: e.message}, res);
    }
    res.end();
});

/**
 * 按条件获取数量
 */
router.get('/count', async (req, res) => {
    debug(req.method, req.url, moment().format('YYYY-MM-DD HH:mm:ss:SS'));
    await sendResponse({
        count: await ProgrammeDB.getCount({...req.query})
    }, res);
    res.end();
});

/**
 * 认证用户
 */
router.post('/auth', async (req, res) => {
    debug(req.method, req.url, moment().format('YYYY-MM-DD HH:mm:ss:SS'));
    let {code, encryptedData, iv} = req.body;
    if (code && encryptedData && iv) {
        let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxConfig.appId}&secret=${wxConfig.appSecret}&js_code=${code}&grant_type=authorization_code`;
        request.get(url, {}, async (err, httpResponse, body) => {
            if (err) {
                debug('err: ', err.message);
                await sendResponse({code: 500, msg: err.message}, res);
            } else {
                body = JSON.parse(body);
                if (body.errcode) {
                    debug('body.errmsg: ', body.errmsg);
                    await sendResponse({code: body.errcode, msg: body.errmsg}, res);
                } else {
                    try {
                        let pc = new WXBizDataCrypt(wxConfig.appId, body.session_key);
                        let data = pc.decryptData(encryptedData, iv);
                        let user = parseData2User(data);
                        debug('auth: ', JSON.stringify(user));
                        await UserDB.addUser(user);
                        let u = await UserDB.getUser({openId: user.openId});
                        await sendResponse(u, res);
                    } catch (e) {
                        debug('e: ', e.message);
                        await sendResponse({code: 500, msg: e.message}, res);
                    }
                }
            }
            res.end();
        })
    } else {
        await sendResponse({code: 500, msg: '参数异常'}, res);
        res.end();
    }
});

/**
 * 通过id获取用户信息
 */
router.post('/userInfo', async (req, res) => {
    debug(req.method, req.url, moment().format('YYYY-MM-DD HH:mm:ss:SS'));
    let {id} = req.body;
    if (id) {
        await sendResponse(UserDB.getUser({id}), res);
    } else {
        await sendResponse({code: 500, msg: '参数异常'}, res);
        res.end();
    }
});

/**
 * 更新用户信息
 * k_name，k_signature，k_birthday三个字段
 */
router.put('/updateProfile', async (req, res) => {
    debug(req.method, req.url, moment().format('YYYY-MM-DD HH:mm:ss:SS'));
    let {id, profile} = req.body;
    if (id && profile) {
        try {
            await UserDB.updateProfile(id, {
                k_name: profile.k_name,
                k_signature: profile.k_signature,
                k_birthday: profile.k_birthday
            });
            await sendResponse(UserDB.getUser({id}), res);
        } catch (e) {
            await sendResponse({code: 500, msg: e.message || '未知错误'}, res);
        }
    } else {
        await sendResponse({code: 500, msg: '参数异常'}, res);
    }
    res.end();
});

module.exports = router;