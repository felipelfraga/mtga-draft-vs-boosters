const https = require('https');

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36';

exports.fetch = function(url, cookies) {
    return new Promise((resolve, reject) => {
      let options;
      if (cookies) {
        options = {
          headers: {
            'User-Agent': userAgent,
            'Cookie': cookies
          }
        }
      } else {
        options = {
          headers: {
            'User-Agent': userAgent,
          }
        }
      }
  
      https.get(url, options, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(Error(`Did not get an OK from the server. Code: ${res.statusCode}`));
          return;
        }
    
        let data = '';
    
        res.on('data', (chunk) => {
          data += chunk;
        });
    
        res.on('close', () => {
          console.log('[success] %s', url);
          resolve({
            'data': data,
            'raw': res
          });
        });
      });
    })
  }
  
exports.fetchJSON = function(url, cookies) {
    return exports.fetch(url, cookies).then(res => JSON.parse(res.data));
}
  