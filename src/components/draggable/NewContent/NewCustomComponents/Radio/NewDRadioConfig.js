import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'danxuan',
  type: 'radio',
  // 1文本2多行文本 3单选 4多选 5下拉 6日期 7单图上传 8多图上传 9视频上传 10音频上传 11附件上传 12富文本 13组织 14地址 15城市
  name: '单选框',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 2,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 2,
  // 排序
  preview: 'NewDRadioPreview',
  editor: 'NewDRadioEditor',
  value: {
    defaultValue: {
      value: '',
      otherValue: ''
    }, // 默认值
    label: '单选按钮', // 字段名称
    name: '', // 标签名称
    tip: '', // 帮助信息
    options: [
      {
        value: 1,
        label: '选项1'
      },
      {
        value: 2,
        label: '选项2'
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
