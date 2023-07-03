import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';
import normalize from 'postcss-normalize';
import clean from 'postcss-clean';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';

const inputPath = './src'
const outputPath = './dist';

const banner = `/*!
 * Intro.js v${pkg.version}
 * https://introjs.com
 *
 * Copyright (C) 2012-${new Date().getFullYear()} Afshin Mehrabani (@afshinmeh).
 * https://introjs.com
 *
 * Date: ${new Date().toUTCString()}
 */
`;

const extensions = ['.ts', '.js'];

const jsPlugins = [
  commonjs(),
  json(),
  resolve({ extensions }),
  progress(),
  filesize({
    showGzippedSize: true,
  }),
  babel({
    exclude: 'node_modules/**',
    include: [`${inputPath}/**/*`],
    extensions
  }),
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
    output: [{
      file: `${outputPath}/introjs-rtl.css`,
      format: 'es'
    }, {
      file: `${outputPath}/minified/introjs-rtl.min.css`,
      format: 'es'
    }],
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
    output: [{
      file: `${outputPath}/introjs.css`,
      format: 'es'
    }, {
      file: `${outputPath}/minified/introjs.min.css`,
      format: 'es'
    }],
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
    output: [{
      file: `${outputPath}/${pkg.main}`,
      format: 'umd',
      banner,
      name: 'introJs',
      sourcemap: true,
    }, {
      file: `${outputPath}/minified/${pkg.main.replace(/\.js$/, '.min.js')}`,
      format: 'umd',
      banner,
      name: 'introJs',
      sourcemap: true,
    }],
    plugins: jsPlugins
  },
  {
    input: `${inputPath}/index.ts`,
    output: {
      file: `${outputPath}/${pkg.module}`,
      banner,
      format: 'es',
      name: 'introJs',
      sourcemap: true,
    },
    plugins: [
      typescript({
        emitDeclarationOnly: true,
        declaration: true,
      }),
      ...jsPlugins,
    ]
  }
];
