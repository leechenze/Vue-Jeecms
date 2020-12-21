<template>
  <section class="member-pie-chart-wrap">
    <pie v-if="tabName === 'pieChart'" :tabName="navName" :siteId="siteId"></pie>
  </section>
</template>
<script>
import pie from '../sitecomm/pie'
export default {
  name: 'pie-Chart',
  components: {
    pie
  },
  props: {
    tabName: {
      type: String,
      default: ''
    },
    siteId: {
      type: Number,
      default: null
    }
  },
  watch: {
    'tabName': function (item) {
      if (item === this.navName) {
        this.navName = item
      }
    },
    siteId (newData) {
      if (newData) {
        this.params.siteId = newData
        // this.getDatas()
      }
    }
  },
  data () {
    return {
      dataInfo: [],
      tendencyHeight: 290,
      navName: 'pieChart',
      params: {
        siteId: '',
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
