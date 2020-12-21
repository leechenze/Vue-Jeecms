<template>
  <section class="statistics-Column-index-container scrollbar">
    <el-tabs v-model="activeName" type="" @tab-click="handleClick">
      <el-tab-pane name="userPie">
        <span slot="label">饼状图</span>
        <user-pie :tabName="activeName"></user-pie>
      </el-tab-pane>
      <el-tab-pane  name="userColumn">
        <span slot="label">柱状图</span>
        <user-column :tabName="activeName"></user-column>
      </el-tab-pane>
      <el-tab-pane  name="userTables">
        <span slot="label">数据表格</span>
        <user-tables :tabName="activeName"></user-tables>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import userPie from './components/UserPie'
import userColumn from './components/UserColumn'
import userTables from './components/UserTables'
export default {
  name: 'statisticsReleaseUser',
  components: {
    userPie,
    userColumn,
    userTables
  },
  data () {
    return {
      siteId: null,
      activeName: 'userPie'
    }
  },
  watch: {
    currentSiteId (newData) {
      this.siteId = newData
    }
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
