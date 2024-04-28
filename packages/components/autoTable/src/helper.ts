import type { PropType, Slots } from 'vue'
import type AutoTableType from './types'
import { isFunction } from '@rh-element/utils'
import type { TableColumnCtx } from 'element-plus'

export const props = {
  columns: {
    type: Array as PropType<AutoTableType.TableColumn[]>,
    default: () => []
  },
  pageSize: {
    type: Number,
    default: 20
  },
  currentPage: {
    type: Number,
    default: 1
  },
  selection: {
    type: Boolean,
    default: false
  },
  showOverflowTooltip: {
    type: Boolean,
    default: true
  },
  expand: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object as PropType<AutoTableType.Pagination>
  },
  reserveSelection: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  reserveIndex: {
    type: Boolean,
    default: false
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  // 表头对齐方式
  headerAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  data: {
    type: Array as PropType<AutoTableType.Recordable[]>,
    default: () => []
  },
  combine: {
    type: Object as PropType<{
      mergeKey: string
      columns: string[]
    }>, // property'combineKey', 'property', ''
    default: () => {
      return {
        mergeKey: '',
        columns: []
      }
    }
  }
}

export const getSpanArr = (list: AutoTableType.Recordable[], key: string) => {
  if (!key) return new Array(list.length).fill(1)
  const arr = [1]
  let idx = 0
  list.forEach((item, index) => {
    if (item[key] === list[index - 1][key]) {
      arr[idx] += 1
      arr[index] = 0
    } else {
      arr[index] = 1
      idx = index
    }
  })
  return arr
}

export const spanMethod = (
  data: {
    row: AutoTableType.Recordable
    column: TableColumnCtx<any>
    rowIndex: number
    columnIndex: number
  },
  property: string[],
  span: number[]
) => {
  const { column, rowIndex } = data
  if (property.includes(column.property)) {
    const rowSpan = span[rowIndex]
    return {
      rowspan: rowSpan,
      colspan: 1
    }
  } else {
    return {
      rowspan: 0,
      colspan: 0
    }
  }
}

export const setIndex = (reserveIndex: boolean, index: number, size: number, current: number) => {
  const newIndex = index + 1
  if (reserveIndex) {
    return size * (current - 1) + newIndex
  } else {
    return newIndex
  }
}

export const getSlot = (slots: Slots, slot = 'default', data?: AutoTableType.Recordable) => {
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

export const arrToMap = <T extends AutoTableType.Recordable, k extends keyof T>(
  arr: Array<T>,
  key: k
) => {
  const map: AutoTableType.Recordable<string, T> = {}
  arr.forEach((item) => (map[item[key]] = item))
  return map
}
