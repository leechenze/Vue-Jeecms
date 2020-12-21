import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'zuzhijiagou',
  type: 'organize',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '组织',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 8,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DOrganizePreview',
  editor: 'DOrganizeEditor',
  disableFields: ['name'],
  value: {
    defaultValue: '', // 默认值
    label: '组织', // 字段名称
    name: 'orgid', // 标签名称
    tip: '', // 帮助信息
    isIncludeVirtual: false, // 是否包含虚拟组织
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
