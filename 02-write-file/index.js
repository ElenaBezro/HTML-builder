const fs = require("fs");
const path = require("path");
const readline = require("readline");

const file = fs.createWriteStream(path.join(__dirname, "text.txt"));

const onFinish = () => {
  file.close();
  readInterface.close();
  console.log("Ok buddy, we're done here! cya ;)");
  process.exit(0);
};

const readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readUserInput = () => {
  readInterface.question("Hah?\n", (userInput) => {
    if (userInput === "exit") {
      onFinish();
      return;
    }
    file.write(userInput + "\n");
    readUserInput();
  });
};

readInterface.on("SIGINT", onFinish);

console.log("Hey buddy! Let's have some fun");
readUserInput();
