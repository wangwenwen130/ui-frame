<script lang="tsx">
import { ElTable, ElTableColumn, ElPagination, vLoading } from 'element-plus'
import { defineComponent, ref, computed, unref, watch, onMounted } from 'vue'
import { props, setIndex, getSlot, getSpanArr, spanMethod } from './helper'
import type AutoTableType from './types'
import type { TableColumnCtx } from 'element-plus'

export default defineComponent({
  name: 'AutoTable',
  props: props,
  emits: ['update:pageSize', 'update:currentPage', 'register'],
  directives: {
    loading: vLoading
  },
  setup(props, { attrs, slots, emit, expose }) {
    const elTableRef = ref<InstanceType<typeof ElTable>>()

    const getProps = computed(() => props)

    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, unref(elTableRef))
    })

    const pageSizeRef = ref(props.pageSize)

    const currentPageRef = ref(props.currentPage)

    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          pagerCount: document.body.clientWidth < 992 ? 5 : 7,
          layout: 'total, sizes, prev, pager, next, jumper',
          pageSizes: [10, 20, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 10
        },
        unref(getProps).pagination
      )
    })

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )
    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val
      }
    )
    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )
    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val)
      }
    )

    const selections = ref<AutoTableType.Recordable[]>([])

    const selectionChange = (selection: AutoTableType.Recordable[]) => {
      selections.value = selection
    }

    const getBindValue = computed(() => {
      const bindValue: AutoTableType.Recordable = { ...attrs, ...props }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })
    const renderTableSelection = () => {
      const { selection, reserveSelection, align, headerAlign } = unref(getProps)
      // 渲染多选
      return selection ? (
        <ElTableColumn
          type="selection"
          reserveSelection={reserveSelection}
          align={align}
          headerAlign={headerAlign}
          width="50"
        ></ElTableColumn>
      ) : undefined
    }

    const renderTableExpand = () => {
      const { align, headerAlign, expand } = unref(getProps)
      // 渲染展开行
      return expand ? (
        <ElTableColumn type="expand" align={align} headerAlign={headerAlign}>
          {{
            default: (data: AutoTableType.TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }

    const renderTreeTableColumn = (columnsChildren: AutoTableType.TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip } = unref(getProps)
      return columnsChildren.map((v) => {
        const props = { ...v }
        if (props.children) delete props.children
        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
          >
            {{
              default: (data: AutoTableType.TableSlotDefault) =>
                v.children && v.children.length
                  ? renderTableColumn(v.children)
                  : getSlot(slots, v.field, data) ||
                    v?.formatter?.(data.row[v.field], data.row, data.column, data.$index) ||
                    data.row[v.field],
              header: getSlot(slots, `${v.field}-header`)
            }}
          </ElTableColumn>
        )
      })
    }

    const renderTableColumn = (columnsChildren?: AutoTableType.TableColumn[]) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip
      } = unref(getProps)
      return [...[renderTableExpand()], ...[renderTableSelection()]].concat(
        (columnsChildren || columns)
          .filter((i) => {
            if (i.visible == undefined) return true
            else return i.visible
          })
          .map((v) => {
            // 自定生成序号
            if (v.type === 'index') {
              return (
                <ElTableColumn
                  type="index"
                  index={
                    v.index
                      ? v.index
                      : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
                  }
                  align={v.align || align}
                  headerAlign={v.headerAlign || headerAlign}
                  label={v.label}
                ></ElTableColumn>
              )
            } else {
              const props = { ...v }
              if (props.children) delete props.children
              return (
                <ElTableColumn
                  showOverflowTooltip={showOverflowTooltip}
                  align={align}
                  headerAlign={headerAlign}
                  {...props}
                  prop={v.field}
                >
                  {{
                    default: (data: AutoTableType.TableSlotDefault) =>
                      v.children && v.children.length
                        ? renderTreeTableColumn(v.children)
                        : getSlot(slots, v.field, data) ||
                          v?.formatter?.(data.row[v.field], data.row, data.column, data.$index) ||
                          data.row[v.field],
                    header: () => getSlot(slots, `${v.field}-header`) || v.label
                  }}
                </ElTableColumn>
              )
            }
          })
      )
    }

    expose({
      setColumns: (data: AutoTableType.TableColumn | AutoTableType.TableColumn[]) => {
        let columns: AutoTableType.TableColumn[] = []
        if (Array.isArray(data)) {
          columns = data
        } else {
          columns.push(data)
        }
        columns
      },
      getSelected: () => selections.value
    })

    const getCombineArr = computed(() => getSpanArr(unref(getProps).data, props.combine.mergeKey))
    const combine = (data: {
      row: AutoTableType.Recordable
      column: TableColumnCtx<any>
      rowIndex: number
      columnIndex: number
    }) => spanMethod(data, props.combine.columns, getCombineArr.value)

    return () => (
      <div v-loading={unref(getProps).loading}>
        <ElTable
          ref={elTableRef}
          spanMethod={props.combine.mergeKey && props.combine.columns.length ? combine : undefined}
          data={unref(getProps).data}
          onSelection-change={selectionChange}
          {...unref(getBindValue)}
        >
          {{
            default: () => renderTableColumn(),
            append: () => getSlot(slots, 'append')
          }}
        </ElTable>
        {unref(getProps).pagination ? (
          <ElPagination
            class="paginationBox"
            v-model:pageSize={pageSizeRef.value}
            v-model:currentPage={currentPageRef.value}
            {...unref(pagination)}
          ></ElPagination>
        ) : undefined}
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-button.is-text) {
  padding: 8px 4px;
  margin-left: 0;
}

:deep(.el-button.is-link) {
  padding: 8px 4px;
  margin-left: 0;
}
:deep(.el-table .cell) {
  padding: 0 4px;
}
:deep(.cell.el-tooltip) {
  min-width: 0;
}

.paginationBox {
  margin-top: 20px;
  margin-right: 20px;
  justify-content: flex-end;
}
</style>
