<script setup lang="ts">
import { ref } from 'vue'
import AutoFormDemo from './components/AutoFormDemo.vue'
import AutoTableDemo from './components/AutoTableDemo.vue'

const activeTab = ref('form')
</script>

<template>
  <div class="app-container">
    <h1>rh-element 组件调试</h1>
    <div class="tab-bar">
      <button :class="{ active: activeTab === 'form' }" @click="activeTab = 'form'">
        AutoForm
      </button>
      <button :class="{ active: activeTab === 'table' }" @click="activeTab = 'table'">
        AutoTable
      </button>
    </div>
    <div class="tab-content">
      <AutoFormDemo v-if="activeTab === 'form'" />
      <AutoTableDemo v-if="activeTab === 'table'" />
    </div>
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tab-bar button {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.tab-bar button.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.tab-content {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
}
</style>
