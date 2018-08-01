const { Transform } = require('stream');
const debug = require('debug')('ebml:decoder');
const tools = require('./tools.js');
const schema = require('./schema.js');

const STATE_TAG = 1;
const STATE_SIZE = 2;
const STATE_CONTENT = 3;

export default class EbmlDecoder extends Transform {
    /**
     * @property
     * @private
     * @type {Uint8Array}
     */
    mU8Buffer = null;

    /**
     * @private
     * @property
     */
    mTagStack = [];

    /**
     * @property
     * @private
     * @type {Number}
     */
    mState = STATE_TAG;

    /**
     * @property
     * @private
     * @type {Number}
     */
    mCursor = 0;

    /**
     * @property
     * @private
     * @type {Number}
     */
    mTotal = 0;

    /**
     * @constructor
     * @param {TransformOptions} options The options to be passed along to the super class
     */
    constructor(options = {}) {
        super({ ...options, readableObjectMode: true });
    }

    get buffer() {
        return this.mU8Buffer;
    }

    get cursor() {
        return this.mCursor;
    }

    get state() {
        return this.mState;
    }

    _transform(chunk, enc, done) {
        if (!this.mU8Buffer) {
            this.mU8Buffer = new Uint8Array(chunk);
        } else {
            this.mU8Buffer = tools.concatenate(
                this.mU8Buffer,
                new Uint8Array(chunk)
            );
        }

        while (this.mCursor < this.mU8Buffer.length) {
            if (this.mState === STATE_TAG && !this.readTag()) {
                break;
            }
            if (this.mState === STATE_SIZE && !this.readSize()) {
                break;
            }
            if (this.mState === STATE_CONTENT && !this.readContent()) {
                break;
            }
        }

        done();
    }

    static getSchemaInfo(tagStr) {
        return (
            schema[tagStr] || {
                type: 'unknown',
                name: 'unknown'
            }
        );
    }

    readTag() {
        debug('parsing tag');

        if (this.mCursor >= this.mU8Buffer.length) {
            debug('waiting for more data');

            return false;
        }

        const start = this.mTotal;
        const tag = tools.readVint(this.mU8Buffer, this.mCursor);

        if (tag === null) {
            debug('waiting for more data');

            return false;
        }

        const tagStr = tools.readHexString(
            this.mU8Buffer,
            this.mCursor,
            this.mCursor + tag.length
        );

        this.mCursor += tag.length;
        this.mTotal += tag.length;
        this.mState = STATE_SIZE;

        const tagObj = {
            tag: tag.value,
            tagStr,
            type: EbmlDecoder.getSchemaInfo(tagStr).type,
            name: EbmlDecoder.getSchemaInfo(tagStr).name,
            start,
            end: start + tag.length
        };

        this.mTagStack.push(tagObj);
        debug(`read tag: ${tagStr}`);

        return true;
    }

    readSize() {
        const tagObj = this.mTagStack[this.mTagStack.length - 1];

        debug(`parsing size for tag: ${tagObj.tagStr}`);

        if (this.mCursor >= this.mU8Buffer.length) {
            debug('waiting for more data');

            return false;
        }

        const size = tools.readVint(this.mU8Buffer, this.mCursor);

        if (size == null) {
            debug('waiting for more data');

            return false;
        }

        this.mCursor += size.length;
        this.mTotal += size.length;
        this.mState = STATE_CONTENT;
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

    readContent() {
        const tagObj = this.mTagStack[this.mTagStack.length - 1];

        debug(`parsing content for tag: ${tagObj.tagStr}`);

        if (tagObj.type === 'm') {
            debug('content should be tags');
            this.push(['start', tagObj]);
            this.mState = STATE_TAG;

            return true;
        }

        if (this.mU8Buffer.length < this.mCursor + tagObj.dataSize) {
            debug(`got: ${this.mU8Buffer.length}`);
            debug(`need: ${this.mCursor + tagObj.dataSize}`);
            debug('waiting for more data');

            return false;
        }

        const data = this.mU8Buffer.subarray(
            this.mCursor,
            this.mCursor + tagObj.dataSize
        );
        this.mTotal += tagObj.dataSize;
        this.mState = STATE_TAG;
        this.mU8Buffer = this.mU8Buffer.subarray(
            this.mCursor + tagObj.dataSize
        );
        this.mCursor = 0;

        this.mTagStack.pop(); // remove the object from the stack

        this.push(['tag', tools.readDataFromTag(tagObj, Buffer.from(data))]);

        while (this.mTagStack.length > 0) {
            const topEle = this.mTagStack[this.mTagStack.length - 1];
            if (this.mTotal < topEle.end) {
                break;
            }
            this.push(['end', topEle]);
            this.mTagStack.pop();
        }

        debug(`read data: ${data.toString('hex')}`);

        return true;
    }
}
