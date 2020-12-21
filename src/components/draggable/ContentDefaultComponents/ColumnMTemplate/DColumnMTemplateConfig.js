import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'columnMTemplate',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '内容手机端模板',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 6,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DColumnMTemplatePreview',
  editor: 'DColumnMTemplateEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '内容手机端模板', // 字段名称
    name: 'tplMobile', // 标签名称
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
