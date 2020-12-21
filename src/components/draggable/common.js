export default {
  // 组件是否可以拖拽
  dragable: true,
  // 是否显示删除按钮
  canDelete: true,
  // 在行内排序
  sortWeight: 1
  // 组件是否可以编辑
  // editable: true,
  // 选中时是否高亮
  // highlightWhenSelect: true,
  // 组件最多可以添加的实例个数
  // 不传或者传 0 表示没有限制
  // limit: 0,
  // 组件不可再添加后，鼠标移上去的提示
  // 如果是个函数，需要返回一个错误信息
  // 如果 limit 是个正整数，limitMessage 会有一个默认的值：该组件最多添加 xx 个
  // 如果 limit 是个负数，limitMessage 默认为：该组件暂不可用
  // limitMessage: (limit) => {
  //   let message = ''
  //   if (limit > 0) {
  //     message = `该组件最多添加${limit}个`
  //   } else if (limit < 0) {
  //     message = '该组件暂不可用'
  //   }
  //   return message
  // }
}
