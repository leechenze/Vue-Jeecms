import BaseTree from '@/components/tree/BaseTree'

export default {
  components: {
    BaseTree
  },
  data () {
    return {
      tree: {
        loading: false,
        currentNodeKey: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  }
}
