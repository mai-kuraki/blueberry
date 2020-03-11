const path = require('path');
const Logger = require('../utils/logger');
const copydir = require('copy-dir');
const Scan = require('../utils/scan');
const child_process = require('child_process');
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
    const { path: dirPath } = arg;
    const { __baseDir } = global.config;
    const cp = child_process.fork(path.join(__baseDir, 'worker/scanFile.js'));
    cp.on('message', (ev) => {
      cp.disconnect();
      e.reply(WIN_SCAN_PROJECT_REPLY, {
        data: ev || [],
        path: dirPath
      })
    });
    cp.send(dirPath);
  }
};
