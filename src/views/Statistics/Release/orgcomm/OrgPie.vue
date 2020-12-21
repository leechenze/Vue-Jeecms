<template>
  <section class="member-org-pie-chart-wrap">
    <pie v-if="tabName === 'orgPie'" :tabName="navName"></pie>
  </section>
</template>
<script>
import pie from '../sitecomm/pie'
export default {
  name: 'org-pie',
  components: {
    pie
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
      navName: 'orgPie',
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
