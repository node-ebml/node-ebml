import assert from 'assert';
import { Decoder, Encoder } from '../src/ebml';

describe('ebml', () => {
    describe('Pipeline', () => {
        it('should output input buffer', done => {
            const decoder = new Decoder();
            const encoder = new Encoder();
            const buffer = Buffer.from([
                0x1a,
                0x45,
                0xdf,
                0xa3,
                0x84,
                0x42,
                0x86,
                0x81,
                0x00
            ]);

            encoder.on('data', chunk => {
                assert.strictEqual(
                    chunk.toString('hex'),
                    buffer.toString('hex')
                );
                done();
            });
            decoder.pipe(encoder);
            decoder.write(buffer);
        });

        it('should support end === -1', done => {
            const decoder = new Decoder();
            const encoder = new Encoder();

            encoder.write([
                'start',
                {
                    name: 'Cluster',
                    start: 0,
                    end: -1
                }
            ]);
            encoder.write([
                'end',
                {
                    name: 'Cluster',
                    start: 0,
                    end: -1
                }
            ]);

            encoder.pipe(decoder).on('data', data => {
                assert.strictEqual(data[1].name, 'Cluster');
                assert.strictEqual(data[1].start, 0);
                assert.strictEqual(data[1].end, -1);
                done();
            });
        });
    });
});
