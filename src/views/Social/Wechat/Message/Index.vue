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
       <section slot="main" v-if="activeId">
          <search-header
            v-bind="searchHeader"
            :params="params"
            @handleSearch="handleSearchs"
          ></search-header>
          <message-box :data="msgData" @refushData="refushData" :tags="tags"
            :appId="activeId" :totalCount="totalCount"></message-box>
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
import messageBox from './messageBox'
export default {
  name: 'socialWechatMessageIndex',
  mixins: [baseHeader, searchHeader],
  components: {
    weiboTree,
    messageBox
  },
  computed: {
    ...mapGetters(['wechatInfoList'])
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            label: '全部消息',
            type: 'text'
          },
          {
            label: '屏蔽黑名单用户',
            type: 'checked',
            value: 'black'
          },
          {
            type: 'select',
            value: 'timeType',
            label: '发送时间:',
            options: [
              { label: '全部', value: '' },
              { label: '今天', value: '1' },
              { label: '昨天', value: '2' },
              { label: '前天', value: '3' },
              { label: '指定日期', value: '4' }
            ]
          },
          {
            type: 'timePicker',
            value: 'times',
            dateType: 'daterange',
            valueFormat: 'yyyy-MM-dd',
            hiddenKey: 'timeType',
            hiddenValue: '4'
          },
          {
            type: 'searchInput',
            value: 'title',
            placeholder: '搜索消息内容'
          }
        ]
      },
      params: {
        'appId': '',
        'times': null,
        'startTime': '',
        'endTime': '',
        'black': true, // true 屏蔽黑名单，false 不屏蔽
        'title': '',
        'timeType': '',
        page: 1,
        size: 10
      },
      activeId: '',
      msgData: [],
      totalCount: 0,
      tags: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.wechatInfoList.length > 0) {
        this.params.appId = this.wechatInfoList[0].appId
        this.activeId = this.wechatInfoList[0].appId
        this.getMsgData()
      }
    })
  },
  methods: {
    refushData (page, size) {
      this.params.page = page || 1
      this.params.size = size || 10
      this.getMsgData()
    },
    // 点击列表
    setActive (id) {
      this.activeId = id
      this.params.appId = id
      this.getMsgData()
    },
    // 搜索
    handleSearchs () {
      let data = this.params
      let times = []
      let time = null
      switch (data.timeType) {
        case '1':
          time = this.$moment(new Date().getTime(), 'YYYY-MM-DD', true)
          times = [time, time]
          break
        case '2':
          time = this.$moment(new Date().getTime() - 24 * 60 * 60 * 1000, 'YYYY-MM-DD', true)
          times = [time, time]
          break
        case '3':
          time = this.$moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 2, 'YYYY-MM-DD', true)
          times = [time, time]
          break
        case '4':
          times = data.times ? data.times : ['', '']
          break
        case '':
          times = ['', '']
          break
        default:
          times = ['', '']
      }
      if (times && times.length > 0) {
        this.params.startTime = times[0]
        this.params.endTime = times[1]
        this.getMsgData()
      }
    },
    // 获取标签列表
    getTags () {
      if (this.activeId) {
        let params = { appId: this.activeId }
        this.$request.wechattagsApp(params).then(res => {
          if (res.code === 200) {
            this.tags = res.data.tagList
          }
        })
      }
    },
    // 获取数据
    getMsgData  () {
      if (this.params.appId) {
        if (!this.tags.length) {
          this.getTags()
        }
        let query = this.params
        delete query.times
        this.$request.fetchWechatfanssendlogPage(query).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.content instanceof Array) {
              this.msgData = res.data.content.map(d => {
                if (d.fans.tagidList) {
                  let tags = this.tags.filter(v => d.fans.tagidList.indexOf(v.id) > -1)
                  d.fans.tags = tags.map(v => { return v.tagName })
                }
                return d
              })
              this.totalCount = res.data.totalElements
              this.searchHeader.searchItems[0].label = '全部消息' + '（' + res.data.totalElements + '）'
            }
          }
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
