import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'pageSize',
  name: '内容列表每页显示内容数',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 14,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DNumberInputPreview',
  editor: 'DNumberInputEditor',
  hiddenFields: ['rules', 'placeholder'],
  disableFields: ['label', 'name', 'tip'],
  value: {
    defaultValue: '', // 默认值
    label: '内容列表每页显示内容数', // 字段名称
    name: 'pageSize', // 标签名称
    tip: '请输入1~200间的整数', // 帮助信息
    min: 1, // 最小值
    max: 200, // 最大值
    isRequired: false, // 是否必填
    rules: [
      {
        rule: 'number'
      }
    ]
  }
}
