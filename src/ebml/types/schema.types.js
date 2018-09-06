/* @flow */
/* eslint-disable flowtype/space-after-type-colon */
export type EBMLSchema = {
  name: string,
  type: 'm' | 'u' | 'i' | 'f' | 's' | '8' | 'd' | 'b' | null,
  description: string,
  level: number,
  mandatory: boolean,
  minver: number,
  multiple: boolean,
  webm: boolean,
  // optional params start here

  br?:
    | string
    | [string, string]
    | [string, string, string]
    | [string, string, string, string],
  bytesize?: number,
  cppname?: string,
  default?: number | string,
  del?: ['1 - bzlib,', '2 - lzo1x'] | '1 - bzlib,' | '2 - lzo1x',
  divx?: boolean,
  i?: string,
  maxver?: number,
  recursive?: boolean,
  strong?: 'informational' | 'Informational',
};
