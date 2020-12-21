
import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'content',
  name: '正文内容',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 12,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DContentPreview',
  editor: 'DContentEditor',
  value: {
    defaultValue: '', // 默认值
    label: '正文内容', // 字段名称
    name: 'content', // 标签名称
    tip: '', // 帮助信息
    isRequired: false // 是否必填
  }
}
