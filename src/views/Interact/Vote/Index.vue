<template>
<!-- 投票调查 -->
  <section class="interact-vote-index">
    <!-- <base-header v-bind="headers"/> -->
    <el-main class="interact-vote-index-wrap">
      <el-tabs v-model="activeTab" @tab-click="handleClick" v-if="workFlow">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :label="item.label" :name="item.name" :key="index">
              <component :is="item.component" :name="activeTab" :activeName="activeName"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
        <div v-else>
          <component :is="'questList'" name="questList" activeName="questList"></component>
        </div>
    </el-main>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import questList from './voteComponents/questionList'
import handle from './voteComponents/handle'
import overDue from './voteComponents/overDue'
import toDeal from './voteComponents/toDeal'
export default {
  name: 'interactVote',
  mixins: [baseHeader],
  components: {
    questList,
    handle,
    overDue,
    toDeal
  },
  data () {
    return {
      activeName: '',
      headers: {
        title: '操作说明',
        showAlertIcon: false
        // content: '操作说明:   这里是关于该页面的相关操作说明文字。'
      },
      activeTab: 'questList',
      tabs: [
        {
          label: '问卷列表',
          name: 'questList',
          component: 'questList'
        },
        {
          label: '待办',
          name: 'toDeal',
          component: 'toDeal'
        },
        {
          label: '已办',
          name: 'handle',
          component: 'handle'
        },
        {
          label: '逾期未办',
          name: 'overDue',
          component: 'overDue'
        }
      ],
      workFlow: false
    }
  },
  methods: {
    handleClick (tab) {
      this.activeName = tab.name
    },
    getWork () {
      this.$request.fetchQuestionnaireWorkflow().then(res => {
        if (res.code === 200) {
          this.workFlow = res.data
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getWork()
    })
  },
  updated () {
    this.getWork()
  }
}
</script>
<style lang="scss">
.interact-vote-index{
  height: 100%;
  .interact-vote-index-wrap{
    height: 100%;
  }
  .el-tabs{
    height: 100%;
    &__content{
       height: calc(100% - 48px);
       overflow-y: auto;
    }
    .el-tab-pane{
       height: calc(100% - 20px);
    }
  }
}
</style>
