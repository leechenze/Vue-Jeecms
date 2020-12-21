import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'fengexian',
  type: 'divisionLine', // 分割
  name: '分割线',
  // 字段名称
  groupType: 'layout', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 1,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'SDivisionLinePreview',
  editor: 'SDivisionLineEditor',
  value: {
    defaultValue: '', // 默认值
    label: '', // 字段名称
    tip: '', // 帮助信息
    borderStyle: 'solid',
    lineColor: '#E8E8E8',
    lineAilgn: 1, // 线条对齐
    titleAilgn: 1, // 标题对齐方式
    tipAilgn: 1, // 帮助信息对齐方式
    width: 100 // 组件宽度
  }
}
