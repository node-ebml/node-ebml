# EBML [![Build Status](https://travis-ci.org/node-ebml/node-ebml.png?branch=master)](https://travis-ci.org/node-ebml/node-ebml) [![NPM](https://nodei.co/npm/ebml.png?compact=true)](https://www.npmjs.com/package/ebml) [![Coverage Status](https://coveralls.io/repos/github/node-ebml/node-ebml/badge.svg?branch=master)](https://coveralls.io/github/node-ebml/node-ebml?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/node-ebml/node-ebml.svg)](https://greenkeeper.io/)

[EBML][EBML] stands for Extensible Binary Meta-Language and is somewhat of a
binary version of XML. It's used for container formats like [WebM][webm] or
[MKV][mkv].

## Note

This is for version `3.0.0` and up, which has undergone a *massive* rewrite and
now builds with [RollupJS][rollup].

Version `2.2.4` is the last version to have guaranteed legacy semantics.

# Install

Install via NPM or Yarn:

```bash
npm install ebml --save
# or
yarn add ebml
```

# Usage

The `Decoder()` class is implemented as a [Node Transform stream][node-stream-transform].
As input it takes EBML. As output it emits a sequence of chunks: two-element
arrays looking like this example.

```js
[ "tag",
  {
    name: "TimecodeScale",
    type: "u",
    value: 1000000
   }
 ]
```

The first element of the array is a short text string. For tags containing
values, like this example, the string is `'tag'`. ebml also has nesting tags.
The opening of those tags has the string `'start'` and the closing has the
string `'end'`. Integers stored in 6 bytes or less are represented as numbers,
and longer integers are represented as hexadecimal text strings.

The second element of the array is an object with these members, among others:

* `name` is the [Matroska][mkv] Element Name.
* `type` is the data type.
  * `u`: unsigned integer. Some of these are UIDs, coded as 128-bit numbers.
  * `i`: signed integer.
  * `f`: IEEE-754 floating point number.
  * `s`: printable ASCII text string.
  * `8`: printable utf-8 Unicode text string.
  * `d`: a 64-bit signed timestamp, in nanoseconds after (or before) `2001-01-01T00:00UTC`.
  * `b` binary data, otherwise uninterpreted.
* `value` is the value of the data in the element, represented as a number or a string.
* `data` is the binary data of the entire element stored in a [`Uint8Array`][MDN-Uint8Array].

Elements with the [`Block`][mkv-block] and  [`SimpleBlock`][mkv-sblock] types
get special treatment. They have these additional members:

* `payload` is the coded information in the element, stored in a  [`Uint8Array`][MDN-Uint8Array].
* `track` is an unsigned integer indicating the payload's track.
* `keyframe` is a Boolean value set to true if the payload starts an I frame (`SimpleBlocks` only).
* `discardable` is a Boolean value showing the value of the element's Discardable flag. (`SimpleBlocks` only).

And the `value` member shows the block's Timecode value.

# Examples

This example reads a media file into memory and decodes it. The `decoder`
invokes its `data` event for each Element.

```js
const fs = require('fs');
const { Decoder } = require('./lib/ebml.js');

const decoder = new Decoder();

decoder.on('data', chunk => console.log(chunk));

fs.readFile('media/test.webm', (err, data) => {
    if (err) {
        throw err;
    }
    decoder.write(data);
});
```

This example does the same thing, but by piping the file stream into the decoder (a Transform stream).

```js
const { Decoder } = require('./lib/ebml.js');

const ebmlDecoder = new Decoder();
const counts = {};

require('fs')
    .createReadStream('media/test.webm')
    .pipe(ebmlDecoder)
    .on('data', chunk => {
        const { name } = chunk[1];
        if (!counts[name]) {
            counts[name] = 0;
        }
        counts[name] += 1;
    })
    .on('finish', () => console.log(counts));
```

# State of this project

Parsing should work. If it doesn't, please create [an issue][new-issue].

`d`-type elements (timestamps) are not yet decoded to Javascript timestamp
values.

Thanks to @chrisprice we got an encoder!

# License

[MIT](./LICENSE)

# Contributors

(in alphabetical order)

* [Chris Price](https://github.com/chrisprice)
* [Davy Van Deursen](https://github.com/dvdeurse)
* [Ed Markowski](https://github.com/siphontv)
* [Jonathan Sifuentes](https://github.com/jayands)
* [Manuel Wiedenmann](https://github.com/fsmanuel)
* [Mark Schmale](https://github.com/themasch)
* [Mathias Buus](https://github.com/mafintosh)
* [Max Ogden](https://github.com/maxogden)
* [Oliver Jones](https://github.com/OllieJones)
* [Oliver Walzer](https://github.com/owcd)

[EBML]: http://ebml.sourceforge.net/
[new-issue]: https://github.com/node-ebml/node-ebml/issues/new
[MDN-Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
[node-stream-transform]: https://nodejs.org/api/stream.html#stream_class_stream_transform
[mkv]: http://www.matroska.org/technical/specs/index.html
[rollup]: https://rollupjs.org/
[mkv-block]: https://www.matroska.org/technical/specs/index.html#block_structure
[mkv-sblock]: https://www.matroska.org/technical/specs/index.html#simpleblock_structure
[webm]: https://www.webmproject.org/
