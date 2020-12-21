import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'source',
  name: '来源',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 2,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DSourcePreview',
  editor: 'DSourceEditor',
  hiddenFields: ['placeholder', 'rules'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: {
      sourceName: '',
      sourceLink: ''
    }, // 默认值
    label: '来源', // 字段名称
    name: 'contentSourceId', // 标签名称
    placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    isLengthLimit: true, // 是否字数限制
    min: 1, // 最小长度
    max: 50, // 最大长度
    isInputLimit: false, // 是否输入限制
    inputLimit: '', // 限制类型
    sourceList: [],
    isRequired: false // 是否必填
  }
}
