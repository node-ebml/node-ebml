import { Transform } from 'stream';
import schema from './schema';
import tools from './tools';

const debug = require('debug')('ebml:encoder');

function encodeTag(tagId, tagData, end) {
  let data = [ Buffer.from(tagId.toString(16), 'hex') ];
  if (end === -1) {
    data.push( Buffer.from('01ffffffffffffff', 'hex') );
  } else {
    data.push( tools.writeVint(tagData.length) );
  }

  // cast ArrayBuffer to Buffer
  if (!(tagData instanceof Buffer)) {
    tagData=Buffer.from(tagData);
  }
  data.push(tagData);
  return Buffer.concat(data);
}

/**
 * Encodes a raw EBML stream
 * @class EbmlEncoder
 * @extends Transform
 */
export default class EbmlEncoder extends Transform {
  /**
   * @type {Buffer}
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
   * @type {Array<Tag>}
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

  set buffer(buffer) {
    this.mBuffer = buffer;
  }

  set corked(corked) {
    this.mCorked = corked;
  }

  set stack(stak) {
    this.mStack = stak;
  }

  /**
   *
   * @param {[string, Tag]} chunk array of chunk data, starting with the tag
   * @param {string} enc the encoding type (not used)
   * @param {Function} done a callback method to call after the transformation
   */
  _transform(chunk, enc, done) {
    const [tag, { data, name, ...rest }] = chunk;
    /* istanbul ignore if */
    if (debug.enabled) {
      debug(`encode ${tag} ${name}`);
    }

    switch (tag) {
      case 'start':
        this.startTag(name, { ...rest });
        break;
      case 'tag':
        this.writeTag(name, data);
        break;
      case 'end':
        this.endTag();
        break;
      default:
        break;
    }

    return done();
  }

  /**
   * @private
   * @param {Function} done callback function
   */
  flush(done = () => {}) {
    if (!this.buffer || this.corked) {
      /* istanbul ignore if */
      if (debug.enabled) {
        debug('no buffer/nothing pending');
      }
      return done();
    }

    if (this.buffer.byteLength === 0) {
      /* istanbul ignore if */
      if (debug.enabled) {
        debug('empty buffer');
      }
      return done();
    }

    /* istanbul ignore if */
    if (debug.enabled) {
      debug(`writing ${this.buffer.length} bytes`);
    }

    const chunk = Buffer.from(this.buffer);
    this.buffer = null;
    this.push(chunk);
    return done();
  }

  /**
   * @private
   * @param {Buffer | Buffer[]} buffer
   */
  bufferAndFlush(buffer) {
    this.buffer = tools.concatenate(this.buffer, buffer);
    this.flush();
  }

  _flush(done = () => {}) {
    this.flush(done);
  }

  _bufferAndFlush(buffer) {
    this.bufferAndFlush(buffer);
  }

  /**
   * gets the ID of the type of tagName
   * @static
   * @param  {string} tagName to be looked up
   * @return {number}         A buffer containing the schema information
   */
  static getSchemaInfo(tagName) {
    const tagId = Array.from(schema.keys()).find(
      str => schema.get(str).name === tagName,
    );
    if (tagId) {
      return tagId;
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
      if (this.stack.length > 0) {
        this.stack[this.stack.length - 1].children.push({ data });
      } else {
        this.bufferAndFlush(data);
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
      data: null,
      id: tagId,
      name: tagName,
      end,
      children: [],
    };

    if (this.stack.length > 0) {
      this.stack[this.stack.length - 1].children.push(tag);
    }
    this.stack.push(tag);
  }

  endTag() {
    const tag = this.stack.pop() || {
      children: [],
      data: { buffer: Buffer.from([]) },
    };
    const childTagDataBuffers = tag.children.map(child => child.data);
    tag.data = encodeTag(tag.id, Buffer.concat(childTagDataBuffers), tag.end);
    if (this.stack.length < 1) {
      this.bufferAndFlush(tag.data);
    }
  }
}
