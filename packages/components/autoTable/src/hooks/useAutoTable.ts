import type AutoTableType from '../types'
import { ElTable } from 'element-plus'
import { computed, reactive, watch, unref } from 'vue'

interface ResponseType<T = any> {
  data: T[]
  totalCount?: number
  page?: number
  pageSize?: number
}

interface UseTableConfig<T = any> {
  getListApi: (option: any) => Promise<ResponseType<T>>
  setPage?: (data: TableObject) => void
  response?: ResponseType
  // 默认传递的参数
  defaultParams?: AutoTableType.Recordable
}
interface TableObject<T = any> {
  pageSize: number
  currentPage: number
  totalCount: number
  tableList: T[]
  params: any
  loading: boolean
  currentRow: T | null
}

export const useAutoTable = <T = unknown>(config: UseTableConfig<T>) => {
  type Instace = InstanceType<typeof ElTable>
  let elTableInstance: Instace

  let autoTableExpose: {
    getSelected: () => Promise<AutoTableType.Recordable[]>
  }

  const isNoRegis = () => {
    if (!elTableInstance) {
      console.error('not registered. Please use the register method to register')
      return true
    }
  }
  const tableObject = reactive<TableObject<T>>({
    // 页数
    pageSize: 10,
    // 当前页
    currentPage: 1,
    // 总条数
    totalCount: 10,
    // 表格数据
    tableList: [],
    // AxiosConfig 配置
    params: {
      ...(config?.defaultParams || {})
    },
    // 加载中
    loading: true,
    // 当前行的数据
    currentRow: null
  })
  const paramsObj = computed(() => {
    return Object.assign(tableObject.params, {
      pageSize: tableObject.pageSize,
      page: tableObject.currentPage
    })
  })

  watch(
    () => tableObject.currentPage,
    () => methods.getList()
  )

  watch(
    () => tableObject.pageSize,
    () => {
      if (tableObject.currentPage === 1) {
        methods.getList()
      } else {
        tableObject.currentPage = 1
      }
    }
  )

  const methods = {
    async getList() {
      tableObject.loading = true
      const res = await config?.getListApi(unref(paramsObj)).finally(() => {
        tableObject.loading = false
      })
      if (config.setPage) {
        config.setPage(tableObject)
      } else if (res) {
        tableObject.tableList = res.data as any[]
        tableObject.totalCount = res.totalCount ?? 0
        tableObject.pageSize = res.pageSize ?? 0
        tableObject.currentPage = res.page ?? 0
      }
    },
    getSelections() {
      if (isNoRegis()) return
      return autoTableExpose.getSelected()
    },
    setSearchParams(data: AutoTableType.Recordable = {}) {
      if (isNoRegis()) return
      tableObject.params = Object.assign(
        tableObject.params,
        {
          pageSize: tableObject.pageSize,
          page: tableObject.currentPage || 1
        },
        data
      )
      const { pageSize, page } = data
      if (pageSize || page) {
        pageSize && (tableObject.pageSize = pageSize)
        page && (tableObject.currentPage = page)
      } else {
        methods.getList()
      }
    },
    reset(data: AutoTableType.Recordable = {}) {
      if (isNoRegis()) return
      methods.setSearchParams({ ...data, page: 1 })
    }
  }

  return {
    tableObject,
    register: (expose: typeof autoTableExpose, instance: Instace) => {
      elTableInstance = instance
      autoTableExpose = expose
    },
    elTableRef: () => elTableInstance,
    ...methods
  }
}
