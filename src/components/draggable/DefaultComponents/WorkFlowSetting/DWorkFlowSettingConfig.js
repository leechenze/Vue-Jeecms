import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'workFlowSetting',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '工作流设置',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 9,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DWorkFlowSettingPreview',
  editor: 'DWorkFlowSettingEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: '', // 默认值
    label: '工作流设置', // 字段名称
    name: 'workflowId', // 标签名称
    tip: '', // 帮助信息
    options: [],
    isRequired: false // 是否必填
  }
}
