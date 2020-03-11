const low = require('lowdb');
const fs = require('fs');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

module.exports = (project = '') => {
  const ideaPath = path.join(project, '.blueberry');
  try{
    fs.statSync(ideaPath).isDirectory();
  }catch(e) {
    fs.mkdirSync(ideaPath);
  }
  const adapter = new FileSync(path.join(project, '.blueberry/db.json'));
  const db = low(adapter);
  return db;
};