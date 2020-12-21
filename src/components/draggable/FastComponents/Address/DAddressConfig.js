import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'dizhi',
  type: 'address',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '地址',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 7,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DAddressPreview',
  editor: 'DAddressEditor',
  value: {
    defaultValue: {
      provinceCode: '',
      cityCode: '',
      areaCode: '',
      address: ''
    }, // 默认值
    label: '地址', // 字段名称
    name: 'address', // 标签名称
    tip: '', // 帮助信息
    isSetDefault: false, // 是否设置默认值
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
