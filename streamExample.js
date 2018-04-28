var ebml = require('./index.js');
var ebmlDecoder = new ebml.Decoder();
var counts = {};
require('fs').createReadStream('media/test.webm').
    pipe(ebmlDecoder).
    on('data', function(chunk) {
        var name = chunk[1].name;
        if (!counts[name]) {
            counts[name] = 0;
        }
        counts[name] += 1;
    }).
    on('finish', function() {
        console.log(counts);
    });
