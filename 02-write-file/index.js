const FS = require('fs');
const READLINE = require('readline');
const PATH = require('path');

// const FILE_PATH = './02-write-file/output.txt';
const FILE_PATH = PATH.join(__dirname, 'output.txt');
const WRITE_STREAM = FS.createWriteStream(FILE_PATH, { flags: 'a' });

const RL = READLINE.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

RL.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    WRITE_STREAM.end();
    RL.close();
    console.log('\nprocess terminated by user (exit). goodbye!');
  } else {
    WRITE_STREAM.write(input + '\n');
  }
});

WRITE_STREAM.on('close', () => {
  RL.close();
});

process.on('SIGINT', () => {
  WRITE_STREAM.end();
  console.log('\nprocess terminated by user (ctrl + c). goodbye!');
  process.exit();
});

console.log('welcome! enter text, type "exit" to terminate.');
