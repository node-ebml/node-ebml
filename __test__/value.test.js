import fs from 'fs';
import unexpected from 'unexpected';
import { Decoder } from '../src/ebml';

process.setMaxListeners(Infinity);

const expect = unexpected.clone();

describe('EBML', () => {
  describe('Values in tags', () => {
    describe('AVC1', () => {
      const data = fs.readFileSync('media/video-webm-codecs-avc1-42E01E.webm');

      it('should get a correct PixelWidth value from a file (2-byte unsigned int)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'PixelWidth') {
            expect(value, 'to equal', 352);
            done();
          }
        });
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
        decoder.write(data);
      });

      it('should get a correct EBMLVersion value from a file (one-byte unsigned int)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'EBMLVersion') {
            expect(value, 'to equal', 1);
            done();
          }
          decoder.on('finish', () => {
            expect.fail('hit end of file without finding tag');
            done();
          });
        });
        decoder.write(data);
      });

      it('should get a correct TimeCodeScale value from a file (3-byte unsigned int)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'TimecodeScale') {
            expect(value, 'to equal', 1000000);
            done();
          }
          decoder.on('finish', () => {
            expect.fail('hit end of file without finding tag');
            done();
          });
        });
        decoder.write(data);
      });

      it('should get a correct TrackUID value from a file (56-bit integer in hex)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'TrackUID') {
            expect(value, 'to be', '1c63824e507a46');
            done();
          }
        });
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
        decoder.write(data);
      });

      it('should get a correct DocType value from a file (ASCII text)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'DocType') {
            expect(value, 'to be', 'matroska');
            done();
          }
          decoder.on('finish', () => {
            expect.fail('hit end of file without finding tag');
            done();
          });
        });
        decoder.write(data);
      });

      it('should get a correct MuxingApp value from a file (utf8 text)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, ...rest }]) => {
          if (tag === 'tag' && name === 'MuxingApp') {
            expect(rest.value, 'to be', 'Chrome');
            done();
          }
          decoder.on('finish', () => {
            expect.fail('hit end of file without finding tag');
            done();
          });
        });
        decoder.write(data);
      });

      it('should get a correct SimpleBlock time payload from a file (binary)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value, payload, track }]) => {
          if (tag === 'tag' && name === 'SimpleBlock') {
            if (value > 0 && value < 200) {
              /* look at second simpleBlock */
              expect(track, 'to equal', 1);
              expect(value, 'to equal', 191);
              expect(payload.byteLength, 'to equal', 169);
              done();
            }
          }
        });
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
        decoder.write(data);
      });
    });

    describe('VP8', () => {
      const data = fs.readFileSync('media/video-webm-codecs-vp8.webm');

      it('should get a correct PixelWidth value from a video/webm; codecs="vp8" file (2-byte unsigned int)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'PixelWidth') {
            expect(value, 'to equal', 352);
            done();
          }
        });
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
        decoder.write(data);
      });

      it('should get a correct EBMLVersion value from a video/webm; codecs="vp8" file (one-byte unsigned int)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'EBMLVersion') {
            expect(value, 'to equal', 1);
            done();
          }
        });
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
        decoder.write(data);
      });

      it('should get a correct TimeCodeScale value from a video/webm; codecs="vp8" file (3-byte unsigned int)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'TimecodeScale') {
            expect(value, 'to equal', 1000000);
            done();
          }
        });
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
        decoder.write(data);
      });

      it('should get a correct TrackUID value from a video/webm; codecs="vp8" file (56-bit integer in hex)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'TrackUID') {
            expect(value, 'to be', '306d02aaa74d06');
            done();
          }
          decoder.on('finish', () => {
            expect.fail('hit end of file without finding tag');
            done();
          });
        });
        decoder.write(data);
      });

      it('should get a correct DocType value from a video/webm; codecs="vp8" file (ASCII text)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'DocType') {
            expect(value, 'to be', 'webm');
            done();
          }
        });
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
        decoder.write(data);
      });

      it('should get a correct MuxingApp value from a video/webm; codecs="vp8" file (utf8 text)', done => {
        const decoder = new Decoder();
        decoder.on('data', ([tag, { name, value }]) => {
          if (tag === 'tag' && name === 'MuxingApp') {
            expect(value, 'to be', 'Chrome');
            done();
          }
        });
        decoder.write(data);
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
      });

      it('should get a correct SimpleBlock time payload from a file (binary)', done => {
        const decoder = new Decoder();
        decoder.on(
          'data',
          ([tag, { name, payload, value, track, discardable }]) => {
            if (tag === 'tag' && name === 'SimpleBlock') {
              if (value > 0 && value < 100) {
                expect(track, 'to equal', 1);
                expect(value, 'to equal', 96);
                /* look at second simpleBlock */
                expect(payload.byteLength, 'to equal', 43);
                expect(discardable, 'to be false');
                done();
              }
            }
          },
        );
        decoder.on('finish', () => {
          expect.fail('hit end of file without finding tag');
          done();
        });
        decoder.write(data);
      });
    });
  });
});
