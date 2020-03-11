const fs = require('fs');
const path = require('path');

module.exports = {
  do: url => {
    const ignoreDir = [
      '.blueberry',
      'node_modules',
      '.git'
    ]
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
        if(ignoreDir.indexOf(title) > -1) return arr;
        const files = fs.readdirSync(url);
        let children = [];
        files.forEach(o => loop(path.join(url, o), children));
        children.sort((a, b) => {
          const aTitle = a.title.toUpperCase();
          const bTitle = b.title.toUpperCase();
          if(a.type === b.type) {
            if(a.title < b.title) return -1;
            if(aTitle > bTitle) return 1;
          }else if(a.type === 'dir') {
            return -1;
          }else if(a.type === 'file') {
            return 1;
          }
          return 0;
        })
        arr.unshift({
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