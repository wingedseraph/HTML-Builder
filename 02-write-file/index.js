const FS = require('fs');
const READLINE = require('readline');

const FILEPATH = './02-write-file/output.txt';
const WRITESTREAM = FS.createWriteStream(FILEPATH, { flags: 'a' });

const RL = READLINE.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

RL.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    WRITESTREAM.end();
    RL.close();
    console.log('\nprocess terminated by user (exit). goodbye!');
  } else {
    WRITESTREAM.write(input + '\n');
  }
});

WRITESTREAM.on('close', () => {
  RL.close();
});

process.on('SIGINT', () => {
  WRITESTREAM.end();
  console.log('\nprocess terminated by user (ctrl + c). goodbye!');
  process.exit();
});

console.log('welcome! enter text, type "exit" to terminate.');
