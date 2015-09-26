var ebml = require('./index.js');
var fs = require('fs');

var decoder = new ebml.Decoder();

decoder.on('data', function(chunk) {
    console.log(chunk);
});

fs.readFile('media/test.webm', function(err, data) {
    if (err)
        throw err;
    decoder.write(data);
});