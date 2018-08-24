export default class Tools {
    /**
     * read variable length integer per
     * https://www.matroska.org/technical/specs/index.html#EBML_ex
     * @param {Buffer} buffer containing input
     * @param {Number} [start=0] position in buffer
     * @returns {{length: Number, value: Object}}  value / length object
     */
    static readVint(buffer, start = 0) {
        const length = 8 - Math.floor(Math.log2(buffer[start]));
        if (length > 8) {
            const number = Tools.readHexString(buffer, start, start + length);
            throw new Error(`Unrepresentable length: ${length} ${number}`);
        }

        if (start + length > buffer.length) {
            return null;
        }

        let value = buffer[start] & ((1 << (8 - length)) - 1);
        for (let i = 1; i < length; i += 1) {
            if (i === 7) {
                if (value >= 2 ** 8 && buffer[start + 7] > 0) {
                    return {
                        length,
                        value: -1,
                    };
                }
            }
            value *= 2 ** 8;
            value += buffer[start + i];
        }

        return {
            length,
            value,
        };
    }

    /**
     * write variable length integer
     * @param {Number} value to store into buffer
     * @returns {Buffer} containing the value
     */
    static writeVint(value) {
        if (value < 0 || value > 2 ** 53) {
            throw new Error(`Unrepresentable value: ${value}`);
        }

        let length = 1;
        for (length = 1; length <= 8; length += 1) {
            if (value < 2 ** (7 * length) - 1) {
                break;
            }
        }

        const buffer = Buffer.alloc(length);
        let val = value;
        for (let i = 1; i <= length; i += 1) {
            const b = val & 0xff;
            buffer[length - i] = b;
            val -= b;
            val /= 2 ** 8;
        }
        buffer[0] |= 1 << (8 - length);

        return buffer;
    }

    /**
     * *
     * concatenate two arrays of bytes
     * @param {Buffer} a1  First array
     * @param {Buffer} a2  Second array
     * @returns  {Buffer} concatenated arrays
     */
    static concatenate(a1, a2) {
        if (!a1 || a1.byteLength === 0) {
            return a2;
        }
        if (!a2 || a2.byteLength === 0) {
            return a1;
        }

        return Buffer.from([...a1, ...a2]);
    }

    /**
     * get a hex text string from Buff[start,end)
     * @param {Buffer} buff from which to read the string
     * @param {Number} [start=0] starting point (default 0)
     * @param {Number} [end=buff.byteLength] ending point (default the whole buffer)
     * @returns {string} the hex string
     */
    static readHexString(buff, start = 0, end = buff.byteLength) {
        return Array.from(buff.slice(start, end))
            .map(q => Number(q).toString(16))
            .reduce((acc, current) => `${acc}${current.padStart(2, '0')}`, '');
    }

    /**
     * tries to read out a UTF-8 encoded string
     * @param  {Buffer} buff the buffer to attempt to read from
     * @return {string|null}      the decoded text, or null if unable to
     */
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
     * @param {Buffer} buff from which to read variable-length unsigned number
     * @returns {number|string} result (in hex for lengths > 6)
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
            return buff.reduce((acc, current) => acc * 256 + current, 0);
        }

        return Tools.readHexString(buff, 0, buff.byteLength);
    }

    /**
     * get an signed number from a buffer
     * @static
     * @param {Buffer} buff from which to read variable-length signed number
     * @returns {number} result
     */
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

    /**
     * get an floating-point number from a buffer
     * @static
     * @param {Buffer} buff from which to read variable-length floating-point number
     * @returns {number} result
     */
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

    /**
     * Reads the data from a tag
     * @static
     * @param  {{type: string, name: string, discardable: Boolean, keyframe: Boolean, payload: Buffer, track: Object}} tagObj The tag object to be read
     * @param  {Buffer} data Data to be transformed
     * @return {{ data: Buffer, discardable: Boolean, keyframe: Boolean, payload: Buffer, track: Object, value: number| string }} result
     */
    static readDataFromTag(tagObj, data) {
        const { type, name } = tagObj;
        let { track } = tagObj;
        let discardable = tagObj.discardable || false;
        let keyframe = tagObj.keyframe || false;
        let payload = null;
        let value;

        switch (type) {
            case 'u':
                value = Tools.readUnsigned(data);
                break;
            case 'f':
                value = Tools.readFloat(data);
                break;
            case 'i':
                value = Tools.readSigned(data);
                break;
            case 's':
                value = String.fromCharCode(...data);
                break;
            case '8':
                value = Tools.readUtf8(data);
                break;
            default:
                break;
        }

        if (name === 'SimpleBlock' || name === 'Block') {
            let p = 0;
            const trk = Tools.readVint(data, p);
            p += trk.length;
            track = trk.value;
            value = Tools.readSigned(data.subarray(p, p + 2));
            p += 2;
            if (name === 'SimpleBlock') {
                keyframe = Boolean(data[trk.length + 2] & 0x80);
                discardable = Boolean(data[trk.length + 2] & 0x01);
            }
            p += 1;
            payload = data.subarray(p);
        }

        return {
            ...tagObj,
            data,
            discardable,
            keyframe,
            payload,
            track,
            value,
        };
    }
}
