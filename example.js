/* eslint no-console:off */
const fs = require('fs');
const { Decoder } = require('./lib/ebml.js');

const decoder = new Decoder();

decoder.on('data', chunk => console.log(chunk));

fs.readFile('media/test.webm', (err, data) => {
  if (err) {
    throw err;
  }
  decoder.write(data);
});
