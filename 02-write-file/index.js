
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const file = fs.createWriteStream(path.join(__dirname, "text.txt"));

const onFinish = () => {
  file.close();
  readInterface.close();
console.log("Noooo, don't leave me, we're not done yet (sad)");
  process.exit(0);
};

const readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (() => {
  const lastInputs = [];

  const getQuestion = () => {
    if (!lastInputs.length) {
      return 'Please enter something';
    }

    const last = lastInputs[lastInputs.length - 1];
    if (last.length === 0) {
      return 'Ah, that was mean... you can do better!';
    }
    if (last.length < 10) {
      return 'It was quite short... I know you have something longer to enter (wink)';
    }

    const beforeLast = lastInputs[lastInputs.length - 2];
    if (beforeLast) {
      if (beforeLast.length < 10 && last.length < 20) {
        return "You're doing great! But you can do it even better!";
      }
    }
    if (last.length < 20) {
      return 'It was quite good, but I know you have something longer to enter (wink)';
    }
    if (lastInputs.length > 5 && Math.random() > 0.3) {
      return 'You seem to love it!';
    }

    const options = [
      "Yeah, that's right",
      "Please don't stop!",
      'Wow, that was something!',
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (cb) => {
    readInterface.question(getQuestion() + '\n', (userInput) => {
      lastInputs.push(userInput);
      cb(userInput);
    });
  };
})();

const readUserInput = () => {
  prompt((userInput) => {
    if (userInput === 'exit') {
      onFinish();
      return;
    }
    file.write(userInput + '\n');
    readUserInput();
  });
};

readInterface.on('SIGINT', onFinish);

console.log("Hey there! Let's have some fun!\n");
readUserInput();

