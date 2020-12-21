import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'xingbie',
  type: 'sex',
  // 1手机号2邮箱3座机号4真实姓名5生日6性别7地址8组织9年龄10身份证号11城市12传真
  name: '性别',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 6,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DSexPreview',
  editor: 'DSexEditor',
  value: {
    defaultValue: {
      value: '',
      otherValue: ''
    }, // 默认值
    label: '性别', // 字段名称
    name: 'sex', // 标签名称
    tip: '', // 帮助信息
    options: [
      {
        value: 1,
        label: '男'
      },
      {
        value: 2,
        label: '女'
      }
    ],
    isOtherOption: false,
    isOtherOptionRequired: false,
    otherOptionLabel: '其他',
    otherOption: {
      value: 999,
      label: ''
    },
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
