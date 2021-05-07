const fs = require('fs')
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;


exports.storeData = function (path, data) {
  return mkdirp(getDirName(path))
          .then(() => new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(data), (res) => {
              if (res instanceof Error) {
                reject(res);
                return;
              }
              resolve();
            })
          }));
}

exports.loadData = function(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (!data || err) {
        reject(err)
      } else {
        resolve(JSON.parse(data));
      }
    });
  });

}
