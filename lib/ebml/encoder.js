var Readable = require('stream').Readable,
    tools = require('./tools.js'),
    schema = require('./schema.js'),
    debug = require('debug')('ebml:encoder');

function EbmlEncoder(options) {

    Readable.call(this, options);

    options = options || {};

    this._schema = schema;
    this._buffer = new Buffer(1024);
    this._cursor = 0;

    this._root = {
        children: []
    };
    this._tag = this._root;
}

require('util').inherits(EbmlEncoder, Readable);

EbmlEncoder.prototype._read = function(size) {
    this.push(this._buffer);
    this.push(null);
};


// this._buffer = Buffer.concat([
//     tagId,
//     tools.writeVint(tagData.length),
//     tagData
// ])

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

EbmlEncoder.prototype.writeTag = function(tagName, tagData) {
    var tagId = this.getSchemaInfo(tagName);
    if (!tagId) {
        throw new Error('No schema entry found for ' + tagName);
    }

    this._tag.children.push({
        id: tagId,
        size: tools.writeVint(tagData.length),
        data: tagData
    });
};

EbmlEncoder.prototype.startTag = function(tagName) {
    var tagId = this.getSchemaInfo(tagName);
    if (!tagId) {
        throw new Error('No schema entry found for ' + tagName);
    }

    var tag = {
        id: tagId,
        size: null,
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

    this._tag = this._tag.parent;
};

module.exports = EbmlEncoder;
