var Writable = require('stream').Writable
  , tools    = require('./tools.js')
  , schema   = require('./schema.js')
  , debug    = require('debug')('ebml:decoder')

var STATE_TAG     = 1
  , STATE_SIZE    = 2
  , STATE_CONTENT = 3


function EbmlDecoder(options) {

    Writable.call(this, options)

    options = options || {}

    this._buffer       = null
    this._tag_stack    = []
    this._state        = STATE_TAG
    this._cursor       = 0
    this._total        = 0
    this._schema       = schema
}

require('util').inherits(EbmlDecoder, Writable)

EbmlDecoder.prototype._write = function(chunk, enc, done) {

    if(this._buffer === null) {
        this._buffer = chunk
    } else {
        this._buffer = Buffer.concat([this._buffer, chunk])
    }

    while(this._cursor < this._buffer.length) {
        if(this._state === STATE_TAG && !this.readTag()) {
            break
        }
        if(this._state === STATE_SIZE && !this.readSize()) {
            break
        }
        if(this._state === STATE_CONTENT && !this.readContent()) {
            break
        }
    }

    done()
}

EbmlDecoder.prototype.getSchemaInfo = function(tagStr) {
    return this._schema[tagStr]
}

EbmlDecoder.prototype.readTag = function() {

    debug('parsing tag')

    if (this._cursor >= this._buffer.length) {
        debug('waiting for more data')
        return false;
    }

    var start = this._total
    var tagFirstByte = this._buffer[this._cursor]
    var tagLength = tools.getVintLength(tagFirstByte)

    if(this._buffer.length < this._cursor + tagLength) {
        debug('got: ' + this._buffer.length)
        debug('need: '+ (this._cursor + tagLength))
        debug('waiting for more data')
        return false
    }

    var tag     = this._buffer.slice(this._cursor, this._cursor + tagLength)
    var tagId   = tools.calcInt(tag)
    var tagStr  = tag.toString('hex')

    this._cursor += tagLength
    this._total  += tagLength
    this._state   = STATE_SIZE

    tagObj = {
        tag:    tagId,
        tagStr: tagStr,
        type:   this.getSchemaInfo(tagStr).type,
        name:   this.getSchemaInfo(tagStr).name,
        start:  start,
        end:    start + tagLength
    }

    this._tag_stack.push(tagObj)
    debug('read tag: ' + tagId.toString(16))

    return true
}

EbmlDecoder.prototype.readSize = function() {

    var tagObj = this._tag_stack[this._tag_stack.length - 1]

    debug('parsing size for tag: ' + tagObj.tag.toString(16))

    if (this._cursor >= this._buffer.length) {
        debug('waiting for more data')
        return false;
    }

    var sizeFirstByte = this._buffer[this._cursor]
    var sizeLength = tools.getVintLength(sizeFirstByte)

    if(this._buffer.length < this._cursor + sizeLength) {
        debug('got: ' + this._buffer.length)
        debug('need: ' + (this._cursor + sizeLength))
        debug('waiting for more data')
        return false
    }

    var size = this._buffer.slice(this._cursor, this._cursor + sizeLength)
    var dataSize  = tools.calcDataSize(size)
    this._cursor += sizeLength
    this._total  += sizeLength
    this._state   = STATE_CONTENT
    tagObj.dataSize = dataSize
    tagObj.end     += dataSize + sizeLength

    debug('read size: ' + dataSize)

    return true
}

EbmlDecoder.prototype.readContent = function() {

    var tagObj = this._tag_stack[this._tag_stack.length - 1]

    debug('parsing content for tag: ' + tagObj.tag.toString(16))

    if(tagObj.type === 'm') {
        debug('content should be tags')
        this.emit(tagObj.name, tagObj)
        this._state = STATE_TAG
        return true
    }

    if(this._buffer.length < this._cursor + tagObj.dataSize) {
        debug('got: ' + this._buffer.length)
        debug('need: ' + (this._cursor + tagObj.dataSize))
        debug('waiting for more data')
        return false
    }

    var data = this._buffer.slice(this._cursor, this._cursor + tagObj.dataSize)
    this._total += tagObj.dataSize
    this._state  = STATE_TAG
    this._buffer = this._buffer.slice(this._cursor+tagObj.dataSize)
    this._cursor = 0

    this._tag_stack.pop() // remove the object from the stack

    tagObj.data = data
    this.emit(tagObj.name, tagObj)

    while(this._tag_stack.length > 0) {
        var topEle = this._tag_stack[this._tag_stack.length - 1]
        if(this._total < topEle.end) {
            break
        }
        this.emit(topEle.name + ':end', topEle)
        this._tag_stack.pop()
    }

    debug('read data: ' + data.toString('hex'))
    return true
}

module.exports = EbmlDecoder
