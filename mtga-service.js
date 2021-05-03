'use strict';

const https = require('https');

let options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
    'Cookie': ''
  }
};

const RARE = 'Rare'
const MYTHIC = 'Mythic'

exports.getMissingAmounts = (setName) => {
  return new Promise((resolve, reject) => {
    https.get('https://mtgahelper.com/api/User/Collection/Missing', options, (res) => {
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
        console.log('Retrieved missing cards data.');
  
        let missingAmounts = {
          rares: 0,
          mythics: 0
        }
  
        let cardsMissing = JSON.parse(data);
        cardsMissing.cardsMissing.forEach(missingCard => {
  
          if (missingCard.set == setName && missingCard.notInBooster == false) {
            if (missingCard.rarity == RARE) {
              missingAmounts.rares = missingAmounts.rares + missingCard.amount;
            } else if (missingCard.rarity == MYTHIC) {
              missingAmounts.mythics = missingAmounts.mythics + missingCard.amount;
            }
          }
        });
  
        resolve(missingAmounts);
      });
    });  
  })

}

exports.getBoosterCount = function (setName) {
  return new Promise((resolve, reject) => {
    https.get('https://mtgahelper.com/api/User/Collection', options, (res) => {
      
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
        console.log('Retrieved the collection data.');
        let collection = JSON.parse(data);
        resolve(collection.inventory.boosters.find(booster => booster.set == setName).count);

      });
    });  
  })

}

exports.getSetTotals = function (setName) {
  return new Promise((resolve, reject) => {
    https.get('https://mtgahelper.com/api/Misc/Sets', options, (res) => {
      
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
        console.log('Retrieved the sets data.');
        let sets = JSON.parse(data);

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
        
        resolve(amountInSet);

      });
    });  
  })
}
