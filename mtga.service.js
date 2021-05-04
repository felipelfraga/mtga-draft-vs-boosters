const https = require('https');
var readline = require('readline');

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36';
let userCookie = '';

const RARE = 'Rare'
const MYTHIC = 'Mythic'

function fetch(url, cookie) {
  return new Promise((resolve, reject) => {
    let options;
    if (cookie) {
      options = {
        headers: {
          'User-Agent': userAgent,
          'Cookie': cookie
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

function setCookies(res) {
  options.cookie = res.raw.headers['set-cookie'].reduce((concatenated, cookie) => concatenated.concat('; ').concat(cookie));
}

function concatCookies(res) {
  return res.raw.headers['set-cookie'].reduce((concatenated, cookie) => concatenated.concat('; ').concat(cookie));
}

exports.signIn = function(user, password) {
  return fetch('https://mtgahelper.com/api/Account', userCookie)
          .then(res => JSON.parse(res.data))
          .then(account => new Promise((resolve, reject) => {
            if (account.isAuthenticated) {
              console.log(">>>>> is authenticated")
              resolve();
              return;
            }
            fetch('https://mtgahelper.com/api/User/Register')
              .then(concatCookies)
              .then(cookies => {

                console.log(">>>>> signing in");

                fetch('https://mtgahelper.com/api/Account/Signin?email=' + user.replace('@', '%40') + '&password=' + password, cookies)
                  .then(concatCookies)
                  .then(cookies => userCookie = cookies)
                  .then(resolve)
                  .catch(error => reject(error));
              });
          }))

}

exports.getBoosterCount = function (setName) {
  return fetch('https://mtgahelper.com/api/User/Collection', userCookie)
          .then(res => JSON.parse(res.data))
          .then(collection => collection.inventory.boosters.find(booster => booster.set == setName).count);
}

exports.getMissingAmounts = (setName) => {
  return fetch('https://mtgahelper.com/api/User/Collection/Missing', userCookie)
          .then(res => JSON.parse(res.data))
          .then(cardsMissing => {
            let missingAmounts = {
              rares: 0,
              mythics: 0
            }

            cardsMissing.cardsMissing.forEach(missingCard => {
              if (missingCard.set == setName && missingCard.notInBooster == false) {
                if (missingCard.rarity == RARE) {
                  missingAmounts.rares = missingAmounts.rares + missingCard.amount;
                } else if (missingCard.rarity == MYTHIC) {
                  missingAmounts.mythics = missingAmounts.mythics + missingCard.amount;
                }
              }
            });

            return missingAmounts;
          });
}

exports.getSetTotals = function (setName) {
  return fetch('https://mtgahelper.com/api/Misc/Sets')
          .then(res => JSON.parse(res.data))
          .then(sets => {
            let amountInSet = {
              rares: 0,
              mythics: 0
            }

            sets.sets.filter(set => {
              return set.name == setName;
            }).forEach(set => {
              if (set.rarity == RARE) {
                amountInSet.rares = set.totalCards * 4;
              } else if (set.rarity == MYTHIC) {
                amountInSet.mythics = set.totalCards * 4;
              }
            });

            return amountInSet;
          });
}
