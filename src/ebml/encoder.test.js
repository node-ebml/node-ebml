import assert from 'assert';
import Encoder from './encoder';

describe('EBML', () => {
    describe('Encoder', () => {
        function createEncoder(expected, done) {
            const encoder = new Encoder();
            encoder.on('data', chunk => {
                assert.strictEqual(
                    chunk.toString('hex'),
                    Buffer.from(expected).toString('hex'),
                );
                done();
            });
            encoder.on('finish', done);
            return encoder;
        }

        it('should write a single tag', done => {
            const encoder = createEncoder([0x42, 0x86, 0x81, 0x01], done);
            encoder.write([
                'tag',
                {
                    name: 'EBMLVersion',
                    data: Buffer.from([0x01]),
                },
            ]);
            encoder.end();
        });
        it('should write a tag with a single child', done => {
            const encoder = createEncoder(
                [0x1a, 0x45, 0xdf, 0xa3, 0x84, 0x42, 0x86, 0x81, 0x00],
                done,
            );
            encoder.write(['start', { name: 'EBML' }]);
            encoder.write([
                'tag',
                {
                    name: 'EBMLVersion',
                    data: Buffer.from([0x00]),
                },
            ]);
            encoder.write(['end', { name: 'EBML' }]);
            // encoder.end();
        });
        describe('#cork and #uncork', () => {
            let encoder;
            beforeEach(() => {
                encoder = new Encoder();
            });
            it('should block flushing when corked', () => {
                encoder.write(['start', { name: 'EBML' }]);
                encoder.write([
                    'tag',
                    {
                        name: 'EBMLVersion',
                        data: Buffer.from([0x00]),
                    },
                ]);
                encoder.cork();
                encoder.write(['end', { name: 'EBML' }]);
                encoder.flush();
                assert.ok(
                    encoder.buffer,
                    Buffer.from([
                        0x1a,
                        0x45,
                        0xdf,
                        0xa3,
                        0x84,
                        0x42,
                        0x86,
                        0x81,
                        0x00,
                    ]),
                );
            });
            it('should not block flushing when uncorked', () => {
                encoder.write(['start', { name: 'EBML' }]);
                encoder.write([
                    'tag',
                    {
                        name: 'EBMLVersion',
                        data: Buffer.from([0x00]),
                    },
                ]);
                encoder.cork();
                encoder.write(['end', { name: 'EBML' }]);
                encoder.flush();
                assert.ok(
                    encoder.buffer,
                    Buffer.from([
                        0x1a,
                        0x45,
                        0xdf,
                        0xa3,
                        0x84,
                        0x42,
                        0x86,
                        0x81,
                        0x00,
                    ]),
                );
                encoder.uncork();
                encoder.flush();
                assert.notStrictEqual(encoder.buffer instanceof Buffer);
            });
        });
        describe('::getSchemaInfo', () => {
            it('should return a valid number when a tag is found', () => {
                assert.ok(Encoder.getSchemaInfo('EBMLVersion'), 0x4286);
            });
            it('should return null when not found', () => {
                assert.strictEqual(Encoder.getSchemaInfo('404NotFound'), null);
            });
        });
        describe('#writeTag', () => {
            let encoder;
            beforeAll(() => {
                encoder = new Encoder();
            });
            it('does nothing with invalid tag data', () => {
                encoder.writeTag('EBMLVersion', null);
                assert.strictEqual(encoder.stack.length, 0);
            });
            it('throws with an invalid tag name', () => {
                assert.throws(
                    () => {
                        encoder.writeTag('404NotFound');
                    },
                    /No schema entry found/,
                    'Not throwing properly',
                );
            });
        });
        describe('#startTag', () => {
            let encoder;
            beforeAll(() => {
                encoder = new Encoder();
            });
            it('throws with an invalid tag name', () => {
                assert.throws(
                    () => {
                        encoder.startTag('404NotFound', { end: -1 });
                    },
                    /No schema entry found/,
                    'Not throwing properly',
                );
            });
        });
        describe('#_transform', () => {
            it('should do nothing on an invalid tag', () => {
                const encoder = new Encoder();
                encoder.write(['404NotFound', { name: 'EBML' }]);
                assert.notStrictEqual(encoder.buffer instanceof Buffer);
                assert.strictEqual(encoder.buffer, null);
            });
        });
        describe('#_bufferAndFlush', () => {
            /* eslint-disable no-underscore-dangle */
            let encoder;
            beforeEach(() => {
                encoder = new Encoder();
            });
            it('should create a new buffer (but still be empty after eval) with an empty buffer', () => {
                assert.strictEqual(encoder.buffer, null);
                encoder._bufferAndFlush(Buffer.from([0x42, 0x86, 0x81, 0x01]));
                assert.strictEqual(encoder.buffer, null);
            });
            it('should append to the buffer (and empty after eval) with an existing buffer', () => {
                encoder.buffer = Buffer.from([0x42, 0x86, 0x81, 0x01]);
                assert.ok(encoder.buffer instanceof Buffer);
                encoder._bufferAndFlush(Buffer.from([0x42, 0x86, 0x81, 0x01]));
                assert.strictEqual(encoder.buffer, null);
            });
            /* eslint-enable no-underscore-dangle */
        });
    });
});
