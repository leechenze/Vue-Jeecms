
<template>
<!-- heyan -->
  <section class="wechat-menu-index">
    <!-- <base-header
      v-bind="headers"
      /> -->
    <jee-aside-layout
      asideWidth="250px"
      class="social-container"
      hiddenHeader :noPageView='true'>
       <section slot="asideMain" >
         <weibo-tree
         rowKey="appId"
          type="wechat"
          ref="weiboTree"
          @setActive="setActive"
          :activeId="activeId"></weibo-tree>
       </section>
       <section slot="main" v-if="activeId">
         <el-tabs v-model="activeTab">
            <template v-for="(item, index) in tabs">
              <el-tab-pane :label="item.label" :name="item.name" :key="index">
                <component :is="item.component" :id="activeId" :name="activeTab"></component>
              </el-tab-pane>
            </template>
          </el-tabs>
       </section>
    </jee-aside-layout>
  </section>
</template>

<script>
import Keyword from './Keyword'
import Received from './Received'
import Attention from './Attention'
import { mapGetters } from 'vuex'
import weiboTree from '../../Weibo/components/WeiboTree'
import baseHeader from '@/components/mixins/baseHeader'

export default {
  name: 'socialWechatAutoReply',
  mixins: [baseHeader],
  components: {
    Keyword,
    Received,
    Attention,
    weiboTree
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      activeTab: 'keyword',
      tabs: [
        {
          label: '关键词回复',
          name: 'keyword',
          component: 'Keyword'
        },
        {
          label: '收到消息回复',
          name: 'received',
          component: 'Received'
        },
        {
          label: '被关注回复',
          name: 'attention',
          component: 'Attention'
        }
      ],
      activeId: ''
    }
  },
  computed: {
    ...mapGetters(['wechatInfoList'])
  },
  mounted () {
    this.$nextTick(() => {
      if (this.wechatInfoList.length > 0) {
        this.activeId = this.wechatInfoList[0].appId
      }
    })
  },
  methods: {
    // 点击列表
    setActive (id) {
      this.activeId = id
    }
  }

}
</script>

<style lang="scss" scoped>
.wechat-menu-index{
  .social-container{
      padding: 0 !important;
      height: calc(100vh - 185px);
    }
}
</style>
