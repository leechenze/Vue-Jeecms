import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'pagination',
  name: '栏目页是否包含分页',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 16,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DPaginationPreview',
  editor: 'DPaginationEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: true, // 默认值
    label: '栏目页是否包含分页', // 字段名称
    name: 'isListChannel', // 标签名称
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
