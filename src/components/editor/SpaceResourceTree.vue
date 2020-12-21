<script>
import { mapActions, mapGetters } from 'vuex'
import ResourceTree from './ResourceTree'

export default {
  name: 'SpaceResourceTree',
  extends: ResourceTree,
  props: {
    createChildren: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['shareResourceOptions']),
    getOptions () {
      return [{
        id: '',
        name: '所有共享资源',
        value: '',
        label: '所有共享资源',
        children: this.shareResourceOptions
      }]
    }
  },
  methods: {
    ...mapActions('system', ['FetchShareResourceOptions'])
  },
  mounted () {
    this.FetchShareResourceOptions()
  }
}
</script>
