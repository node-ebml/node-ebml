var log2 = 0.6931471805599453 // chosen by a fair dice roll... not

var tools =  {
    getVintLength: function(firstByte) {
        if      (firstByte & 0x80) { return 1; }
        else if (firstByte & 0x40) { return 2; }
        else if (firstByte & 0x20) { return 3; }
        else if (firstByte & 0x10) { return 4; }
        else if (firstByte & 0x08) { return 5; }
        else if (firstByte & 0x04) { return 6; }
        else if (firstByte & 0x02) { return 7; }
        else if (firstByte & 0x01) { return 8; }
        else {
            throw new Error('error' + firstByte)
        }
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
        var length = tools.getVintLength(buffer[0])
        var copy = new Buffer(length)
        buffer.copy(copy)
        copy[0] = copy[0] & ~Math.pow(2, 8-length)
        return tools.calcInt(copy);
    }
}

module.exports = tools
