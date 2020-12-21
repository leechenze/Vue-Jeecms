import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: false,
  icon: 'jia',
  type: 'column',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '所属栏目',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 1,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'NewDColumnPreview',
  editor: 'NewDColumnEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name', 'isRequired'],
  value: {
    defaultValue: '', // 默认值
    label: '所属栏目', // 字段名称
    name: 'channelId', // 标签名称
    tip: '', // 帮助信息
    options: [],
    isOtherOption: false,
    isOtherOptionRequired: false,
    otherOption: {
      value: 999,
      label: '其他'
    },
    isRequired: true // 是否必填
  }
}
