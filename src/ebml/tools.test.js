import forEach from 'lodash.foreach';
import range from 'lodash.range';
import unexpected from 'unexpected';
import unexpectedDate from 'unexpected-date';

import tools from './tools';

const expect = unexpected.clone().use(unexpectedDate);

describe('EBML', () => {
  describe('tools', () => {
    describe('#readVint()', () => {
      function readVint(buffer, expected) {
        const vint = tools.readVint(buffer, 0);
        expect(expected, 'to be', vint.value);
        expect(buffer.length, 'to be', vint.length);
      }

      it('should read the correct value for all 1 byte integers', () => {
        forEach(range(0x80), i => readVint(Buffer.from([i | 0x80]), i));
      });
      it('should read the correct value for 1 byte int with non-zero start', () => {
        const b = Buffer.from([0x00, 0x81]);
        const vint = tools.readVint(b, 1);
        expect(vint.value, 'to be', 1);
        expect(vint.length, 'to be', 1);
      });
      it('should read the correct value for all 2 byte integers', () => {
        for (let i = 0; i < 0x40; i += 1)
          for (let j = 0; j < 0xff; j += 1) {
            readVint(Buffer.from([i | 0x40, j]), (i << 8) + j);
          }
      });
      it('should read the correct value for all 3 byte integers', () => {
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
        expect(
          () => {
            tools.readVint(
              Buffer.from([
                0x00,
                0x80,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0xff,
                0xff,
              ]),
            );
          },
          'to throw',
          /Unrepresentable length/,
        );
      });
    });
    describe('#writeVint()', () => {
      function writeVint(value, expected) {
        const actual = tools.writeVint(value);
        expect(expected.toString('hex'), 'to be', actual.toString('hex'));
      }

      it('should throw when writing -1', () => {
        expect(
          () => {
            tools.writeVint(-1);
          },
          'to throw',
          /Unrepresentable value/,
        );
      });
      it('should write all 1 byte integers', () => {
        forEach(range(0, 0x80 - 1), i => writeVint(i, Buffer.from([i | 0x80])));
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
        expect(
          () => {
            tools.writeVint(2 ** 56 + 1);
          },
          'to throw',
          /Unrepresentable value/,
        );
      });
      it('should throw for 9+ byte int values', () => {
        expect(
          () => {
            tools.writeVint(2 ** 56 + 1);
          },
          'to throw',
          /Unrepresentable value/,
        );
      });
    });
    describe('#concatenate', () => {
      it('returns the 2nd buffer if the first is invalid', () => {
        expect(
          tools.concatenate(null, Buffer.from([0x01])),
          'to equal',
          Buffer.from([0x01]),
        );
      });
      it('returns the 1st buffer if the second is invalid', () => {
        expect(
          tools.concatenate(Buffer.from([0x01]), null),
          'to equal',
          Buffer.from([0x01]),
        );
      });
      it('returns the two buffers joined if both are valid', () => {
        expect(
          tools.concatenate(Buffer.from([0x01]), Buffer.from([0x01])),
          'to equal',
          Buffer.from([0x01, 0x01]),
        );
      });
    });
    describe('#readFloat', () => {
      it('can read 32-bit floats', () => {
        expect(
          tools.readFloat(Buffer.from([0x40, 0x20, 0x00, 0x00])),
          'to be',
          2.5,
        );
      });
      it('can read 64-bit floats', () => {
        expect(
          tools.readFloat(
            Buffer.from([0x40, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
          ),
          'to be',
          2.5,
        );
      });
      it('returns NaN with invalid sized arrays', () => {
        expect(tools.readFloat(Buffer.from([0x40, 0x20, 0x00])), 'to be NaN');
      });
    });
    describe('#readUnsigned', () => {
      it('handles 8-bit integers', () => {
        expect(tools.readUnsigned(Buffer.from([0x07])), 'to be', 7);
      });
      it('handles 16-bit integers', () => {
        expect(tools.readUnsigned(Buffer.from([0x07, 0x07])), 'to be', 1799);
      });
      it('handles 32-bit integers', () => {
        expect(
          tools.readUnsigned(Buffer.from([0x07, 0x07, 0x07, 0x07])),
          'to be',
          117901063,
        );
      });
      it('handles integers smaller than 49 bits as numbers', () => {
        expect(
          tools.readUnsigned(Buffer.from([0x07, 0x07, 0x07, 0x07, 0x07])),
          'to be',
          30182672135,
        );
        expect(
          tools.readUnsigned(Buffer.from([0x07, 0x07, 0x07, 0x07, 0x07, 0x07])),
          'to be',
          7726764066567,
        );
      });
      it('returns integers 49 bits or larger as strings', () => {
        expect(
          tools.readUnsigned(
            Buffer.from([0x1, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07]),
          ),
          'to be a string',
        ).and('to equal', '01070707070707');
      });
    });
    describe('#readUtf8', () => {});
    describe('#readSigned', () => {
      it('handles 8-bit integers', () => {
        expect(tools.readSigned(Buffer.from([0x07])), 'to be', 7);
      });
      it('handles 16-bit integers', () => {
        expect(tools.readSigned(Buffer.from([0x07, 0x07])), 'to be', 1799);
      });
      it('handles 32-bit integers', () => {
        expect(
          tools.readSigned(Buffer.from([0x07, 0x07, 0x07, 0x07])),
          'to be',
          117901063,
        );
      });
      it('returns NaN with invalid sized arrays', () => {
        expect(tools.readSigned(Buffer.from([0x40, 0x20, 0x00])), 'to be NaN');
      });
    });
    describe('#readDataFromTag', () => {});
  });
});
