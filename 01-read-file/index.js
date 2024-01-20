const FS = require('fs');
const PATH = require('path');
const STREAM = FS.createReadStream(PATH.join(__dirname, 'text.txt'), 'utf-8');

let arg = '';

STREAM.on('data', (chunk) => {
  arg += chunk;
});

STREAM.on('end', () => {
  console.log(arg);
});

STREAM.on('error', (error) => {
  console.error(error.message);
});
