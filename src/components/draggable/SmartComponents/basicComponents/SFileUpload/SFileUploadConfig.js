import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'fujianshangchuan',
  type: 'fileUpload',
  // 1文本2多行文本 3单选 4多选 5下拉 6日期 7单图上传 8多图上传 9视频上传 10音频上传 11附件上传 12富文本 13组织 14地址 15城市
  name: '附件上传',
  // 字段名称
  groupType: 'input', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 14,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  // 是否可删除
  canDelete: true,
  preview: 'SFileUploadPreview',
  editor: 'SFileUploadEditor',
  value: {
    defaultValue: [], // 默认值
    label: '附件上传', // 字段名称
    name: '', // 标签名称
    tip: '', // 帮助信息
    limit: '',
    typeLimit: 1, // 类型限制方式
    enableType: '', // 附件类型
    disableType: '', // 附件类型
    size: '10', // 附件大小
    unit: 'MB', // 附件大小单位
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
