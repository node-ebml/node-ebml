import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const plugins = [babel(), json(), commonjs(), builtins(), globals(), resolve()];
const sourcemap = true;

export default {
    input: './src/ebml/index.js',
    output: [
        {
            file: 'lib/ebml.js',
            format: 'cjs',
            sourcemap,
        },
        {
            file: 'lib/ebml.esm.js',
            format: 'esm',
            sourcemap,
        },
    ],
    plugins,
};
