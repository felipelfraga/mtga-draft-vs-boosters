const readline = require('readline');

exports.prompt = function(question, secret) {
    return new Promise((resolve, reject) => {

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });

        if (secret) {
          rl.stdoutMuted = true;

          rl._writeToOutput = function _writeToOutput(stringToWrite) {
            if (rl.stdoutMuted && stringToWrite != '\r\n' &&  stringToWrite != '\n' && stringToWrite != '\r')
              rl.output.write("*");
            else
              rl.output.write(stringToWrite);
          };
            
        }
    });
}