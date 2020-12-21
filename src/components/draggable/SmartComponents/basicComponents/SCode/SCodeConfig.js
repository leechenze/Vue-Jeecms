import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'yanzhengma',
  type: 'code',
  // 1文本2多行文本 3单选 4多选 5下拉 6日期 7单图上传 8多图上传 9视频上传 10音频上传 11附件上传 12富文本 13组织 14地址 15城市
  name: '验证码',
  // 字段名称
  groupType: 'layout', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 8,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 是否可删除
  canDelete: true,
  hiddenFields: [],
  disableFields: ['isRequired'],
  // 排序
  preview: 'SCodePreview',
  editor: 'SCodeEditor',
  value: {
    defaultValue: '', // 默认值
    label: '验证码', // 字段名称
    name: '', // 标签名称
    placeholder: '请输入验证码', // 默认提示文字
    tip: '', // 帮助信息
    isLengthLimit: false, // 是否字数限制
    max: 50, // 最大长度
    isInputLimit: false, // 是否输入限制
    inputLimit: '', // 限制类型
    width: 80, // 组件宽度
    isRequired: true // 是否必填
  }
}
