<template>
  <div class="collect-iframe-container" v-loading="loading">
    <iframe :src="iframeUrl" width="100%" height="100%" @load="reset" frameborder="0"></iframe>
  </div>
</template>

<script>
// 获取子窗口
window.addEventListener('message', function (event) {
  if (event.data.taskId) {
    // 此处执行事件
    getCmsData(event.data.taskId)
  }
})

export default {
  name: 'interactCollectIframe',
  data () {
    return {
      loading: true,
      // 云端用户ID
      identity: '',
      // 云端url
      iframeUrl: '',
      // 客户端APPID
      appid: '',
      // 主题
      theme: '',
      // 子站ID
      siteId: ''
    }
  },
  activated () {
    this.loading = true
    this.init()
  },
  mounted () {
    this.init()
    window['getCmsData'] = data => {
      this.getCmsData(data)
    }
  },
  methods: {
    reset () {
      this.loading = false
    },
    // 获取模型和APPID
    getAppIDOrModel () {
      this.$request.fetchCollectGetId().then(res => {
        this.collectLook = false
        if (res.code === 200) {
          this.CMSData = res.data
          window.localStorage.setItem('appid', res.data.appId)
          this.setYunAppIdOrModel()
        }
      })
    },
    // 设置云端模型和栏目
    setYunAppIdOrModel () {
      let obj = Object.assign({ 'identity': this.identity, 'siteId': window.localStorage.getItem('siteId') }, this.CMSData)
      this.$request.fetchSetYunAppIdOrModel(obj).then(res => {})
    },
    init () {
      let urlText = ''
      this.siteId = window.localStorage.getItem('siteId')
      this.appid = window.localStorage.getItem('appid')
      this.theme = window.localStorage.getItem('theme')
      this.getAppIDOrModel()
      if (this.$route.query.collectType !== undefined) {
        urlText += '&taskId=' + this.$route.query.taskId
        if (this.$route.query.collectType === 'Start' || this.$route.query.collectType === 'See') {
          urlText += '&to=FastCollectLog'
        } else if (this.$route.query.collectType === 'Edit') {
          urlText += '&to=' + this.$route.query.to
        }
      }
      this.identity = window.localStorage.getItem('yunIdentity')
      console.log('进入')
      // this.iframeUrl = 'http://192.168.0.182:8081/' + '?appId=' + this.appid + '&siteId=' + this.siteId + '&identity=' + this.identity + '&theme=' + this.theme + urlText
      this.iframeUrl = 'http://cj.yun.jeecms.com/' + '?appId=' + this.appid + '&siteId=' + this.siteId + '&identity=' + this.identity + '&theme=' + this.theme + urlText
      // this.iframeUrl = window.localStorage.getItem('yunIframeUrl') + '?appId=' + this.appid + '&siteId=' + this.siteId + '&identity=' + this.identity + '&theme=' + this.theme + urlText
    },
    getCmsData (taskId) {
      this.$request.fetchCollectConsume({ 'taskId': taskId, 'appId': this.appid, 'identity': this.identity }).then(res => {
        if (res.code === 200) {

        }
      })
    }
  }
}
</script>

<style lang="scss">
.collect-iframe-container{
  height: 100%;
}
</style>
