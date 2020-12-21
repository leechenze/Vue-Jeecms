import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'shengri',
  type: 'birthday',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '生日',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 5,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 表单排序
  preview: 'DBirthdayPreview',
  editor: 'DBirthdayEditor',
  value: {
    defaultValue: '', // 默认值
    label: '生日', // 字段名称
    name: 'birthday', // 标签名称
    // placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    type: 'date', // 时间类型
    format: 'yyyy-MM-dd', // 时间格式
    accuracy: 'HH:mm:ss', // 精确度
    isDefaultNow: false, // 默认显示当前日期时间
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
