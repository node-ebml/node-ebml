var ebml = require('./index.js')

var decoder = new ebml.Decoder({
    tagmap: {
        0x1A45dfa3: 'm',
        0x4282: 's'
    },
    defaultType: 'u'
});
decoder.on('tag', function(data) {
    console.log('tag', data)
    if(data.type === 's') {
        console.log('string data:', data.data.toString('utf-8'));
    }
})
decoder.on('tag:end', function(data) {
    console.log('tag:end', data)
    if(data.type === 's') {
        console.log('string data:', data.data.toString('utf-8'));
    }
})

decoder.write(new Buffer([0x42, 0x86, 0x81, 0x01])) // 0 - 3
decoder.write(new Buffer([0x42]))       // 4
decoder.write(new Buffer([0x86]))       // 5
decoder.write(new Buffer([0x81, 0x01])) // 6 & 7

decoder.write(new Buffer([
    0x1a, 0x45, 0xdf, 0xa3, // 8 - 11
    0xa3, 0x42, 0x86, 0x81, // 12 - 15
    0x01, 0x42, 0xf7, 0x81, // 16 - 19
    0x01, 0x42, 0xf2, 0x81  // 20 - 23
]))
decoder.write(new Buffer([
    0x04, 0x42, 0xf3, 0x81, // 24 - 27
    0x08, 0x42, 0x82, 0x88, // 28 - 31
    0x6d, 0x61, 0x74, 0x72, // 32 - 35
    0x6f, 0x73 ,0x6b ,0x61  // 36 - 39
]))

decoder.write(new Buffer([
    0x42, 0x87, 0x81, 0x02, // 40 - 43
    0x42, 0x85, 0x81, 0x02, // 44 - 47
    0x18, 0x53, 0x80, 0x67, // 48 - 51
    0x01, 0x00, 0x00, 0x00  // 52 - 55
]))
