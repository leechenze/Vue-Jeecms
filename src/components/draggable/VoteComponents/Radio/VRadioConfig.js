import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: true,
  icon: 'danxuanxuanzhong',
  type: 'radio',
  name: '单选题',
  // 分组类型
  groupIndex: 1,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'VRadioPreview',
  editor: 'VRadioEditor',
  hiddenFields: [],
  disableFields: ['label', 'name', 'isRequired'],
  value: {
    defaultValue: {
      value: ''
    }, // 默认值
    label: '1.单选题', // 字段名称
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
      },
      {
        value: 3,
        label: '选项3'
      }
    ],
    isRegister: false, // 是否应用到注册
    isRequired: false // 是否必填
  },
  isAnswer: true,
  prompt: '',
  option: {
    column: 1, // 每行列数
    inputLimit: false, // 是否限制输入类型
    inputNumLimit: false, // 是否限制输入字数
    inputType: '', // 输入限制
    inputNum: 150, // 限制字数
    inputWidth: '100', // 输入框宽度
    inputHeight: '40', // 输入框高度
    isRadio: 1, // 是否单选-下拉题
    fileSizeLimit: false, // 附件大小限制
    fileNumLimit: true, // 附件数量限制
    fileTypeLimit: false, // 附件类型限制
    fileSize: '', // 附件大小
    fileUnit: 'KB',
    fileNum: 1, // 附件数量
    fileTypeSet: 0, // 附件类型
    fileTypes: '', // 附件类型
    options: [{
      name: '选项1', // 单个选项
      pic: '', // 图片id
      isDefault: false, // 是否默认
      isRequired: false, // 是否必填
      sortNum: 1// 排序
    },
    {
      name: '选项2', // 单个选项
      pic: '', // 图片id
      isDefault: false, // 是否默认
      isRequired: false, // 是否必填
      sortNum: 2// 排序
    }]
  }
}
