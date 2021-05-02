let files = require('./files.js')

const RARE = 'Rare'
const MYTHIC = 'Mythic'

exports.getMissingAmounts = function(setName) {
    let cardsMissing = files.loadData('data/missingCards.json');

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
    
}

exports.getBoosterCount = function(setName) {
  let collection = files.loadData('data/collection.json');
  let count = 0;
  collection.inventory.boosters.forEach(booster => {
    if (booster.set == setName) {
      count = booster.count;
      return;
    }
  });
  return count;
}

exports.getSetTotals = function(setName) {

  let amountInSet = {
    rares: 0,
    mythics: 0
  }

  let sets = files.loadData('data/sets.json');
  sets.sets.filter(set => {
    return set.name == setName;
  }).forEach(set => {
    if (set.rarity == RARE) {
      amountInSet.rares = set.totalCards*4;
    } else if (set.rarity == MYTHIC) {
      amountInSet.mythics = set.totalCards*4;
    }
  });

  return amountInSet;
}
