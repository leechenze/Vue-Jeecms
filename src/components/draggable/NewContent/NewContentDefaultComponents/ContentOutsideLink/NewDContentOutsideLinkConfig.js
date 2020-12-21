import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'outsideLink',
  name: '外部链接',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 10,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'NewDContentOutsideLinkPreview',
  editor: 'NewDContentOutsideLinkEditor',
  hiddenFields: ['placeholder', 'rules'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: {
      isNewTarget: false,
      outLink: ''
    }, // 默认值
    label: '外部链接', // 字段名称
    name: 'outLink', // 标签名称
    placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    isLengthLimit: true, // 是否字数限制
    max: 120, // 最大长度
    isInputLimit: false, // 是否输入限制
    inputLimit: '', // 限制类型
    isSelect: true, // 是否附加选择项
    selectValue: false,
    selectLabel: '新窗口打开外部链接',
    isRequired: false // 是否必填
  }
}
