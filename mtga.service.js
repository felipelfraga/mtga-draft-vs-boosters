const http = require('./http.service.js');

const RARE = 'Rare'
const MYTHIC = 'Mythic'

exports.getBoosterCount = function (setName, userCookie) {
  return http.fetchJSON('https://mtgahelper.com/api/User/Collection', userCookie)
          .then(collection => collection.inventory.boosters.find(booster => booster.set == setName).count);
}

exports.getMissingAmounts = (setName, userCookie) => {
  return http.fetchJSON('https://mtgahelper.com/api/User/Collection/Missing', userCookie)
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
  return http.fetchJSON('https://mtgahelper.com/api/Misc/Sets')
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


