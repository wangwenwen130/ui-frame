import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const compRoot = resolve(pkgRoot, 'components')
export const epRoot = resolve(pkgRoot, 'rh-element')
export const hookRoot = resolve(pkgRoot, 'hooks')
export const utilRoot = resolve(pkgRoot, 'utils')

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist')
export const epOutput = resolve(buildOutput, 'rh-element')

export const projPackage = resolve(projRoot, 'package.json')
export const compPackage = resolve(compRoot, 'package.json')
export const hookPackage = resolve(hookRoot, 'package.json')
export const utilPackage = resolve(utilRoot, 'package.json')
export const epPackage = resolve(epRoot, 'package.json')
