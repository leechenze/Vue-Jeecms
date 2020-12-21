
<template>
<!-- heyan -->
  <section class="wechat-menu-index">
    <base-header
      v-bind="headers"
      />
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
                <label slot="label">{{item.label}}<jee-icon iconClass="caozuoshuoming1" :style="{fontSize: '16px'}"/></label>
                <component :is="item.component" :id="activeId" :name="activeTab"></component>
              </el-tab-pane>
            </template>
          </el-tabs>
       </section>
    </jee-aside-layout>
  </section>
</template>

<script>
import fansList from './FansList'
import blackList from './BlackList'
import { mapGetters } from 'vuex'
import weiboTree from '../../Weibo/components/WeiboTree'
import baseHeader from '@/components/mixins/baseHeader'
export default {
  name: 'socialWechatFansIndex',
  mixins: [baseHeader],
  components: {
    weiboTree,
    fansList,
    blackList
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '首次使用时请先同步粉丝数据'
      },
      activeTab: 'fansList',
      tabs: [
        {
          label: '粉丝列表',
          name: 'fansList',
          component: 'fansList'
        },
        {
          label: '黑名单',
          name: 'blackList',
          component: 'blackList'
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
  height: 100%;
}
</style>
