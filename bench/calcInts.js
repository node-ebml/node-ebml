suite('calc ints', function() {
    var buffer = new Buffer([0x1a, 0x45, 0xdf, 0xa3 ])
    bench('parseInt(toString())', function() {
        return parseInt(buffer.toString('hex'), 16);
    })

    bench('multiplication', function() {
        var res = 0;
        for(var i=0;i<buffer.length;i++) {
            res = (res << 8) + buffer[i]
        }
        return res;
    })
})
