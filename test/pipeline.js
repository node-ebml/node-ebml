var ebml = require('../lib/ebml/index.js'),
    assert = require('assert');

describe('embl', function() {
    describe('Pipeline', function() {
        it('should output input buffer', function(done) {
            var decoder = new ebml.Decoder();
            var encoder = new ebml.Encoder();
            var buffer = new Buffer([0x1a, 0x45, 0xdf, 0xa3, 0x84, 0x42, 0x86, 0x81, 0x00]);
            encoder.on('data', function(chunk) {
                assert.equal(chunk.toString('hex'), buffer.toString('hex'));
                done();
            });
            decoder.pipe(encoder);
            decoder.write(buffer);
        });
    });
});
