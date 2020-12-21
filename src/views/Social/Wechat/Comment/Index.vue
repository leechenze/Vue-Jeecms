<template>
<!-- heyan -->
  <section class="wechat-comment-index">
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
       <section slot="main" v-if="activeId" style='height: 100%'>
         <comment-list :id="activeId" :name="activeTab" :wechatInfo="wechatInfo"></comment-list>
         <!-- <el-tabs v-model="activeTab">
            <template v-for="(item, index) in tabs">
              <el-tab-pane :label="item.label" :name="item.name" :key="index">
                <component :is="item.component" :id="activeId"
                  :name="activeTab"></component>
              </el-tab-pane>
            </template>
          </el-tabs> -->
       </section>
    </jee-aside-layout>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import { mapGetters } from 'vuex'
import weiboTree from '../../Weibo/components/WeiboTree'
import commentList from './commentList'
// import commentSet from './commentSet'
export default {
  name: 'socialWechatCommentIndex',
  mixins: [baseHeader],
  components: {
    weiboTree,
    commentList
  },
  computed: {
    ...mapGetters(['wechatInfoList']),
    wechatInfo () {
      return this.wechatInfoList.find(d => d.appId === this.activeId) || {}
    }
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      activeId: '',
      activeTab: 'commentList',
      tabs: [
        // {
        //   label: '留言列表',
        //   name: 'commentList',
        //   component: 'commentList'
        // }
        // {
        //   label: '留言设置',
        //   name: 'commentSet',
        //   component: 'commentSet'
        // }
      ],
      params: {}
    }
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
.wechat-comment-index{
  height: 100%;
}
</style>
