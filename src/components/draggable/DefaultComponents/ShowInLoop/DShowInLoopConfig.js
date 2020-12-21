import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'showInLoop',
  name: '显示在栏目循环列表',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 4,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DShowInLoopPreview',
  editor: 'DShowInLoopEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '显示在栏目循环列表', // 字段名称
    name: 'display', // 标签名称
    tip: '', // 帮助信息
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ],
    isOtherOption: false,
    isOtherOptionRequired: false,
    otherOptionLabel: '其他',
    otherOption: {
      value: 999,
      label: ''
    },
    isRequired: false // 是否必填
  }
}
