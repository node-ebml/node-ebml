module.exports = class Tools {

    /**
     * read variable length integer per https://www.matroska.org/technical/specs/index.html#EBML_ex
     * @param {Uint8Array} buffer containing input
     * @param {Number} start position in buffer
     * @returns {*}  value / length object
     */
    static readVint(buffer, start) {
        start = start || 0;
        let length;
        for (length = 1; length <= 8; length++) {
            if (buffer[start] >= Math.pow(2, 8 - length)) {
                break;
            }
        }

        if (length > 8) {
            const number = Tools.readHexString(buffer, start, start + length);
            throw new Error(`Unrepresentable length: ${length} ${number}`);
        }

        if (start + length > buffer.length) {
            return null;
        }

        let value = buffer[start] & (1 << (8 - length)) - 1;
        for (let i = 1; i < length; i++) {
            if (i === 7) {
                if (value >= Math.pow(2, 53 - 8) && buffer[start + 7] > 0) {
                    return {
                        length: length,
                        value: -1
                    };
                }
            }
            value *= Math.pow(2, 8);
            value += buffer[start + i];
        }

        return {
            length: length,
            value: value
        };
    }

    /**
     * write variable length integer
     * @param {Number} value to store into buffer
     * @returns {Buffer} containing the value
     */
    static writeVint(value) {
        if (value < 0 || value > Math.pow(2, 53)) {
            throw new Error('Unrepresentable value: ' + value);
        }

        let length;
        for (length = 1; length <= 8; length++) {
            if (value < Math.pow(2, 7 * length) - 1) {
                break;
            }
        }

        const buffer = new Buffer(length);
        for (let i = 1; i <= length; i++) {
            const b = value & 0xFF;
            buffer[length - i] = b;
            value -= b;
            value /= Math.pow(2, 8);
        }
        buffer[0] = buffer[0] | (1 << (8 - length));
        return buffer;
    }

    /**
     * *
     * concatenate two arrays of bytes
     * @param {Uint8Array} a1  First array
     * @param {Uint8Array} a2  Second array
     * @returns  {Uint8Array} concatenated arrays
     */
    static concatenate(a1, a2) {
        if (!a1 || a1.byteLength === 0) {
            return a2;
        }
        if (!a2 || a2.byteLength === 0) {
            return a1;
        }
        const result = new Uint8Array(a1.byteLength + a2.byteLength);
        result.set(a1, 0);
        result.set(a2, a1.byteLength);
        a1 = null;
        a2 = null;
        return result;
    }

    /**
     * get a hex text string from Buff[start,end)
     * @param {Uint8Array} buff from which to read the string
     * @param {Number} start, default 0
     * @param {Number} end, default the whole buffer
     * @returns {string} the hex string
     */
    static readHexString(buff, start, end) {
        if (!start) {
            start = 0;
        }
        if (!end) {
            end = buff.byteLength;
        }

        let result = '';
        for (let p = start; p < end; p++) {
            const q = Number(buff[p] & 0xff);
            result += ('00' + q.toString(16)).substr(-2);
        }
        return result;
    }

    static readUtf8(buff) {
        if (typeof window === 'undefined') {
            return Buffer.from(buff).toString('utf8');
        }
        try {

            /* redmond Middle School science projects don't do this. */
            if (typeof TextDecoder !== 'undefined') {
                return new TextDecoder('utf8').decode(buff);
            }
            return null;
        } catch (exception) {
            return null;
        }
    }

    /**
     * get an unsigned number from a buffer
     * @param {Uint8Array} buff from which to read variable-length unsigned number
     * @returns {number} result (in hex for lengths > 6)
     */
    static readUnsigned(buff) {
        const b = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        switch (buff.byteLength) {
            case 1:
                return b.getUint8(0);
            case 2:
                return b.getUint16(0);
            case 4:
                return b.getUint32(0);
            default:
                break;
        }
        if (buff.byteLength <= 6) {
            let val = 0;
            for (let i = 0; i < buff.byteLength; i++) {
                val = (val * 256) + buff[i];
            }
            return val;
        }

        return Tools.readHexString(buff, 0, buff.byteLength);

    }

    static readSigned(buff) {
        const b = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        switch (buff.byteLength) {
            case 1:
                return b.getInt8(0);
            case 2:
                return b.getInt16(0);
            case 4:
                return b.getInt32(0);
            default:
                return NaN;
        }

    }

    static readFloat(buff) {
        const b = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        switch (buff.byteLength) {
            case 4:
                return b.getFloat32(0);
            case 8:
                return b.getFloat64(0);
            default:
                return NaN;
        }
    }

    static readDataFromTag(tagObj, data) {

        tagObj.data = data;
        switch (tagObj.type) {
            case 'u':
                tagObj.value = Tools.readUnsigned(data);
                break;
            case 'f':
                tagObj.value = Tools.readFloat(data);
                break;
            case 'i':
                tagObj.value = Tools.readSigned(data);
                break;
            case 's':
                tagObj.value = String.fromCharCode.apply(null, data);
                break;
            case '8':
                tagObj.value = Tools.readUtf8(data);
                break;
            default:
                break;
        }

        if (tagObj.name === 'SimpleBlock' || tagObj.name === 'Block') {
            let p = 0;
            const track = Tools.readVint(data, p);
            p += track.length;
            tagObj.track = track.value;
            tagObj.value = Tools.readSigned(data.subarray(p, p + 2));
            p += 2;
            if (tagObj.name === 'SimpleBlock') {
                tagObj.keyframe = Boolean(data[track.length + 2] & 0x80);
                tagObj.discardable = Boolean(data[track.length + 2] & 0x01);
            }
            p += 1;
            tagObj.payload = data.subarray(p);
        }
        return tagObj;
    }
};
