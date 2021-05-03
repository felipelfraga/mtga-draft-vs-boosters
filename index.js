'use strict';

let mtga = require('./mtga-service.js');
let calculator = require('./calculator-service.js');

let args = process.argv.slice(2);
let setName = args[0]; 

if (!setName) {
  console.log('Set name is required')
  process.exit(1);
}

Promise.all([mtga.getMissingAmounts(setName), mtga.getBoosterCount(setName), mtga.getSetTotals(setName)])
.then(results => {
  let calculatorInputForRares = {
    amountInSet: results[2].rares,
    amountInCollection: results[2].rares - results[0].rares,
    amountNewCardsPerDraft: 2.5,
    averageAmountBoosterRewardPerDraft: 1.35,
    amountOwnedBoosters: results[1]
  }
  let calculatorInputForMythics = {
    amountInSet: results[2].mythics,
    amountInCollection: results[2].mythics - results[0].mythics,
    amountNewCardsPerDraft: 0.5,
    averageAmountBoosterRewardPerDraft: 1.35,
    amountOwnedBoosters: results[1]
  }
  let draftsRequired = {
    rares: calculator.draftsNeededForRares(calculatorInputForRares),
    mythics: calculator.draftsNeededForMythics(calculatorInputForMythics)
  }
  
  console.log('Drafts required: %s', draftsRequired);
})
.catch(error => console.log(error));

