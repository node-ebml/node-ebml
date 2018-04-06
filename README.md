# EBML [![Build Status](https://travis-ci.org/themasch/node-ebml.png?branch=master)](https://travis-ci.org/themasch/node-ebml) [![NPM](https://nodei.co/npm/ebml.png?compact=true)](https://www.npmjs.com/package/ebml)

[![Greenkeeper badge](https://badges.greenkeeper.io/themasch/node-ebml.svg)](https://greenkeeper.io/)

[EBML](http://ebml.sourceforge.net/) stands for Extensible Binary Meta-Language
and is some what of a binary version of XML.
It's used for container formats like webm or [mkv](http://www.matroska.org/technical/specs/index.html)

# install

```
npm install ebml --save
```

# example

```js
const ebml = require('./index.js');
const fs = require('fs');

const decoder = new ebml.Decoder();

decoder.on('data', function(chunk) {
    console.log(chunk);
});

fs.readFile('media/test.webm', function(err, data) {
    if (err)
        throw err;
    decoder.write(data);
});
```

# state of this project

Parsing should work. If it doesn't, please create [an issue](https://github.com/themasch/node-ebml/issues/new).

Thanks to @chrisprice we got an encoder!

# license

MIT

# contributors

(in alphabetical order)

* [Chris Price](https://github.com/chrisprice)
* [Davy Van Deursen](https://github.com/dvdeurse)
* [Ed Markowski](https://github.com/siphontv)
* [Manuel Wiedenmann](https://github.com/fsmanuel)
* [Mark Schmale](https://github.com/themasch)
* [Mathias Buus](https://github.com/mafintosh)
* [Max Ogden](https://github.com/maxogden)
* [Oliver Walzer](https://github.com/owcd)
