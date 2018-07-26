const { Transform } = require('stream');
const tools = require('./tools.js');
const schema = require('./schema.js');
const debug = require('debug')('ebml:encoder');
const Buffers = require('buffers');

module.exports = class EbmlEncoder extends Transform {
    constructor (options = {}) {
        options.writableObjectMode = true;
        super(options);

        this._schema = schema;
        this._buffer = null;
        this._corked = false;

        this._stack = [];
    }

    _transform (chunk, enc, done) {
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
        }

        done();
    }

    _flush (done = () => {}) {

        if (!this._buffer || this._corked) {
            debug('no buffer/nothing pending');
            done();

            return;
        }

        debug(`writing ${this._buffer.length} bytes`);

        const chunk = this._buffer.toBuffer();
        this._buffer = null;
        this.push(chunk);
        done();
    }

    _bufferAndFlush (buffer) {
        if (this._buffer) {
            this._buffer.push(buffer);
        } else {
            this._buffer = Buffers([buffer]);
        }
        this._flush();
    }

    getSchemaInfo (tagName) {
        const tagStrs = Object.keys(this._schema)
            .find(tagStr => this._schema[tagStr].name === tagName);
        if (tagStrs) {
            return Buffer.from(tagStrs, 'hex');
        }

        return null;
    }

    cork () {
        this._corked = true;
    }

    uncork () {
        this._corked = false;
        this._flush();
    }

    _encodeTag (tagId, tagData, end) {
        return Buffers([tagId, end === -1 ? Buffer.from('01ffffffffffffff', 'hex') : tools.writeVint(tagData.length), tagData]);
    }

    writeTag (tagName, tagData) {
        const tagId = this.getSchemaInfo(tagName);
        if (!tagId) {
            throw new Error(`No schema entry found for ${tagName}`);
        }

        const data = this._encodeTag(tagId, tagData);
        if (this._stack.length > 0) {
            this._stack[this._stack.length - 1].children.push({ data: data });
        } else {
            this._bufferAndFlush(data.toBuffer());
        }
    }

    startTag (tagName, info) {
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

        if (this._stack.length > 0) {
            this._stack[this._stack.length - 1].children.push(tag);
        }
        this._stack.push(tag);
    }

    endTag () {
        const tag = this._stack.pop();

        const childTagDataBuffers = tag.children.map((child) => child.data);
        tag.data = this._encodeTag(tag.id, Buffers(childTagDataBuffers), tag.end);

        if (this._stack.length < 1) {
            this._bufferAndFlush(tag.data.toBuffer());
        }
    }
};
