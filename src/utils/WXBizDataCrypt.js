let crypto = require('crypto');

function WXBizDataCrypt(appId, sessionKey) {
    this.appId = appId;
    this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
    // base64 decode
    let decoded;
    let sessionKey = new Buffer(this.sessionKey, 'base64');
    encryptedData = new Buffer(encryptedData, 'base64');
    iv = new Buffer(iv, 'base64');

    try {
        // 解密
        let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
        // 设置自动 padding 为 true，删除填充补位
        decipher.setAutoPadding(true);
        decoded = decipher.update(encryptedData, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        decoded = JSON.parse(decoded)
    } catch (err) {
        throw new Error('Illegal Buffer')
    }

    if (decoded.watermark.appid !== this.appId) {
        throw new Error('Illegal Buffer')
    }
    return decoded

};

// let encryptedData = "+VptHchPDST5XD8odOTn4Ent71heEhGPlRXkD1RoorcuJ88onW+4Ixk4KLbMdnBwLMXlKAbVhfh/3Ig0EzKNOrRm9zAc3ivYEBYMrkWsCXBxR+sH/Q1aXycR7jYpku2gWfPfXuY4ZWxKslaLjlHhUNbZ/yk22rtNSqxWPneUPC2QTSRt1DrPEvdBm/KOgm+ZovnmsrQemGRF5THqjpjUznZht/iA8uiILWGwB2d66GU6NOh5aDOK3BkdUII3KPOcL5XeA/BCBv0tTlbYRl6RtorFj/UHE8M9cfEwydxAat1Jk71FIP+jBCOV5GNACq2h5FnbjB5nvEly8f5dxu35oMkA0DBwaUFA0GDtIG83q4BMCWb0SLdwBOtYs9TlV0hnvvZqulUb5gVQiDfd3MJHodklitVU+zlDPYdbJLPuewbHQuPhj5eaBuWeL6KMAfeF5RozoheGGnAKpAmbyslfXw==";
// let iv = "x+vixc5hQTDV5bYqko+i9w==";
// let appId = 'wx333c3b621a877665';
// let sessionKey = '78ceb64310fe66baff76f705ceb46d87';

// let appId = 'wx333c3b621a877665';
// let sessionKey = "O6fnMOjlSQu3EPj+2Uq9Nw==";
// let encryptedData = "KuqUdZuPjXEYNu8lJH3d0jtEK8qjO95Annh6uxRPUc2EYN3rR3EShSibWZslvdQy9TpIyvgMOBjdUPqTl+PvbWzLGL1dc9ZQ0Tqo/XxQB+FGCIgn1ifBo/RRnX8Hi/Ryz+O0qsfc0qnLVjUTBzuJO2Q8JVulPNz/NEz7nTjzvEzX6qHSe/try5GuOWVP5mIas50pF3N2tnsOJt1ZTbJlZ4D8Xny7/TCKCYTAOFNx2T5dvWiGOY+th/hn2X9NqKa4ULn3sWoT65aKBYezI4twa3dy6JUgr/gF3DM1r+uCGNhBkqD4InyVlbORtELj+exGV3/8qyWOHEqPoFXs/y8nFhE5+iLTKiB2+psBf35qiPgvJxnA+yZkZX9UUFe/lXlbLQyK5BWQMxPlOIiBKX/TYYnc1AsoVT0lU2Z4YjG4gKQQI8EgiLZFHpIJZQlZGp63aPbUPFRzpHWMFG7UUVGqDg==";
// let iv = "N/Y+JFLfgGEKo8k7UIWjGQ==";
//
// let pc = new WXBizDataCrypt(appId, sessionKey);
// let data = pc.decryptData(encryptedData, iv);
// console.log(data);

module.exports = WXBizDataCrypt;
