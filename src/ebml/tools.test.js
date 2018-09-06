import assert from 'assert';
import tools from './tools';

describe('EBML', () => {
  describe('tools', () => {
    describe('#readVint()', () => {
      function readVint(buffer, expected) {
        const vint = tools.readVint(buffer, 0);
        assert.strictEqual(expected, vint.value);
        assert.strictEqual(buffer.length, vint.length);
      }

      it('should read the correct value for all 1 byte ints', () => {
        for (let i = 0; i < 0x80; i += 1) {
          readVint(Buffer.from([i | 0x80]), i);
        }
      });
      it('should read the correct value for 1 byte int with non-zero start', () => {
        const b = Buffer.from([0x00, 0x81]);
        const vint = tools.readVint(b, 1);
        assert.strictEqual(1, vint.value);
        assert.strictEqual(1, vint.length);
      });
      it('should read the correct value for all 2 byte ints', () => {
        for (let i = 0; i < 0x40; i += 1)
          for (let j = 0; j < 0xff; j += 1) {
            readVint(Buffer.from([i | 0x40, j]), (i << 8) + j);
          }
      });
      it('should read the correct value for all 3 byte ints', () => {
        for (let i = 0; i < 0x20; i += 1) {
          for (let j = 0; j < 0xff; j += 2) {
            for (let k = 0; k < 0xff; k += 3) {
              readVint(Buffer.from([i | 0x20, j, k]), (i << 16) + (j << 8) + k);
            }
          }
        }
      });
      // not brute forcing any more bytes, takes sooo long
      it('should read the correct value for 4 byte int min/max values', () => {
        readVint(Buffer.from([0x10, 0x20, 0x00, 0x00]), 2 ** 21);
        readVint(Buffer.from([0x1f, 0xff, 0xff, 0xff]), 2 ** 28 - 1);
      });
      it('should read the correct value for 5 byte int min/max values', () => {
        readVint(Buffer.from([0x08, 0x10, 0x00, 0x00, 0x00]), 2 ** 28);
        readVint(Buffer.from([0x0f, 0xff, 0xff, 0xff, 0xff]), 2 ** 35 - 1);
      });
      it('should read the correct value for 6 byte int min/max values', () => {
        readVint(Buffer.from([0x04, 0x08, 0x00, 0x00, 0x00, 0x00]), 2 ** 35);
        readVint(
          Buffer.from([0x07, 0xff, 0xff, 0xff, 0xff, 0xff]),
          2 ** 42 - 1,
        );
      });
      it('should read the correct value for 7 byte int min/max values', () => {
        readVint(
          Buffer.from([0x02, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00]),
          2 ** 42,
        );
        readVint(
          Buffer.from([0x03, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]),
          2 ** 49 - 1,
        );
      });
      it('should read the correct value for 8 byte int min value', () => {
        readVint(
          Buffer.from([0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
          2 ** 49,
        );
      });
      it('should read the correct value for the max representable JS number (2^53)', () => {
        readVint(
          Buffer.from([0x01, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
          2 ** 53,
        );
      });
      // an unknown value is represented by -1
      it('should return value -1 for more than max representable JS number (2^53 + 1)', () => {
        readVint(
          Buffer.from([0x01, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]),
          -1,
        );
      });
      it('should return value -1 for more than max representable JS number (8 byte int max value)', () => {
        readVint(
          Buffer.from([0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]),
          -1,
        );
      });
      it('should throw for 9+ byte int values', () => {
        assert.throws(() => {
          tools.readVint(
            Buffer.from([0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff]),
          );
        }, /Unrepresentable length/);
      });
    });
    describe('#writeVint()', () => {
      function writeVint(value, expected) {
        const actual = tools.writeVint(value);
        assert.strictEqual(expected.toString('hex'), actual.toString('hex'));
      }

      it('should throw when writing -1', () => {
        assert.throws(() => {
          tools.writeVint(-1);
        }, /Unrepresentable value/);
      });
      it('should write all 1 byte ints', () => {
        for (let i = 0; i < 0x80 - 1; i += 1) {
          writeVint(i, Buffer.from([i | 0x80]));
        }
      });
      it('should write 2 byte int min/max values', () => {
        writeVint(2 ** 7 - 1, Buffer.from([0x40, 0x7f]));
        writeVint(2 ** 14 - 2, Buffer.from([0x7f, 0xfe]));
      });
      it('should write 3 byte int min/max values', () => {
        writeVint(2 ** 14 - 1, Buffer.from([0x20, 0x3f, 0xff]));
        writeVint(2 ** 21 - 2, Buffer.from([0x3f, 0xff, 0xfe]));
      });
      it('should write 4 byte int min/max values', () => {
        writeVint(2 ** 21 - 1, Buffer.from([0x10, 0x1f, 0xff, 0xff]));
        writeVint(2 ** 28 - 2, Buffer.from([0x1f, 0xff, 0xff, 0xfe]));
      });
      it('should write 5 byte int min/max value', () => {
        writeVint(2 ** 28 - 1, Buffer.from([0x08, 0x0f, 0xff, 0xff, 0xff]));
        writeVint(2 ** 35 - 2, Buffer.from([0x0f, 0xff, 0xff, 0xff, 0xfe]));
      });
      it('should write 6 byte int min/max value', () => {
        writeVint(
          2 ** 35 - 1,
          Buffer.from([0x04, 0x07, 0xff, 0xff, 0xff, 0xff]),
        );
        writeVint(
          2 ** 42 - 2,
          Buffer.from([0x07, 0xff, 0xff, 0xff, 0xff, 0xfe]),
        );
      });
      it('should write 7 byte int min/max value', () => {
        writeVint(
          2 ** 42 - 1,
          Buffer.from([0x02, 0x03, 0xff, 0xff, 0xff, 0xff, 0xff]),
        );
        writeVint(
          2 ** 49 - 2,
          Buffer.from([0x03, 0xff, 0xff, 0xff, 0xff, 0xff, 0xfe]),
        );
      });
      it('should write the correct value for 8 byte int min value', () => {
        writeVint(
          2 ** 49 - 1,
          Buffer.from([0x01, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]),
        );
      });
      it('should write the correct value for the max representable JS number (2^53)', () => {
        writeVint(
          2 ** 53,
          Buffer.from([0x01, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
        );
      });

      /*
             * can't prevent this, 2^53 + 1 === 2^53
             * it('should throw for more than max representable JS number (2^53 + 1)', function() {
             *     assert.throws(function() {
             *         tools.writeVint((2 ** 53) + 1));
             *     }, /Unrepresentable value/)
             * })
             */
      it('should throw for more than max representable JS number (8 byte int max value)', () => {
        assert.throws(() => {
          tools.writeVint(2 ** 56 + 1);
        }, /Unrepresentable value/);
      });
      it('should throw for 9+ byte int values', () => {
        assert.throws(() => {
          tools.writeVint(2 ** 56 + 1);
        }, /Unrepresentable value/);
      });
    });
    describe('#concatenate', () => {
      it('returns the 2nd buffer if the first is invalid', () => {
        assert.ok(
          tools.concatenate(null, Buffer.from([0x01])),
          Buffer.from([0x01]),
        );
      });
      it('returns the 1st buffer if the second is invalid', () => {
        assert.ok(
          tools.concatenate(Buffer.from([0x01]), null),
          Buffer.from([0x01]),
        );
      });
      it('returns the two buffers joined if both are valid', () => {
        assert.ok(
          tools.concatenate(Buffer.from([0x01]), Buffer.from([0x01])),
          Buffer.from([0x01, 0x01]),
        );
      });
    });
    describe('#readFloat', () => {
      it('can read 32-bit floats', () => {
        assert.strictEqual(
          tools.readFloat(Buffer.from([0x40, 0x20, 0x00, 0x00])),
          2.5,
        );
      });
      it('can read 64-bit floats', () => {
        assert.strictEqual(
          tools.readFloat(
            Buffer.from([0x40, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
          ),
          2.5,
        );
      });
      it('returns NaN with invalid sized arrays', () => {
        assert.ok(
          Number.isNaN(tools.readFloat(Buffer.from([0x40, 0x20, 0x00]))),
        );
      });
    });
    describe('#readUnsigned', () => {
      it('handles 8-bit ints', () => {
        assert.strictEqual(tools.readUnsigned(Buffer.from([0x07])), 7);
      });
      it('handles 16-bit ints', () => {
        assert.strictEqual(tools.readUnsigned(Buffer.from([0x07, 0x07])), 1799);
      });
      it('handles 32-bit ints', () => {
        assert.strictEqual(
          tools.readUnsigned(Buffer.from([0x07, 0x07, 0x07, 0x07])),
          117901063,
        );
      });
      it('handles ints smaller than 49 bits as numbers', () => {
        assert.strictEqual(
          tools.readUnsigned(Buffer.from([0x07, 0x07, 0x07, 0x07, 0x07])),
          30182672135,
        );
        assert.strictEqual(
          tools.readUnsigned(Buffer.from([0x07, 0x07, 0x07, 0x07, 0x07, 0x07])),
          7726764066567,
        );
      });
      it('returns ints 49 bits or larger as strings', () => {
        assert.strictEqual(
          tools.readUnsigned(
            Buffer.from([0x1, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07]),
          ),
          '01070707070707',
        );
        assert.strictEqual(
          typeof tools.readUnsigned(
            Buffer.from([0x1, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07]),
          ),
          'string',
        );
      });
    });
    describe('#readUtf8', () => {});
    describe('#readSigned', () => {
      it('handles 8-bit ints', () => {
        assert.strictEqual(tools.readSigned(Buffer.from([0x07])), 7);
      });
      it('handles 16-bit ints', () => {
        assert.strictEqual(tools.readSigned(Buffer.from([0x07, 0x07])), 1799);
      });
      it('handles 32-bit ints', () => {
        assert.strictEqual(
          tools.readSigned(Buffer.from([0x07, 0x07, 0x07, 0x07])),
          117901063,
        );
      });
      it('returns NaN with invalid sized arrays', () => {
        assert.ok(
          Number.isNaN(tools.readSigned(Buffer.from([0x40, 0x20, 0x00]))),
        );
      });
    });
    describe('#readDataFromTag', () => {});
  });
});
