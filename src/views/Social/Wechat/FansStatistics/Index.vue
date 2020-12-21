<template>
  <section class="social-WeChat-fansStatistics-index">
    <jee-aside-layout
      asideWidth="250px"
      class="social-container"
      hiddenHeader :noPageView='true'>
       <section slot="asideMain" >
         <tencent
          @setActive="setActive"
          :activeId="activeId">
        </tencent>
       </section>
       <section slot="main" v-if="activeId">
         <el-tabs v-model="activeTab" class="forbid-tabs">
           <el-tab-pane v-for="(item, index) in tabs" :label="item.label" :name="item.name" :key="index">
              <component :is="item.component"
                v-if="item.name === activeTab"
                :activeId="activeId" :name="activeTab"/>
           </el-tab-pane>
        </el-tabs>
       </section>
    </jee-aside-layout>
  </section>
</template>

<script>
import increase from './Increase'
import property from './Property'
import tencent from './Tencent'
import { mapGetters } from 'vuex'
export default {
  name: 'socialWechatFansStatisticsIndex',
  components: {
    increase,
    property,
    tencent
  },
  data () {
    return {
      activeTab: '1',
      fontId: '',
      tabs: [
        {
          name: '1',
          label: '用户增长',
          component: 'increase'
        },
        {
          name: '2',
          label: '用户属性',
          component: 'property'
        }
      ],
      activeId: '',
      first: true
    }
  },
  computed: {
    ...mapGetters(['tencentList'])
  },
  mounted () {
    this.setActive()
  },
  methods: {
    // 点击列表
    setActive (id) {
      this.activeId = id
    }
  },
  watch: {
    tencentList () {
      if (this.tencentList.length > 0 && this.first === true) {
        this.activeId = this.tencentList[0].appId
        this.first = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .social-WeChat-fansStatistics-index{
    .social-container{
      padding: 0 !important;
      height: calc(100vh - 155px);
    }
  }
</style>
