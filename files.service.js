const fs = require('fs')
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;

exports.storeData = function (path, data) {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

exports.storeData2 = function (path, data) {
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


          

  // return new Promise((resolve, reject) => {
  //   console.log(getDirName(path));
  //   mkdirp(getDirName(path), (err) => {
  //     if (err) reject(err);
  //     fs.writeFile(path, data, () => resolve());
  //   });  
  // });
}

exports.loadData = function (path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  } catch (err) {
    console.error(err)
    return false
  }
}

exports.loadData2 = function(path) {
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
