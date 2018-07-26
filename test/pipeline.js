const ebml = require('../lib/ebml/index.js');
const assert = require('assert');

describe('embl', () => {
    describe('Pipeline', () => {
        it('should output input buffer', (done) => {
            const decoder = new ebml.Decoder();
            const encoder = new ebml.Encoder();
            const buffer = Buffer.from([0x1a,
                0x45,
                0xdf,
                0xa3,
                0x84,
                0x42,
                0x86,
                0x81,
                0x00]);
            encoder.on('data', (chunk) => {
                assert.equal(chunk.toString('hex'), buffer.toString('hex'));
                done();
            });
            decoder.pipe(encoder);
            decoder.write(buffer);
        });

        it('should support end === -1', (done) => {
            const decoder = new ebml.Decoder();
            const encoder = new ebml.Encoder();

            encoder.write(['start',
                {
                    name: 'Cluster',
                    start: 0,
                    end: -1
                }]);
            encoder.write(['end',
                {
                    name: 'Cluster',
                    start: 0,
                    end: -1
                }]);

            encoder.pipe(decoder).on('data', (data) => {
                assert.equal(data[1].name, 'Cluster');
                assert.equal(data[1].start, 0);
                assert.equal(data[1].end, -1);
                done();
            });
        });
    });
});
