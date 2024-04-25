<script lang="tsx">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { ElRadioGroup, ElRadio, ElRadioButton } from 'element-plus'
import { filterProps } from '../help'
import type AutoForm from '../type'

export default defineComponent({
  name: 'RhRadio',
  props: {
    modelValue: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
      default: ''
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
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    const { labelField, valueField } = props.optionsAlias
    const renderRadio = (cprops: AutoForm.ComponentOptions = {}) => {
      const oprops = { ...cprops }
      const fprop = filterProps(cprops, ['label', 'value'])
      const Com = isButton.value ? ElRadioButton : ElRadio
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
        return renderRadio({ ...opt, key: opt.key || opt.label })
      })
    }
    return () =>
      isGroup.value ? (
        <ElRadioGroup v-model={model.value}>{renderOptions()}</ElRadioGroup>
      ) : (
        renderRadio(rprops)
      )
  }
})
</script>
