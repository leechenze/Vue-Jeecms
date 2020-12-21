<template>
  <section class="member-org-pie-chart-wrap">
    <bar v-if="tabName === 'userColumn'" :tabName="navName"></bar>
  </section>
</template>
<script>
import bar from '../sitecomm/bar'
export default {
  name: 'user-column',
  components: {
    bar
  },
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  watch: {
    'tabName': function (item) {
      if (item === this.navName) {
        this.navName = item
      }
    }
  },
  data () {
    return {
      dataInfo: [],
      tendencyHeight: 290,
      navName: 'userColumn',
      params: {
        startDate: '',
        endDate: '',
        time2: 1,
        time: []
      }
    }
  },
  computed: {
  },
  methods: {
  },
  activated () {
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
