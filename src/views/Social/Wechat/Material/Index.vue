
<template>
<!-- heyan -->
  <section class="wechat-menu-index">
    <jee-aside-layout
      asideWidth="250px"
      class="social-container"
      :showScrollbar='false'
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
import imageText from './Material/imageText'
import images from './Material/images'
import voices from './Material/voices'
import videos from './Material/videos'
import { mapGetters } from 'vuex'
import weiboTree from '../../Weibo/components/WeiboTree'

export default {
  name: 'socialWechatMaterialIndex',
  components: {
    imageText,
    images,
    voices,
    videos,
    weiboTree
  },
  data () {
    return {
      activeTab: 'imageText',
      tabs: [
        {
          label: '图文信息',
          name: 'imageText',
          component: 'imageText'
        },
        {
          label: '图片',
          name: 'image',
          component: 'images'
        },
        {
          label: '语音',
          name: 'voice',
          component: 'voices'
        },
        {
          label: '视频',
          name: 'video',
          component: 'videos'
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
    height: calc(100vh - 155px);
  }
}
</style>
