
const Scan = require('../utils/scan');

process.on('message', (path) => {
  const dirs = Scan.do(path);
  process.send(dirs);
});