import { getPackageDependencies } from '@rh-element/utils'
import { epPackage } from '../path'
import { copy } from 'fs-extra'
import { copyFile, mkdir } from 'fs/promises'
import path from 'path'
import { buildOutput, projRoot, epOutput } from '../path'
import { buildConfig } from '../build-info'
import type { OutputOptions, RollupBuild } from 'rollup'

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(epPackage)

  return (id: string) => {
    const packages: string[] = [...peerDependencies]
    if (!options.full) {
      packages.push('@vue', ...dependencies)
    }

    return [...new Set(packages)].some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
  }
}

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

export function formatBundleFilename(name: string, minify: boolean, ext: string) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}

export const copyTypesDefinitions = async () => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const esmPath = path.resolve(buildConfig.esm.output.path, 'packages')
  const cjsPath = path.resolve(buildConfig.cjs.output.path, 'packages')
  await copy(src, esmPath)
  await copy(src, cjsPath)
  await copyFile(epPackage, path.join(epOutput, 'package.json'))
  await copyFile(
    path.join(esmPath, '/rh-element/index.d.ts'),
    path.join(buildConfig.esm.output.path, 'index.d.ts')
  )
  await copyFile(
    path.join(cjsPath, '/rh-element/index.d.ts'),
    path.join(buildConfig.cjs.output.path, 'index.d.ts')
  )
}
