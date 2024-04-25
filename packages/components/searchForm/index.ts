import search from './src/searchForm.vue'
import { withInstall } from '@rh-element/utils'
export type SearchFormInstance = InstanceType<typeof search>

export const SearchForm = withInstall(search)
