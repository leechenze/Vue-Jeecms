<template>
<!-- heyan -->
  <section class="social-message-index">
    <!-- <base-header v-bind="headers" /> -->
    <jee-aside-layout
      asideWidth="250px"
      class="social-container"
      hiddenHeader :noPageView='true'>
       <section slot="asideMain" >
         <weibo-tree
          ref="weiboTree"
          @setActive="setActive"
          :activeId="activeId"></weibo-tree>
       </section>
       <section slot="main" v-if="activeId">
         <el-tabs v-model="activeTab">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :label="item.label" :name="item.name" :key="index">
              <component :is="item.component" :id="activeId" :name="activeTab" :activeName="activeName"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
       </section>
    </jee-aside-layout>
  </section>
</template>

<script>
import weiboTree from '../components/WeiboTree'
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import myWeibo from './MyWeibo'
import myComments from './MyComments'
import receivedComments from './ReceivedComments'
import issueComments from './IssueComments'
import { mapGetters } from 'vuex'

export default {
  name: 'socialWeiboMessage',
  mixins: [baseTable, baseHeader],
  components: {
    weiboTree,
    myWeibo,
    myComments,
    receivedComments,
    issueComments
  },
  computed: {
    ...mapGetters(['weiboinfoList'])
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        content: '操作说明'
      },
      activeTab: 'myWeibo',
      tabs: [
        {
          label: '@我的微博',
          name: 'myWeibo',
          component: 'myWeibo'
        },
        {
          label: '@我的评论',
          name: 'myComments',
          component: 'myComments'
        },
        {
          label: '收到的评论',
          name: 'receivedComments',
          component: 'receivedComments'
        },
        {
          label: '发出的评论',
          name: 'issueComments',
          component: 'issueComments'
        }
      ],
      activeId: '',
      activeName: ''
    }
  },
  mounted () {
    if (this.weiboinfoList.length > 0) {
      this.activeId = this.weiboinfoList[0].id
    }
  },
  methods: {
    // 点击列表
    setActive (id, name) {
      this.activeId = id
      this.activeName = name
    }
  }
}
</script>
<style lang="scss" scoped>
  .social-message-index{
    .social-container{
      padding: 0 !important;
      height: calc(100vh - 230px);
    }
  }
</style>
