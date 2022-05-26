import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import commonjs from '@rollup/plugin-commonjs';
import progress from 'rollup-plugin-progress';
import json from '@rollup/plugin-json';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';
import normalize from 'postcss-normalize';
import clean from 'postcss-clean';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import { version } from './package.json';

const inputPath = './src';
const outputPath = './dist';

const banner = `/*!
 * Intro.js v${version}
 * https://introjs.com
 *
 * Copyright (C) 2012-2022 Afshin Mehrabani (@afshinmeh).
 * https://introjs.com
 *
 * Date: ${new Date().toUTCString()}
 */
`;

const jsPlugins = [
  typescript(),
  json(),
  resolve(),
  progress(),
  filesize({
    showGzippedSize: true,
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  commonjs(),
  terser()
];

const postCSSPlugins = [
  normalize,
  autoprefixer,
  clean
];

export default [
  {
    input: `${inputPath}/styles/introjs-rtl.scss`,
    output: {
      file: `${outputPath}/minified/introjs-rtl.min.css`,
      format: 'es'
    },
    plugins: [
      postcss({
        sourceMap: true,
        extract: true,
        plugins: postCSSPlugins
      })
    ]
  },
  {
    input: `${inputPath}/styles/introjs-rtl.scss`,
    output: {
      file: `${outputPath}/introjs-rtl.css`,
      format: 'es'
    },
    plugins: [
      postcss({
        extract: true,
        sourceMap: true,
        plugins: postCSSPlugins
      })
    ]
  },
  {
    input: `${inputPath}/styles/introjs.scss`,
    output: {
      file: `${outputPath}/introjs.css`,
      format: 'es'
    },
    plugins: [
      postcss({
        extract: true,
        sourceMap: true,
        plugins: postCSSPlugins
      })
    ]
  },
  {
    input: `${inputPath}/styles/introjs.scss`,
    output: {
      file: `${outputPath}/minified/introjs.min.css`,
      format: 'es'
    },
    plugins: [
      postcss({
        extract: true,
        sourceMap: true,
        plugins: postCSSPlugins
      })
    ]
  },
  {
    input: `${inputPath}/index.ts`,
    output: {
      file: `${outputPath}/${pkg.main}`,
      format: 'umd',
      banner,
      name: 'introJs',
      sourcemap: true,
    },
    plugins: jsPlugins
  },
  {
    input: `${inputPath}/index.ts`,
    output: {
      file: `${outputPath}/minified/${pkg.main.replace(/\.js$/, '.min.js')}`,
      banner,
      format: 'umd',
      name: 'introJs',
      sourcemap: true,
    },
    plugins: jsPlugins
  },
  {
    input: `${inputPath}/index.ts`,
    output: {
      file: `${outputPath}/${pkg.main.replace(/\.js$/, '.module.js')}`,
      banner,
      format: 'es',
      name: 'introJs',
      sourcemap: true,
    },
    plugins: jsPlugins
  }
];
