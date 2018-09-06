// @flow

import type { EBMLSchema } from "./schema.types";

export type TagMeta = {
  data: Buffer,
  dataSize: number,
  discardable: boolean,
  end: number,
  id: number,
  keyframe: boolean,
  payload: Buffer,
  start: number,
  tagStr: string,
  track: number,
  value: number | string
};

export type Tag = EBMLSchema & TagMeta;

export type TagStackItem = Tag & { children: TagStackItem[] };
export type TagStack = TagStackItem[];
