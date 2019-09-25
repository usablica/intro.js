import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const inputPath = 'src/index.js';

const plugins = [
  resolve(),
  commonjs(),
  progress(),
  filesize({
    showGzippedSize: true,
  }),
  babel({
    exclude: 'node_modules/**'
  })
];

export default [
  {
    input: inputPath,
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'introJs'
    },
    plugins
  },
  {
    input: inputPath,
    output: {
      file: pkg.main.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: 'introJs'
    },
    plugins: [
      ...plugins,
      terser()
    ]
  }
];

