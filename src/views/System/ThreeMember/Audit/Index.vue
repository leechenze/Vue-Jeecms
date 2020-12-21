<template>
  <section class="three-member-section">
    <base-header v-bind="headers"/>
    <el-tabs v-model="activeName" type="" @tab-click="handleClick">
      <el-tab-pane name="pendingAudit">
        <span slot="label"> 待审核<span class="auditNum">{{activeOneNum||''}}</span></span>
        <pending-audit @formSubmit="translateText" :tabName="activeName"></pending-audit>
      </el-tab-pane>
      <el-tab-pane  name="auditeding">
        <span slot="label"> 已审核<span class="auditNum">{{activeTwoNum||''}}</span></span>
        <auditeding :tabName="activeName"></auditeding>
      </el-tab-pane>
      <el-tab-pane  name="theFailed">
        <span slot="label"> 审核不通过<span class="auditNum">{{activeThreeNum||''}}</span></span>
        <the-failed :tabName="activeName" ></the-failed>
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
  name: 'three-analysis',
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
        content: '操作说明:   启用三员管理并勾选相应模块操作后，有权限人员在对该模块数据进行相应操作时将提交数据至安全管理员进行审核，审核通过后方生效。'
      },
      activeName: 'pendingAudit',
      activeStatus: 1,
      activeOneNum: '',
      activeTwoNum: '',
      activeThreeNum: ''
    }
  },
  methods: {
    translateText (data) {
      if (data === 'auditeding') {
        this.activeStatus = 2
      } else if (data === 'pendingAudit') {
        this.activeStatus = 1
      } else {
        this.activeStatus = 3
      }
      this.getData()
    },
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
      this.$request.fetAuditOperateStatistics({ status: this.activeStatus, type: 1 }).then(res => {
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
    this.$nextTick(() => {
      this.getData()
    })
  }
}
</script>

<style lang="scss" scoped>
.three-member-section{
  .auditNum{
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
  .three-member-section{
    .el-tabs{
      .el-tabs__header{

      }
    }
  }
</style>
