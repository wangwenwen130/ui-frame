import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import glob from 'fast-glob'
import { pkgRoot, epRoot } from './path'
import { excludeFiles } from '@rh-element/utils'
import { writeBundles } from './utils/pack'
import { buildConfigEntries, target } from './build-info'
import postcss from 'rollup-plugin-postcss'

import type { OutputOptions } from 'rollup'

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true
    })
  )
  const bundle = await rollup({
    input,
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: true
          }),
          vueJsx: vueJsx()
        }
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts']
      }),
      postcss(),
      commonjs(),
      esbuild({
        sourceMap: false,
        target,
        loaders: {
          '.vue': 'ts'
        }
      })
    ],
    external: ['vue', 'element-plus', '@element-plus/icons-vue'],
    treeshake: true
  })
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: epRoot,
        sourcemap: config.sourcemap,
        entryFileNames: `[name].${config.ext}`
      }
    })
  )
}

buildModules()
