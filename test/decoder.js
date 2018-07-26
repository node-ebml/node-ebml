const ebml = require('../lib/ebml/index.js');
const assert = require('assert');

const STATE_TAG = 1;


const STATE_SIZE = 2;


const STATE_CONTENT = 3;

describe('embl', () => {
    describe('Decoder', () => {
        it('should wait for more data if a tag is longer than the buffer', () => {
            const decoder = new ebml.Decoder();
            decoder.write(Buffer.from([0x1A, 0x45]));

            assert.equal(STATE_TAG, decoder._state);
            assert.equal(2, decoder._buffer.length);
            assert.equal(0, decoder._cursor);
        });

        it('should clear the buffer after a full tag is written in one chunk', () => {
            const decoder = new ebml.Decoder();
            decoder.write(Buffer.from([0x42,
                0x86,
                0x81,
                0x01]));

            assert.equal(STATE_TAG, decoder._state);
            assert.equal(0, decoder._buffer.length);
            assert.equal(0, decoder._cursor);
        });

        it('should clear the buffer after a full tag is written in multiple chunks', () => {
            const decoder = new ebml.Decoder();

            decoder.write(Buffer.from([0x42, 0x86]));
            decoder.write(Buffer.from([0x81, 0x01]));

            assert.equal(STATE_TAG, decoder._state);
            assert.equal(0, decoder._buffer.length);
            assert.equal(0, decoder._cursor);
        });

        it('should increment the cursor on each step', () => {
            const decoder = new ebml.Decoder();

            decoder.write(Buffer.from([0x42])); // 4

            assert.equal(STATE_TAG, decoder._state);
            assert.equal(1, decoder._buffer.length);
            assert.equal(0, decoder._cursor);

            decoder.write(Buffer.from([0x86])); // 5

            assert.equal(STATE_SIZE, decoder._state);
            assert.equal(2, decoder._buffer.length);
            assert.equal(2, decoder._cursor);

            decoder.write(Buffer.from([0x81])); // 6 & 7

            assert.equal(STATE_CONTENT, decoder._state);
            assert.equal(3, decoder._buffer.length);
            assert.equal(3, decoder._cursor);

            decoder.write(Buffer.from([0x01])); // 6 & 7

            assert.equal(STATE_TAG, decoder._state);
            assert.equal(0, decoder._buffer.length);
            assert.equal(0, decoder._cursor);
        });

        it('should emit correct tag events for simple data', (done) => {
            const decoder = new ebml.Decoder();
            decoder.on('data', (d) => {
                const [state, data] = d;
                assert.equal(state, 'tag');
                assert.equal(data.tag, 0x286);
                assert.equal(data.tagStr, '4286');
                assert.equal(data.dataSize, 0x01);
                assert.equal(data.type, 'u');
                assert.deepEqual(data.data, Buffer.from([0x01]));
                done();
            });
            decoder.write(Buffer.from([0x42,
                0x86,
                0x81,
                0x01]));
        });

        it('should emit correct EBML tag events for master tags', (done) => {
            const decoder = new ebml.Decoder();

            decoder.on('data', (d) => {
                const [state, data] = d;
                assert.equal(state, 'start');
                assert.equal(data.tag, 0x0a45dfa3);
                assert.equal(data.tagStr, '1a45dfa3');
                assert.equal(data.dataSize, 0);
                assert.equal(data.type, 'm');
                assert.equal(data.data, undefined);
                done();
            });

            decoder.write(Buffer.from([0x1a,
                0x45,
                0xdf,
                0xa3,
                0x80]));
        });

        it('should emit correct EBML:end events for master tags', (done) => {
            const decoder = new ebml.Decoder();
            let tags = 0;
            decoder.on('data', (d) => {
                const [state, data] = d;
                if (state !== 'end') {
                    tags += 1;
                } else {
                    assert.equal(tags, 2); // two tags
                    assert.equal(data.tag, 0x0a45dfa3);
                    assert.equal(data.tagStr, '1a45dfa3');
                    assert.equal(data.dataSize, 4);
                    assert.equal(data.type, 'm');
                    assert.equal(data.data, undefined);
                    done();
                }
            });
            decoder.write(Buffer.from([0x1a,
                0x45,
                0xdf,
                0xa3]));
            decoder.write(Buffer.from([0x84,
                0x42,
                0x86,
                0x81,
                0x00]));
        });
    });
});
