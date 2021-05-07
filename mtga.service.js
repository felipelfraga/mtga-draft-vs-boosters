const https = require('https');
var readline = require('readline');
const cookiesRepository = require('./cookies.repository.js');

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36';

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

function concatCookies(res) {
  return res.raw.headers['set-cookie'].reduce((concatenated, cookie) => concatenated.concat('; ').concat(cookie));
}

function assertCurrentCookieIsValid(account, cookies) {
  if (account.isAuthenticated) {
    console.log(">>>>> valid user cookie was found! \\o/");
    return cookies;
  } else {
   throw new Error('valid-cookie-unavailable', 'Invalid Cookie');
  }
}

function fetchValidCookie(user, password, cookies) {
  console.log(">>>>> signing in...");
  return fetch('https://mtgahelper.com/api/Account/Signin?email=' + user.replace('@', '%40') + '&password=' + password, cookies)
    .then(concatCookies)
    .then(cookies => {
      cookiesRepository.store(cookies);
      console.log(">>>>> signed in successfully!");
      return cookies;
    });
}

function onValidCookieUnavailable(user, password, error) {
  if (error.code !== 'ENOENT' && error.name !== 'valid-cookie-unavailable') {
    console.log(error);
  }
  console.log('>>>>> Unable to use existing cookie. Attempting to aquire new one. =(');
  return fetch('https://mtgahelper.com/api/User/Register')
            .then(concatCookies)
            .then(cookies => fetchValidCookie(user, password, cookies));

}

exports.signIn = function(user, password) {
  return cookiesRepository
    .load()
    .then(cookies => fetch('https://mtgahelper.com/api/Account', cookies)
                       .then(res => JSON.parse(res.data))
                       .then(account => assertCurrentCookieIsValid(account, cookies)))
    .catch(error => onValidCookieUnavailable(user, password, error));
}

exports.getBoosterCount = function (setName, userCookie) {
  return fetch('https://mtgahelper.com/api/User/Collection', userCookie)
          .then(res => JSON.parse(res.data))
          .then(collection => collection.inventory.boosters.find(booster => booster.set == setName).count);
}

exports.getMissingAmounts = (setName, userCookie) => {
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


