# rh-element

基于 Vue 3 + Element Plus 的组件库，使用 pnpm workspace + Vite library mode 构建。

## 技术栈

- Vue 3 + TypeScript
- Element Plus
- Vite (library mode 打包)
- vue-tsc (类型声明生成)
- @antfu/eslint-config (代码规范)
- pnpm workspace (monorepo)

## 项目结构

```
packages/
├── components/       # 组件源码
│   ├── autoForm/     # JSON 驱动的表单组件
│   ├── autoTable/    # JSON 驱动的表格组件（支持分页）
│   └── searchForm/   # 搜索表单组件
├── utils/            # 工具函数
├── hooks/            # 组合式函数
└── rh-element/       # 发布包入口（构建产物）
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 代码检查
pnpm lint

# 自动修复
pnpm lint:fix
```

## 组件

### AutoForm

通过 JSON schema 渲染 Element Plus 表单，支持的组件类型：

- TimePicker / TimeSelect / DatePicker / DateTimePicker
- Select / CheckBox / Radio
- Input / InputNumber
- Cascader / Switch / Slider
- Divider / ColorPicker

### AutoTable

通过 JSON 配置渲染 Element Plus 表格，支持自动分页和接口请求。

### SearchForm

基于 AutoForm 封装的搜索表单，内置搜索/重置按钮和列显隐控制。
