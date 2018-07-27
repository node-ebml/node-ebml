const {Transform} = require('stream');
const tools = require('./tools.js');
const schema = require('./schema.js');
const debug = require('debug')('ebml:decoder');

const STATE_TAG = 1;


const STATE_SIZE = 2;


const STATE_CONTENT = 3;

module.exports = class EbmlDecoder extends Transform {
    constructor (options = {}) {
        options.readableObjectMode = true;
        super(options);

        this._buffer = null;
        this._tag_stack = [];
        this._state = STATE_TAG;
        this._cursor = 0;
        this._total = 0;
        this._schema = schema;
    }

    _transform (chunk, enc, done) {

        if (this._buffer === null) {
            this._buffer = new Uint8Array(chunk);
        } else {
            this._buffer = tools.concatenate(this._buffer, new Uint8Array(chunk));
        }

        while (this._cursor < this._buffer.length) {
            if (this._state === STATE_TAG && !this.readTag()) {
                break;
            }
            if (this._state === STATE_SIZE && !this.readSize()) {
                break;
            }
            if (this._state === STATE_CONTENT && !this.readContent()) {
                break;
            }
        }

        done();
    }

    getSchemaInfo (tagStr) {
        return this._schema[tagStr] || {
            type: 'unknown',
            name: 'unknown'
        };
    }

    readTag () {

        debug('parsing tag');

        if (this._cursor >= this._buffer.length) {
            debug('waiting for more data');

            return false;
        }

        const start = this._total;
        const tag = tools.readVint(this._buffer, this._cursor);

        if (tag == null) {
            debug('waiting for more data');

            return false;
        }

        const tagStr = tools.readHexString(this._buffer, this._cursor, this._cursor + tag.length);

        this._cursor += tag.length;
        this._total += tag.length;
        this._state = STATE_SIZE;

        const tagObj = {
            tag: tag.value,
            tagStr: tagStr,
            type: this.getSchemaInfo(tagStr).type,
            name: this.getSchemaInfo(tagStr).name,
            start: start,
            end: start + tag.length
        };

        this._tag_stack.push(tagObj);
        debug(`read tag: ${tagStr}`);

        return true;
    }

    readSize () {

        const tagObj = this._tag_stack[this._tag_stack.length - 1];

        debug(`parsing size for tag: ${tagObj.tagStr}`);

        if (this._cursor >= this._buffer.length) {
            debug('waiting for more data');

            return false;
        }


        const size = tools.readVint(this._buffer, this._cursor);

        if (size == null) {
            debug('waiting for more data');

            return false;
        }

        this._cursor += size.length;
        this._total += size.length;
        this._state = STATE_CONTENT;
        tagObj.dataSize = size.value;

        // unknown size
        if (size.value === -1) {
            tagObj.end = -1;
        } else {
            tagObj.end += size.value + size.length;
        }

        debug(`read size: ${size.value}`);

        return true;
    }

    readContent () {

        const tagObj = this._tag_stack[this._tag_stack.length - 1];

        debug(`parsing content for tag: ${tagObj.tagStr}`);

        if (tagObj.type === 'm') {
            debug('content should be tags');
            this.push(['start', tagObj]);
            this._state = STATE_TAG;

            return true;
        }

        if (this._buffer.length < this._cursor + tagObj.dataSize) {
            debug(`got: ${this._buffer.length}`);
            debug(`need: ${this._cursor + tagObj.dataSize}`);
            debug('waiting for more data');

            return false;
        }

        const data = this._buffer.subarray(this._cursor, this._cursor + tagObj.dataSize);
        this._total += tagObj.dataSize;
        this._state = STATE_TAG;
        this._buffer = this._buffer.subarray(this._cursor + tagObj.dataSize);
        this._cursor = 0;

        this._tag_stack.pop(); // remove the object from the stack


        this.push(['tag', tools.readDataFromTag(tagObj, Buffer.from(data))]);

        while (this._tag_stack.length > 0) {
            const topEle = this._tag_stack[this._tag_stack.length - 1];
            if (this._total < topEle.end) {
                break;
            }
            this.push(['end', topEle]);
            this._tag_stack.pop();
        }

        debug(`read data: ${data.toString('hex')}`);

        return true;
    }
};
