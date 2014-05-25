var Readable = require('stream').Readable,
    tools = require('./tools.js'),
    schema = require('./schema.js'),
    debug = require('debug')('ebml:encoder'),
    Buffers = require('buffers');

function EbmlEncoder(options) {

    Readable.call(this, options);

    options = options || {};

    this._schema = schema;
    this._cursor = 0;
    this._pending = 0;

    this._stack = [{
            children: []
        }];
}

require('util').inherits(EbmlEncoder, Readable);

EbmlEncoder.prototype._read = function(size) {
    debug('read ' + size);
    this._pending += size;
    this._flush();
};

EbmlEncoder.prototype._flush = function() {

    var buffer = this._stack[0].children[0] && this._stack[0].children[0].data;

    if (!buffer || this._pending === 0) {
        debug('no buffer/nothing pending');
        return;
    }

    debug('writing ' + this._pending + ' bytes');

    var chunk = buffer.slice(this._cursor, this._cursor + this._pending);
    this._cursor += this._pending;
    this._pending = 0;
    this.push(chunk);

    debug('remaining buffer ' + (buffer.length - this._cursor));

    if (this._cursor >= buffer.length) {
        debug('buffer empty');
        this.push(null);
    }
};


EbmlEncoder.prototype.getSchemaInfo = function(tagName) {
    var tagStrs = Object.keys(this._schema);
    for (var i = 0; i < tagStrs.length; i++) {
        var tagStr = tagStrs[i];
        if (this._schema[tagStr].name === tagName) {
            return new Buffer(tagStr, 'hex');
        }
    }
    return null;
};

EbmlEncoder.prototype._encodeTag = function(tagId, tagData) {
    return Buffers([tagId, tools.writeVint(tagData.length), tagData]);
};

EbmlEncoder.prototype.writeTag = function(tagName, tagData) {
    var tagId = this.getSchemaInfo(tagName);
    if (!tagId) {
        throw new Error('No schema entry found for ' + tagName);
    }

    this._stack[this._stack.length - 1].children.push({
        data: this._encodeTag(tagId, tagData)
    });

    this._flush();
};

EbmlEncoder.prototype.startTag = function(tagName) {
    var tagId = this.getSchemaInfo(tagName);
    if (!tagId) {
        throw new Error('No schema entry found for ' + tagName);
    }

    var tag = {
        id: tagId,
        children: []
    };
    this._stack[this._stack.length - 1].children.push(tag);
    this._stack.push(tag);
};

EbmlEncoder.prototype.endTag = function() {

    var tag = this._stack[this._stack.length - 1];

    var childTagDataBuffers = tag.children.map(function(child) {
        return child.data;
    });
    tag.data = this._encodeTag(tag.id, Buffers(childTagDataBuffers));
    this._stack.pop();

    if (this._stack.length === 1) {
        this._flush();
    }
};

module.exports = EbmlEncoder;
