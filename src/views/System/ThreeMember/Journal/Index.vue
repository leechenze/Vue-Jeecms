<template>
  <section class="journal-member-section">
    <base-header v-bind="headers"/>
    <el-tabs v-model="activeName" type="" @tab-click="handleClick">
      <el-tab-pane name="pendingAudit">
        <span slot="label"> 待审核<span class="auditNum">{{activeOneNum||''}}</span></span>
        <pending-audit :tabName="activeName"></pending-audit>
      </el-tab-pane>
      <el-tab-pane  name="auditeding">
        <span slot="label"> 已审核<span class="auditNum">{{activeTwoNum||''}}</span></span>
        <auditeding :tabName="activeName"></auditeding>
      </el-tab-pane>
      <el-tab-pane  name="theFailed">
        <span slot="label"> 审核不通过<span class="auditNum">{{activeThreeNum||''}}</span></span>
        <the-failed :tabName="activeName"></the-failed>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import pendingAudit from './pending/PendingAudit'
import auditeding from './Audited/Auditeding'
import theFailed from './TheFailed/TheFailed'

export default {
  name: 'journal-analysis',
  mixins: [baseHeader],
  components: {
    pendingAudit,
    auditeding,
    theFailed
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        paddingBottom: '17px',
        content: '操作说明:   显示所有三员审核的日志，包括已处理和未处理的记录'
      },
      activeName: 'pendingAudit',
      activeStatus: 1,
      activeOneNum: '',
      activeTwoNum: '',
      activeThreeNum: ''
    }
  },
  methods: {
    handleClick (e) {
      this.activeOneNum = ''
      this.activeTwoNum = ''
      this.activeThreeNum = ''
      if (e.name === 'auditeding') {
        this.activeStatus = 2
      } else if (e.name === 'pendingAudit') {
        this.activeStatus = 1
      } else {
        this.activeStatus = 3
      }
      this.getData()
    },
    getData () {
      this.$request.fetAuditOperateStatistics({ status: this.activeStatus, type: 2 }).then(res => {
        if (this.activeStatus === 1) {
          this.activeOneNum = res.data
        } else if (this.activeStatus === 2) {
          this.activeTwoNum = res.data
        } else if (this.activeStatus === 3) {
          this.activeThreeNum = res.data
        }
      })
    }
  },
  mounted () {
    this.activeStatus = 1
    this.$nextTick(() => {
      this.getData()
    })
  }
}
</script>

<style lang="scss" scoped>
.journal-member-section{
  .auditNum{
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
  .journal-member-section{
    .el-tabs{
      .el-tabs__header{

      }
    }
  }
</style>
