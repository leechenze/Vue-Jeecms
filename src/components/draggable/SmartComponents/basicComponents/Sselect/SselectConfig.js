import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'xialaxuankuang',
  type: 'select',
  // 1文本2多行文本 3单选 4多选 5下拉 6日期 7单图上传 8多图上传 9视频上传 10音频上传 11附件上传 12富文本 13组织 14地址 15城市
  name: '下拉选框',
  // 字段名称
  groupType: 'input', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 5,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  // 是否可删除
  canDelete: true,
  preview: 'SselectPreview',
  editor: 'SselectEditor',
  value: {
    defaultValue: {
      value: '',
      otherValue: ''
    }, // 默认值
    label: '下拉选框', // 字段名称
    name: '', // 标签名称
    width: 80,
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
    otherOption: {
      value: 999,
      label: '其他'
    },
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  }
}
