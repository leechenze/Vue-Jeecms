<template>
<!-- heyan -->
  <section class="wechat-menu-index wxmenus">
    <!-- <base-header
      v-bind="headers"
      /> -->
      <jee-aside-layout
      asideWidth="250px"
      class="social-container"
      hiddenHeader :noPageView='true'>
       <section slot="asideMain" >
         <weibo-tree
          type="wechat"
          rowKey="appId"
          ref="weiboTree"
          @setActive="setActive"
          :activeId="activeId"></weibo-tree>
       </section>
       <section slot="main" v-if="activeId">
         <el-tabs v-model="activeTab">
            <template v-for="(item, index) in tabs">
              <el-tab-pane :label="item.label" :name="item.name" :key="index">
              </el-tab-pane>
            </template>
          </el-tabs>
          <component :is="'defaultMenu'" :id="activeId" :name="activeTab"></component>
       </section>
    </jee-aside-layout>
  </section>
</template>

<script>
import defaultMenu from './DefaultMenu'
import baseHeader from '@/components/mixins/baseHeader'
import { mapGetters } from 'vuex'
import weiboTree from '../../Weibo/components/WeiboTree'

export default {
  name: 'socialWechatMenuIndex',
  mixins: [baseHeader],
  components: {
    defaultMenu,
    weiboTree
  },
  computed: {
    ...mapGetters(['wechatInfoList'])
  },
  watch: {
    wechatInfoList () {
      if (this.wechatInfoList.length > 0 && !this.activeId) {
        this.activeId = this.wechatInfoList[0].appId
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.wechatInfoList.length > 0) {
        this.activeId = this.wechatInfoList[0].appId
      }
    })
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      activeTab: 'default',
      tabs: [
        {
          label: '默认菜单',
          name: 'default',
          component: 'defaultMenu'
        },
        {
          label: '个性化菜单',
          name: 'individualization',
          component: 'defaultMenu'
        }
      ],
      activeId: ''

    }
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
.wechat-menu-index.wxmenus{
  height: 100%;
  .el-container.jee-aside-layout-container.social-container{
    height: calc(100% - 96px);
  }
}
</style>
