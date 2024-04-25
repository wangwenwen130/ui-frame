import type { PropType, Slots } from 'vue'
import { isFunction } from '@rh-element/utils'
import type AutoForm from './type'

export const props = {
  schema: Object as PropType<AutoForm.Schema[]>,
  model: Object as PropType<Record<string, any>>,
  inline: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Object as PropType<Pick<AutoForm.FormItemProps, 'rules'>>
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  labelWidth: {
    type: [String, Number]
  },
  isCol: {
    type: Boolean,
    default: false
  },
  labelPosition: {
    type: String as PropType<'left' | 'right' | 'top'>,
    default: 'right'
  },
  inlineMessage: {
    type: Boolean,
    default: false
  },
  statusIcon: {
    type: Boolean,
    default: false
  },
  scrollToError: {
    type: Boolean,
    default: false
  }
}

export const getBindProps = <T extends AutoForm.Recordable>(props: AutoForm.FormProps<T>) => {
  const obj = { ...props }
  const delKeys: (keyof AutoForm.FormProps)[] = ['schema', 'isCol', 'isCustom']
  return filterProps(obj, delKeys)
}

export const filterProps = (props: AutoForm.Recordable, keys: string[]) => {
  const obj = { ...props }
  for (const key in obj) {
    if (keys.includes(key as string)) delete obj[key as string]
  }
  return obj
}

export const getSlot = (slots: Slots, slot = 'default', data?: AutoForm.Recordable) => {
  // Reflect.has 判断一个对象是否存在某个属性
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}

export const initModel = (schema: AutoForm.Schema[], model: AutoForm.Recordable) => {
  schema.map((v) => {
    if (v.hidden) {
      delete model[v.field]
    } else if (v.component) {
      const hasField = Reflect.has(model, v.field)
      model[v.field] = hasField ? model[v.field] : v.value !== void 0 ? v.value : ''
    }
  })
  return model
}

/**
 * @param slots 插槽
 * @param field 字段名
 * @returns 返回FormIiem插槽
 */
export const setFormItemSlots = (slots: Slots, field: string): AutoForm.Recordable => {
  const slotObj: AutoForm.Recordable = {}
  if (slots[`${field}-error`]) {
    slotObj['error'] = (data: AutoForm.Recordable) => {
      return getSlot(slots, `${field}-error`, data)
    }
  }
  if (slots[`${field}-label`]) {
    slotObj['label'] = (data: AutoForm.Recordable) => {
      return getSlot(slots, `${field}-label`, data)
    }
  }
  return slotObj
}

export const findIndex = <T = AutoForm.Recordable>(ary: Array<T>, fn: AutoForm.Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}
