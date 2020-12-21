import common from '@/components/draggable/common'

export default {
  ...common,
  canDelete: true,
  icon: 'tiankongti',
  type: 'question',
  name: '问答题',
  // 分组类型
  groupIndex: 3,
  // 分组排序 左侧拖动区顺序
  isCustom: true,
  // 是否自定义字段
  index: 1,
  // 排序
  preview: 'VQuestionPreview',
  editor: 'VQuestionEditor',
  hiddenFields: [],
  disableFields: ['label', 'name', 'isRequired'],
  value: {
    defaultValue: '', // 默认值
    label: '1. 问答题', // 字段名称
    name: '', // 标签名称
    placeholder: '请输入内容', // 默认提示文字
    tip: '', // 帮助信息
    isLengthLimit: false, // 是否字数限制
    max: 50, // 最大长度
    isInputLimit: false, // 是否输入限制
    inputLimit: '', // 限制类型
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
    options: []
  }
}
