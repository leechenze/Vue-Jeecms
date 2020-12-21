<script>
import compoment from '@/components/draggable/CustomComponents/Select/DSimpleSelectPreview'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DLevelPreview',
  extends: compoment,
  computed: {
    ...mapGetters(['memberLevelOptions']),
    getOptions () {
      return this.memberLevelOptions
    }
  },
  methods: {
    ...mapActions('vip', ['FetchMembersLevelOptions'])
  },
  mounted () {
    this.FetchMembersLevelOptions()
  }
}
</script>
