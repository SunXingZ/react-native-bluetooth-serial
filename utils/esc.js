import * as Util from "./utils";

// https://www.jianshu.com/p/d07f71ad830d

const _ = require('lodash');

const Common = {
  INIT: "1B 40",//初始化

  ALIGN_LEFT: "1B 61 00",//左对齐
  ALIGN_RIGHT: "1B 61 02",//居右对齐
  ALIGN_CENTER: "1B 61 01",//居中对齐

  UNDER_LINE: "1C 2D 01",//下划线

  PRINT_AND_NEW_LINE: "0A",//打印并换行

  FONT_SMALL: "1B 4D 01",//小号字体 9x17
  FONT_NORMAL: "1B 4D 00",//正常 12x24
  FONT_BOLD: "1B 45 01",//粗体
  FONT_BIG: "1D 21 01 10", // 字体加大

  FONT_HEIGHT_TIMES: '1B 21 10',
  FONT_WIDTH_TIMES: '1B 21 20',
  FONT_HEIGHT_WIDTH_TIMES: '1B 21 30',

  CUT_PAPER: '1D 56 42 15', // 走纸并切纸

  SOUND: "1B 42 02 02" // 蜂鸣 2次/100ms
};

const Config = {
  wordNumber: 48 // 可打印的字数，对应58mm纸张; 48 对应 80mm
};

let writeTextToDevice, writeHexToDevice;

const _setBT = (bt) => {
  writeTextToDevice = bt.writeTextToDevice;
  writeHexToDevice = bt.writeHexToDevice;
}

const setConfig = (config) => {
  Object.assign(Config, config);
}

/**
* 打印左右格式的方案
* @param {*} left 打印左侧的字符
* @param {*} right 打印右侧的字符
* @param {*} wordNumber 打印字符的总长度
*/
const leftRight = (left, right, wordNumber = Config.wordNumber) => {
  return left + Util.getSpace(wordNumber - Util.getWordsLength(left) - Util.getWordsLength(right)) + right
}

/**
* 打印左中右格式的方案
* @param {*} left 左侧的打印字符
* @param {*} center 中间的打印字符
* @param {*} right 右侧的打印字符
* @param {*} wordNumber 打印字符的总长度
*/
const leftCenterRight = (left, center, right, wordNumber = Config.wordNumber) => {
  const spaceLen = Util.getSpace((wordNumber - Util.getWordsLength(left) - Util.getWordsLength(center) - Util.getWordsLength(right)) / 4)
  return left + spaceLen + center + spaceLen + right
}

const keyValue = (name, value, wordNumber = Config.wordNumber) => {
  const nameLen = Util.getWordsLength(name);
  let vArr = [], temp = '';
  _.each(value, (v, i) => {
    const tvLen = Util.getWordsLength(temp + v);
    const diff = tvLen - (wordNumber - nameLen);
    if (diff <= 0) {
      temp += v;
      if (i === value.length - 1) {
        vArr.push(temp);
      }
    } else {
      if (Util.isChinese(v) && diff === 1) {
        temp += ' ';
      }
      vArr.push(temp);
      temp = v;
    }
  });
  return _.map(vArr, (v, i) => {
    if (i === 0) {
      return name + v;
    } else {
      return Util.getSpace(name.length) + v;
    }
  }).join('');
}

const getQrCodeHexString = (qrCode) => {
  let data = [], store_len = qrCode.length + 3, store_pL = store_len % 256, store_pH = store_len / 256;
  const modelQR = [0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00];
  const sizeQR = [0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x08];
  const errorQR = [0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31];
  const storeQR = [0x1d, 0x28, 0x6b, store_pL, store_pH, 0x31, 0x50, 0x30];
  const printQR = [0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30];
  data = byteMerger(modelQR, sizeQR);
  data = byteMerger(data, errorQR);
  data = byteMerger(data, storeQR);
  data = byteMerger(data, Util.stringToByte(qrCode));
  data = byteMerger(data, printQR);
  const byteString = Util.byteToString(data);
  return Util.stringToHex(byteString);
}

const byteMerger = (bytesA, bytesB) => {
  let bytes = bytesA.concat(bytesB);
  return bytes;
}

const ESC = {
  Config,
  Common,
  Util: {
    leftRight,
    leftCenterRight,
    keyValue,
  },
  _setBT,
  setConfig,

  // 初始化打印机
  init() {
    writeHexToDevice(Common.INIT);
  },

  // 打印并换行
  printAndNewLine() {
    writeHexToDevice(Common.PRINT_AND_NEW_LINE);
  },

  // 对齐方式
  alignLeft() {
    writeHexToDevice(Common.ALIGN_LEFT);
  },
  alignCenter() {
    writeHexToDevice(Common.ALIGN_CENTER);
  },
  alignRight() {
    writeHexToDevice(Common.ALIGN_RIGHT);
  },

  // 打印下划线
  underline() {
    writeHexToDevice(Common.UNDER_LINE);
  },

  // 字体设置
  fontSmall() {
    writeHexToDevice(Common.FONT_SMALL);
  },
  fontNormal() {
    writeHexToDevice(Common.FONT_NORMAL);
  },
  fontBold() {
    writeHexToDevice(Common.FONT_BOLD);
  },
  fontBig() {
    writeHexToDevice(Common.FONT_BIG);
  },

  fontHeightTimes() {
    writeHexToDevice(Common.FONT_HEIGHT_TIMES);
  },
  fontHeightTimes() {
    writeHexToDevice(Common.FONT_WIDTH_TIMES);
  },
  fontHeightTimes() {
    writeHexToDevice(Common.FONT_HEIGHT_WIDTH_TIMES);
  },

  // 打印文字
  text(str) {
    writeTextToDevice(str)
  },

  // 打印二维码
  printQRCode(str) {
    writeHexToDevice(getQrCodeHexString(str))
  },

  // 走纸并切纸
  cutPaper() {
    writeHexToDevice(Common.CUT_PAPER);
  },

  /**
  * 蜂鸣
  */
  sound() {
    writeHexToDevice(Common.SOUND);
  }
};

export default ESC;