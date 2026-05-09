import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  stylistic: {
    quotes: 'single',
    semi: false
  },
  ignores: [
    '**/dist/**',
    '**/es/**',
    '**/lib/**',
    '**/node_modules/**',
    'pnpm-lock.yaml'
  ]
})
