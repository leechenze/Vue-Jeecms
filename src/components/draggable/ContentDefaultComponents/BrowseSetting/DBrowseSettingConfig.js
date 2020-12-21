import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'browseSetting',
  name: '浏览设置',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 8,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DBrowseSettingPreview',
  editor: 'DBrowseSettingEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '浏览设置', // 字段名称
    name: 'viewControl', // 标签名称
    tip: '', // 帮助信息
    options: [
      {
        value: 1,
        label: '允许访客访问'
      },
      {
        value: 2,
        label: '登录后访问'
      }
    ],
    isOtherOption: false,
    isOtherOptionRequired: false,
    otherOptionLable: '其他',
    otherOption: {
      value: 999,
      label: ''
    },
    isRequired: false // 是否必填
  }
}
