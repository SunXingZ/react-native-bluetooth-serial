const _ = require('lodash');

function isChinese(word) {
    const charCode = word.charCodeAt(0);
    return !(charCode >= 0 && charCode <= 128)
}

function getWordLength(word) {
    return isChinese(word) ? 2 : 1;
}

function getWordsLength(words) {
    return _.reduce(words, (m, v) => m + getWordLength(v), 0);
}

function getSpace(len) {
    return _.times(len, () => ' ').join('');
}

/**
* 一个将字符串转换为 16 进制的方法
* @param {*} str 转换 16 进制的字符串
*/
const stringToHex = (str) => {
    let val = ''
    for (let i = 0; i < str.length; i++) {
        if (val === '') {
            val = str.charCodeAt(i).toString(16)
        } else {
            val += ' ' + str.charCodeAt(i).toString(16)
        }
    }
    return val
}

/**
 * 字符串转bytes数组
 * @param {*} str 
 */
const stringToByte = (str) => {
    const bytes = new Array();
    let len = str.length;
    let c = "";
    for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

/**
 * 字节数组转字符串
 * @param {*} byte 
 */
const byteToString = (byte) => {
    if (typeof byte === 'string') {
        return byte;
    }
    let str = '';
    let _byte = byte;
    for (let i = 0; i < _byte.length; i++) {
        const one = _byte[i].toString(2);
        const v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            const bytesLength = v[0].length;
            let store = _byte[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _byte[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_byte[i]);
        }
    }
    return str;
}

export {
    isChinese,
    getWordLength,
    getWordsLength,
    getSpace,
    stringToHex,
    stringToByte,
    byteToString
}