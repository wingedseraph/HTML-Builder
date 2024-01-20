const FS = require('fs');
const PATH = require('path');
const STREAM = FS.createReadStream(PATH.join(__dirname, 'text.txt'), 'utf-8');

let arg = '';

STREAM.on('data', (chunk) => {
  arg += chunk;
});

STREAM.on('end', (code) => {
  console.log(arg);
  // console.log('stream closed');
  console.log(code);
  // STREAM.close();
});

STREAM.on('error', (error) => {
  console.error(error.message);
});
