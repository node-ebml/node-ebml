const schema = {
    '80': {
        'name': 'ChapterDisplay',
        'level': '4',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'webm': '1',
        'description': 'Contains all possible strings to use for the chapter display.'
    },
    '83': {
        'name': 'TrackType',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'range': '1-254',
        'description': 'A set of track types coded on 8 bits (1: video, 2: audio, 3: complex, 0x10: logo, 0x11: subtitle, 0x12: buttons, 0x20: control).'
    },
    '85': {
        'name': 'ChapString',
        'cppname': 'ChapterString',
        'level': '5',
        'type': '8',
        'mandatory': '1',
        'minver': '1',
        'webm': '1',
        'description': 'Contains the string to use as the chapter atom.'
    },
    '86': {
        'name': 'CodecID',
        'level': '3',
        'type': 's',
        'mandatory': '1',
        'minver': '1',
        'description': 'An ID corresponding to the codec, see the codec page for more info.'
    },
    '88': {
        'name': 'FlagDefault',
        'cppname': 'TrackFlagDefault',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'default': '1',
        'range': '0-1',
        'description': 'Set if that track (audio, video or subs) SHOULD be active if no language found matches the user preference. (1 bit)'
    },
    '89': {
        'name': 'ChapterTrackNumber',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'range': 'not 0',
        'description': 'UID of the Track to apply this chapter too. In the absense of a control track, choosing this chapter will select the listed Tracks and deselect unlisted tracks. Absense of this element indicates that the Chapter should be applied to any currently used Tracks.'
    },
    '91': {
        'name': 'ChapterTimeStart',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '1',
        'description': 'Timestamp of the start of Chapter (not scaled).'
    },
    '92': {
        'name': 'ChapterTimeEnd',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'description': 'Timestamp of the end of Chapter (timestamp excluded, not scaled).'
    },
    '96': {
        'name': 'CueRefTime',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'minver': '2',
        'webm': '0',
        'description': 'Timestamp of the referenced Block.'
    },
    '97': {
        'name': 'CueRefCluster',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'webm': '0',
        'description': 'The Position of the Cluster containing the referenced Block.'
    },
    '98': {
        'name': 'ChapterFlagHidden',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'range': '0-1',
        'description': 'If a chapter is hidden (1), it should not be available to the user interface (but still to Control Tracks; see flag notes). (1 bit)'
    },
    '4254': {
        'name': 'ContentCompAlgo',
        'level': '6',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'br': [
            '',
            '',
            '',
            ''
        ],
        'del': [
            '1 - bzlib,',
            '2 - lzo1x'
        ],
        'description': 'The compression algorithm used. Algorithms that have been specified so far are: 0 - zlib,   3 - Header Stripping'
    },
    '4255': {
        'name': 'ContentCompSettings',
        'level': '6',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'description': 'Settings that might be needed by the decompressor. For Header Stripping (ContentCompAlgo=3), the bytes that were removed from the beggining of each frames of the track.'
    },
    '4282': {
        'name': 'DocType',
        'level': '1',
        'type': 's',
        'mandatory': '1',
        'default': 'matroska',
        'minver': '1',
        'description': 'A string that describes the type of document that follows this EBML header. \'matroska\' in our case or \'webm\' for webm files.'
    },
    '4285': {
        'name': 'DocTypeReadVersion',
        'level': '1',
        'type': 'u',
        'mandatory': '1',
        'default': '1',
        'minver': '1',
        'description': 'The minimum DocType version an interpreter has to support to read this file.'
    },
    '4286': {
        'name': 'EBMLVersion',
        'level': '1',
        'type': 'u',
        'mandatory': '1',
        'default': '1',
        'minver': '1',
        'description': 'The version of EBML parser used to create the file.'
    },
    '4287': {
        'name': 'DocTypeVersion',
        'level': '1',
        'type': 'u',
        'mandatory': '1',
        'default': '1',
        'minver': '1',
        'description': 'The version of DocType interpreter used to create the file.'
    },
    '4444': {
        'name': 'SegmentFamily',
        'level': '2',
        'type': 'b',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'bytesize': '16',
        'description': 'A randomly generated unique ID that all segments related to each other must use (128 bits).'
    },
    '4461': {
        'name': 'DateUTC',
        'level': '2',
        'type': 'd',
        'minver': '1',
        'description': 'Date of the origin of timestamp (value 0), i.e. production date.'
    },
    '4484': {
        'name': 'TagDefault',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '1',
        'range': '0-1',
        'description': 'Indication to know if this is the default/original language to use for the given tag. (1 bit)'
    },
    '4485': {
        'name': 'TagBinary',
        'level': '4',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'description': 'The values of the Tag if it is binary. Note that this cannot be used in the same SimpleTag as TagString.'
    },
    '4487': {
        'name': 'TagString',
        'level': '4',
        'type': '8',
        'minver': '1',
        'webm': '0',
        'description': 'The value of the Tag.'
    },
    '4489': {
        'name': 'Duration',
        'level': '2',
        'type': 'f',
        'minver': '1',
        'range': '> 0',
        'description': 'Duration of the segment (based on TimecodeScale).'
    },
    '4598': {
        'name': 'ChapterFlagEnabled',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '1',
        'range': '0-1',
        'description': 'Specify wether the chapter is enabled. It can be enabled/disabled by a Control Track. When disabled, the movie should skip all the content between the TimeStart and TimeEnd of this chapter (see flag notes). (1 bit)'
    },
    '4660': {
        'name': 'FileMimeType',
        'level': '3',
        'type': 's',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'MIME type of the file.'
    },
    '4661': {
        'name': 'FileUsedStartTime',
        'level': '3',
        'type': 'u',
        'divx': '1',
        'description': 'DivX font extension'
    },
    '4662': {
        'name': 'FileUsedEndTime',
        'level': '3',
        'type': 'u',
        'divx': '1',
        'description': 'DivX font extension'
    },
    '4675': {
        'name': 'FileReferral',
        'level': '3',
        'type': 'b',
        'webm': '0',
        'description': 'A binary value that a track/codec can refer to when the attachment is needed.'
    },
    '5031': {
        'name': 'ContentEncodingOrder',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'Tells when this modification was used during encoding/muxing starting with 0 and counting upwards. The decoder/demuxer has to start with the highest order number it finds and work its way down. This value has to be unique over all ContentEncodingOrder elements in the segment.'
    },
    '5032': {
        'name': 'ContentEncodingScope',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '1',
        'range': 'not 0',
        'br': [
            '',
            '',
            ''
        ],
        'description': 'A bit field that describes which elements have been modified in this way. Values (big endian) can be OR\'ed. Possible values: 1 - all frame contents, 2 - the track\'s private data, 4 - the next ContentEncoding (next ContentEncodingOrder. Either the data inside ContentCompression and/or ContentEncryption)'
    },
    '5033': {
        'name': 'ContentEncodingType',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'br': [
            '',
            ''
        ],
        'description': 'A value describing what kind of transformation has been done. Possible values: 0 - compression, 1 - encryption'
    },
    '5034': {
        'name': 'ContentCompression',
        'level': '5',
        'type': 'm',
        'minver': '1',
        'webm': '0',
        'description': 'Settings describing the compression used. Must be present if the value of ContentEncodingType is 0 and absent otherwise. Each block must be decompressable even if no previous block is available in order not to prevent seeking.'
    },
    '5035': {
        'name': 'ContentEncryption',
        'level': '5',
        'type': 'm',
        'minver': '1',
        'webm': '0',
        'description': 'Settings describing the encryption used. Must be present if the value of ContentEncodingType is 1 and absent otherwise.'
    },
    '5378': {
        'name': 'CueBlockNumber',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': '1',
        'range': 'not 0',
        'description': 'Number of the Block in the specified Cluster.'
    },
    '5654': {
        'name': 'ChapterStringUID',
        'level': '4',
        'type': '8',
        'mandatory': '0',
        'minver': '3',
        'webm': '1',
        'description': 'A unique string ID to identify the Chapter. Use for WebVTT cue identifier storage.'
    },
    '5741': {
        'name': 'WritingApp',
        'level': '2',
        'type': '8',
        'mandatory': '1',
        'minver': '1',
        'description': 'Writing application ("mkvmerge-0.3.3").'
    },
    '5854': {
        'name': 'SilentTracks',
        'cppname': 'ClusterSilentTracks',
        'level': '2',
        'type': 'm',
        'minver': '1',
        'webm': '0',
        'description': 'The list of tracks that are not used in that part of the stream. It is useful when using overlay tracks on seeking. Then you should decide what track to use.'
    },
    '6240': {
        'name': 'ContentEncoding',
        'level': '4',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Settings for one content encoding like compression or encryption.'
    },
    '6264': {
        'name': 'BitDepth',
        'cppname': 'AudioBitDepth',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'range': 'not 0',
        'description': 'Bits per sample, mostly used for PCM.'
    },
    '6532': {
        'name': 'SignedElement',
        'level': '3',
        'type': 'b',
        'multiple': '1',
        'webm': '0',
        'description': 'An element ID whose data will be used to compute the signature.'
    },
    '6624': {
        'name': 'TrackTranslate',
        'level': '3',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'The track identification for the given Chapter Codec.'
    },
    '6911': {
        'name': 'ChapProcessCommand',
        'cppname': 'ChapterProcessCommand',
        'level': '5',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Contains all the commands associated to the Atom.'
    },
    '6922': {
        'name': 'ChapProcessTime',
        'cppname': 'ChapterProcessTime',
        'level': '6',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Defines when the process command should be handled (0: during the whole chapter, 1: before starting playback, 2: after playback of the chapter).'
    },
    '6924': {
        'name': 'ChapterTranslate',
        'level': '2',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'A tuple of corresponding ID used by chapter codecs to represent this segment.'
    },
    '6933': {
        'name': 'ChapProcessData',
        'cppname': 'ChapterProcessData',
        'level': '6',
        'type': 'b',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Contains the command information. The data should be interpreted depending on the ChapProcessCodecID value. For ChapProcessCodecID = 1, the data correspond to the binary DVD cell pre/post commands.'
    },
    '6944': {
        'name': 'ChapProcess',
        'cppname': 'ChapterProcess',
        'level': '4',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Contains all the commands associated to the Atom.'
    },
    '6955': {
        'name': 'ChapProcessCodecID',
        'cppname': 'ChapterProcessCodecID',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'Contains the type of the codec used for the processing. A value of 0 means native Matroska processing (to be defined), a value of 1 means the DVD command set is used. More codec IDs can be added later.'
    },
    '7373': {
        'name': 'Tag',
        'level': '2',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Element containing elements specific to Tracks/Chapters.'
    },
    '7384': {
        'name': 'SegmentFilename',
        'level': '2',
        'type': '8',
        'minver': '1',
        'webm': '0',
        'description': 'A filename corresponding to this segment.'
    },
    '7446': {
        'name': 'AttachmentLink',
        'cppname': 'TrackAttachmentLink',
        'level': '3',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'range': 'not 0',
        'description': 'The UID of an attachment that is used by this codec.'
    },
    '258688': {
        'name': 'CodecName',
        'level': '3',
        'type': '8',
        'minver': '1',
        'description': 'A human-readable string specifying the codec.'
    },
    '18538067': {
        'name': 'Segment',
        'level': '0',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'description': 'This element contains all other top-level (level 1) elements. Typically a Matroska file is composed of 1 segment.'
    },
    '447a': {
        'name': 'TagLanguage',
        'level': '4',
        'type': 's',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': 'und',
        'description': 'Specifies the language of the tag specified, in the Matroska languages form.'
    },
    '45a3': {
        'name': 'TagName',
        'level': '4',
        'type': '8',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'The name of the Tag that is going to be stored.'
    },
    '67c8': {
        'name': 'SimpleTag',
        'cppname': 'TagSimple',
        'level': '3',
        'recursive': '1',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Contains general information about the target.'
    },
    '63c6': {
        'name': 'TagAttachmentUID',
        'level': '4',
        'type': 'u',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'A unique ID to identify the Attachment(s) the tags belong to. If the value is 0 at this level, the tags apply to all the attachments in the Segment.'
    },
    '63c4': {
        'name': 'TagChapterUID',
        'level': '4',
        'type': 'u',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'A unique ID to identify the Chapter(s) the tags belong to. If the value is 0 at this level, the tags apply to all chapters in the Segment.'
    },
    '63c9': {
        'name': 'TagEditionUID',
        'level': '4',
        'type': 'u',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'A unique ID to identify the EditionEntry(s) the tags belong to. If the value is 0 at this level, the tags apply to all editions in the Segment.'
    },
    '63c5': {
        'name': 'TagTrackUID',
        'level': '4',
        'type': 'u',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'A unique ID to identify the Track(s) the tags belong to. If the value is 0 at this level, the tags apply to all tracks in the Segment.'
    },
    '63ca': {
        'name': 'TargetType',
        'cppname': 'TagTargetType',
        'level': '4',
        'type': 's',
        'minver': '1',
        'webm': '0',
        'strong': 'informational',
        'description': 'An  string that can be used to display the logical level of the target like "ALBUM", "TRACK", "MOVIE", "CHAPTER", etc (see TargetType).'
    },
    '68ca': {
        'name': 'TargetTypeValue',
        'cppname': 'TagTargetTypeValue',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'default': '50',
        'description': 'A number to indicate the logical level of the target (see TargetType).'
    },
    '63c0': {
        'name': 'Targets',
        'cppname': 'TagTargets',
        'level': '3',
        'type': 'm',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Contain all UIDs where the specified meta data apply. It is empty to describe everything in the segment.'
    },
    '1254c367': {
        'name': 'Tags',
        'level': '1',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Element containing elements specific to Tracks/Chapters. A list of valid tags can be found here.'
    },
    '450d': {
        'name': 'ChapProcessPrivate',
        'cppname': 'ChapterProcessPrivate',
        'level': '5',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'description': 'Some optional data attached to the ChapProcessCodecID information. For ChapProcessCodecID = 1, it is the "DVD level" equivalent.'
    },
    '437e': {
        'name': 'ChapCountry',
        'cppname': 'ChapterCountry',
        'level': '5',
        'type': 's',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'The countries corresponding to the string, same 2 octets as in Internet domains.'
    },
    '437c': {
        'name': 'ChapLanguage',
        'cppname': 'ChapterLanguage',
        'level': '5',
        'type': 's',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '1',
        'default': 'eng',
        'description': 'The languages corresponding to the string, in the bibliographic ISO-639-2 form.'
    },
    '8f': {
        'name': 'ChapterTrack',
        'level': '4',
        'type': 'm',
        'minver': '1',
        'webm': '0',
        'description': 'List of tracks on which the chapter applies. If this element is not present, all tracks apply'
    },
    '63c3': {
        'name': 'ChapterPhysicalEquiv',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'description': 'Specify the physical equivalent of this ChapterAtom like "DVD" (60) or "SIDE" (50), see complete list of values.'
    },
    '6ebc': {
        'name': 'ChapterSegmentEditionUID',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'range': 'not 0',
        'description': 'The EditionUID to play from the segment linked in ChapterSegmentUID.'
    },
    '6e67': {
        'name': 'ChapterSegmentUID',
        'level': '4',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'range': '>0',
        'bytesize': '16',
        'description': 'A segment to play in place of this chapter. Edition ChapterSegmentEditionUID should be used for this segment, otherwise no edition is used.'
    },
    '73c4': {
        'name': 'ChapterUID',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '1',
        'range': 'not 0',
        'description': 'A unique ID to identify the Chapter.'
    },
    'b6': {
        'name': 'ChapterAtom',
        'level': '3',
        'recursive': '1',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '1',
        'description': 'Contains the atom information to use as the chapter atom (apply to all tracks).'
    },
    '45dd': {
        'name': 'EditionFlagOrdered',
        'level': '3',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'range': '0-1',
        'description': 'Specify if the chapters can be defined multiple times and the order to play them is enforced. (1 bit)'
    },
    '45db': {
        'name': 'EditionFlagDefault',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'range': '0-1',
        'description': 'If a flag is set (1) the edition should be used as the default one. (1 bit)'
    },
    '45bd': {
        'name': 'EditionFlagHidden',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'range': '0-1',
        'description': 'If an edition is hidden (1), it should not be available to the user interface (but still to Control Tracks; see flag notes). (1 bit)'
    },
    '45bc': {
        'name': 'EditionUID',
        'level': '3',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'range': 'not 0',
        'description': 'A unique ID to identify the edition. It\'s useful for tagging an edition.'
    },
    '45b9': {
        'name': 'EditionEntry',
        'level': '2',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '1',
        'description': 'Contains all information about a segment edition.'
    },
    '1043a770': {
        'name': 'Chapters',
        'level': '1',
        'type': 'm',
        'minver': '1',
        'webm': '1',
        'description': 'A system to define basic menus and partition data. For more detailed information, look at the Chapters Explanation.'
    },
    '46ae': {
        'name': 'FileUID',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'range': 'not 0',
        'description': 'Unique ID representing the file, as random as possible.'
    },
    '465c': {
        'name': 'FileData',
        'level': '3',
        'type': 'b',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'The data of the file.'
    },
    '466e': {
        'name': 'FileName',
        'level': '3',
        'type': '8',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Filename of the attached file.'
    },
    '467e': {
        'name': 'FileDescription',
        'level': '3',
        'type': '8',
        'minver': '1',
        'webm': '0',
        'description': 'A human-friendly name for the attached file.'
    },
    '61a7': {
        'name': 'AttachedFile',
        'level': '2',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'An attached file.'
    },
    '1941a469': {
        'name': 'Attachments',
        'level': '1',
        'type': 'm',
        'minver': '1',
        'webm': '0',
        'description': 'Contain attached files.'
    },
    'eb': {
        'name': 'CueRefCodecState',
        'level': '5',
        'type': 'u',
        'webm': '0',
        'default': '0',
        'description': 'The position of the Codec State corresponding to this referenced element. 0 means that the data is taken from the initial Track Entry.'
    },
    '535f': {
        'name': 'CueRefNumber',
        'level': '5',
        'type': 'u',
        'webm': '0',
        'default': '1',
        'range': 'not 0',
        'description': 'Number of the referenced Block of Track X in the specified Cluster.'
    },
    'db': {
        'name': 'CueReference',
        'level': '4',
        'type': 'm',
        'multiple': '1',
        'minver': '2',
        'webm': '0',
        'description': 'The Clusters containing the required referenced Blocks.'
    },
    'ea': {
        'name': 'CueCodecState',
        'level': '4',
        'type': 'u',
        'minver': '2',
        'webm': '0',
        'default': '0',
        'description': 'The position of the Codec State corresponding to this Cue element. 0 means that the data is taken from the initial Track Entry.'
    },
    'b2': {
        'name': 'CueDuration',
        'level': '4',
        'type': 'u',
        'mandatory': '0',
        'minver': '4',
        'webm': '0',
        'description': 'The duration of the block according to the segment time base. If missing the track\'s DefaultDuration does not apply and no duration information is available in terms of the cues.'
    },
    'f0': {
        'name': 'CueRelativePosition',
        'level': '4',
        'type': 'u',
        'mandatory': '0',
        'minver': '4',
        'webm': '0',
        'description': 'The relative position of the referenced block inside the cluster with 0 being the first possible position for an element inside that cluster.'
    },
    'f1': {
        'name': 'CueClusterPosition',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'description': 'The position of the Cluster containing the required Block.'
    },
    'f7': {
        'name': 'CueTrack',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'range': 'not 0',
        'description': 'The track for which a position is given.'
    },
    'b7': {
        'name': 'CueTrackPositions',
        'level': '3',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'description': 'Contain positions for different tracks corresponding to the timestamp.'
    },
    'b3': {
        'name': 'CueTime',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'description': 'Absolute timestamp according to the segment time base.'
    },
    'bb': {
        'name': 'CuePoint',
        'level': '2',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'description': 'Contains all information relative to a seek point in the segment.'
    },
    '1c53bb6b': {
        'name': 'Cues',
        'level': '1',
        'type': 'm',
        'minver': '1',
        'description': 'A top-level element to speed seeking access. All entries are local to the segment. Should be mandatory for non "live" streams.'
    },
    '47e6': {
        'name': 'ContentSigHashAlgo',
        'level': '6',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'br': [
            '',
            ''
        ],
        'description': 'The hash algorithm used for the signature. A value of \'0\' means that the contents have not been signed but only encrypted. Predefined values: 1 - SHA1-160 2 - MD5'
    },
    '47e5': {
        'name': 'ContentSigAlgo',
        'level': '6',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'br': '',
        'description': 'The algorithm used for the signature. A value of \'0\' means that the contents have not been signed but only encrypted. Predefined values: 1 - RSA'
    },
    '47e4': {
        'name': 'ContentSigKeyID',
        'level': '6',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'description': 'This is the ID of the private key the data was signed with.'
    },
    '47e3': {
        'name': 'ContentSignature',
        'level': '6',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'description': 'A cryptographic signature of the contents.'
    },
    '47e2': {
        'name': 'ContentEncKeyID',
        'level': '6',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'description': 'For public key algorithms this is the ID of the public key the the data was encrypted with.'
    },
    '47e1': {
        'name': 'ContentEncAlgo',
        'level': '6',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'br': '',
        'description': 'The encryption algorithm used. The value \'0\' means that the contents have not been encrypted but only signed. Predefined values: 1 - DES, 2 - 3DES, 3 - Twofish, 4 - Blowfish, 5 - AES'
    },
    '6d80': {
        'name': 'ContentEncodings',
        'level': '3',
        'type': 'm',
        'minver': '1',
        'webm': '0',
        'description': 'Settings for several content encoding mechanisms like compression or encryption.'
    },
    'c4': {
        'name': 'TrickMasterTrackSegmentUID',
        'level': '3',
        'type': 'b',
        'divx': '1',
        'bytesize': '16',
        'description': 'DivX trick track extenstions'
    },
    'c7': {
        'name': 'TrickMasterTrackUID',
        'level': '3',
        'type': 'u',
        'divx': '1',
        'description': 'DivX trick track extenstions'
    },
    'c6': {
        'name': 'TrickTrackFlag',
        'level': '3',
        'type': 'u',
        'divx': '1',
        'default': '0',
        'description': 'DivX trick track extenstions'
    },
    'c1': {
        'name': 'TrickTrackSegmentUID',
        'level': '3',
        'type': 'b',
        'divx': '1',
        'bytesize': '16',
        'description': 'DivX trick track extenstions'
    },
    'c0': {
        'name': 'TrickTrackUID',
        'level': '3',
        'type': 'u',
        'divx': '1',
        'description': 'DivX trick track extenstions'
    },
    'ed': {
        'name': 'TrackJoinUID',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'multiple': '1',
        'minver': '3',
        'webm': '0',
        'range': 'not 0',
        'description': 'The trackUID number of a track whose blocks are used to create this virtual track.'
    },
    'e9': {
        'name': 'TrackJoinBlocks',
        'level': '4',
        'type': 'm',
        'minver': '3',
        'webm': '0',
        'description': 'Contains the list of all tracks whose Blocks need to be combined to create this virtual track'
    },
    'e6': {
        'name': 'TrackPlaneType',
        'level': '6',
        'type': 'u',
        'mandatory': '1',
        'minver': '3',
        'webm': '0',
        'description': 'The kind of plane this track corresponds to (0: left eye, 1: right eye, 2: background).'
    },
    'e5': {
        'name': 'TrackPlaneUID',
        'level': '6',
        'type': 'u',
        'mandatory': '1',
        'minver': '3',
        'webm': '0',
        'range': 'not 0',
        'description': 'The trackUID number of the track representing the plane.'
    },
    'e4': {
        'name': 'TrackPlane',
        'level': '5',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '3',
        'webm': '0',
        'description': 'Contains a video plane track that need to be combined to create this 3D track'
    },
    'e3': {
        'name': 'TrackCombinePlanes',
        'level': '4',
        'type': 'm',
        'minver': '3',
        'webm': '0',
        'description': 'Contains the list of all video plane tracks that need to be combined to create this 3D track'
    },
    'e2': {
        'name': 'TrackOperation',
        'level': '3',
        'type': 'm',
        'minver': '3',
        'webm': '0',
        'description': 'Operation that needs to be applied on tracks to create this virtual track. For more details look at the Specification Notes on the subject.'
    },
    '7d7b': {
        'name': 'ChannelPositions',
        'cppname': 'AudioPosition',
        'level': '4',
        'type': 'b',
        'webm': '0',
        'description': 'Table of horizontal angles for each successive channel, see appendix.'
    },
    '9f': {
        'name': 'Channels',
        'cppname': 'AudioChannels',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'default': '1',
        'range': 'not 0',
        'description': 'Numbers of channels in the track.'
    },
    '78b5': {
        'name': 'OutputSamplingFrequency',
        'cppname': 'AudioOutputSamplingFreq',
        'level': '4',
        'type': 'f',
        'minver': '1',
        'default': 'Sampling Frequency',
        'range': '> 0',
        'description': 'Real output sampling frequency in Hz (used for SBR techniques).'
    },
    'b5': {
        'name': 'SamplingFrequency',
        'cppname': 'AudioSamplingFreq',
        'level': '4',
        'type': 'f',
        'mandatory': '1',
        'minver': '1',
        'default': '8000.0',
        'range': '> 0',
        'description': 'Sampling frequency in Hz.'
    },
    'e1': {
        'name': 'Audio',
        'cppname': 'TrackAudio',
        'level': '3',
        'type': 'm',
        'minver': '1',
        'description': 'Audio settings.'
    },
    '2383e3': {
        'name': 'FrameRate',
        'cppname': 'VideoFrameRate',
        'level': '4',
        'type': 'f',
        'range': '> 0',
        'strong': 'Informational',
        'description': 'Number of frames per second.  only.'
    },
    '2fb523': {
        'name': 'GammaValue',
        'cppname': 'VideoGamma',
        'level': '4',
        'type': 'f',
        'webm': '0',
        'range': '> 0',
        'description': 'Gamma Value.'
    },
    '2eb524': {
        'name': 'ColourSpace',
        'cppname': 'VideoColourSpace',
        'level': '4',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'bytesize': '4',
        'description': 'Same value as in AVI (32 bits).'
    },
    '54b3': {
        'name': 'AspectRatioType',
        'cppname': 'VideoAspectRatio',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': '0',
        'description': 'Specify the possible modifications to the aspect ratio (0: free resizing, 1: keep aspect ratio, 2: fixed).'
    },
    '54b2': {
        'name': 'DisplayUnit',
        'cppname': 'VideoDisplayUnit',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': '0',
        'description': 'How DisplayWidth & DisplayHeight should be interpreted (0: pixels, 1: centimeters, 2: inches, 3: Display Aspect Ratio).'
    },
    '54ba': {
        'name': 'DisplayHeight',
        'cppname': 'VideoDisplayHeight',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': 'PixelHeight',
        'range': 'not 0',
        'description': 'Height of the video frames to display. The default value is only valid when DisplayUnit is 0.'
    },
    '54b0': {
        'name': 'DisplayWidth',
        'cppname': 'VideoDisplayWidth',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': 'PixelWidth',
        'range': 'not 0',
        'description': 'Width of the video frames to display. The default value is only valid when DisplayUnit is 0.'
    },
    '54dd': {
        'name': 'PixelCropRight',
        'cppname': 'VideoPixelCropRight',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': '0',
        'description': 'The number of video pixels to remove on the right of the image.'
    },
    '54cc': {
        'name': 'PixelCropLeft',
        'cppname': 'VideoPixelCropLeft',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': '0',
        'description': 'The number of video pixels to remove on the left of the image.'
    },
    '54bb': {
        'name': 'PixelCropTop',
        'cppname': 'VideoPixelCropTop',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': '0',
        'description': 'The number of video pixels to remove at the top of the image.'
    },
    '54aa': {
        'name': 'PixelCropBottom',
        'cppname': 'VideoPixelCropBottom',
        'level': '4',
        'type': 'u',
        'minver': '1',
        'default': '0',
        'description': 'The number of video pixels to remove at the bottom of the image (for HDTV content).'
    },
    'ba': {
        'name': 'PixelHeight',
        'cppname': 'VideoPixelHeight',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'range': 'not 0',
        'description': 'Height of the encoded video frames in pixels.'
    },
    'b0': {
        'name': 'PixelWidth',
        'cppname': 'VideoPixelWidth',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'range': 'not 0',
        'description': 'Width of the encoded video frames in pixels.'
    },
    '53b9': {
        'name': 'OldStereoMode',
        'level': '4',
        'type': 'u',
        'maxver': '0',
        'webm': '0',
        'divx': '0',
        'description': 'DEPRECATED, DO NOT USE. Bogus StereoMode value used in old versions of libmatroska. (0: mono, 1: right eye, 2: left eye, 3: both eyes).'
    },
    '53c0': {
        'name': 'AlphaMode',
        'cppname': 'VideoAlphaMode',
        'level': '4',
        'type': 'u',
        'minver': '3',
        'webm': '1',
        'default': '0',
        'description': 'Alpha Video Mode. Presence of this element indicates that the BlockAdditional element could contain Alpha data.'
    },
    '53b8': {
        'name': 'StereoMode',
        'cppname': 'VideoStereoMode',
        'level': '4',
        'type': 'u',
        'minver': '3',
        'webm': '1',
        'default': '0',
        'description': 'Stereo-3D video mode (0: mono, 1: side by side (left eye is first), 2: top-bottom (right eye is first), 3: top-bottom (left eye is first), 4: checkboard (right is first), 5: checkboard (left is first), 6: row interleaved (right is first), 7: row interleaved (left is first), 8: column interleaved (right is first), 9: column interleaved (left is first), 10: anaglyph (cyan/red), 11: side by side (right eye is first), 12: anaglyph (green/magenta), 13 both eyes laced in one Block (left eye is first), 14 both eyes laced in one Block (right eye is first)) . There are some more details on 3D support in the Specification Notes.'
    },
    '9a': {
        'name': 'FlagInterlaced',
        'cppname': 'VideoFlagInterlaced',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '2',
        'webm': '1',
        'default': '0',
        'range': '0-1',
        'description': 'Set if the video is interlaced. (1 bit)'
    },
    'e0': {
        'name': 'Video',
        'cppname': 'TrackVideo',
        'level': '3',
        'type': 'm',
        'minver': '1',
        'description': 'Video settings.'
    },
    '66a5': {
        'name': 'TrackTranslateTrackID',
        'level': '4',
        'type': 'b',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'The binary value used to represent this track in the chapter codec data. The format depends on the ChapProcessCodecID used.'
    },
    '66bf': {
        'name': 'TrackTranslateCodec',
        'level': '4',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'The chapter codec using this ID (0: Matroska Script, 1: DVD-menu).'
    },
    '66fc': {
        'name': 'TrackTranslateEditionUID',
        'level': '4',
        'type': 'u',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Specify an edition UID on which this translation applies. When not specified, it means for all editions found in the segment.'
    },
    '56bb': {
        'name': 'SeekPreRoll',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'multiple': '0',
        'default': '0',
        'minver': '4',
        'webm': '1',
        'description': 'After a discontinuity, SeekPreRoll is the duration in nanoseconds of the data the decoder must decode before the decoded data is valid.'
    },
    '56aa': {
        'name': 'CodecDelay',
        'level': '3',
        'type': 'u',
        'multiple': '0',
        'default': '0',
        'minver': '4',
        'webm': '1',
        'description': 'CodecDelay is The codec-built-in delay in nanoseconds. This value must be subtracted from each block timestamp in order to get the actual timestamp. The value should be small so the muxing of tracks with the same actual timestamp are in the same Cluster.'
    },
    '6fab': {
        'name': 'TrackOverlay',
        'level': '3',
        'type': 'u',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Specify that this track is an overlay track for the Track specified (in the u-integer). That means when this track has a gap (see SilentTracks) the overlay track should be used instead. The order of multiple TrackOverlay matters, the first one is the one that should be used. If not found it should be the second, etc.'
    },
    'aa': {
        'name': 'CodecDecodeAll',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '2',
        'webm': '0',
        'default': '1',
        'range': '0-1',
        'description': 'The codec can decode potentially damaged data (1 bit).'
    },
    '26b240': {
        'name': 'CodecDownloadURL',
        'level': '3',
        'type': 's',
        'multiple': '1',
        'webm': '0',
        'description': 'A URL to download about the codec used.'
    },
    '3b4040': {
        'name': 'CodecInfoURL',
        'level': '3',
        'type': 's',
        'multiple': '1',
        'webm': '0',
        'description': 'A URL to find information about the codec used.'
    },
    '3a9697': {
        'name': 'CodecSettings',
        'level': '3',
        'type': '8',
        'webm': '0',
        'description': 'A string describing the encoding setting used.'
    },
    '63a2': {
        'name': 'CodecPrivate',
        'level': '3',
        'type': 'b',
        'minver': '1',
        'description': 'Private data only known to the codec.'
    },
    '22b59c': {
        'name': 'Language',
        'cppname': 'TrackLanguage',
        'level': '3',
        'type': 's',
        'minver': '1',
        'default': 'eng',
        'description': 'Specifies the language of the track in the Matroska languages form.'
    },
    '536e': {
        'name': 'Name',
        'cppname': 'TrackName',
        'level': '3',
        'type': '8',
        'minver': '1',
        'description': 'A human-readable track name.'
    },
    '55ee': {
        'name': 'MaxBlockAdditionID',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'The maximum value of BlockAdditions for this track.'
    },
    '537f': {
        'name': 'TrackOffset',
        'level': '3',
        'type': 'i',
        'webm': '0',
        'default': '0',
        'description': 'A value to add to the Block\'s Timestamp. This can be used to adjust the playback offset of a track.'
    },
    '23314f': {
        'name': 'TrackTimecodeScale',
        'level': '3',
        'type': 'f',
        'mandatory': '1',
        'minver': '1',
        'maxver': '3',
        'webm': '0',
        'default': '1.0',
        'range': '> 0',
        'description': 'DEPRECATED, DO NOT USE. The scale to apply on this track to work at normal speed in relation with other tracks (mostly used to adjust video speed when the audio length differs).'
    },
    '234e7a': {
        'name': 'DefaultDecodedFieldDuration',
        'cppname': 'TrackDefaultDecodedFieldDuration',
        'level': '3',
        'type': 'u',
        'minver': '4',
        'range': 'not 0',
        'description': 'The period in nanoseconds (not scaled by TimcodeScale)\nbetween two successive fields at the output of the decoding process (see the notes)'
    },
    '23e383': {
        'name': 'DefaultDuration',
        'cppname': 'TrackDefaultDuration',
        'level': '3',
        'type': 'u',
        'minver': '1',
        'range': 'not 0',
        'description': 'Number of nanoseconds (not scaled via TimecodeScale) per frame (\'frame\' in the Matroska sense -- one element put into a (Simple)Block).'
    },
    '6df8': {
        'name': 'MaxCache',
        'cppname': 'TrackMaxCache',
        'level': '3',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'description': 'The maximum cache size required to store referenced frames in and the current frame. 0 means no cache is needed.'
    },
    '6de7': {
        'name': 'MinCache',
        'cppname': 'TrackMinCache',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'The minimum number of frames a player should be able to cache during playback. If set to 0, the reference pseudo-cache system is not used.'
    },
    '9c': {
        'name': 'FlagLacing',
        'cppname': 'TrackFlagLacing',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'default': '1',
        'range': '0-1',
        'description': 'Set if the track may contain blocks using lacing. (1 bit)'
    },
    '55aa': {
        'name': 'FlagForced',
        'cppname': 'TrackFlagForced',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'default': '0',
        'range': '0-1',
        'description': 'Set if that track MUST be active during playback. There can be many forced track for a kind (audio, video or subs), the player should select the one which language matches the user preference or the default + forced track. Overlay MAY happen between a forced and non-forced track of the same kind. (1 bit)'
    },
    'b9': {
        'name': 'FlagEnabled',
        'cppname': 'TrackFlagEnabled',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '2',
        'webm': '1',
        'default': '1',
        'range': '0-1',
        'description': 'Set if the track is usable. (1 bit)'
    },
    '73c5': {
        'name': 'TrackUID',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'range': 'not 0',
        'description': 'A unique ID to identify the Track. This should be kept the same when making a direct stream copy of the Track to another file.'
    },
    'd7': {
        'name': 'TrackNumber',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'range': 'not 0',
        'description': 'The track number as used in the Block Header (using more than 127 tracks is not encouraged, though the design allows an unlimited number).'
    },
    'ae': {
        'name': 'TrackEntry',
        'level': '2',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'description': 'Describes a track with all elements.'
    },
    '1654ae6b': {
        'name': 'Tracks',
        'level': '1',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'description': 'A top-level block of information with many tracks described.'
    },
    'af': {
        'name': 'EncryptedBlock',
        'level': '2',
        'type': 'b',
        'multiple': '1',
        'webm': '0',
        'description': 'Similar to EncryptedBlock Structure)'
    },
    'ca': {
        'name': 'ReferenceTimeCode',
        'level': '4',
        'type': 'u',
        'multiple': '0',
        'mandatory': '1',
        'minver': '0',
        'webm': '0',
        'divx': '1',
        'description': 'DivX trick track extenstions'
    },
    'c9': {
        'name': 'ReferenceOffset',
        'level': '4',
        'type': 'u',
        'multiple': '0',
        'mandatory': '1',
        'minver': '0',
        'webm': '0',
        'divx': '1',
        'description': 'DivX trick track extenstions'
    },
    'c8': {
        'name': 'ReferenceFrame',
        'level': '3',
        'type': 'm',
        'multiple': '0',
        'minver': '0',
        'webm': '0',
        'divx': '1',
        'description': 'DivX trick track extenstions'
    },
    'cf': {
        'name': 'SliceDuration',
        'level': '5',
        'type': 'u',
        'default': '0',
        'description': 'The (scaled) duration to apply to the element.'
    },
    'ce': {
        'name': 'Delay',
        'cppname': 'SliceDelay',
        'level': '5',
        'type': 'u',
        'default': '0',
        'description': 'The (scaled) delay to apply to the element.'
    },
    'cb': {
        'name': 'BlockAdditionID',
        'cppname': 'SliceBlockAddID',
        'level': '5',
        'type': 'u',
        'default': '0',
        'description': 'The ID of the BlockAdditional element (0 is the main Block).'
    },
    'cd': {
        'name': 'FrameNumber',
        'cppname': 'SliceFrameNumber',
        'level': '5',
        'type': 'u',
        'default': '0',
        'description': 'The number of the frame to generate from this lace with this delay (allow you to generate many frames from the same Block/Frame).'
    },
    'cc': {
        'name': 'LaceNumber',
        'cppname': 'SliceLaceNumber',
        'level': '5',
        'type': 'u',
        'minver': '1',
        'default': '0',
        'divx': '0',
        'description': 'The reverse number of the frame in the lace (0 is the last frame, 1 is the next to last, etc). While there are a few files in the wild with this element, it is no longer in use and has been deprecated. Being able to interpret this element is not required for playback.'
    },
    'e8': {
        'name': 'TimeSlice',
        'level': '4',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'divx': '0',
        'description': 'Contains extra time information about the data contained in the Block. While there are a few files in the wild with this element, it is no longer in use and has been deprecated. Being able to interpret this element is not required for playback.'
    },
    '8e': {
        'name': 'Slices',
        'level': '3',
        'type': 'm',
        'minver': '1',
        'divx': '0',
        'description': 'Contains slices description.'
    },
    '75a2': {
        'name': 'DiscardPadding',
        'level': '3',
        'type': 'i',
        'minver': '4',
        'webm': '1',
        'description': 'Duration in nanoseconds of the silent data added to the Block (padding at the end of the Block for positive value, at the beginning of the Block for negative value). The duration of DiscardPadding is not calculated in the duration of the TrackEntry and should be discarded during playback.'
    },
    'a4': {
        'name': 'CodecState',
        'level': '3',
        'type': 'b',
        'minver': '2',
        'webm': '0',
        'description': 'The new codec state to use. Data interpretation is private to the codec. This information should always be referenced by a seek entry.'
    },
    'fd': {
        'name': 'ReferenceVirtual',
        'level': '3',
        'type': 'i',
        'webm': '0',
        'description': 'Relative position of the data that should be in position of the virtual block.'
    },
    'fb': {
        'name': 'ReferenceBlock',
        'level': '3',
        'type': 'i',
        'multiple': '1',
        'minver': '1',
        'description': 'Timestamp of another frame used as a reference (ie: B or P frame). The timestamp is relative to the block it\'s attached to.'
    },
    'fa': {
        'name': 'ReferencePriority',
        'cppname': 'FlagReferenced',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '0',
        'description': 'This frame is referenced and has the specified cache priority. In cache only a frame of the same or higher priority can replace this frame. A value of 0 means the frame is not referenced.'
    },
    '9b': {
        'name': 'BlockDuration',
        'level': '3',
        'type': 'u',
        'minver': '1',
        'default': 'TrackDuration',
        'description': 'The duration of the Block (based on TimecodeScale). This element is mandatory when DefaultDuration is set for the track (but can be omitted as other default values). When not written and with no DefaultDuration, the value is assumed to be the difference between the timestamp of this Block and the timestamp of the next Block in "display" order (not coding order). This element can be useful at the end of a Track (as there is not other Block available), or when there is a break in a track like for subtitle tracks. When set to 0 that means the frame is not a keyframe.'
    },
    'a5': {
        'name': 'BlockAdditional',
        'level': '5',
        'type': 'b',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Interpreted by the codec as it wishes (using the BlockAddID).'
    },
    'ee': {
        'name': 'BlockAddID',
        'level': '5',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'default': '1',
        'range': 'not 0',
        'description': 'An ID to identify the BlockAdditional level.'
    },
    'a6': {
        'name': 'BlockMore',
        'level': '4',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Contain the BlockAdditional and some parameters.'
    },
    '75a1': {
        'name': 'BlockAdditions',
        'level': '3',
        'type': 'm',
        'minver': '1',
        'webm': '0',
        'description': 'Contain additional blocks to complete the main one. An EBML parser that has no knowledge of the Block structure could still see and use/skip these data.'
    },
    'a2': {
        'name': 'BlockVirtual',
        'level': '3',
        'type': 'b',
        'webm': '0',
        'description': 'A Block with no data. It must be stored in the stream at the place the real Block should be in display order. (see Block Virtual)'
    },
    'a1': {
        'name': 'Block',
        'level': '3',
        'type': 'b',
        'mandatory': '1',
        'minver': '1',
        'description': 'Block containing the actual data to be rendered and a timestamp relative to the Cluster Timecode. (see Block Structure)'
    },
    'a0': {
        'name': 'BlockGroup',
        'level': '2',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'description': 'Basic container of information containing a single Block or BlockVirtual, and information specific to that Block/VirtualBlock.'
    },
    'a3': {
        'name': 'SimpleBlock',
        'level': '2',
        'type': 'b',
        'multiple': '1',
        'minver': '2',
        'webm': '1',
        'divx': '1',
        'description': 'Similar to SimpleBlock Structure)'
    },
    'ab': {
        'name': 'PrevSize',
        'cppname': 'ClusterPrevSize',
        'level': '2',
        'type': 'u',
        'minver': '1',
        'description': 'Size of the previous Cluster, in octets. Can be useful for backward playing.'
    },
    'a7': {
        'name': 'Position',
        'cppname': 'ClusterPosition',
        'level': '2',
        'type': 'u',
        'minver': '1',
        'webm': '0',
        'description': 'The Position of the Cluster in the segment (0 in live broadcast streams). It might help to resynchronise offset on damaged streams.'
    },
    '58d7': {
        'name': 'SilentTrackNumber',
        'cppname': 'ClusterSilentTrackNumber',
        'level': '3',
        'type': 'u',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'One of the track number that are not used from now on in the stream. It could change later if not specified as silent in a further Cluster.'
    },
    'e7': {
        'name': 'Timecode',
        'cppname': 'ClusterTimecode',
        'level': '2',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'description': 'Absolute timestamp of the cluster (based on TimecodeScale).'
    },
    '1f43b675': {
        'name': 'Cluster',
        'level': '1',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'description': 'The lower level element containing the (monolithic) Block structure.'
    },
    '4d80': {
        'name': 'MuxingApp',
        'level': '2',
        'type': '8',
        'mandatory': '1',
        'minver': '1',
        'description': 'Muxing application or library ("libmatroska-0.4.3").'
    },
    '7ba9': {
        'name': 'Title',
        'level': '2',
        'type': '8',
        'minver': '1',
        'webm': '0',
        'description': 'General name of the segment.'
    },
    '2ad7b2': {
        'name': 'TimecodeScaleDenominator',
        'level': '2',
        'type': 'u',
        'mandatory': '1',
        'minver': '4',
        'default': '1000000000',
        'description': 'Timestamp scale numerator, see TimecodeScale.'
    },
    '2ad7b1': {
        'name': 'TimecodeScale',
        'level': '2',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'default': '1000000',
        'description': 'Timestamp scale in nanoseconds (1.000.000 means all timestamps in the segment are expressed in milliseconds).'
    },
    '69a5': {
        'name': 'ChapterTranslateID',
        'level': '3',
        'type': 'b',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'The binary value used to represent this segment in the chapter codec data. The format depends on the ChapProcessCodecID used.'
    },
    '69bf': {
        'name': 'ChapterTranslateCodec',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'webm': '0',
        'description': 'The chapter codec using this ID (0: Matroska Script, 1: DVD-menu).'
    },
    '69fc': {
        'name': 'ChapterTranslateEditionUID',
        'level': '3',
        'type': 'u',
        'multiple': '1',
        'minver': '1',
        'webm': '0',
        'description': 'Specify an edition UID on which this correspondance applies. When not specified, it means for all editions found in the segment.'
    },
    '3e83bb': {
        'name': 'NextFilename',
        'level': '2',
        'type': '8',
        'minver': '1',
        'webm': '0',
        'description': 'An escaped filename corresponding to the next segment.'
    },
    '3eb923': {
        'name': 'NextUID',
        'level': '2',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'bytesize': '16',
        'description': 'A unique ID to identify the next chained segment (128 bits).'
    },
    '3c83ab': {
        'name': 'PrevFilename',
        'level': '2',
        'type': '8',
        'minver': '1',
        'webm': '0',
        'description': 'An escaped filename corresponding to the previous segment.'
    },
    '3cb923': {
        'name': 'PrevUID',
        'level': '2',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'bytesize': '16',
        'description': 'A unique ID to identify the previous chained segment (128 bits).'
    },
    '73a4': {
        'name': 'SegmentUID',
        'level': '2',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'range': 'not 0',
        'bytesize': '16',
        'description': 'A randomly generated unique ID to identify the current segment between many others (128 bits).'
    },
    '1549a966': {
        'name': 'Info',
        'level': '1',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'description': 'Contains miscellaneous general information and statistics on the file.'
    },
    '53ac': {
        'name': 'SeekPosition',
        'level': '3',
        'type': 'u',
        'mandatory': '1',
        'minver': '1',
        'description': 'The position of the element in the segment in octets (0 = first level 1 element).'
    },
    '53ab': {
        'name': 'SeekID',
        'level': '3',
        'type': 'b',
        'mandatory': '1',
        'minver': '1',
        'description': 'The binary ID corresponding to the element name.'
    },
    '4dbb': {
        'name': 'Seek',
        'cppname': 'SeekPoint',
        'level': '2',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'description': 'Contains a single seek entry to an EBML element.'
    },
    '114d9b74': {
        'name': 'SeekHead',
        'cppname': 'SeekHeader',
        'level': '1',
        'type': 'm',
        'multiple': '1',
        'minver': '1',
        'description': 'Contains the position of other level 1 elements.'
    },
    '7e7b': {
        'name': 'SignatureElementList',
        'level': '2',
        'type': 'm',
        'multiple': '1',
        'webm': '0',
        'i': 'Cluster|Block|BlockAdditional',
        'description': 'A list consists of a number of consecutive elements that represent one case where data is used in signature. Ex:  means that the BlockAdditional of all Blocks in all Clusters is used for encryption.'
    },
    '7e5b': {
        'name': 'SignatureElements',
        'level': '1',
        'type': 'm',
        'webm': '0',
        'description': 'Contains elements that will be used to compute the signature.'
    },
    '7eb5': {
        'name': 'Signature',
        'level': '1',
        'type': 'b',
        'webm': '0',
        'description': 'The signature of the data (until a new.'
    },
    '7ea5': {
        'name': 'SignaturePublicKey',
        'level': '1',
        'type': 'b',
        'webm': '0',
        'description': 'The public key to use with the algorithm (in the case of a PKI-based signature).'
    },
    '7e9a': {
        'name': 'SignatureHash',
        'level': '1',
        'type': 'u',
        'webm': '0',
        'description': 'Hash algorithm used (1=SHA1-160, 2=MD5).'
    },
    '7e8a': {
        'name': 'SignatureAlgo',
        'level': '1',
        'type': 'u',
        'webm': '0',
        'description': 'Signature algorithm used (1=RSA, 2=elliptic).'
    },
    '1b538667': {
        'name': 'SignatureSlot',
        'level': '-1',
        'type': 'm',
        'multiple': '1',
        'webm': '0',
        'description': 'Contain signature of some (coming) elements in the stream.'
    },
    'bf': {
        'name': 'CRC-32',
        'level': '-1',
        'type': 'b',
        'minver': '1',
        'webm': '0',
        'description': 'The CRC is computed on all the data of the Master element it\'s in. The CRC element should be the first in it\'s parent master for easier reading. All level 1 elements should include a CRC-32. The CRC in use is the IEEE CRC32 Little Endian'
    },
    'ec': {
        'name': 'Void',
        'level': '-1',
        'type': 'b',
        'minver': '1',
        'description': 'Used to void damaged data, to avoid unexpected behaviors when using damaged data. The content is discarded. Also used to reserve space in a sub-element for later use.'
    },
    '42f3': {
        'name': 'EBMLMaxSizeLength',
        'level': '1',
        'type': 'u',
        'mandatory': '1',
        'default': '8',
        'minver': '1',
        'description': 'The maximum length of the sizes you\'ll find in this file (8 or less in Matroska). This does not override the element size indicated at the beginning of an element. Elements that have an indicated size which is larger than what is allowed by EBMLMaxSizeLength shall be considered invalid.'
    },
    '42f2': {
        'name': 'EBMLMaxIDLength',
        'level': '1',
        'type': 'u',
        'mandatory': '1',
        'default': '4',
        'minver': '1',
        'description': 'The maximum length of the IDs you\'ll find in this file (4 or less in Matroska).'
    },
    '42f7': {
        'name': 'EBMLReadVersion',
        'level': '1',
        'type': 'u',
        'mandatory': '1',
        'default': '1',
        'minver': '1',
        'description': 'The minimum EBML version a parser has to support to read this file.'
    },
    '1a45dfa3': {
        'name': 'EBML',
        'level': '0',
        'type': 'm',
        'mandatory': '1',
        'multiple': '1',
        'minver': '1',
        'description': 'Set the EBML characteristics of the data to follow. Each EBML document has to start with this.'
    }
};

module.exports = schema;
