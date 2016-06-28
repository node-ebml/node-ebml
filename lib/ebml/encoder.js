var Transform = require('stream').Transform,
    tools = require('./tools.js'),
    schema = require('./schema.js'),
    debug = require('debug')('ebml:encoder'),
    Buffers = require('buffers');

function EbmlEncoder(options) {
    options = options || {};
    options.writableObjectMode = true;
    Transform.call(this, options);

    this._schema = schema;
    this._buffer = null;
    this._corked = false;

    this._stack = [];
}

require('util').inherits(EbmlEncoder, Transform);

EbmlEncoder.prototype._transform = function(chunk, enc, done) {
    debug('encode ' + chunk[0] + ' ' + chunk[1].name);

    if(chunk[0] === 'start') {
        this.startTag(chunk[1].name, chunk[1]);
    } else if(chunk[0] === 'tag') {
        this.writeTag(chunk[1].name, chunk[1].data);
    } else if(chunk[0] === 'end') {
        this.endTag(chunk[1].name);
    }

    done();
};

EbmlEncoder.prototype._flush = function(done) {
    done = done || function(){};
    if (!this._buffer || this._corked) {
        debug('no buffer/nothing pending');
        done();
        return;
    }

    debug('writing ' + this._buffer.length + ' bytes');

    var chunk = this._buffer.toBuffer();
    this._buffer = null;
    this.push(chunk);
    done();
};

EbmlEncoder.prototype._bufferAndFlush = function(buffer) {
    if(this._buffer) {
        this._buffer.push(buffer);
    } else {
        this._buffer = Buffers([buffer]);
    }
    this._flush();
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

EbmlEncoder.prototype.cork = function() {
    this._corked = true;
};

EbmlEncoder.prototype.uncork = function() {
    this._corked = false;
    this._flush();
};

EbmlEncoder.prototype._encodeTag = function(tagId, tagData, end) {
    return Buffers([tagId, end === -1 ? Buffer('01ffffffffffffff', 'hex') : tools.writeVint(tagData.length), tagData]);
};

EbmlEncoder.prototype.writeTag = function(tagName, tagData) {
    var tagId = this.getSchemaInfo(tagName);
    if (!tagId) {
        throw new Error('No schema entry found for ' + tagName);
    }

    var data = this._encodeTag(tagId, tagData);
    if(this._stack.length > 0) {
        this._stack[this._stack.length - 1].children.push({
            data: data
        });
    } else {
        this._bufferAndFlush(data.toBuffer());
    }
};

EbmlEncoder.prototype.startTag = function(tagName, info) {
    var tagId = this.getSchemaInfo(tagName);
    if (!tagId) {
        throw new Error('No schema entry found for ' + tagName);
    }

    var tag = {
        id: tagId,
        name: tagName,
        end: info.end,
        children: []
    };

    if(this._stack.length > 0) {
        this._stack[this._stack.length - 1].children.push(tag);
    }
    this._stack.push(tag);
};

EbmlEncoder.prototype.endTag = function(tagName) {
    var tag = this._stack.pop();

    var childTagDataBuffers = tag.children.map(function(child) {
        return child.data;
    });
    tag.data = this._encodeTag(tag.id, Buffers(childTagDataBuffers), tag.end);

    if (this._stack.length < 1) {
        this._bufferAndFlush(tag.data.toBuffer());
    }
};

module.exports = EbmlEncoder;
