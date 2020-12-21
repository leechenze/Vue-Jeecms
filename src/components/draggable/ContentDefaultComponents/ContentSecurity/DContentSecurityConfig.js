import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'contentSecurity',
  name: '内容密级',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 17,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DContentSecurityPreview',
  editor: 'DContentSecurityEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '内容密级', // 字段名称
    name: 'contentSecretId', // 标签名称
    // placeholder: '请输入顺序号', // 默认提示文字
    tip: '', // 帮助信息
    options: [],
    isOtherOption: false,
    isOtherOptionRequired: false,
    otherOption: {
      value: 999,
      label: '其他'
    },
    isRequired: false // 是否必填
  }
}
