<script>
import compoment from '@/components/draggable/SmartComponents/layoutConfigs/DivisionLine/SDivisionLineEditor'
var options = [
  { label: '左对齐 ', value: 1 },
  { label: '居中对齐 ', value: 2 },
  { label: '右对齐 ', value: 3 }
]
export default {
  name: 'SDivisionBarEditor',
  extends: compoment,
  data () {
    return {
      options,
      formItems: [
        {
          prop: 'label',
          label: '标题：',
          maxlength: 15,
          placeholder: '请输入内容'
        },
        {
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50,
          placeholder: '请输入内容'
        },
        {
          prop: 'lineColor',
          label: '线条颜色：',
          type: 'color',
          class: 'width line',
          disInput: true,
          showAlpha: true
        },
        {
          prop: 'width',
          label: '组件宽度(%)：',
          type: 'number',
          class: 'width',
          step: 10,
          max: 100,
          min: 10
        },
        {
          prop: 'lineAilgn',
          label: '线条对齐方式：',
          type: 'radio',
          class: 'label-20',
          options: options
        },
        {
          prop: 'titleAilgn',
          label: '标题对齐方式：',
          type: 'radio',
          class: 'label-20',
          options: options
        },
        {
          prop: 'tipAilgn',
          label: '帮助信息对齐方式：',
          type: 'radio',
          class: 'label-20',
          options: options
        }
      ]
    }
  }
}
</script>
