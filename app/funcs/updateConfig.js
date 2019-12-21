const fs = require('fs');
const path = require('path');
const Logger = require('../utils/logger');
const {
  WIN_UPDATECONFIG_REPLY
} = require('../../consts/event');

module.exports = (e, arg) => {
  const { dir } = arg;
  const { __baseDir } = global.config;
  const configPath = path.join(__baseDir, 'settings/config.json');
  if(!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({
      workspace: dir
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
        json.workspace = dir;
        fs.writeFileSync(configPath, JSON.stringify(json, null, 2));
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
}