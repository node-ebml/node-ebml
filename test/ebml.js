var ebml = require('../lib/ebml/index.js')
  , assert = require('assert')

describe('embl', function() {
    describe('tools', function() {
        describe('#readVint()', function() {
            function readVint(buffer, expected) {
                var vint = ebml.tools.readVint(buffer, 0);
                assert.equal(expected, vint.value);
                assert.equal(buffer.length, vint.length);
            }
            it('should return the correct value for all 1 byte ints', function() {
                for(var i=0;i<0x80;i++) {
                    readVint(new Buffer([i | 0x80]), i);
                }
            })
            it('should return the correct value for 1 byte int with non-zero start', function() {
                var b = new Buffer([0x00, 0x81]);
                var vint = ebml.tools.readVint(b, 1);
                assert.equal(1, vint.value);
                assert.equal(1, vint.length);
            })
            it('should return the correct value for all 2 byte ints', function() {
                for(var i=0;i<0x40;i++) for(j=0;j<0xff;j++) {
                    readVint(new Buffer([i | 0x40, j]), (i << 8) + j);
                }
            })
            it('should return the correct value for all 3 byte ints', function() {
                for(var i=0;i<0x20;i++) for(j=0;j<0xff;j+=2)  for(k=0;k<0xff;k+=3) {
                    readVint(new Buffer([i | 0x20, j, k]), (i << 16) + (j << 8) + k);
                }
            })
            // not brute forcing any more bytes, takes sooo long
            it('should return the correct value for 4 byte int min/max values', function() {
                readVint(new Buffer([0x10, 0x20, 0x00, 0x00]), Math.pow(2, 21));
                readVint(new Buffer([0x1F, 0xFF, 0xFF, 0xFF]), Math.pow(2, 28) - 1);
            })
            it('should return the correct value for 5 byte int min/max values', function() {
                readVint(new Buffer([0x08, 0x10, 0x00, 0x00, 0x00]), Math.pow(2, 28));
                readVint(new Buffer([0x0F, 0xFF, 0xFF, 0xFF, 0xFF]), Math.pow(2, 35) - 1);
            })
            it('should return the correct value for 6 byte int min/max values', function() {
                readVint(new Buffer([0x04, 0x08, 0x00, 0x00, 0x00, 0x00]), Math.pow(2, 35));
                readVint(new Buffer([0x07, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), Math.pow(2, 42) - 1);
            })
            it('should return the correct value for 7 byte int min/max values', function() {
                readVint(new Buffer([0x02, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00]), Math.pow(2, 42));
                readVint(new Buffer([0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), Math.pow(2, 49) - 1);
            })
            it('should return the correct value for 8 byte int min value', function() {
                readVint(new Buffer([0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), Math.pow(2, 49));
            })
            it('should return the correct value for the max representable JS number (2^53)', function() {
                readVint(new Buffer([0x01, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), Math.pow(2, 53));
            })
            it('should throw for more than max representable JS number (2^53 + 1)', function() {
                assert.throws(function() {
                    ebml.tools.readVint(new Buffer([0x01, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]));
                })
            })
            it('should throw for more than max representable JS number (8 byte int max value)', function() {
                assert.throws(function() {
                    ebml.tools.readVint(new Buffer([0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
                })
            })
            it('should throw for 9+ byte int values', function() {
                assert.throws(function() {
                    ebml.tools.readVint([0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF]);
                })
            })

        })
        describe('#writeVint()', function() {
            it('should throw when writing -1', function() {
                var buffer = new Buffer(8)
                assert.throws(
                    function() { ebml.tools.writeVint(-1, buffer) },
                    /Unrepresentable value, negative: -1/)
            })
            it('should write 1 byte int min value', function() {
                var buffer = new Buffer(8)
                assert.equal(1, ebml.tools.writeVint(0, buffer))
                assert.equal(0x80, buffer[0])
            })
            it('should write 1 byte int max value', function() {
                var buffer = new Buffer(8)
                assert.equal(1, ebml.tools.writeVint(127, buffer)) // (2^7 - 1)
                assert.equal(0xFF, buffer[0])
            })
            it('should write 2 byte int min value', function() {
                var buffer = new Buffer(8)
                assert.equal(2, ebml.tools.writeVint(128, buffer)) // (2^7)
                assert.equal(0x40, buffer[0])
                assert.equal(0x80, buffer[1])
            })
            it('should write 2 byte int max value', function() {
                var buffer = new Buffer(8)
                assert.equal(2, ebml.tools.writeVint(16383, buffer)) // (2^14 - 1)
                assert.equal(0x7F, buffer[0])
                assert.equal(0xFF, buffer[1])
            })
            it('should write 3 byte int min value', function() {
                var buffer = new Buffer(8)
                assert.equal(3, ebml.tools.writeVint(16384, buffer)) // (2^14)
                assert.equal(0x20, buffer[0])
                assert.equal(0x40, buffer[1])
                assert.equal(0x00, buffer[2])
            })
            it('should write 3 byte int max value', function() {
                var buffer = new Buffer(8)
                assert.equal(3, ebml.tools.writeVint(2097151, buffer)) // (2^21 - 1)
                assert.equal(0x3F, buffer[0])
                assert.equal(0xFF, buffer[1])
                assert.equal(0xFF, buffer[2])
            })
            it('should write 4 byte int min value', function() {
                var buffer = new Buffer(8)
                assert.equal(4, ebml.tools.writeVint(2097152, buffer)) // (2^21)
                assert.equal(0x10, buffer[0])
                assert.equal(0x20, buffer[1])
                assert.equal(0x00, buffer[2])
                assert.equal(0x00, buffer[3])
            })
            it('should write 4 byte int max value', function() {
                var buffer = new Buffer(8)
                assert.equal(4, ebml.tools.writeVint(268435455, buffer)) // (2^28 - 1)
                assert.equal(0x1F, buffer[0])
                assert.equal(0xFF, buffer[1])
                assert.equal(0xFF, buffer[2])
                assert.equal(0xFF, buffer[3])
            })
            it('should throw when writing 5+ byte int values', function() {
                var buffer = new Buffer(8)
                assert.throws(
                    function() { ebml.tools.writeVint(268435456, buffer) }, // (2^28)
                    /Unrepresentable value, too large: 268435456/)
            })

        })
    })
})
