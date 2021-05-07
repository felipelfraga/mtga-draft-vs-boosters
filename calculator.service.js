// Original article for calculations
//https://www.mtggoldfish.com/articles/collecting-mtg-arena-part-1-of-2

// For Rares:
// For Mythics:
// D = (T - P*7/8*11/12 - R)/(N+W*7/8*11/12)
// D = (T - P*1/8*11/12 - R)/(N+W*1/8*11/12)
// [Ref. MtgGoldfish]
// For Rares
// T =	256
// P =	19
// R =	12
// N =	2.5
// W =	1.35
// For Mythics
// T =	80
// P =	19
// R =	3
// N =	0.5
// W =	1.35
// D	Number of drafts you still need to do
// T	Total number of [Rares/Mythics] in a set you need to collect
// P	Total number of reward packs of that set already in your collection
// R	Total number of [Rares/Mythics] of that set already in your collection
// N	Number of "new" [Rares/Mythics] you pull from a draft on average (Higher earlier, lesser later, but an average across the set is fine.)
// W	Average number of reward packs from doing the draft

const GLOBAL_ADJUSTMENT = 11/12;
const RARES_ADJUSTMENT = (7/8)*GLOBAL_ADJUSTMENT;
const MYTHICS_ADJUSTMENT = (1/8)*GLOBAL_ADJUSTMENT;


/**
 * @typedef {Object} Input
 * @property {number} input.amountInSet - The total amount of cards that exists in the targeted set
 * @property {number} input.amountInCollection - The total amount of cards already owned by the user
 * @property {number} input.amountNewCardsPerDraft - The average cards aquired per draft session
 * @property {number} input.averageAmountBoosterRewardPerDraft - The average amount of boosters rewarded per draft session
 * @property {number} input.amountOwnedBoosters - The amount of boosters already owned by the user
 */

/**
 * 
 * @param {Input} - The calculation required parameters
 * @returns The drafts needed before start opening boosters for collecting all rare cards
 */
exports.draftsNeededForRares = function(input) {
  return draftsNeeded(input, RARES_ADJUSTMENT)
}  

/**
 * 
 * @param {Input} - The calculation required parameters
 * @returns The drafts needed before start opening boosters for collecting all mythic cards
 */
exports.draftsNeededForMythics = function(input) {
  return draftsNeeded(input, MYTHICS_ADJUSTMENT)
}

const draftsNeeded = function(input, adjustment) {
  return (input.amountInSet - input.amountOwnedBoosters*adjustment - input.amountInCollection)/(input.amountNewCardsPerDraft+input.averageAmountBoosterRewardPerDraft*adjustment)
}
