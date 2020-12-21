<template>
  <section class="statistics-Column-index-container scrollbar">
    <el-tabs v-model="activeName" type="" @tab-click="handleClick">
      <el-tab-pane name="sitePie">
        <span slot="label">饼状图</span>
        <site-pie :tabName="activeName"></site-pie>
      </el-tab-pane>
      <el-tab-pane  name="siteColumn">
        <span slot="label">柱状图</span>
        <site-column :tabName="activeName"></site-column>
      </el-tab-pane>
      <el-tab-pane  name="siteTables">
        <span slot="label">数据表格</span>
        <site-tables :tabName="activeName"></site-tables>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import sitePie from './orgcomm/SitePie'
import siteColumn from './orgcomm/SiteColumn'
import siteTables from './orgcomm/SiteTables'
export default {
  name: 'statisticsReleaseSiteview',
  components: {
    sitePie,
    siteColumn,
    siteTables
  },
  data () {
    return {
      siteId: null,
      activeName: 'sitePie'
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    handleClick (e) {
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>

</style>
