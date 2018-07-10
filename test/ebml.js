/* global describe, it */
const ebml = require('../lib/ebml/index.js');
const assert = require('assert');

describe('embl', function () {
    describe('tools', function () {
        describe('#readVint()', function () {
            function readVint(buffer, expected) {
                const vint = ebml.tools.readVint(buffer, 0);
                assert.equal(expected, vint.value);
                assert.equal(buffer.length, vint.length);
            }

            it('should read the correct value for all 1 byte ints', function () {
                for (let i = 0; i < 0x80; i++) {
                    readVint(new Buffer([i | 0x80]), i);
                }
            });
            it('should read the correct value for 1 byte int with non-zero start', function () {
                const b = new Buffer([0x00, 0x81]);
                const vint = ebml.tools.readVint(b, 1);
                assert.equal(1, vint.value);
                assert.equal(1, vint.length);
            });
            it('should read the correct value for all 2 byte ints', function () {
                for (let i = 0; i < 0x40; i++)
                    for (let j = 0; j < 0xff; j++) {
                        readVint(new Buffer([i | 0x40, j]), (i << 8) + j);
                    }
            });
            it('should read the correct value for all 3 byte ints', function () {
                for (let i = 0; i < 0x20; i++)
                    for (let j = 0; j < 0xff; j += 2)
                        for (let k = 0; k < 0xff; k += 3) {
                            readVint(new Buffer([i | 0x20, j, k]), (i << 16) + (j << 8) + k);
                        }
            });
            // not brute forcing any more bytes, takes sooo long
            it('should read the correct value for 4 byte int min/max values', function () {
                readVint(new Buffer([0x10, 0x20, 0x00, 0x00]), Math.pow(2, 21));
                readVint(new Buffer([0x1F, 0xFF, 0xFF, 0xFF]), Math.pow(2, 28) - 1);
            });
            it('should read the correct value for 5 byte int min/max values', function () {
                readVint(new Buffer([0x08, 0x10, 0x00, 0x00, 0x00]), Math.pow(2, 28));
                readVint(new Buffer([0x0F, 0xFF, 0xFF, 0xFF, 0xFF]), Math.pow(2, 35) - 1);
            });
            it('should read the correct value for 6 byte int min/max values', function () {
                readVint(new Buffer([0x04, 0x08, 0x00, 0x00, 0x00, 0x00]), Math.pow(2, 35));
                readVint(new Buffer([0x07, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), Math.pow(2, 42) - 1);
            });
            it('should read the correct value for 7 byte int min/max values', function () {
                readVint(new Buffer([0x02, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00]), Math.pow(2, 42));
                readVint(new Buffer([0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), Math.pow(2, 49) - 1);
            });
            it('should read the correct value for 8 byte int min value', function () {
                readVint(new Buffer([0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), Math.pow(2, 49));
            });
            it('should read the correct value for the max representable JS number (2^53)', function () {
                readVint(new Buffer([0x01, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), Math.pow(2, 53));
            });
            // an unknown value is represented by -1
            it('should return value -1 for more than max representable JS number (2^53 + 1)', function () {
                readVint(new Buffer([0x01, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]), -1);
            });
            it('should return value -1 for more than max representable JS number (8 byte int max value)', function () {
                readVint(new Buffer([0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), -1);
            });
            it('should throw for 9+ byte int values', function () {
                assert.throws(function () {
                    ebml.tools.readVint(new Buffer([0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF]));
                }, /Unrepresentable length/);
            });
        });
        describe('#writeVint()', function () {
            function writeVint(value, expected) {
                const actual = ebml.tools.writeVint(value);
                assert.equal(expected.toString('hex'), actual.toString('hex'));
            }

            it('should throw when writing -1', function () {
                assert.throws(function () {
                    ebml.tools.writeVint(-1);
                }, /Unrepresentable value/);
            });
            it('should write all 1 byte ints', function () {
                for (let i = 0; i < 0x80 - 1; i++) {
                    writeVint(i, new Buffer([i | 0x80]));
                }
            });
            it('should write 2 byte int min/max values', function () {
                writeVint(Math.pow(2, 7) - 1, new Buffer([0x40, 0x7F]));
                writeVint(Math.pow(2, 14) - 2, new Buffer([0x7F, 0xFE]));
            });
            it('should write 3 byte int min/max values', function () {
                writeVint(Math.pow(2, 14) - 1, new Buffer([0x20, 0x3F, 0xFF]));
                writeVint(Math.pow(2, 21) - 2, new Buffer([0x3F, 0xFF, 0xFE]));
            });
            it('should write 4 byte int min/max values', function () {
                writeVint(Math.pow(2, 21) - 1, new Buffer([0x10, 0x1F, 0xFF, 0xFF]));
                writeVint(Math.pow(2, 28) - 2, new Buffer([0x1F, 0xFF, 0xFF, 0xFE]));
            });
            it('should write 5 byte int min/max value', function () {
                writeVint(Math.pow(2, 28) - 1, new Buffer([0x08, 0x0F, 0xFF, 0xFF, 0xFF]));
                writeVint(Math.pow(2, 35) - 2, new Buffer([0x0F, 0xFF, 0xFF, 0xFF, 0xFE]));
            });
            it('should write 6 byte int min/max value', function () {
                writeVint(Math.pow(2, 35) - 1, new Buffer([0x04, 0x07, 0xFF, 0xFF, 0xFF, 0xFF]));
                writeVint(Math.pow(2, 42) - 2, new Buffer([0x07, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE]));
            });
            it('should write 7 byte int min/max value', function () {
                writeVint(Math.pow(2, 42) - 1, new Buffer([0x02, 0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
                writeVint(Math.pow(2, 49) - 2, new Buffer([0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE]));
            });
            it('should write the correct value for 8 byte int min value', function () {
                writeVint(Math.pow(2, 49) - 1, new Buffer([0x01, 0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
            });
            it('should write the correct value for the max representable JS number (2^53)', function () {
                writeVint(Math.pow(2, 53), new Buffer([0x01, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
            });
            // Can't prevent this, 2^53 + 1 === 2^53
            // it('should throw for more than max representable JS number (2^53 + 1)', function() {
            //     assert.throws(function() {
            //         ebml.tools.writeVint(Math.pow(2, 53) + 1));
            //     }, /Unrepresentable value/)
            // })
            it('should throw for more than max representable JS number (8 byte int max value)', function () {
                assert.throws(function () {
                    ebml.tools.writeVint(Math.pow(2, 56) + 1);
                }, /Unrepresentable value/);
            });
            it('should throw for 9+ byte int values', function () {
                assert.throws(function () {
                    ebml.tools.writeVint(Math.pow(2, 56) + 1);
                }, /Unrepresentable value/);
            });

        });
    });
});
