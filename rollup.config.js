import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import multiEntry from 'rollup-plugin-multi-entry';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'iife',
      name: 'introJs'
    },
    plugins: [
      resolve(),
      commonjs(),
      progress(),
      filesize({
        showGzippedSize: true,
      }),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
          [
            '@babel/env',
            {
              modules: false,
              useBuiltIns: "usage",
              targets: 'maintained node versions'
            }
          ]
        ]
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.main.replace(/\.js$/, '.min.js'),
      format: 'iife',
      name: 'introJs'
    },
    plugins: [
      resolve(),
      commonjs(),
      progress(),
      terser(),
      filesize({
        showGzippedSize: true,
      }),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
          [
            '@babel/env',
            {
              modules: false,
              useBuiltIns: "usage",
              targets: 'maintained node versions'
            }
          ]
        ]
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'introJs'
    },
    plugins: [
      resolve(),
      commonjs(),
      progress(),
      filesize({
        showGzippedSize: true,
      }),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: 'introJs'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      terser(),
      progress(),
      filesize({
        showGzippedSize: true,
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      progress(),
      filesize({
        showGzippedSize: true,
      })
    ]
  }
];

