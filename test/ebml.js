var ebml = require('../lib/ebml/index.js')
  , assert = require('assert')

describe('embl', function() {
    describe('tools', function() {
        describe('#getVintValue()', function() {
            it('should return the correct value for all 1 byte ints', function() {
                for(var i=0;i<0x80;i++) {
                    var b = new Buffer([i | 0x80])
                    var res = null;
                    assert.equal(
                        i,
                        res = ebml.tools.getVintValue(b, 1, 0),
                        'wrong result for 0x' + b.toString('hex') + ' (is: '+res+' | should '+i+')'
                    )
                }
            })
            it('should return the correct value for all 2 byte ints', function() {
                for(var i=0;i<0x40;i++) for(j=0;j<0xff;j++) {
                    var b = new Buffer([i | 0x40, j])
                    var x = (i << 8) + j
                    var res = null;
                    assert.equal(
                        x,
                        res = ebml.tools.getVintValue(b, 2, 0),
                        'wrong result for 0x' + b.toString('hex') + ' (is: '+res+' | should '+x+')'
                    )
                }
            })
            it('should return the correct value for all 3 byte ints', function() {
                for(var i=0;i<0x20;i++) for(j=0;j<0xff;j+=2)  for(k=0;k<0xff;k+=3) {
                    var b = new Buffer([i | 0x20, j, k])
                    var x = (i << 16) + (j << 8) + k
                    var res = null;
                    assert.equal(
                        x,
                        res = ebml.tools.getVintValue(b, 3, 0),
                        'wrong result for 0x' + b.toString('hex') + ' (is: '+res+' | should '+x+')'
                    )
                }
            })
            // not brute forcing any more bytes, takes sooo long
            it('should return the correct value for 4 byte int min value', function() {
                var b = new Buffer([0x10, 0x20, 0x00, 0x00]);
                var x = 2097152; // (2^21)
                assert.equal(
                    x,
                    res = ebml.tools.getVintValue(b, 4, 0),
                    'wrong result for 0x' + b.toString('hex') + ' (is: '+res+' | should '+x+')'
                )
            })
            it('should return the correct value for 4 byte int max value', function() {
                var b = new Buffer([0x1F, 0xFF, 0xFF, 0xFF]);
                var x = 268435455; // (2^28 - 1)
                assert.equal(
                    x,
                    res = ebml.tools.getVintValue(b, 4, 0),
                    'wrong result for 0x' + b.toString('hex') + ' (is: '+res+' | should '+x+')'
                )
            })
            it('should throw for 5+ byte int values', function() {
                var b = new Buffer([0x0F, 0xFF, 0xFF, 0xFF, 0xFF]);
                var x = 268435455; // (2^28)
                assert.throws(function() {
                    ebml.tools.getVintValue(b, 5, 0);
                })
            })
        })

        describe('#getVintLength()', function() {
            it('should return the correct length for all 1 byte ints', function() {
                for(var i=0x80;i<0xFF;i++) {
                    assert.equal(1, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return the correct length for all 2 byte ints', function() {
                for(var i=0x40;i<0x80;i++) {
                    assert.equal(2, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return the correct length for all 3 byte ints', function() {
                for(var i=0x20;i<0x40;i++) {
                    assert.equal(3, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return the correct length for all 4 byte ints', function() {
                for(var i=0x10;i<0x20;i++) {
                    assert.equal(4, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return the correct length for all 5 byte ints', function() {
                for(var i=0x08;i<0x0F;i++) {
                    assert.equal(5, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return the correct length for all 6 byte ints', function() {
                for(var i=0x04;i<0x08;i++) {
                    assert.equal(6, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return the correct length for all 7 byte ints', function() {
                assert.equal(7, ebml.tools.getVintLength(0x02), 'wrong result for 0x02')
                assert.equal(7, ebml.tools.getVintLength(0x03), 'wrong result for 0x03')
            })
            it('should return the correct length for all 8 byte ints', function() {
                assert.equal(8, ebml.tools.getVintLength(0x01), 'wrong result for 0x01')
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
