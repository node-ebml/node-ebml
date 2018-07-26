const ebml = require('../lib/ebml/index.js');
const assert = require('assert');

describe('embl', () => {
    describe('Encoder', () => {
        function createEncoder (expected, done) {
            const encoder = new ebml.Encoder();
            encoder.on('data', (chunk) => {
                assert.equal(chunk.toString('hex'), Buffer.from(expected).toString('hex'));
                done();
            });

            return encoder;
        }

        it('should write a single tag', (done) => {
            const encoder = createEncoder([0x42,
                0x86,
                0x81,
                0x01], done);
            encoder.write(['tag',
                {
                    name: 'EBMLVersion',
                    data: Buffer.from([0x01])
                }]);
        });
        it('should write a tag with a single child', (done) => {
            const encoder = createEncoder([0x1a,
                0x45,
                0xdf,
                0xa3,
                0x84,
                0x42,
                0x86,
                0x81,
                0x00], done);
            encoder.write(['start', { name: 'EBML' }]);
            encoder.write(['tag',
                {
                    name: 'EBMLVersion',
                    data: Buffer.from([0x00])
                }]);
            encoder.write(['end', { name: 'EBML' }]);
        });
    });
});
