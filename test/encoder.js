var ebml = require('../lib/ebml/index.js'),
    assert = require('assert');

describe('embl', function() {
    describe('Encoder', function() {
        it('should wait for more data if a tag is longer than the buffer', function(done) {
            var encoder = new ebml.Encoder();
            encoder.writeTag('EBMLVersion', new Buffer([0x01]));
            encoder.on('data', function(chunk) {
                assert.equal(new Buffer([0x42, 0x86, 0x81, 0x01]).toString('hex'), chunk.toString('hex'));
                done();
            });
        });
    });
});
