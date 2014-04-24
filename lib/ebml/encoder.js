var Readable = require('stream').Readable
  , tools    = require('./tools.js')
  , schema   = require('./schema.js')
  , debug    = require('debug')('ebml:encoder')

function EbmlEncoder(options) {

    Readable.call(this, options)

    options = options || {}

    this._tag_stack    = []
    this._schema       = schema
}

require('util').inherits(EbmlDecoder, Readable)

EbmlDecoder.prototype._read = function(size) {

    var shouldPushMore = this.push(new Buffer(0));
}

EbmlDecoder.prototype.getSchemaInfo = function(tagName) {
    return this._schema.filter(function(tag) {
        return tag.name = tagName;
    })[0];
}


module.exports = EbmlEncoder
