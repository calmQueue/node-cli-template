import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import esbuild from 'rollup-plugin-esbuild'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import hashbang from 'rollup-plugin-hashbang'

const entries = ['src/index.ts', 'src/command.ts']

const plugins = [
  babel({
    babelrc: false,
    babelHelpers: 'bundled',
    presets: [['env', { modules: false }]]
  }),
  resolve({
    preferBuiltins: true
  }),
  alias(),
  json(),
  typescript(),
  hashbang.default(),
  commonjs(),
  esbuild({
    minify: process.env.NODE_ENV === 'production'
  })
]

export default [
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
        format: 'esm'
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.cjs'),
        format: 'cjs'
      }
    ],
    external: [],
    plugins
  })),
  ...entries.map((input) => ({
    input,
    output: {
      file: input.replace('src/', '').replace('.ts', '.d.ts'),
      format: 'esm'
    },
    external: [],
    plugins: [dts({ respectExternal: true })]
  }))
]