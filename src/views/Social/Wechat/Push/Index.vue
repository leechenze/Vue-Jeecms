<template>
  <section class="wechat-push-index">
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
       <section slot="main" v-if="activeId" v-loading="loading">
          <search-header
            class="search-header-dialog"
            v-bind="searchHeader"
            :params="params"
            @handleSearch="handleSearchs"
          ></search-header>
          <image-text :data="pushData"></image-text>
       </section>
    </jee-aside-layout>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import { mapGetters } from 'vuex'
// mapActions
import weiboTree from '../../Weibo/components/WeiboTree'
import imageText from './imageTextBox'
export default {
  name: 'socialWechatPushIndex',
  mixins: [baseHeader, searchHeader],
  components: {
    weiboTree,
    imageText
  },
  computed: {
    ...mapGetters(['wechatInfoList'])
  },
  data () {
    return {
      loading: false,
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'timePicker',
            value: 'times',
            label: '发送时间:',
            dateType: 'month',
            valueFormat: 'yyyy-MM',
            pickerOptions: {
              disabledDate: function (time) {
                return time.getTime() > Date.now()
              }
            }
          },
          {
            type: 'searchInput',
            value: 'title',
            placeholder: '搜索图文标题'
          }
        ]
      },
      params: {
        'appId': '',
        'times': '',
        'year': '',
        'month': '',
        'title': ''
      },
      activeId: '',
      pushData: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.wechatInfoList.length > 0) {
        this.params.appId = this.wechatInfoList[0].appId
        this.activeId = this.wechatInfoList[0].appId
        this.handleSearchs()
      }
    })
  },
  methods: {
    // 点击列表
    setActive (id) {
      this.activeId = id
      this.params.appId = id
      this.handleSearchs()
    },
    // 搜索
    handleSearchs () {
      if (this.params.appId) {
        let times = []
        if (this.params.times) {
          times = this.params.times.split('-')
        } else {
          let date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          times = [year, month]
          this.params.times = times.join('-')
        }
        this.params.year = times[0]
        this.params.month = times[1]
        this.getPushData()
      }
    },
    // 获取数据
    getPushData () {
      this.loading = true
      if (this.params.appId) {
        this.$request.fetchWechatsendCollect(this.params).then(res => {
          if (res.code === 200) {
            this.pushData = res.data.content
          }
          this.loading = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wechat-push-index{
  height: 100%;
}
</style>
