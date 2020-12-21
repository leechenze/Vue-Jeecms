import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'columnPCTemplate',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '栏目PC端模板',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 5,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DColumnPCTemplatePreview',
  editor: 'DColumnPCTemplateEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '栏目PC端模板', // 字段名称
    name: 'tplPc', // 标签名称
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
