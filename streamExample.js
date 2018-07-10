/* eslint no-console:off */
const ebml = require('./index.js');
const ebmlDecoder = new ebml.Decoder();
const counts = {};

require('fs')
    .createReadStream('media/test.webm')
    .pipe(ebmlDecoder)
    .on('data', chunk => {
        const name = chunk[1].name;
        if (!counts[name]) {
            counts[name] = 0;
        }
        counts[name] += 1;
    })
    .on('finish', () => console.log(counts));
