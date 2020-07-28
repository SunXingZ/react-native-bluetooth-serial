import * as Util from "./utils";

const _ = require('lodash');

// https://www.docin.com/p-248730840.html 指令文档

let writeTextToDevice;

function _setBT(bt) {
  writeTextToDevice = bt.writeTextToDevice;
}

let Config = {
  width: 70,
  height: 60,
  gap: 0,
  direction: 0,
  referenceX: 10,
  referenceY: 10
};

const TSC = {
  _setBT,
  config(con) {
    Object.assign(Config, con);
  },
  /**
   * 设置卷标纸的宽度及长度
   * @param {number} width 
   * @param {number} height 
   */
  size(width, height) {
    writeTextToDevice(`SIZE ${width} mm, ${height} mm\r\n`);
  },
  /**
   * 设置两张卷标纸间的垂直间距距离
   * @param {number} g 
   */
  gap(g) {
    writeTextToDevice(`GAP ${g} mm\r\n`);
  },
  /**
   * 设置打印的出纸方向
   * @param {number} dir 0或1
   */
  direction(dir = 0) {
    writeTextToDevice(`DIRECTION ${dir}\r\n`);
  },
  /**
   * 设置卷标的参考坐标原点
   * @param {number} x 
   * @param {number} y 
   */
  reference(x = 0, y = 0) {
    writeTextToDevice(`REFERENCE ${x},${y}\r\n`);
  },
  /**
   * 清除影像缓冲区的数据
   */
  cls() {
    writeTextToDevice(`CLS \r\n`);
  },

  init() {
    TSC.size(Config.width, Config.height);
    TSC.gap(Config.gap);
    TSC.direction(Config.direction);
    TSC.reference(Config.referenceX, Config.referenceY);
    TSC.cls();
  },

  text(x, y, text, x_times = 1, y_times = 1) {
    writeTextToDevice(`TEXT ${x},${y},"TSS24.BF2",0,${x_times},${y_times},"${text}"\r\n`)
  },
  print(times = 1) {
    writeTextToDevice(`PRINT ${times}\r\n`);
  },
  sound(times = 2, time = 100) {
    writeTextToDevice(`SOUND ${times},${time}\r\n`);
  },
  drawBox(x_start, y_start, x_end, y_end, line_thickness) {
    writeTextToDevice(`BOX ${x_start},${y_start},${x_end},${y_end},${line_thickness}\r\n`);
  },
  drawBar(x, y, width, height) {
    writeTextToDevice(`BAR ${x},${y},${width},${height}\r\n`);
  },
  drawBarCode(x, y, height, barcode_content) {
    writeTextToDevice(`BARCODE ${x},${y},"128",${height},1,0,3,3,"${barcode_content}"\r\n`)
  },
  drawQrcode(x, y, ecc_level, cell_width, mode, rotation, qrcode_content) {
    writeTextToDevice(`QRCODE ${x},${y},${ecc_level},${cell_width},${mode},${rotation},"${qrcode_content}"\r\n`)
  }
};

export default TSC;