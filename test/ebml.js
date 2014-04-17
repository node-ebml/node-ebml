var ebml = require('../lib/ebml/index.js')
  , assert = require('assert')

describe('embl', function() {
    describe('tools', function() {
        describe('#calcDataSize()', function() {
            it('should return the correct size for 1 byte ints', function() {
                for(var i=0;i<0x80;i++) {
                    var b = new Buffer([i | 0x80])
                    var res = null;
                    assert.equal(
                        i,
                        res = ebml.tools.calcDataSize(b),
                        'wrong result for 0x' + b.toString('hex') + ' (is: '+res+' | should '+i+')'
                    )
                }
            })
            it('should return the correct size for 2 byte ints', function() {
                for(var i=0;i<0x40;i++) for(j=0;j<0xff;j++) {
                    var b = new Buffer([i | 0x40, j])
                    var x = (i << 8) + j
                    var res = null;
                    assert.equal(
                        x,
                        res = ebml.tools.calcDataSize(b),
                        'wrong result for 0x' + b.toString('hex') + ' (is: '+res+' | should '+x+')'
                    )
                }
            })
            it('should return the correct size for 3 byte ints', function() {
                for(var i=0;i<0x20;i++) for(j=0;j<0xff;j+=2)  for(k=0;k<0xff;k+=3) {
                    var b = new Buffer([i | 0x20, j, k])
                    var x = (i << 16) + (j << 8) + k
                    var res = null;
                    assert.equal(
                        x,
                        res = ebml.tools.calcDataSize(b),
                        'wrong result for 0x' + b.toString('hex') + ' (is: '+res+' | should '+x+')'
                    )
                }
            })
            // not testing more bytes, takes sooo long
        })

        describe('#getVintLength()', function() {
            it('should return 1 for tags that are supposed to be 1 byte long', function() {
                for(var i=0x80;i<0xFF;i++) {
                    assert.equal(1, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return 2 for tags that are supposed to be 2 byte long', function() {
                for(var i=0x40;i<0x80;i++) {
                    assert.equal(2, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return 3 for tags that are supposed to be 3 byte long', function() {
                for(var i=0x20;i<0x40;i++) {
                    assert.equal(3, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return 4 for tags that are supposed to be 4 byte long', function() {
                for(var i=0x10;i<0x20;i++) {
                    assert.equal(4, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return 5 for tags that are supposed to be 5 byte long', function() {
                for(var i=0x08;i<0x0F;i++) {
                    assert.equal(5, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return 6 for tags that are supposed to be 6 byte long', function() {
                for(var i=0x04;i<0x08;i++) {
                    assert.equal(6, ebml.tools.getVintLength(i), 'wrong result for 0x' + i.toString(16))
                }
            })
            it('should return 7 for tags that are supposed to be 7 byte long', function() {
                assert.equal(7, ebml.tools.getVintLength(0x02), 'wrong result for 0x02')
                assert.equal(7, ebml.tools.getVintLength(0x03), 'wrong result for 0x03')
            })
            it('should return 8 for tags that are supposed to be 8 byte long', function() {
                assert.equal(8, ebml.tools.getVintLength(0x01), 'wrong result for 0x01')
            })
        })
    })
})
