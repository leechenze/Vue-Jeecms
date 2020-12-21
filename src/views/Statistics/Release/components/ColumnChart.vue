<template>
  <section class="member-column-chart-wrap">
    <bar v-if="tabName === 'columnChart'" :tabName="navName" :siteId="siteId"></bar>
  </section>
</template>
<script>
import bar from '../sitecomm/bar'
export default {
  name: 'column-Chart',
  components: {
    bar
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
      navName: 'columnChart',
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
