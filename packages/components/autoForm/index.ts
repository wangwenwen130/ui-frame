import form from './src/autoForm.vue'
import { withInstall } from '@rh-element/utils'
export type { AutoFormType } from './src/type'
export { useAutoForm } from './src/hooks/useAutoForm'
export type AutoFormInstance = InstanceType<typeof form>

export const AutoForm = withInstall(form)
