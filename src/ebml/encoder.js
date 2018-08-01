const { Transform } = require('stream');
const debug = require('debug')('ebml:encoder');
const Buffers = require('buffers');
const schema = require('./schema.js');
const tools = require('./tools.js');

export function encodeTag(tagId, tagData, end) {
    return Buffers([
        tagId,
        end === -1
            ? Buffer.from('01ffffffffffffff', 'hex')
            : tools.writeVint(tagData.length),
        tagData
    ]);
}
export default class EbmlEncoder extends Transform {
    /**
     * @private
     * @property
     * @type {EbmlSchema}
     */
    mSchema = schema;

    /**
     * @type {Uint8Array}
     * @property
     * @private
     */
    mU8Buffer = null;

    /**
     * @private
     * @property
     * @type {Boolean}
     */
    mCorked = false;

    mStack = [];

    constructor(options = {}) {
        super({ ...options, writableObjectMode: true });
    }

    _transform(chunk, enc, done) {
        debug(`encode ${chunk[0]} ${chunk[1].name}`);

        switch (chunk[0]) {
            case 'start':
                this.startTag(chunk[1].name, chunk[1]);
                break;
            case 'tag':
                this.writeTag(chunk[1].name, chunk[1].data);
                break;
            case 'end':
                this.endTag(chunk[1].name);
                break;
            default:
                break;
        }

        done();
    }

    _flush(done = () => {}) {
        if (!this.mU8Buffer || this.mCorked) {
            debug('no buffer/nothing pending');
            done();

            return;
        }

        debug(`writing ${this.mU8Buffer.length} bytes`);

        const chunk = this.mU8Buffer.toBuffer();
        this.mU8Buffer = null;
        this.push(chunk);
        done();
    }

    _bufferAndFlush(buffer) {
        if (this.mU8Buffer) {
            this.mU8Buffer.push(buffer);
        } else {
            this.mU8Buffer = Buffers([buffer]);
        }
        this._flush();
    }

    getSchemaInfo(tagName) {
        const tagStr = Object.keys(this.mSchema).find(
            str => this.mSchema[str].name === tagName
        );
        if (tagStr) {
            return Buffer.from(tagStr, 'hex');
        }

        return null;
    }

    cork() {
        this.mCorked = true;
    }

    uncork() {
        this.mCorked = false;
        this._flush();
    }

    writeTag(tagName, tagData) {
        const tagId = this.getSchemaInfo(tagName);
        if (!tagId) {
            throw new Error(`No schema entry found for ${tagName}`);
        }
        if (tagData) {
            const data = encodeTag(tagId, tagData);
            if (this.mStack.length > 0) {
                this.mStack[this.mStack.length - 1].children.push({ data });
            } else {
                this._bufferAndFlush(data.toBuffer());
            }
        }
    }

    startTag(tagName, info) {
        const tagId = this.getSchemaInfo(tagName);
        if (!tagId) {
            throw new Error(`No schema entry found for ${tagName}`);
        }

        const tag = {
            id: tagId,
            name: tagName,
            end: info.end,
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
            this._bufferAndFlush(tag.data.toBuffer());
        }
    }
}
