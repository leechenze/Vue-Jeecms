import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: false,
  icon: 'jia',
  type: 'status',
  name: '会员状态',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 8,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DStatusPreview',
  editor: 'DStatusEditor',
  hiddenFields: ['placeholder', 'isSmsVerification', 'isSmsFindPassword'],
  disableFields: ['label', 'name', 'isRequired', 'isRegister'],
  value: {
    defaultValue: true, // 默认值
    label: '会员状态', // 字段名称
    name: 'status', // 标签名称
    tip: '', // 帮助信息
    options: [
      {
        value: true,
        label: '开启'
      },
      {
        value: false,
        label: '关闭'
      }
    ],
    isRequired: true, // 是否必填
    isRegister: false, // 是否注册
    isSmsVerification: false, // 是否短信验证
    isSmsFindPassword: false // 是否找回密码
  }
}
