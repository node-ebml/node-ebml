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

    this._root = {
        id: new Buffer([]),
        children: []
    };
    this._tag = this._root;
}

require('util').inherits(EbmlEncoder, Readable);

EbmlEncoder.prototype._read = function(size) {
    debug('read ' + size);
    this._pending += size;
    this._flush();
};

EbmlEncoder.prototype._flush = function() {

    var buffer = this._root.children[0] && this._root.children[0].data;

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

    this._tag.children.push({
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
        parent: this._tag,
        children: []
    };
    this._tag.children.push(tag);
    this._tag = tag;
};

EbmlEncoder.prototype.endTag = function() {
    if (this._tag.parent == null) {
        throw new Error('Invalid state');
    }

    var childTagDataBuffers = this._tag.children.map(function(child) {
        return child.data;
    });
    this._tag.data = this._encodeTag(this._tag.id, Buffers(childTagDataBuffers));
    this._tag = this._tag.parent;

    if (this._tag === this._root) {
        this._flush();
    }
};

module.exports = EbmlEncoder;
