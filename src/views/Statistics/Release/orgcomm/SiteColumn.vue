<template>
  <section class="member-org-pie-chart-wrap">
    <bar v-if="tabName === 'siteColumn'" :tabName="navName"></bar>
  </section>
</template>
<script>
import bar from '../sitecomm/bar'
export default {
  name: 'site-column',
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
      navName: 'siteColumn'
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
