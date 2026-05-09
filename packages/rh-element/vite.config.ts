import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

const pkgRoot = resolve(__dirname, '..')

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@rh-element': pkgRoot
    }
  },
  build: {
    target: 'es2020',
    lib: {
      entry: resolve(__dirname, 'index.ts')
    },
    rollupOptions: {
      external: ['vue', 'element-plus', '@element-plus/icons-vue'],
      output: [
        {
          format: 'es',
          dir: resolve(__dirname, 'es'),
          entryFileNames: '[name].mjs',
          preserveModules: true,
          preserveModulesRoot: pkgRoot
        },
        {
          format: 'cjs',
          dir: resolve(__dirname, 'lib'),
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: pkgRoot,
          exports: 'named'
        }
      ]
    },
    cssCodeSplit: true,
    sourcemap: false
  }
})
