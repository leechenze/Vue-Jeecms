import DragTree from '@/components/tree/DragTree'

export default {
  components: {
    DragTree
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
    handleDrop (draggingNode, dropNode, dropType) {
      console.log('handleDrop')
    }
  }
}
