import type { PropType, Slots } from 'vue'
import { isFunction } from '@rh-element/utils'
import type { AutoFormType } from '../../autoForm'
import type { AutoTableType } from '../../autoTable'

export const props = {
  schema: {
    type: Array as PropType<AutoFormType.Schema[]>,
    default: () => []
  },
  columns: {
    type: Array as PropType<AutoTableType.TableColumn[]>,
    default: () => []
  },
  inline: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  showReset: {
    type: Boolean,
    default: true
  },
  showRefresh: {
    type: Boolean,
    default: false
  },
  showColumnVisible: {
    type: Boolean,
    default: false
  },
  iconSize: {
    type: String,
    default: '24px'
  },
  iconColor: {
    type: String
  },
  searchText: {
    type: String,
    default: '搜索'
  },
  resetText: {
    type: String,
    default: '重置'
  }
}

export const filterProps = (props: AutoFormType.Recordable, keys: string[]) => {
  const obj = { ...props }
  for (const key in obj) {
    if (keys.includes(key as string)) delete obj[key as string]
  }
  return obj
}

export const getSlot = (slots: Slots, slot = 'default', data?: AutoFormType.Recordable) => {
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
