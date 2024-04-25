<script lang="tsx">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { filterProps } from '../help'
import type AutoForm from '../type'

export default defineComponent({
  name: 'RhSelect',
  props: {
    modelValue: {
      type: [String, Number, Boolean, Object, Array],
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

    const model = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })

    const { labelField, valueField } = props.optionsAlias
    const renderOtions = (cprops: AutoForm.ComponentOptions = {}) => {
      const oprops = { ...cprops }
      const fprop = filterProps(cprops, ['label', 'value'])
      return (
        <ElOption
          value={oprops[valueField || 'value']}
          label={oprops[labelField || 'label']}
          {...fprop}
        ></ElOption>
      )
    }

    const renderOptions = () => {
      return options.value.map((opt) => {
        return renderOtions({ ...opt, key: opt.key || opt.label })
      })
    }

    return () => <ElSelect v-model={model.value}>{renderOptions()}</ElSelect>
  }
})
</script>
