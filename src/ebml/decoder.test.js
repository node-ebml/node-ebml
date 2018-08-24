import assert from 'assert';
import Decoder from './decoder';

const STATE_TAG = 1;
const STATE_SIZE = 2;
const STATE_CONTENT = 3;

describe('EBML', () => {
    describe('Decoder', () => {
        it('should wait for more data if a tag is longer than the buffer', () => {
            const decoder = new Decoder();
            decoder.write(Buffer.from([0x1a, 0x45]));

            assert.strictEqual(STATE_TAG, decoder.state);
            assert.strictEqual(2, decoder.buffer.length);
            assert.strictEqual(0, decoder.cursor);
        });

        it('should clear the buffer after a full tag is written in one chunk', () => {
            const decoder = new Decoder();
            decoder.write(Buffer.from([0x42, 0x86, 0x81, 0x01]));

            assert.strictEqual(STATE_TAG, decoder.state);
            assert.strictEqual(0, decoder.buffer.length);
            assert.strictEqual(0, decoder.cursor);
        });

        it('should clear the buffer after a full tag is written in multiple chunks', () => {
            const decoder = new Decoder();

            decoder.write(Buffer.from([0x42, 0x86]));
            decoder.write(Buffer.from([0x81, 0x01]));

            assert.strictEqual(STATE_TAG, decoder.state);
            assert.strictEqual(0, decoder.buffer.length);
            assert.strictEqual(0, decoder.cursor);
        });

        it('should increment the cursor on each step', () => {
            const decoder = new Decoder();

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
            const decoder = new Decoder();
            decoder.on(
                'data',
                ([state, { dataSize, tag, type, tagStr, data }]) => {
                    assert.strictEqual(state, 'tag');
                    assert.strictEqual(tag, 0x286);
                    assert.strictEqual(tagStr, '4286');
                    assert.strictEqual(dataSize, 0x01);
                    assert.strictEqual(type, 'u');
                    assert.deepStrictEqual(data, Buffer.from([0x01]));
                    done();
                },
            );
            decoder.write(Buffer.from([0x42, 0x86, 0x81, 0x01]));
        });

        it('should emit correct EBML tag events for master tags', done => {
            const decoder = new Decoder();

            decoder.on(
                'data',
                ([state, { dataSize, tag, type, tagStr, data }]) => {
                    assert.strictEqual(state, 'start');
                    assert.strictEqual(tag, 0x0a45dfa3);
                    assert.strictEqual(tagStr, '1a45dfa3');
                    assert.strictEqual(dataSize, 0);
                    assert.strictEqual(type, 'm');
                    assert.strictEqual(data, undefined); // eslint-disable-line no-undefined
                    done();
                },
            );

            decoder.write(Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x80]));
        });

        it('should emit correct EBML:end events for master tags', done => {
            const decoder = new Decoder();
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
        describe('::getSchemaInfo', () => {
            it('returns a correct tag if possible', () => {
                assert.ok(Decoder.getSchemaInfo(0x4286), {
                    name: 'EBMLVersion',
                    level: 1,
                    type: 'u',
                    mandatory: true,
                    default: 1,
                    minver: 1,
                    description:
                        'The version of EBML parser used to create the file.',
                    multiple: false,
                    webm: false,
                });
            });
            it('returns a default object if not found', () => {
                assert.ok(Decoder.getSchemaInfo(0x404), {
                    type: null,
                    name: 'unknown',
                    description: '',
                    level: -1,
                    minver: -1,
                    multiple: false,
                    webm: false,
                });
            });
        });
    });
});
