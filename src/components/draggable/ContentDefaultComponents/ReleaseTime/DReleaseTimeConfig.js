import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: false,
  icon: 'jia',
  type: 'releaseTime',
  name: '发布时间',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 2,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DReleaseTimePreview',
  editor: 'DReleaseTimeEditor',
  hiddenFields: [],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '发布时间', // 字段名称
    name: 'releaseTime', // 标签名称
    // placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    type: 'datetime', // 时间类型
    format: 'yyyy-MM-dd', // 时间格式
    accuracy: 'HH:mm:ss', // 精确度
    isDefaultNow: true, // 默认显示当前日期时间
    isRequired: false // 是否必填
  }
}
