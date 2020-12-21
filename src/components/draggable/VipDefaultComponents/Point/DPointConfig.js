import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: false,
  icon: 'jia',
  type: 'point',
  name: '积分',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 7,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DPointPreview',
  editor: 'DPointEditor',
  hiddenFields: ['placeholder', 'isSmsVerification', 'isSmsFindPassword', 'defaultValue'],
  disableFields: ['label', 'name', 'isRegister'],
  value: {
    defaultValue: '', // 默认值
    label: '积分', // 字段名称
    name: 'integral', // 标签名称
    placeholder: '请输入大于0的整数', // 默认提示文字
    tip: '', // 帮助信息
    isLengthLimit: true, // 是否字数限制
    max: 8,
    rules: [
      {
        rule: 'number'
      }
    ],
    isRequired: false, // 是否必填
    isRegister: false, // 是否注册
    isSmsVerification: false, // 是否短信验证
    isSmsFindPassword: false // 是否找回密码
  }
}
