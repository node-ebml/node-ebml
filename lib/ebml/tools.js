var log2 = 0.6931471805599453 // chosen by a fair dice roll... not

var tools =  {
    readVint: function(buffer, start) {
        start = start || 0;
        for (var length = 1; length <= 8; length++) {
            if (buffer[start] >= Math.pow(2, 8 - length)) {
                break;
            }
        }
        if (length > 8) {
            throw new Error("Unrepresentable length: " + length + " " +
                buffer.toString('hex', start, start + length));
        }
        if (start + length > buffer.length) {
            return null;
        }
        var value = buffer[start] & (1 << (8 - length)) - 1;
        for (i = 1; i < length; i++) {
            if (i === 7) {
                if (value >= Math.pow(2, 53 - 8) && buffer[start + 7] > 0) {
                    throw new Error("Unrepresentable value: " +
                        buffer.toString('hex', start, start + length));
                }
            }
            value *= Math.pow(2, 8);
            value += buffer[start + i];
        }
        return {
            length: length,
            value: value
        };
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
