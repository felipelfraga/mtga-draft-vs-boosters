const readline = require('readline');

exports.prompt = function(question) {
    return new Promise((resolve, reject) => {

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
          });
          
    });
}