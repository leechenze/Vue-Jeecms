import DragableTree from '@/components/tree/DragableTree'

export default {
  components: {
    DragableTree
  },
  data () {
    return {
      tree: {
        loading: false,
        currentNodeKey: '',
        data: [],
        draggable: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  methods: {
    nodeClick (item, node, ev) {
      // this.$emit('handleClick', item, node, ev)
    },
    nodeDragStart (node, ev) {
      // console.log('drag start', node)
    },
    nodeDragEnter (draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label)
    },
    nodeDragLeave (draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label)
    },
    nodeDragOver (draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label)
    },
    nodeDragEnd (draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    nodeDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', draggingNode.label, dropNode.label, dropType)
      // dropType: before after inner
    }
  }
}
