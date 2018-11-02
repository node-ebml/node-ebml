import unexpected from 'unexpected';
import unexpectedDate from 'unexpected-date';

import Decoder from './decoder';

const expect = unexpected.clone().use(unexpectedDate);

const STATE_TAG = 1;
const STATE_SIZE = 2;
const STATE_CONTENT = 3;

describe('EBML', () => {
  describe('Decoder', () => {
    it('should wait for more data if a tag is longer than the buffer', () => {
      const decoder = new Decoder();
      decoder.write(Buffer.from([0x1a, 0x45]));

      expect(decoder.state, 'to be', STATE_TAG);
      expect(decoder.buffer.length, 'to be', 2);
      expect(decoder.cursor, 'to be', 0);
    });

    it('should clear the buffer after a full tag is written in one chunk', () => {
      const decoder = new Decoder();
      decoder.write(Buffer.from([0x42, 0x86, 0x81, 0x01]));

      expect(decoder.state, 'to be', STATE_TAG);
      expect(decoder.buffer.length, 'to be', 0);
      expect(decoder.cursor, 'to be', 0);
    });

    it('should clear the buffer after a full tag is written in multiple chunks', () => {
      const decoder = new Decoder();

      decoder.write(Buffer.from([0x42, 0x86]));
      decoder.write(Buffer.from([0x81, 0x01]));

      expect(decoder.state, 'to be', STATE_TAG);
      expect(decoder.buffer.length, 'to be', 0);
      expect(decoder.cursor, 'to be', 0);
    });

    it('should increment the cursor on each step', () => {
      const decoder = new Decoder();

      decoder.write(Buffer.from([0x42])); // 4

      expect(decoder.state, 'to be', STATE_TAG);
      expect(decoder.buffer.length, 'to be', 1);
      expect(decoder.cursor, 'to be', 0);

      decoder.write(Buffer.from([0x86])); // 5

      expect(decoder.state, 'to be', STATE_SIZE);
      expect(decoder.buffer.length, 'to be', 2);
      expect(decoder.cursor, 'to be', 2);

      decoder.write(Buffer.from([0x81])); // 6 & 7

      expect(decoder.state, 'to be', STATE_CONTENT);
      expect(decoder.buffer.length, 'to be', 3);
      expect(decoder.cursor, 'to be', 3);

      decoder.write(Buffer.from([0x01])); // 6 & 7

      expect(decoder.state, 'to be', STATE_TAG);
      expect(decoder.buffer.length, 'to be', 0);
      expect(decoder.cursor, 'to be', 0);
    });

    it('should emit correct tag events for simple data', done => {
      const decoder = new Decoder();
      decoder.on('data', ([state, { dataSize, tag, type, tagStr, data }]) => {
        expect(state, 'to be', 'tag');
        expect(tag, 'to be', 0x286);
        expect(tagStr, 'to be', '4286');
        expect(dataSize, 'to be', 0x01);
        expect(type, 'to be', 'u');
        expect(data, 'to equal', Buffer.from([0x01]));
        done();
        decoder.on('finish', done);
      });
      decoder.on('finish', done);
      decoder.write(Buffer.from([0x42, 0x86, 0x81, 0x01]));
      decoder.end();
    });

    it('should emit correct EBML tag events for master tags', done => {
      const decoder = new Decoder();

      decoder.on('data', ([state, { dataSize, tag, type, tagStr, data }]) => {
        expect(state, 'to be', 'start');
        expect(tag, 'to be', 0x0a45dfa3);
        expect(tagStr, 'to be', '1a45dfa3');
        expect(dataSize, 'to be', 0);
        expect(type, 'to be', 'm');
        expect(data, 'to be undefined');
        done();
        decoder.on('finish', done);
      });
      decoder.on('finish', done);

      decoder.write(Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x80]));
      decoder.end();
    });

    it('should emit correct EBML:end events for master tags', done => {
      const decoder = new Decoder();
      let tags = 0;
      decoder.on('data', d => {
        const [state, data] = d;
        if (state === 'end') {
          expect(tags, 'to be', 2); // two tags
          expect(data.tag, 'to be', 0x0a45dfa3);
          expect(data.tagStr, 'to be', '1a45dfa3');
          expect(data.dataSize, 'to be', 4);
          expect(data.type, 'to be', 'm');
          expect(data.data, 'to be undefined');
          done();
          decoder.on('finish', done);
        } else {
          tags += 1;
        }
      });
      decoder.on('finish', done);

      decoder.write(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
      decoder.write(Buffer.from([0x84, 0x42, 0x86, 0x81, 0x00]));
      decoder.end();
    });
    describe('::getSchemaInfo', () => {
      it('returns a correct tag if possible', () => {
        expect(Decoder.getSchemaInfo(0x4286), 'to satisfy', {
          name: 'EBMLVersion',
          level: 1,
          type: 'u',
          mandatory: true,
          default: 1,
          minver: 1,
          description: 'The version of EBML parser used to create the file.',
          multiple: false,
          webm: false,
        });
      });
      it('returns a default object if not found', () => {
        expect(Decoder.getSchemaInfo(0x404), 'to satisfy', {
          type: expect.it('to be null'),
          name: expect.it('to be a string').and('to be', 'unknown'),
          description: expect.it('to be a string').and('to be empty'),
          level: expect.it('to be a number').and('not to be positive'),
          minver: expect.it('to be a number').and('not to be positive'),
          multiple: expect.it('to be a boolean'),
          webm: expect.it('to be a boolean'),
        });
      });
    });
  });
});
