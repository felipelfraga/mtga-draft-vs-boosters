const files = require('./files.service.js');
const os = require('os');
 
const homeDir = os.homedir();

const userCookiesFilePath = homeDir + '/.mtga-draft-vs-boosters/user-cookies.json';

exports.load = function() {
    return files
        .loadData(userCookiesFilePath)
            .then(data => data.data);
}

exports.store = function(cookies) {
    return files.storeData(userCookiesFilePath, { data: cookies });
}
