<script setup lang="ts">
import { ref } from 'vue'
import { AutoForm, useAutoForm } from '@rh-element/components'
import type { AutoFormType } from '@rh-element/components'

const { register, formModel, getElFormRef } = useAutoForm()

const model = ref({
  name: '',
  age: undefined,
  gender: '',
  hobbies: [],
  date: '',
  remark: ''
})

const schema: AutoFormType.Schema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入姓名',
      clearable: true
    },
    formItemProps: {
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入年龄'
    }
  },
  {
    field: 'gender',
    label: '性别',
    component: 'Select',
    componentProps: {
      placeholder: '请选择性别',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    }
  },
  {
    field: 'hobbies',
    label: '爱好',
    component: 'CheckBox',
    componentProps: {
      options: [
        { label: '篮球', value: 'basketball' },
        { label: '足球', value: 'football' },
        { label: '游泳', value: 'swimming' }
      ]
    }
  },
  {
    field: 'date',
    label: '日期',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择日期'
    }
  },
  {
    field: 'remark',
    label: '备注',
    labelMessage: '这是一个带提示的字段',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: '请输入备注'
    }
  }
]

const handleSubmit = async () => {
  const valid = await getElFormRef()?.validate()
  if (valid) {
    console.log('表单数据:', formModel())
  }
}

const handleReset = () => {
  getElFormRef()?.resetFields()
}
</script>

<template>
  <div>
    <h2>AutoForm 示例</h2>
    <AutoForm
      :schema="schema"
      :model="model"
      label-width="80px"
      @register="register"
    />
    <div style="margin-top: 16px;">
      <el-button type="primary" @click="handleSubmit">
        提交
      </el-button>
      <el-button @click="handleReset">
        重置
      </el-button>
    </div>
    <pre style="margin-top: 16px; background: #f5f7fa; padding: 12px; border-radius: 4px;">{{ JSON.stringify(model, null, 2) }}</pre>
  </div>
</template>
