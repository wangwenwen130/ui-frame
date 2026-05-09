<script setup lang="ts">
import { reactive } from 'vue'
import { AutoTable, useAutoTable } from '@rh-element/components'
import type { AutoTableType } from '@rh-element/components'

const columns: AutoTableType.TableColumn[] = [
  { field: 'index', label: '序号', type: 'index', width: 60 },
  { field: 'name', label: '姓名', width: 120 },
  { field: 'age', label: '年龄', width: 80 },
  { field: 'email', label: '邮箱' },
  { field: 'address', label: '地址' }
]

// 模拟数据
const mockData = Array.from({ length: 56 }, (_, i) => ({
  name: `用户${i + 1}`,
  age: 20 + (i % 30),
  email: `user${i + 1}@example.com`,
  address: `地址${i + 1}号`
}))

// 模拟接口
const fetchList = (params: { page: number, pageSize: number }) => {
  return new Promise<{ data: typeof mockData, totalCount: number, page: number, pageSize: number }>((resolve) => {
    setTimeout(() => {
      const start = (params.page - 1) * params.pageSize
      const data = mockData.slice(start, start + params.pageSize)
      resolve({
        data,
        totalCount: mockData.length,
        page: params.page,
        pageSize: params.pageSize
      })
    }, 500)
  })
}

const { tableObject, register, getList } = useAutoTable({
  getListApi: fetchList
})

// 初始加载
getList()
</script>

<template>
  <div>
    <h2>AutoTable 示例</h2>
    <AutoTable
      v-model:page-size="tableObject.pageSize"
      v-model:current-page="tableObject.currentPage"
      :columns="columns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.totalCount
      }"
      reserve-index
      @register="register"
    />
  </div>
</template>
