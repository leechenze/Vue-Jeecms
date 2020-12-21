import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'browseSetting',
  name: '栏目及内容页浏览设置',
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
    label: '栏目及内容页浏览设置', // 字段名称
    name: 'viewControl', // 标签名称
    tip: '', // 帮助信息
    options: [
      {
        value: 1,
        label: '都不需要登录'
      },
      {
        value: 2,
        label: '仅内容页需要登录'
      },
      {
        value: 3,
        label: '都需要登录'
      }
    ],
    isOtherOption: false,
    isOtherOptionRequired: false,
    otherOptionLabel: '其他',
    otherOption: {
      value: 999,
      label: ''
    },
    isRequired: false // 是否必填
  }
}
