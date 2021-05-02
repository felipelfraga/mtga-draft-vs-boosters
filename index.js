let mtga = require('./mtga-service.js');
let calculator = require('./calculator-service.js');

const https = require('https');

var url = 'https://mtgahelper.com/api/Misc/Cards';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
        'Cookie': 'cookie'
    }
};

let args = process.argv.slice(2);
let setName = args[0]; 

if (!setName) {
  console.log('Set name is required')
  process.exit(1);
}

let amountInSetForRares = mtga.getSetTotals(setName);
let amountOwnedBoosters = mtga.getBoosterCount(setName);
let calculatorInputForRares = {
  amountInSet: amountInSetForRares.rares,
  amountInCollection: amountInSetForRares.rares - mtga.getMissingAmounts(setName).rares,
  amountNewCardsPerDraft: 2.5,
  averageAmountBoosterRewardPerDraft: 1.35,
  amountOwnedBoosters: amountOwnedBoosters
}

let calculatorInputForMythics = {
  amountInSet: amountInSetForRares.mythics,
  amountInCollection: amountInSetForRares.mythics - mtga.getMissingAmounts(setName).mythics,
  amountNewCardsPerDraft: 0.5,
  averageAmountBoosterRewardPerDraft: 1.35,
  amountOwnedBoosters: amountOwnedBoosters
}

let draftsRequired = {
  rares: calculator.draftsNeededForRares(calculatorInputForRares),
  mythics: calculator.draftsNeededForMythics(calculatorInputForMythics)
}

console.log('Drafts required: %s', draftsRequired);
