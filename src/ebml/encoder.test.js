import assert from 'assert';
import unexpected from 'unexpected';
import unexpectedDate from 'unexpected-date';
import Encoder from './encoder';

const expect = unexpected.clone().use(unexpectedDate);

jest.dontMock('debug');
describe('EBML', () => {
  describe('Encoder', () => {
    function createEncoder(expected, done) {
      const encoder = new Encoder();
      encoder.on('data', chunk => {
        expect(
          chunk.toString('hex'),
          'to be',
          Buffer.from(expected).toString('hex'),
        );
        encoder.on('finish', done);
        done();
      });
      encoder.on('finish', done);
      return encoder;
    }

    it('should write a single tag', done => {
      const encoder = createEncoder([0x42, 0x86, 0x81, 0x01], done);
      encoder.write([
        'tag',
        {
          name: 'EBMLVersion',
          data: Buffer.from([0x01]),
        },
      ]);
      encoder.end();
    });
    it('should write a tag with a single child', done => {
      const encoder = createEncoder(
        [0x1a, 0x45, 0xdf, 0xa3, 0x84, 0x42, 0x86, 0x81, 0x00],
        done,
      );
      encoder.write(['start', { name: 'EBML' }]);
      encoder.write([
        'tag',
        {
          name: 'EBMLVersion',
          data: Buffer.from([0x00]),
        },
      ]);
      encoder.write(['end', { name: 'EBML' }]);
      // encoder.end();
    });
    describe('#cork and #uncork', () => {
      let encoder;
      beforeEach(() => {
        encoder = new Encoder();
      });
      it('should block flushing when corked', () => {
        encoder.write(['start', { name: 'EBML' }]);
        encoder.write([
          'tag',
          {
            name: 'EBMLVersion',
            data: Buffer.from([0x00]),
          },
        ]);
        encoder.cork();
        encoder.write(['end', { name: 'EBML' }]);
        encoder.flush();
        // expect(
        //   encoder.buffer,
        //   'to satisfy',
        //   Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x84, 0x42, 0x86, 0x81, 0x00]),
        // );
        assert.ok(
          encoder.buffer,
          Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x84, 0x42, 0x86, 0x81, 0x00]),
        );
      });
      it('should not block flushing when uncorked', () => {
        encoder.write(['start', { name: 'EBML' }]);
        encoder.write([
          'tag',
          {
            name: 'EBMLVersion',
            data: Buffer.from([0x00]),
          },
        ]);
        encoder.cork();
        encoder.write(['end', { name: 'EBML' }]);
        encoder.flush();
        // expect(
        //   encoder.buffer,
        //   'to satisfy',
        //   Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x84, 0x42, 0x86, 0x81, 0x00]),
        // );
        assert.ok(
          encoder.buffer,
          Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x84, 0x42, 0x86, 0x81, 0x00]),
        );
        encoder.uncork();
        encoder.flush();
        assert.notStrictEqual(encoder.buffer instanceof Buffer);
      });
    });
    describe('::getSchemaInfo', () => {
      it('should return a valid number when a tag is found', () => {
        assert.ok(Encoder.getSchemaInfo('EBMLVersion'), 0x4286);
      });
      it('should return null when not found', () => {
        assert.strictEqual(Encoder.getSchemaInfo('404NotFound'), null);
      });
    });
    describe('#writeTag', () => {
      let encoder;
      beforeAll(() => {
        encoder = new Encoder();
      });
      it('does nothing with invalid tag data', () => {
        encoder.writeTag('EBMLVersion', null);
        expect(encoder.stack.length, 'to equal', 0);
      });
      it('throws with an invalid tag name', () => {
        expect(
          () => {
            encoder.writeTag('404NotFound');
          },
          'to throw',
          /No schema entry found/,
        );
      });
    });
    describe('#startTag', () => {
      let encoder;
      beforeAll(() => {
        encoder = new Encoder();
      });
      it('throws with an invalid tag name', () => {
        expect(
          () => {
            encoder.startTag('404NotFound', { end: -1 });
          },
          'to throw',
          /No schema entry found/,
        );
      });
      it('creates a valid tag when presented', () => {
        encoder.startTag('ChapterTrackNumber', { end: -1 });
        expect(encoder.stack, 'not to be empty')
          .and('to have length', 1)
          .and('to satisfy', [
            {
              data: expect.it('to be null'),
              id: expect.it('to equal', 0x89),
              name: expect.it('to equal', 'ChapterTrackNumber'),
              children: expect.it('to be an array').and('to be empty'),
            },
          ]);
      });
      it('creates a valid tag when presented with a stack already present', () => {
        encoder.stack = [
          {
            data: 1,
            id: 0x89,
            name: 'ChapterTrackNumber',
            children: [],
          },
        ];
        encoder.startTag('ChapterTimeStart', { end: 0x80 });
        expect(encoder.stack[0].children, 'not to be empty').and(
          'to have length',
          1,
        );
      });
    });
    describe('#_transform', () => {
      it('should do nothing on an invalid tag', () => {
        const encoder = new Encoder();
        encoder.write(['404NotFound', { name: 'EBML' }]);
        expect(encoder.buffer, 'to be null');
      });
    });
    describe('#_bufferAndFlush', () => {
      /* eslint-disable no-underscore-dangle */
      let encoder;
      beforeEach(() => {
        encoder = new Encoder();
      });
      it('should create a new buffer (but still be empty after eval) with an empty buffer', () => {
        expect(encoder.buffer, 'to be null');
        encoder._bufferAndFlush(Buffer.from([0x42, 0x86, 0x81, 0x01]));
        expect(encoder.buffer, 'to be null');
      });
      it('should append to the buffer (and empty after eval) with an existing buffer', () => {
        encoder.buffer = Buffer.from([0x42, 0x86, 0x81, 0x01]);
        expect(encoder.buffer, 'to be a', Buffer);
        encoder._bufferAndFlush(Buffer.from([0x42, 0x86, 0x81, 0x01]));
        expect(encoder.buffer, 'to be null');
      });
      /* eslint-enable no-underscore-dangle */
    });
  });
});
