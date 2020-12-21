import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: false,
  icon: 'jia',
  type: 'group',
  name: '所属会员组',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 1,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DGroupPreview',
  editor: 'DGroupEditor',
  hiddenFields: ['placeholder', 'defaultValue', 'isSmsVerification', 'isSmsFindPassword'],
  disableFields: ['label', 'name', 'isRequired', 'isRegister'],
  value: {
    defaultValue: '', // 默认值
    label: '所属会员组', // 字段名称
    name: 'userGroup', // 标签名称
    placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    options: [],
    isRequired: false, // 是否必填
    isRegister: false, // 是否注册
    isSmsVerification: false, // 是否短信验证
    isSmsFindPassword: false // 是否找回密码
  }
}
