import commonjs from '@rollup/plugin-commonjs'
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import fs from 'fs'
import serve from 'rollup-plugin-serve'
import typescript from 'rollup-plugin-typescript'

const showAddress = () => ({
  load: () =>
    console.log(
      '\x1b[35m%s\x1b[0m',
      `Current registry address: https://localhost:3001/dapplet.json`
    ),
})

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        format: 'cjs',
        exports: 'named',
      },
    ],
    plugins: [
      typescript(),
      json(),
      resolve({ browser: true }),
      commonjs(),
      image(),
      serve({
        port: 3001,
        https: {
          key: fs.readFileSync('src/server/secret/server.key'),
          cert: fs.readFileSync('src/server/secret/server.cert'),
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
      showAddress(),
    ],
  },
]
