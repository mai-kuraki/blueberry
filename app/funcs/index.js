const fs = require('fs');
const path = require('path');
const Logger = require('../utils/logger');
const copydir = require('copy-dir');
const {
  WIN_UPDATECONFIG_REPLY,
  WIN_COPY_TEMPLATE_REPLY
} = require('../consts/event');

module.exports = {
  updateConfig: (e, arg) => {
    const { __baseDir } = global.config;
    const configPath = path.join(__baseDir, 'settings/config.json');
    if(!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify({
        ...arg
      }, null, 2), {
        flag: 'w+'
      })
      e.reply(WIN_UPDATECONFIG_REPLY, {
        success: true,
      });
    }else {
      const data = fs.readFileSync(configPath);
      if(data) {
        const jsonStr = data.toString();
        try{
          const json = JSON.parse(jsonStr);
          fs.writeFileSync(configPath, JSON.stringify({
            ...json,
            ...arg
          }, null, 2));
          e.reply(WIN_UPDATECONFIG_REPLY, {
            success: true,
          });
        }catch(e) {
          Logger.error(e);
          e.reply(WIN_UPDATECONFIG_REPLY, {
            success: false,
            error: 'File is illegal'
          })
        }
      }
    }
  },
  copyTemplate: (e, arg) => {
    const { dir } = arg
    const { __baseDir } = global.config;
    const from = path.join(__baseDir, 'frameTemplate');
    copydir.sync(from, dir);
    e.reply(WIN_COPY_TEMPLATE_REPLY, {
      success: true,
    });
  }
};
