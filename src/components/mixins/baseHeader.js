import BaseHeader from '@/components/header/BaseHeader'

export default {
  components: {
    BaseHeader
  },
  data () {
    return {
      headers: {
        buttons: [],
        title: '',
        content: '',
        icon: 'caozuoshuoming1',
        backUrl: '/'
      }
    }
  },
  methods: {
    handleBack (data) {
      this.$routerLink(this.backUrl, data.type, {})
    },
    handleHeaderBack () {
      this.$router.go(-1)
    },
    handleHeaderLink (item) {
      if (!item.params) {
        item.params = { id: this.$route.query.id }
      }
      this.$routerLink(item.href, item.type, item.params)
    }
  }
}
