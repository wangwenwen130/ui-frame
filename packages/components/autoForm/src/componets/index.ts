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

export const renderComMap = {
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
  Radio: Radio as typeof ElRadio,
  CheckBox: Checkbox as typeof ElCheckbox,
  Select: Select as typeof ElSelect
}
