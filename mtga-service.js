'use strict';

const https = require('https');

let options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
    'Cookie': 'ARRAffinity=92d5e9d425c8d913178af7476667e0b99396eadd18ba42196fb8ac8650f3a73d; ARRAffinitySameSite=92d5e9d425c8d913178af7476667e0b99396eadd18ba42196fb8ac8650f3a73d; _ga=GA1.2.294324276.1619295433; _gid=GA1.2.1624598197.1619823403; userId=c6af3dd9b12e4757a104dacac9de5e4d; userEmail=felipefraga%40gmail.com; idsrv.session=_EUeVDzI6Xsmqqeyx_NXnQ; idsrv=CfDJ8JxNtljkKC5NuHThgQ8GRJTBdk185TId4VQm3b5BQP3KLdTlrI0WaW9Azpi5oAEsL7a0-pdA8zKzZGNzPCGcMVecOPG4m_GxCDtVsh-mNfgHNs9GgATL3o5-mhWp8_SW6D5MQ5lCoBK5V8HyUMmI7LAF9h6al_fXXSm1CJVUfRszuJC6DOZpMXNCpt1SHWo2Q8och1esHOX1RiwK6Bd02fV-PVfCqQV5HtZ8PoIBV_DpZvyhZeaoagf8K7qvSqMMrUTkcyv3IcSZh6uQaoaJ_IrwWvJj_hblD44-MlDPyrvFuTNDfh_ff0oamkRSA4Hs0b7jTEwU9V7wo2DmROsZ7lov2wOnQySt2pesvc7pHeC7WXb-DUcTqAL985nliR71V2oSJvqgDMFGCnTKnRIDDHj3evd16ISR4hdqucsyVVle55wKSY2Zk5lh0luf75lMQYQgqsnQ6Uv-76cCS-ggS1vQnrp_LMghy3mUVCXNnSv5h-5ypfVzexbuknt4PjQiKc3AQj6qADguqwE_L21UR5w; _gat_gtag_UA_137512649_1=1'
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
