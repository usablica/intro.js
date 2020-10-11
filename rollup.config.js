import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';
import json from '@rollup/plugin-json';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import sass from 'rollup-plugin-sass';
import autoprefixer from 'autoprefixer';
import normalize from 'postcss-normalize';
import clean from 'postcss-clean';
import postcss from 'postcss';
import { version } from './package.json';

const inputPath = 'src/index.js';

const banner = `/*!
 * Intro.js v${version}
 * https://github.com/usablica/intro.js
 *
 * Copyright (C) 2017-2020 Afshin Mehrabani (@afshinmeh).
 * https://raw.githubusercontent.com/usablica/intro.js/master/license.md
 *
 * Date: ${new Date().toUTCString()}
 */
`;

const plugins = [
  json(),
  sass({
    output: "dist/introjs.css",
    options: {
      sourceMap: true,
    },
    processor: css => postcss([normalize, autoprefixer, clean])
      .process(css)
      .then(result => result.css)
  }),
  resolve(),
  progress(),
  filesize({
    showGzippedSize: true,
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  commonjs()
];

export default [
  {
    input: inputPath,
    output: {
      file: pkg.main,
      format: 'umd',
      banner,
      name: 'introJs'
    },
    plugins
  },
  {
    input: inputPath,
    output: {
      file: pkg.main.replace(/\.js$/, '.min.js'),
      banner,
      format: 'umd',
      name: 'introJs'
    },
    plugins: [
      ...plugins,
      terser()
    ]
  }
];

