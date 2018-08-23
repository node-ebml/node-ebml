/* @flow */
export type EBMLSchema = {
    name: string,
    type: 'm' | 'u' | 'i' | 'f' | 's' | '8' | 'd' | 'b' | null,
    description: string,
    level: number,
    minver: number,
    multiple: boolean,
    webm: boolean,
    // optional params start here

    br?: [string, string, string, string]
        | [string, string, string]
        | [string, string]
        | string,
    bytesize?: number,
    cppname?: string,
    default?: number | string,
    del?: ['1 - bzlib,', '2 - lzo1x'],
    divx?: boolean,
    i?: 'Cluster' | 'Block' | 'BlockAdditional',
    mandatory?: boolean,
    maxver?: number,
    recursive?: boolean,
    strong?: 'informational'
};
