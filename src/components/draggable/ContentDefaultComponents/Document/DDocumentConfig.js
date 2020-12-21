import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'document',
  name: '文库文档',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 7,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DDocumentPreview',
  editor: 'DDocumentEditor',
  disableFields: ['label', 'name', 'limit'],
  value: {
    defaultValue: [], // 默认值
    modeObj: {
      modelId: '',
      fieldName: ''
    },
    label: '文库文档', // 字段名称
    name: 'textLibrary', // 标签名称
    tip: '', // 帮助信息
    limit: 1, // 文档最大个数
    typeLimit: 2, // 类型限制方式
    type: ['doc', 'docx', 'xls', 'xlsx', 'txt', 'wps', 'ppt', 'pptx', 'pdf'], // 图片类型
    enableType: '',
    disableType: '', // 图片类型
    size: '10', // 图片大小
    unit: 'MB', // 图片大小单位
    isRequired: false // 是否必填
  }
}
