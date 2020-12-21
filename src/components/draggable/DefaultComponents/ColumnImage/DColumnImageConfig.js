import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'columnImage',
  name: '栏目图片',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 15,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DColumnImagePreview',
  editor: 'DColumnImageEditor',
  hiddenFields: [],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '栏目图片', // 字段名称
    name: 'resourceId', // 标签名称
    tip: '', // 帮助信息
    type: ['jpg', 'png', 'gif', 'bmp', 'jpeg'], // 图片类型
    size: '', // 图片大小
    unit: 'KB', // 图片大小单位
    width: '', // 建议宽度
    height: '', // 建议高度
    isRequired: false // 是否必填
  }
}
