import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: false,
  icon: 'jia',
  type: 'level',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '会员等级',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 2,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DLevelPreview',
  editor: 'DLevelEditor',
  hiddenFields: ['placeholder', 'isSmsVerification', 'isSmsFindPassword'],
  disableFields: ['label', 'name', 'isRegister'],
  value: {
    defaultValue: '', // 默认值
    label: '会员等级', // 字段名称
    name: 'userLevel', // 标签名称
    tip: '', // 帮助信息
    options: [],
    isRequired: false, // 是否必填
    isRegister: false, // 是否注册
    isSmsVerification: false, // 是否短信验证
    isSmsFindPassword: false // 是否找回密码
  }
}
