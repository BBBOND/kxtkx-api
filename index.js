let http = require('http');
let fs = require('fs');
let FeedParser = require('feedparser');
let ProgrammeDB = require('./src/dbs/ProgrammeDB');
let feedParser = new FeedParser();

let req = http.get('http://www.kexuetuokouxiu.com/feed', (res) => {
    const {statusCode, statusMessage} = res;
    if (statusCode === 200) {
        res.setEncoding('utf8');
        // let fWriter = fs.createWriteStream('./kxtkx');
        // res.pipe(fWriter);
        res.pipe(feedParser);
    } else {
        console.log(`${statusCode}: ${statusMessage}`);
    }
});
req.on('error', (err) => {
    console.log(err);
});

feedParser.on('error', (err) => {
    console.log(err);
});

const parser2Json = (item) => {
    let programme = {};
    programme.title = item.title || '';
    programme.description = item.description && item.description.replace(/(\r\n)|(\n)/g, '') || '';
    programme.summary = item.summary || '';
    programme.pubDate = new Date(item.pubDate);
    programme.link = item.link || '';
    programme.author = item.author || '';
    programme.categories = item.categories[0] || '';
    if (item.enclosures[0]) {
        programme.duration = item['itunes:duration'] && item['itunes:duration']['#'] || '';
        programme.mediaUrl = item.enclosures[0].url || '';
        programme.size = item.enclosures[0].length || 0;
        programme.type = 'media';
    } else {
        programme.type = 'article';
    }
    return programme;
};

let programmeList = [];

feedParser.on('readable', () => {
    let item;
    while (item = feedParser.read()) {
        programmeList.push(parser2Json(item));
    }
});

feedParser.on('end', async () => {
    // fs.writeFile('./kxtkx.json', JSON.stringify(programmeList), () => {
    //     console.log('文件写入完成');
    // });

    try {
        await ProgrammeDB.insertProgrammes(programmeList);
        console.log('保存成功');
        ProgrammeDB.close();
    } catch (e) {
        console.log(e.message);
    }
});