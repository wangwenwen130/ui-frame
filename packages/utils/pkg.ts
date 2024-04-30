export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'gulpfile', 'dist']
  return files.filter((path) => !excludes.some((exclude) => path.includes(exclude)))
}

export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies)
  }
}

export const getPackageManifest = (pkgPath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // @ts-ignore
  return require(pkgPath)
}
