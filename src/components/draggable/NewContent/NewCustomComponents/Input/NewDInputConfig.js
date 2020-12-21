import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'wenben',
  type: 'input',
  // 1文本2多行文本 3单选 4多选 5下拉 6日期 7单图上传 8多图上传 9视频上传 10音频上传 11附件上传 12富文本 13组织 14地址 15城市
  name: '文本',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 1,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'NewDInputPreview',
  editor: 'NewDInputEditor',
  value: {
    defaultValue: '', // 默认值
    label: '单行文本', // 字段名称
    name: '', // 标签名称
    placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    isLengthLimit: false, // 是否字数限制
    max: 50, // 最大长度
    isInputLimit: false, // 是否输入限制
    inputLimit: '', // 限制类型
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
