import AutoForm from '../type'
export const useAutoForm = () => {
  let formInstance: AutoForm.FormInstance
  let autoFormExpose: AutoForm.FormExpose

  const isNoRegis = () => {
    if (!formInstance) {
      console.error('not registered. Please use the register method to register')
      return true
    }
  }

  return {
    register: (instace: AutoForm.FormInstance, method: AutoForm.FormExpose) => {
      formInstance = instace
      autoFormExpose = method
    },
    setValues: (data: AutoForm.Recordable) => {
      if (isNoRegis()) return
      autoFormExpose.setValues(data)
    },
    setProps: (props: AutoForm.Recordable) => {
      if (isNoRegis()) return
      autoFormExpose.setProps(props)
    },
    delSchema: (field: string) => {
      if (isNoRegis()) return
      autoFormExpose.delSchema(field)
    },
    addSchema: (formSchema: AutoForm.Schema, index?: number) => {
      if (isNoRegis()) return
      autoFormExpose.addSchema(formSchema, index)
    },
    formModel: () => {
      if (isNoRegis()) return
      return autoFormExpose.formModel()
    },
    getElFormRef: () => {
      if (isNoRegis()) return
      return autoFormExpose.getElFormRef()
    }
  }
}
