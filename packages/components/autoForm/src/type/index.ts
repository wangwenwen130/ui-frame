import type { FormRules, FormItemProp, FormValidateCallback } from 'element-plus'

declare module AutoForm {
  type Arrayable<T> = T | T[]
  export type ObjKey<k> = k extends string | number | symbol ? k : any

  export interface Fn<T = any> {
    (...arg: T[]): T
  }

  export type Recordable<k = string, T = any> = Record<
    k extends null | undefined ? string : ObjKey<k>,
    T
  >

  export interface ColProps {
    gutter?: number
    span?: number
    offset?: number
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  }

  export type Component =
    | 'TimePicker'
    | 'TimeSelect'
    | 'DatePicker'
    | 'DateTimePicker'
    | 'Select'
    | 'CheckBox'
    | 'Radio'
    | 'Input'
    | 'InputNumber'
    | 'Cascader'
    | 'Switch'
    | 'Slider'
    | 'Divider'
    | 'ColorPicker'
    | (string & object)

  export type Values = string | number | string[] | number[] | boolean | undefined | null

  export interface ComponentOptions extends Recordable {
    label?: string
    value?: Values
    disabled?: boolean
    key?: string | number
  }

  export type ComponentOptionsAlias = {
    labelField?: string
    valueField?: string
  }

  export interface ComponentProps extends ComponentOptions, Recordable {
    optionsAlias?: ComponentOptionsAlias
    options?: ComponentOptions[]
    optionsSlot?: boolean
    placeholder?: string
    maxlength?: string | number
    clearable?: boolean
    disabled?: boolean
  }

  export interface FormItemProps {
    labelWidth?: string | number
    required?: boolean
    rules?: FormRules
    error?: string
    showMessage?: boolean
    inlineMessage?: boolean
    style?: Recordable<string, string>
  }

  export interface Schema {
    field: string
    label?: string
    labelMessage?: string
    colProps?: ColProps
    componentProps?: { slots?: Record<string, any> } & ComponentProps
    formItemProps?: FormItemProps
    component?: Component
    value?: Values
    hidden?: boolean
  }

  export interface FormProps<ModeType extends Recordable = {}> {
    schema: Schema[]
    model: ModeType
    inline?: boolean
    rules?: FormRules
    isCustom?: boolean
    isCol?: boolean
    labelWidth?: string | number
    inlineMessage?: boolean
    labelPosition?: 'left' | 'right' | 'top'
    statusIcon?: boolean
    scrollToError?: boolean
  }

  export interface FormInstance {
    validate: (callBack?: FormValidateCallback) => Promise<boolean>
    resetFields: (field?: Arrayable<FormItemProp>) => Promise<boolean>
    scrollToField: (field: FormItemProp) => void
    validateField: (field: Arrayable<FormItemProp>) => Promise<boolean>
    clearValidate: (field?: Arrayable<FormItemProp>) => void
  }

  export interface FormExpose<ModeType extends Recordable = {}> {
    setValues: (data: Recordable) => void
    setProps: (props: Recordable) => void
    delSchema: (field: string) => void
    addSchema: (formSchema: Schema, index?: number) => void
    formModel: () => ModeType
    getElFormRef: () => FormInstance
  }

  export type GetModel<T> = T extends { model: infer U } ? U : Recordable
}

export default AutoForm
