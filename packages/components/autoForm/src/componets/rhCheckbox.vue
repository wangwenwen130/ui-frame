<script lang="tsx">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { ElCheckboxGroup, ElCheckbox, ElCheckboxButton } from 'element-plus'
import { filterProps } from '../help'
import type AutoForm from '../type'

export default defineComponent({
  name: 'RhCheckbox',
  props: {
    modelValue: {
      type: [String, Number, Boolean, Array] as PropType<
        string | number | boolean | string[] | number[]
      >,
      default: () => []
    },
    options: {
      type: Array as PropType<AutoForm.ComponentOptions[]>,
      default: () => []
    },
    isButton: {
      type: Boolean,
      default: false
    },
    optionsAlias: {
      type: Object as PropType<AutoForm.ComponentOptionsAlias>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const options = computed(() => props.options)
    const isGroup = computed(() => options.value.length > 0)
    const isButton = computed(() => props.isButton)
    const rprops = filterProps(props, ['options', 'isButton', 'modelValue', 'optionsAlias'])
    const model = computed({
      get() {
        if (isGroup.value) {
          if (Array.isArray(props.modelValue)) return props.modelValue
          return props.modelValue ? [props.modelValue] : []
        }
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    const { labelField, valueField } = props.optionsAlias

    const renderCheckbox = (cprops: AutoForm.ComponentOptions = {}) => {
      const oprops = { ...cprops }
      const fprop = filterProps(cprops, ['label', 'value'])
      const Com = isButton.value ? ElCheckboxButton : ElCheckbox
      return isGroup.value ? (
        <Com
          value={oprops[valueField || 'value']}
          label={oprops[labelField || 'label']}
          {...fprop}
        ></Com>
      ) : (
        <Com
          v-model={model.value}
          value={oprops[valueField || 'value']}
          label={oprops[labelField || 'label']}
          {...fprop}
        ></Com>
      )
    }

    const renderOptions = () => {
      return options.value.map((opt) => {
        return renderCheckbox({ ...opt, key: opt.key || opt.label })
      })
    }

    return () =>
      isGroup.value ? (
        <ElCheckboxGroup v-model={model.value}>{renderOptions()}</ElCheckboxGroup>
      ) : (
        renderCheckbox(rprops)
      )
  }
})
</script>

<style scoped></style>
