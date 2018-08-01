const assert = require('assert');
const ebml = require('../src/ebml/index.js');

const STATE_TAG = 1;

const STATE_SIZE = 2;

const STATE_CONTENT = 3;

describe('embl', () => {
    describe('Decoder', () => {
        it('should wait for more data if a tag is longer than the buffer', () => {
            const decoder = new ebml.Decoder();
            decoder.write(Buffer.from([0x1a, 0x45]));

            assert.strictEqual(STATE_TAG, decoder.state);
            assert.strictEqual(2, decoder.buffer.length);
            assert.strictEqual(0, decoder.cursor);
        });

        it('should clear the buffer after a full tag is written in one chunk', () => {
            const decoder = new ebml.Decoder();
            decoder.write(Buffer.from([0x42, 0x86, 0x81, 0x01]));

            assert.strictEqual(STATE_TAG, decoder.state);
            assert.strictEqual(0, decoder.buffer.length);
            assert.strictEqual(0, decoder.cursor);
        });

        it('should clear the buffer after a full tag is written in multiple chunks', () => {
            const decoder = new ebml.Decoder();

            decoder.write(Buffer.from([0x42, 0x86]));
            decoder.write(Buffer.from([0x81, 0x01]));

            assert.strictEqual(STATE_TAG, decoder.state);
            assert.strictEqual(0, decoder.buffer.length);
            assert.strictEqual(0, decoder.cursor);
        });

        it('should increment the cursor on each step', () => {
            const decoder = new ebml.Decoder();

            decoder.write(Buffer.from([0x42])); // 4

            assert.strictEqual(STATE_TAG, decoder.state);
            assert.strictEqual(1, decoder.buffer.length);
            assert.strictEqual(0, decoder.cursor);

            decoder.write(Buffer.from([0x86])); // 5

            assert.strictEqual(STATE_SIZE, decoder.state);
            assert.strictEqual(2, decoder.buffer.length);
            assert.strictEqual(2, decoder.cursor);

            decoder.write(Buffer.from([0x81])); // 6 & 7

            assert.strictEqual(STATE_CONTENT, decoder.state);
            assert.strictEqual(3, decoder.buffer.length);
            assert.strictEqual(3, decoder.cursor);

            decoder.write(Buffer.from([0x01])); // 6 & 7

            assert.strictEqual(STATE_TAG, decoder.state);
            assert.strictEqual(0, decoder.buffer.length);
            assert.strictEqual(0, decoder.cursor);
        });

        it('should emit correct tag events for simple data', done => {
            const decoder = new ebml.Decoder();
            decoder.on('data', d => {
                const [state, data] = d;
                assert.strictEqual(state, 'tag');
                assert.strictEqual(data.tag, 0x286);
                assert.strictEqual(data.tagStr, '4286');
                assert.strictEqual(data.dataSize, 0x01);
                assert.strictEqual(data.type, 'u');
                assert.deepStrictEqual(data.data, Buffer.from([0x01]));
                done();
            });
            decoder.write(Buffer.from([0x42, 0x86, 0x81, 0x01]));
        });

        it('should emit correct EBML tag events for master tags', done => {
            const decoder = new ebml.Decoder();

            decoder.on('data', d => {
                const [state, data] = d;
                assert.strictEqual(state, 'start');
                assert.strictEqual(data.tag, 0x0a45dfa3);
                assert.strictEqual(data.tagStr, '1a45dfa3');
                assert.strictEqual(data.dataSize, 0);
                assert.strictEqual(data.type, 'm');
                assert.strictEqual(data.data, undefined); // eslint-disable-line no-undefined
                done();
            });

            decoder.write(Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x80]));
        });

        it('should emit correct EBML:end events for master tags', done => {
            const decoder = new ebml.Decoder();
            let tags = 0;
            decoder.on('data', d => {
                const [state, data] = d;
                if (state === 'end') {
                    assert.strictEqual(tags, 2); // two tags
                    assert.strictEqual(data.tag, 0x0a45dfa3);
                    assert.strictEqual(data.tagStr, '1a45dfa3');
                    assert.strictEqual(data.dataSize, 4);
                    assert.strictEqual(data.type, 'm');
                    assert.strictEqual(data.data, undefined); // eslint-disable-line no-undefined
                    done();
                } else {
                    tags += 1;
                }
            });
            decoder.write(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
            decoder.write(Buffer.from([0x84, 0x42, 0x86, 0x81, 0x00]));
        });
    });
});
