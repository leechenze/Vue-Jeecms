<script>
import compoment from '@/components/draggable/DefaultComponents/ParentColumn/DParentColumnPreview'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'NewDColumnPreview',
  extends: compoment,
  computed: {
    ...mapGetters(['contentColumnOptions']),
    getCascaderProps () {
      return {
        checkStrictly: false
      }
    },
    getOptions () {
      return this.contentColumnOptions
    }
  },
  methods: {
    ...mapActions('column', ['FetchContentColumnOptions'])
  },
  mounted () {
    this.FetchContentColumnOptions()
  }
}
</script>
