import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'shengshi',
  type: 'city',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '城市',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 11,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DCityPreview',
  editor: 'DCityEditor',
  value: {
    defaultValue: {
      provinceCode: '',
      cityCode: ''
    }, // 默认值
    label: '城市', // 字段名称
    name: 'city', // 标签名称
    tip: '', // 帮助信息
    isSetDefault: false, // 是否设置默认值
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
