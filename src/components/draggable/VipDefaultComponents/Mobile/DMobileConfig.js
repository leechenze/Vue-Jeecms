import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: false,
  icon: 'jia',
  type: 'mobile',
  name: '手机号',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 6,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DVipMobilePreview',
  editor: 'DVipMobileEditor',
  hiddenFields: ['placeholder', 'defaultValue'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '手机号', // 字段名称
    name: 'telephone', // 标签名称
    placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    isLengthLimit: true, // 是否字数限制
    max: 11,
    rules: [
      {
        rule: 'mobile'
      }
    ],
    isRequired: false, // 是否必填
    isRegister: false, // 是否注册
    isSmsVerification: false, // 是否短信验证
    isSmsFindPassword: false // 是否找回密码
  }
}
