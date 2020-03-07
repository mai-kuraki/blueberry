const path = require('path');
const Logger = require('../utils/logger');
const copydir = require('copy-dir');
const Scan = require('../utils/scan');
const {
  WIN_COPY_TEMPLATE_REPLY,
  WIN_SCAN_PROJECT_REPLY
} = require('../consts/event');

module.exports = {
  copyTemplate: (e, arg) => {
    const { dir } = arg
    const { __baseDir } = global.config;
    const from = path.join(__baseDir, 'frameTemplate');
    copydir.sync(from, dir);
    e.reply(WIN_COPY_TEMPLATE_REPLY, {
      success: true,
    });
  },
  openDev: () => {
    const { mainWindow } = global;
    if(!mainWindow) return;
    mainWindow.webContents.openDevTools();
  },
  scanProject: (e, arg) => {
    const { path } = arg;
    const dirs = Scan.do(path);
    e.reply(WIN_SCAN_PROJECT_REPLY, {
      data: dirs || [],
      path
    })
  }
};
