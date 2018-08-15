import { Transform } from 'stream';
import Buffers from 'buffers';
import schema from './schema';
import tools from './tools';

const debug = require('debug')('ebml:encoder');

function encodeTag(tagId, tagData, end) {
    if (end === -1) {
        return Buffers([
            tagId,
            Buffer.from('01ffffffffffffff', 'hex'),
            tagData
        ]);
    }
    return Buffers([tagId, tools.writeVint(tagData.length), tagData]);
}

/**
 * Encodes a raw EBML stream
 * @class EbmlEncoder
 * @extends Transform
 */
export default class EbmlEncoder extends Transform {
    /**
     * @type {Buffers}
     * @property
     * @private
     */
    mBuffer = null;

    /**
     * @private
     * @property
     * @type {Boolean}
     */
    mCorked = false;

    /**
     * @private
     * @property
     * @type {Array<{}>}
     */
    mStack = [];

    constructor(options = {}) {
        super({ ...options, writableObjectMode: true });
    }

    get buffer() {
        return this.mBuffer;
    }

    get corked() {
        return this.mCorked;
    }

    get stack() {
        return this.mStack;
    }

    set buffer(buffr) {
        this.mBuffer = buffr;
    }

    set corked(corked) {
        // cheap copy -- no check needed
        this.mCorked = corked;
    }

    set stack(stak) {
        this.mStack = stak;
    }

    /**
     *
     * @param {Array<[string, Object]>} chunk array of chunk data, starting with the tag
     * @param {String} enc the encoding type (not used)
     * @param {Function} done a callback method to call after the transformation
     */
    _transform(chunk, enc, done = () => {}) {
        const [tag, { data, name, ...rest }] = chunk;
        debug(`encode ${tag} ${name}`);

        switch (tag) {
            case 'start':
                this.startTag(name, { name, data, ...rest });
                break;
            case 'tag':
                this.writeTag(name, data);
                break;
            case 'end':
                this.endTag(name);
                break;
            default:
                break;
        }

        done();
    }

    /**
     * @private
     * @param {Function} done callback function
     */
    flush(done = () => {}) {
        if (!this.buffer || this.corked) {
            debug('no buffer/nothing pending');
            done();

            return;
        }

        debug(`writing ${this.buffer.length} bytes`);

        // console.info(`this.buffer.toBuffer = ${this.buffer.toBuffer()}`);

        const chunk = this.buffer.toBuffer();
        this.buffer = null;
        this.push(chunk);
        done();
    }

    /**
     * @private
     * @param {Buffer | Buffer[]} buffer
     */
    bufferAndFlush(buffer) {
        if (this.buffer) {
            this.buffer.push(buffer);
        } else {
            this.buffer = Buffers(buffer);
        }
        this.flush();
    }

    _flush(done) {
        this.flush(done);
    }

    _bufferAndFlush(buffer) {
        this.bufferAndFlush(buffer);
    }

    /**
     * gets a Buffer of the type of tagName
     * @static
     * @param  {string} tagName to be looked up
     * @return {Buffer}         A buffer containing the schema information
     */
    static getSchemaInfo(tagName) {
        const tagStr = Object.keys(schema).find(
            str => schema[str].name === tagName
        );
        if (tagStr) {
            return Buffer.from(tagStr, 'hex');
        }

        return null;
    }

    cork() {
        this.corked = true;
    }

    uncork() {
        this.corked = false;
        this.flush();
    }

    writeTag(tagName, tagData) {
        const tagId = EbmlEncoder.getSchemaInfo(tagName);
        if (!tagId) {
            throw new Error(`No schema entry found for ${tagName}`);
        }
        if (tagData) {
            const data = encodeTag(tagId, tagData);
            if (this.mStack.length > 0) {
                this.mStack[this.mStack.length - 1].children.push({ data });
            } else {
                this.bufferAndFlush(data.toBuffer());
            }
        }
    }

    /**
     *
     * @param {String} tagName The name of the tag to start
     * @param {{end: Number}} info an information object with a `end` parameter
     */
    startTag(tagName, { end }) {
        const tagId = EbmlEncoder.getSchemaInfo(tagName);
        if (!tagId) {
            throw new Error(`No schema entry found for ${tagName}`);
        }

        const tag = {
            id: tagId,
            name: tagName,
            end,
            children: []
        };

        if (this.mStack.length > 0) {
            this.mStack[this.mStack.length - 1].children.push(tag);
        }
        this.mStack.push(tag);
    }

    endTag() {
        const tag = this.mStack.pop();

        const childTagDataBuffers = tag.children.map(child => child.data);
        tag.data = encodeTag(tag.id, Buffers(childTagDataBuffers), tag.end);

        if (this.mStack.length < 1) {
            this.bufferAndFlush(tag.data.toBuffer());
        }
    }
}
