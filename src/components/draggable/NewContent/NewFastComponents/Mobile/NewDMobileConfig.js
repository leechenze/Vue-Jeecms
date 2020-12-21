import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'shouji',
  type: 'mobile',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '手机号',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 1,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'NewDMobilePreview',
  editor: 'NewDMobileEditor',
  value: {
    defaultValue: '', // 默认值
    label: '手机号', // 字段名称
    name: 'mobile', // 标签名称
    placeholder: '请输入手机号', // 默认提示文字
    tip: '', // 帮助信息
    isLengthLimit: true, // 是否字数限制
    min: '11', // 最小长度
    max: '11', // 最大长度
    isInputLimit: true, // 是否输入限制
    inputLimit: 'number', // 限制类型
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
