var ebml = require('./index.js');
var fs = require('fs');

var decoder = new ebml.Decoder();

decoder.on('data', function(data) {
  var state = data[0];
  var tagObject = data[1];

  switch (tagObject.name) {
    case 'Cluster':
      console.log(tagObject.name + ':' + state, tagObject);
      break;
    default:
  }
});

fs.readFile('media/test.webm', function(err, data) {
    if (err)
        throw err;
    decoder.write(data);
});
