import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

const plugins = [
  babel({ exclude: 'node_modules/**' }),
  resolve({
    browser: true,
    jsnext: true,
    main: true,
    module: true,
    preferBuiltins: true,
  }),
  commonjs(),
  builtins(),
  globals(),
  replace({
    vars: {
      ENV: process.env.NODE_ENV || 'development',
    },
  }),
  json(),
];

const sourcemap = true;

export default [
  {
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
      {
        file: 'lib/ebml.iife.js',
        format: 'iife',
        name: 'EBML',
        sourcemap,
      },
      {
        file: 'lib/ebml.amd.js',
        format: 'amd',
        name: 'EBML',
        sourcemap,
      },
      {
        file: 'lib/ebml.umd.js',
        format: 'umd',
        name: 'EBML',
        sourcemap,
      },
    ],
    plugins,
  },
  {
    input: './src/ebml/index.js',
    output: [
      {
        file: 'lib/ebml.min.js',
        format: 'cjs',
        sourcemap,
      },
      {
        file: 'lib/ebml.esm.min.js',
        format: 'esm',
        sourcemap,
      },
      {
        file: 'lib/ebml.iife.min.js',
        format: 'iife',
        name: 'EBML',
        sourcemap,
      },
      {
        file: 'lib/ebml.amd.min.js',
        format: 'amd',
        name: 'EBML',
        sourcemap,
      },
      {
        file: 'lib/ebml.umd.min.js',
        format: 'umd',
        name: 'EBML',
        sourcemap,
      },
    ],
    plugins: [...plugins, terser()],
  },
];
