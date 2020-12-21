<template>
  <section class="result-analysis-section">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="结果数据" name="userManage">
        <user-manage :tabName="tabName"></user-manage>
      </el-tab-pane>
      <el-tab-pane label="报表" name="configManage">
        <config-manage :tabName="tabName"></config-manage>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import configManage from './components/configManage'
import userManage from './components/userManage'

export default {
  name: 'result-analysis',
  components: {
    userManage,
    configManage
  },
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeName: 'userManage'
    }
  },
  methods: {
    handleClick (e) {
      // console.log(e)
    }
  }
}
</script>

<style lang="scss">
  .result-analysis-section {
    padding-top: 30px;

    .search-header-container .el-col .search-item-wrap > .el-input .input-prepend .el-input__inner {
      color: #333333;
    }

    .el-tabs.el-tabs--card > .el-tabs__header .el-tabs__item {
      width: 95px;
      text-align: center;
      height: 36px !important;
      line-height: 36px !important;
      padding: 0 15px !important;

      &:last-of-type {
        border-radius: 0 4px 0 0;
        vertical-align: top;
      }

      &:first-of-type {
        border-radius: 4px 0 0 0;
        vertical-align: top;
      }
    }

    .el-tabs.el-tabs--card > .el-tabs__content .el-tab-pane {
      border: none !important;
    }

    .el-tabs {
      &__content {
        &:last-of-type {
          overflow: inherit;
        }
      }
    }
  }
</style>
