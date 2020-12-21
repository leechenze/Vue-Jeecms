import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'nianyueri',
  type: 'datetime',
  // 1文本2多行文本 3单选 4多选 5下拉 6日期 7单图上传 8多图上传 9视频上传 10音频上传 11附件上传 12富文本 13组织 14地址 15城市
  name: '日期时间',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 5,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 表单排序
  preview: 'NewDDateTimePreview',
  editor: 'NewDDateTimeEditor',
  value: {
    defaultValue: '', // 默认值
    label: '日期时间', // 字段名称
    name: '', // 标签名称
    // placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    type: 'datetime', // 时间类型
    format: 'yyyy-MM-dd', // 时间格式
    accuracy: 'HH:mm:ss', // 精确度
    isDefaultNow: true, // 默认显示当前日期时间
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
