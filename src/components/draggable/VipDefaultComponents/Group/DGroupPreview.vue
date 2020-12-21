<script>
import compoment from '@/components/draggable/CustomComponents/Select/DSimpleSelectPreview'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'DGroupPreview',
  extends: compoment,
  computed: {
    ...mapGetters(['memberGroupOptions']),
    getOptions () {
      return this.memberGroupOptions
    }
  },
  methods: {
    ...mapActions('vip', ['FetchMemberGroupOptions'])
  },
  mounted () {
    this.FetchMemberGroupOptions()
  }
}
</script>
