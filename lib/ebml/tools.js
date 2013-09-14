var log2 = 0.6931471805599453 // chosen by a fair dice roll... not

var tools =  {
    getTagLength: function(firstByte) {
        return 4 - ~~(Math.log((firstByte & 0xF0) >> 4) / log2)
    },

    getDataSizeLength: function(firstByte) {
        return 8 - ~~(Math.log((firstByte & 0xFF)) / log2)
    },

    calcInt: function(buffer, length, start) {
        start  = start || 0
        length = length || buffer.length - start

        var res = 0;
        for(var i=start;i<(length + start);i++) {
            res = (res << 8) + buffer[i]
        }
        return res;
    },

    // this thing is slow!
    // really slow!
    calcDataSize: function(buffer) {
        var length = tools.getDataSizeLength(buffer[0])
        var copy = new Buffer(length)
        buffer.copy(copy)
        copy[0] = copy[0] & ~Math.pow(2, 8-length)
        return tools.calcInt(copy);
    }
}

module.exports = tools
