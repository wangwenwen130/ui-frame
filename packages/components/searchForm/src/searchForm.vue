<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { AutoForm, useAutoForm } from '../../autoForm'
import { props, filterProps, getSlot } from './helper'
import { ElButton, ElPopover, ElCheckbox, ElScrollbar } from 'element-plus'
import Reflash from './reflash.vue'
import Setting from './setting.vue'

export default defineComponent({
  name: 'SearchForm',
  props,
  emits: ['search', 'reset'],
  setup(props, { emit, slots }) {
    const { register, formModel, getElFormRef } = useAutoForm()

    const newSchema = computed(() => {
      const schema = props.schema
      schema.push({
        field: 'action',
        formItemProps: {
          labelWidth: '0px'
        }
      })
      return schema
    })
    const rprops = computed(() => filterProps(props, ['schema', 'showSearch', 'showReset']))

    const settingBox = () =>
      props.columns.map((item) => {
        return <ElCheckbox v-model={item.visible} label={item.label}></ElCheckbox>
      })

    const actionSlots = () => {
      return {
        action: () => {
          return (
            <>
              {props.showRefresh && (
                <i class="icon-wrap mr10" onClick={search}>
                  <Reflash size={props.iconSize} fill={props.iconColor} />
                </i>
              )}
              {props.showColumnVisible && (
                <ElPopover trigger="click" placement="bottom">
                  {{
                    reference: () => (
                      <i class="icon-wrap mr10">
                        <Setting size={props.iconSize} fill={props.iconColor} />
                      </i>
                    ),
                    default: () => (
                      <ElScrollbar max-height={400}>
                        <div class="setting-box">{settingBox()}</div>
                      </ElScrollbar>
                    )
                  }}
                </ElPopover>
              )}
              {props.showSearch && (
                <ElButton type="primary" onClick={search}>
                  搜索
                </ElButton>
              )}
              {props.showReset && <ElButton onClick={reset}>重置</ElButton>}
              <>{slots.actionMore && slots.actionMore()}</>
            </>
          )
        }
      }
    }
    const search = async () => {
      const isValid = await getElFormRef()?.validate()
      if (isValid) {
        emit('search', formModel())
      }
    }
    const reset = async () => {
      await getElFormRef()?.resetFields()
      emit('search', formModel())
    }

    const rendeSlots = () => {
      const allSlots = { ...slots }
      delete allSlots.actionMore
      return allSlots
    }
    return () => (
      <AutoForm schema={newSchema.value} {...rprops.value} onRegister={register}>
        {{
          ...rendeSlots(),
          ...actionSlots()
        }}
      </AutoForm>
    )
  }
})
</script>
<style lang="scss" scoped>
.icon-wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.mr10 {
  margin-right: 10px;
}
.setting-box {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  .el-checkbox {
    margin-right: 0;
  }
}
</style>
