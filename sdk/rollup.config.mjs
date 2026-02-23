import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/tracker.ts',
  output: {
    file: 'dist/tracker.js',
    format: 'iife',
    sourcemap: false,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    terser(),
  ],
};
