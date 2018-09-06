/* eslint no-console:off */
const { Decoder } = require('./lib/ebml.js');

const ebmlDecoder = new Decoder();
const counts = {};

require('fs')
  .createReadStream('media/test.webm')
  .pipe(ebmlDecoder)
  .on('data', chunk => {
    const { name } = chunk[1];
    if (!counts[name]) {
      counts[name] = 0;
    }
    counts[name] += 1;
  })
  .on('finish', () => console.log(counts));
