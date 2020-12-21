<template>
  <section class="member-site-pie-chart-wrap">
    <pie v-if="tabName === 'sitePie'" :tabName="navName"></pie>
  </section>
</template>
<script>
import pie from '../sitecomm/pie'
export default {
  name: 'site-pie',
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
        console.log(item)
        this.navName = item
      }
    }
  },
  data () {
    return {
      dataInfo: [],
      tendencyHeight: 290,
      navName: 'sitePie',
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
