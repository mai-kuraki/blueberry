const fs = require('fs');
const path = require('path');
const { BrowserWindow } = require('electron');

module.exports = () => {
  const { __baseDir } = global.config;
  if(fs.existsSync(path.join(__baseDir, 'settings/dev.json'))) {
    const data = fs.readFileSync(path.join(__baseDir, 'settings/dev.json'));
    if(data) {
      const jsonStr = data.toString();
      try{
        const json = JSON.parse(jsonStr);
        json.reactDevToolSrc && BrowserWindow.addDevToolsExtension(json.reactDevToolSrc);
        json.reduxDevToolSrc && BrowserWindow.addDevToolsExtension(json.reduxDevToolSrc);
      }catch(e) {
        console.log(e)
      }
    }
  }
}