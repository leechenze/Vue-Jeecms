<template>
  <section class="statistics-Column-index-container scrollbar">
    <el-form>
      <el-form-item label='选择站点：'>
        <el-select
          popper-class="jee-border"
          style="width: 414px;"
          v-model="siteId">
          <el-option
            v-for="option in ownSiteOptions"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" type="" @tab-click="handleClick">
      <el-tab-pane name="pieChart">
        <span slot="label">饼状图</span>
        <pie-chart :tabName="activeName" :siteId="siteId" ></pie-chart>
      </el-tab-pane>
      <el-tab-pane  name="columnChart">
        <span slot="label">柱状图</span>
        <column-chart :tabName="activeName" :siteId="siteId"></column-chart>
      </el-tab-pane>
      <el-tab-pane  name="dataTables">
        <span slot="label">数据表格</span>
        <data-tables :tabName="activeName" :siteId="siteId"></data-tables>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import pieChart from './components/PieChart'
import columnChart from './components/ColumnChart'
import dataTables from './components/DataTables'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'statisticsReleaseColumns',
  components: {
    pieChart,
    columnChart,
    dataTables
  },
  data () {
    return {
      siteId: null,
      activeName: 'pieChart'

    }
  },
  watch: {
    currentSiteId (newData) {
      this.siteId = newData
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    handleClick (e) {
    }
  },
  mounted () {
    this.siteId = Number(this.currentSiteId)
    this.FetchSitesOwnsite()
  }
}
</script>
<style lang="scss" scoped>

</style>
