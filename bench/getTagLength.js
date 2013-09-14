var log_2 = Math.log(2);
suite('getTagLength', function() {

   // set('mintime', 2000);
    bench('?:', function() {
        var x = 0x42
        return x >= 0x80
                    ? 1
                    : x >= 0x40
                        ? 2
                        : x >= 0x20
                            ? 3
                            : 4;
    })
    bench('bitshift into ?:', function() {
        var tmp;
        return (tmp = 0x42) >= 8
                    ? 1
                    : tmp >= 4
                        ? 2
                        : tmp >= 2
                            ? 3
                            : 4;
    })
    var rand = 0x42;
    bench('log(x) / 0.69..', function() {
        return 4 - ~~(Math.log((rand & 0xF0) >> 4) / 0.6931471805599453)
    })
    bench('log(x) / log(2)', function() {
        return 4 - ~~(Math.log((rand & 0xF0) >> 4) / Math.log(2))
    })
    bench('log(x) / log_2', function() {
        return 4 - ~~(Math.log((rand & 0xF0) >> 4) / log_2)
    })
    bench('log(x) / 0.69..', function() {
        return 8 - ~~(Math.log((rand & 0xFF)) / 0.6931471805599453)
    })
    bench('log(x) / log(2)', function() {
        return 8 - ~~(Math.log((rand & 0xFF)) / Math.log(2))
    })
    bench('log(x) / log_2', function() {
        return 8 - ~~(Math.log((rand & 0xFF)) / log_2)
    })
})
