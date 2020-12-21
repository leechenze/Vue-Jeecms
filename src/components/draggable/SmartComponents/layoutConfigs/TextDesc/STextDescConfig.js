import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'wenbenmiaoshu',
  type: 'textDesc', // 分割
  name: '文本描述',
  // 字段名称
  groupType: 'layout', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 3,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'STextDescPreview',
  editor: 'STextDescEditor',
  value: {
    defaultValue: '', // 默认值
    label: '文本描述', // 字段名称
    fontStyle: {
      fontSize: 14,
      fontColor: '#666666',
      fontWigth: 400
    },
    lineColor: '#E8E8E8',
    titleAilgn: 1, // 标题对齐方式
    width: 100 // 组件宽度
  }
}
