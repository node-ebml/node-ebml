/* eslint-disable node/no-unsupported-features/es-syntax */
import babel from '@rollup/plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from '@rollup/plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'rollup';

const plugins = [
  babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
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
    preventAssignment: true,
  }),
  json(),
];

const sourcemap = process.env.SOURCE_MAPS || true;
const globalOpts = {
  stream: 'stream',
};

export default defineConfig([
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
        globals: globalOpts,
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
        globals: globalOpts,
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
      },
      {
        file: 'lib/ebml.esm.min.js',
        format: 'esm',
      },
      {
        file: 'lib/ebml.iife.min.js',
        format: 'iife',
        name: 'EBML',
        globals: globalOpts,
      },
      {
        file: 'lib/ebml.amd.min.js',
        format: 'amd',
        name: 'EBML',
      },
      {
        file: 'lib/ebml.umd.min.js',
        format: 'umd',
        name: 'EBML',
        globals: globalOpts,
      },
    ],
    plugins: [...plugins, terser()],
  },
]);
/* eslint-enable node/no-unsupported-features/es-syntax */
