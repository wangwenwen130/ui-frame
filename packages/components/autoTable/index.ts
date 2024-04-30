import table from './src/autoTable.vue'
export type { AutoTableType } from './src/types'
import { withInstall } from '@rh-element/utils'
export { useAutoTable } from './src/hooks/useAutoTable'

export type AutoTableInstance = InstanceType<typeof table>

export const AutoTable = withInstall(table)
