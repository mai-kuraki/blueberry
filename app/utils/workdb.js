const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

module.exports = (project = '') => {
  const adapter = new FileSync(path.join(project, '.idea/db.json'));
  const db = low(adapter);
  return db;
};