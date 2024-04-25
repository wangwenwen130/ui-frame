<script lang="tsx">
import type AutoForm from './type'
import { defineComponent, unref, ref, reactive, onMounted, computed, watch } from 'vue'
import type { DefineComponent } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElTooltip, ElCol } from 'element-plus'
import {
  props,
  initModel,
  getBindProps,
  getSlot,
  setFormItemSlots,
  filterProps,
  findIndex
} from './help'
import { renderComMap } from './componets'

export default defineComponent({
  name: 'AutoForm',
  props: props,
  emits: ['register'],
  setup(props, { emit, slots, expose }) {
    type ModeType = AutoForm.GetModel<typeof props.model>

    const fromInstance = ref<AutoForm.FormInstance>()

    const fModel = reactive<ModeType>(props.model || {})

    initModel(props.schema || [], fModel)

    onMounted(() => {
      emit('register', unref(fromInstance), method)
    })
    const mergeProps = ref<AutoForm.Recordable>({})

    const getProps = computed(() => Object.assign(props, mergeProps.value))

    const renderComponet = (schema: AutoForm.Schema) => {
      const { component, field, componentProps } = schema
      if (slots[field]) return getSlot(slots, field, fModel)
      if (!component) return console.error('Schema component field is required')
      const Com = renderComMap[component] as unknown as DefineComponent<Record<string, any>>
      const rpops = filterProps(componentProps || {}, ['slots'])
      return <Com v-model={fModel[field]} {...rpops} style={componentProps?.style}></Com>
    }

    const renderFormItem = (schema: AutoForm.Schema) => {
      const { labelMessage, field, label, formItemProps } = schema
      const fItemSlots = setFormItemSlots(slots, field)
      if (labelMessage) {
        fItemSlots.label = () => (
          <span class={'flexc'}>
            <span>{label}</span>
            <ElTooltip placement="right" raw-content>
              {{
                content: () => <span>{labelMessage}</span>,
                default: () => (
                  <el-icon size={16} color="var(--el-color-primary)" class="form-warn-icon">
                    <WarningFilled />
                  </el-icon>
                )
              }}
            </ElTooltip>
          </span>
        )
      }
      return (
        <ElFormItem {...(formItemProps || {})} prop={field} label={label || ''}>
          {{
            ...fItemSlots,
            default: () => renderComponet(schema)
          }}
        </ElFormItem>
      )
    }

    const renderContent = () => {
      const { schema = [], isCol } = unref(getProps)

      return schema
        .filter((v) => !v.hidden)
        .map((item) => {
          const isDivider = item.component === 'Divider'
          const Com = renderComMap['Divider']
          return isDivider ? (
            <Com {...{ contentPosition: 'left', ...item.componentProps }}>{item?.label}</Com>
          ) : isCol ? (
            <ElCol {...item.colProps}>{renderFormItem(item)}</ElCol>
          ) : (
            renderFormItem(item)
          )
        })
    }

    const render = () => (
      <ElForm
        ref={fromInstance}
        {...getBindProps(getProps.value as AutoForm.FormProps<ModeType>)}
        model={fModel}
        class={props.inline ? 'el-from-wrap' : ''}
      >
        {{
          default: () => {
            const { isCustom } = unref(getProps)
            return isCustom ? getSlot(slots, 'default') : renderContent()
          }
        }}
      </ElForm>
    )

    watch(
      () => getProps.value.schema,
      (schema = []) => {
        initModel(schema, fModel)
      },
      {
        immediate: true,
        deep: true
      }
    )

    const method = {
      setValues: (data: ModeType) => {
        Object.keys(data).forEach((key) => {
          fModel[key] = data[key]
        })
      },
      setProps: (props: AutoForm.Recordable) => {
        mergeProps.value = Object.assign(mergeProps.value, props)
      },
      delSchema: (field: string) => {
        const { schema = [] } = unref(getProps)
        const index = findIndex(schema, (v: AutoForm.Schema) => v.field === field)
        if (index > -1) schema.splice(index, 1)
      },
      addSchema: (formSchema: AutoForm.Schema, index?: number) => {
        const { schema = [] } = unref(getProps)
        if (index !== void 0) return schema.splice(index, 0, formSchema)
        schema.push(formSchema)
      },
      formModel: () => fModel,
      getElFormRef: () => unref(fromInstance)
    }

    expose(method)
    return render
  }
})
</script>

<style scoped>
.el-from-wrap {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.form-warn-icon {
  margin-left: 4px;
}
.flexc {
  display: flex;
  align-items: center;
}
</style>
