import fs from 'fs';
import assert from 'assert';
import { Decoder } from '../src/ebml';

process.setMaxListeners(Infinity);

describe('EBML', () => {
    describe('Values in tags', () => {
        describe('AVC1', () => {
            const data = fs.readFileSync(
                'media/video-webm-codecs-avc1-42E01E.webm',
            );

            it('should get a correct PixelWidth value from a file (2-byte unsigned int)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'PixelWidth') {
                        assert.strictEqual(value, 352);
                        done();
                    }
                });
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
                    done();
                });
                decoder.write(data);
            });

            it('should get a correct EBMLVersion value from a file (one-byte unsigned int)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'EBMLVersion') {
                        assert.strictEqual(value, 1);
                        done();
                    }
                    decoder.on('finish', () => {
                        assert.strictEqual(
                            0,
                            1,
                            'hit end of file without finding tag.',
                        );
                        done();
                    });
                });
                decoder.write(data);
            });

            it('should get a correct TimeCodeScale value from a file (3-byte unsigned int)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'TimecodeScale') {
                        assert.strictEqual(value, 1000000);
                        done();
                    }
                    decoder.on('finish', () => {
                        assert.strictEqual(
                            0,
                            1,
                            'hit end of file without finding tag.',
                        );
                        done();
                    });
                });
                decoder.write(data);
            });

            it('should get a correct TrackUID value from a file (56-bit integer in hex)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'TrackUID') {
                        assert.strictEqual(value, '1c63824e507a46');
                        done();
                    }
                });
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
                    done();
                });
                decoder.write(data);
            });

            it('should get a correct DocType value from a file (ASCII text)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'DocType') {
                        assert.strictEqual(value, 'matroska');
                        done();
                    }
                    decoder.on('finish', () => {
                        assert.strictEqual(
                            0,
                            1,
                            'hit end of file without finding tag.',
                        );
                        done();
                    });
                });
                decoder.write(data);
            });

            it('should get a correct MuxingApp value from a file (utf8 text)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, ...rest }]) => {
                    if (tag === 'tag' && name === 'MuxingApp') {
                        assert.strictEqual(
                            rest.value,
                            'Chrome',
                            JSON.stringify(rest),
                        );
                        done();
                    }
                    decoder.on('finish', () => {
                        assert.strictEqual(
                            0,
                            1,
                            'hit end of file without finding tag.',
                        );
                        done();
                    });
                });
                decoder.write(data);
            });

            it('should get a correct SimpleBlock time payload from a file (binary)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value, payload, track }]) => {
                    if (tag === 'tag' && name === 'SimpleBlock') {
                        if (value > 0) {
                            /* look at second simpleBlock */
                            assert.strictEqual(track, 1, 'track');
                            assert.strictEqual(value, 191, 'value (timestamp)');
                            assert.strictEqual(
                                payload.byteLength,
                                169,
                                JSON.stringify(payload),
                            );
                            decoder.destroy();
                            done();
                        }
                    }
                });
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
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
                        assert.strictEqual(value, 352);
                        done();
                    }
                });
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
                    done();
                });
                decoder.write(data);
            });

            it('should get a correct EBMLVersion value from a video/webm; codecs="vp8" file (one-byte unsigned int)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'EBMLVersion') {
                        assert.strictEqual(value, 1);
                        done();
                    }
                });
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
                    done();
                });
                decoder.write(data);
            });

            it('should get a correct TimeCodeScale value from a video/webm; codecs="vp8" file (3-byte unsigned int)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'TimecodeScale') {
                        assert.strictEqual(value, 1000000);
                        decoder.destroy();
                        done();
                    }
                });
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
                    decoder.destroy();
                    done();
                });
                decoder.write(data);
            });

            it('should get a correct TrackUID value from a video/webm; codecs="vp8" file (56-bit integer in hex)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'TrackUID') {
                        assert.strictEqual(value, '306d02aaa74d06');
                        decoder.destroy();
                        done();
                    }
                    decoder.on('finish', () => {
                        assert.strictEqual(
                            0,
                            1,
                            'hit end of file without finding tag.',
                        );
                        decoder.destroy();
                        done();
                    });
                });
                decoder.write(data);
            });

            it('should get a correct DocType value from a video/webm; codecs="vp8" file (ASCII text)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'DocType') {
                        assert.strictEqual(value, 'webm');
                        decoder.destroy();
                        done();
                    }
                });
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
                    decoder.destroy();
                    done();
                });
                decoder.write(data);
            });

            it('should get a correct MuxingApp value from a video/webm; codecs="vp8" file (utf8 text)', done => {
                const decoder = new Decoder();
                decoder.on('data', ([tag, { name, value }]) => {
                    if (tag === 'tag' && name === 'MuxingApp') {
                        assert.strictEqual(value, 'Chrome');
                        done();
                    }
                });
                decoder.write(data);
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
                    done();
                });
            });

            it('should get a correct SimpleBlock time payload from a file (binary)', done => {
                const decoder = new Decoder();
                decoder.on(
                    'data',
                    ([
                        tag,
                        { name, payload, value, track, discardable, ...rest },
                    ]) => {
                        if (tag === 'tag' && name === 'SimpleBlock') {
                            if (value > 0) {
                                assert.strictEqual(track, 1, 'track');
                                assert.strictEqual(
                                    value,
                                    96,
                                    JSON.stringify({ ...rest, value }),
                                );
                                /* look at second simpleBlock */
                                assert.strictEqual(
                                    payload.byteLength,
                                    43,
                                    JSON.stringify({ ...rest, payload }),
                                );
                                assert.strictEqual(
                                    discardable,
                                    false,
                                    'discardable',
                                );
                                decoder.destroy();
                                done();
                            }
                        }
                    },
                );
                decoder.on('finish', () => {
                    assert.strictEqual(
                        0,
                        1,
                        'hit end of file without finding tag.',
                    );
                    done();
                });
                decoder.write(data);
            });
        });
    });
});
