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
        else throw new Error('Unrepresentable value: ' + firstByte);
    },

    getVintValue: function(buffer, length, start) {
        if (length < 1 || length > 8) {
            throw new Error("Unrepresentable length: " + length + " " +
                buffer.toString('hex', start, start + length));
        }
        var value = buffer[start] & (1 << (8 - length)) - 1;
        for (var i = 1; i < length; i++) {
            if (i === 7) {
                if (value >= 0x200000000000 && buffer[start + 7] > 0) {
                    throw new Error("Unrepresentable value: " +
                        buffer.toString('hex', start, start + length));
                }
            }
            value *= Math.pow(2, 8);
            value += buffer[start + i];
        }
        return value;
    },

    writeVint: function(int, buffer, start) {
        start = start || 0;

        if (int < 0) {
            throw new Error("Unrepresentable value, negative: " + int)
        } else if (int < Math.pow(2, 7)) {
            buffer[start] = 0x80 | int;
            return 1;
        } else if (int < Math.pow(2, 14)) {
            buffer[start] = (0x4000 | int) >> 8;
            buffer[start + 1] = int & 0xFF;
            return 2;
        } else if (int < Math.pow(2, 21)) {
            buffer[start] = (0x200000 | int) >> 16;
            buffer[start + 1] = (int & 0xFF00) >> 8;
            buffer[start + 2] = int & 0xFF;
            return 3;
        } else if (int < Math.pow(2, 28)) {
            buffer[start] = (0x10000000 | int) >> 24;
            buffer[start + 1] = (int & 0xFF0000) >> 16;
            buffer[start + 2] = (int & 0xFF00) >> 8;
            buffer[start + 3] = int & 0xFF;
            return 4;
        } else {
            throw new Error("Unrepresentable value, too large: " + int);
        }
    }
}

module.exports = tools
