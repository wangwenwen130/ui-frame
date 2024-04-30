import {
  ElSlider,
  ElSwitch,
  ElInputNumber,
  ElColorPicker,
  ElInput,
  ElCascader,
  ElDatePicker,
  ElTimeSelect,
  ElTimePicker,
  ElDivider,
  ElRadio,
  ElSelect,
  ElCheckbox
} from 'element-plus'
import Radio from './rhRadio.vue'
import Checkbox from './rhCheckbox.vue'
import Select from './rhSelect.vue'

const renderComMap: Record<string, any> = {
  TimePicker: ElTimePicker,
  TimeSelect: ElTimeSelect,
  DatePicker: ElDatePicker,
  DateTimePicker: ElDatePicker,
  Input: ElInput,
  InputNumber: ElInputNumber,
  Cascader: ElCascader,
  Switch: ElSwitch,
  Slider: ElSlider,
  Divider: ElDivider,
  ColorPicker: ElColorPicker,
  Radio: Radio as unknown as typeof ElRadio,
  CheckBox: Checkbox as unknown as typeof ElCheckbox,
  Select: Select as unknown as typeof ElSelect
}

export { renderComMap }
