<template>
  <section class="statistics-Column-index-container scrollbar">
    <el-tabs v-model="activeName" type="" @tab-click="handleClick">
      <el-tab-pane name="orgPie">
        <span slot="label">饼状图</span>
        <org-pie :tabName="activeName"></org-pie>
      </el-tab-pane>
      <el-tab-pane  name="orgColumn">
        <span slot="label">柱状图</span>
        <org-column :tabName="activeName"></org-column>
      </el-tab-pane>
      <el-tab-pane  name="orgTables">
        <span slot="label">数据表格</span>
        <org-tables :tabName="activeName"></org-tables>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import orgPie from './orgcomm/OrgPie'
import orgColumn from './orgcomm/OrgColumn'
import orgTables from './orgcomm/OrgTables'
export default {
  name: 'statisticsReleaseOrganization',
  components: {
    orgPie,
    orgColumn,
    orgTables
  },
  data () {
    return {
      siteId: null,
      activeName: 'orgPie'
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
