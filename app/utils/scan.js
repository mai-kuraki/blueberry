const fs = require('fs');
const path = require('path');

module.exports = {
  do: url => {
    const isDir = p => fs.statSync(p).isDirectory();
    const isFile = p => fs.statSync(p).isFile();
    const dirs = [];
    const loop = (url, arr) => {
      const title = path.basename(url);
      if(isFile(url)) {
        const ext = path.extname(url);
        arr.push({
          title,
          key: url,
          type: 'file',
          ext
        });
      }else if(isDir(url)){
        const files = fs.readdirSync(url);
        const children = [];
        files.forEach(o => loop(path.join(url, o), children));
        arr.push({
          title,
          key: url,
          type: 'dir',
          children
        });
      }
      return arr;
    }
    return loop(url, dirs);
  }
};