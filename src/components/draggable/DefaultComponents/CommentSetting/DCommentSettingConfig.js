import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'commentSetting',
  name: '评论设置',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 7,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DCommentSettingPreview',
  editor: 'DCommentSettingEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '评论设置', // 字段名称
    name: 'commentControl', // 标签名称
    tip: '', // 帮助信息
    options: [
      {
        value: 1,
        label: '允许游客评论'
      },
      {
        value: 2,
        label: '登录后评论'
      },
      {
        value: 3,
        label: '不允许评论'
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
