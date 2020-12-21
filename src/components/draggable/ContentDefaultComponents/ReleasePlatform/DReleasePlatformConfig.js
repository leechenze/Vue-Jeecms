import common from '@/components/draggable/common'

export default {
  ...common,
  icon: 'jia',
  type: 'releasePlatform',
  // 1文本2多行文本 3单选 4多选 5下拉 6日期 7单图上传 8多图上传 9视频上传 10音频上传 11附件上传 12富文本 13组织 14地址 15城市
  name: '发布平台',
  // 字段名称
  groupType: '', // 基础、扩展、SEO
  // 分组类型
  groupIndex: 3,
  // 分组排序 左侧拖动区顺序
  isCustom: false,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'DReleasePlatformPreview',
  editor: 'DReleasePlatformEditor',
  hiddenFields: ['options'],
  disableFields: ['label', 'name'],
  value: {
    defaultValue: ['releasePc', 'releaseWap', 'releaseApp', 'releaseMiniprogram'], // 默认值
    label: '发布平台', // 字段名称
    name: 'releaseTerrace', // 标签名称
    tip: '', // 帮助信息
    options: [
      {
        value: 'releasePc',
        label: 'PC'
      },
      {
        value: 'releaseWap',
        label: 'wap端'
      },
      {
        value: 'releaseApp',
        label: 'APP'
      },
      {
        value: 'releaseMiniprogram',
        label: '小程序'
      }
    ],
    isOtherOption: false,
    isOtherOptionRequired: false,
    otherOptionLabel: '其他',
    otherOption: {
      value: 999,
      label: '其他'
    },
    isRequired: false // 是否必填
  }
}
