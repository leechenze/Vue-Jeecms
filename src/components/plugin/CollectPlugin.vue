<template>
  <div class="collectPluginBox">
    <div class="collectPlugin" v-show="isShow">
      <jee-icon iconClass="guanbi" @click="close"></jee-icon>
      检测到采集插件未开启，请  <span @click="openCollect">前往开启</span> ，未安装？   <span @click="download">立即下载</span>
    </div>
    <div class="collectPlugin" v-show="updateShow">检测到采集插件有更新，<span @click="download">立即下载</span>   体验最新功能</div>
  </div>
</template>

<script>
export default {
  name: 'CollectPlugin',
  data () {
    return {
      isShow: false,
      updateShow: false,
      CollectConfig: {}, // 本地插件配置
      CollectPluginConfig: {} // 服务器插件配置
    }
  },
  mounted () {
    let _this = this
    // 监听页面事件 监听版本
    window.addEventListener('message', function (e) {
      if (e.data.CollectConfig) {
        _this.CollectConfig = e.data.CollectConfig
        _this.isShow = false
      }
    }, false)
  },
  watch: {
    '$route': function (newVal, oldVal) {
      this.isShow = false
      this.updateShow = false
      if (newVal.name === 'interactCollectIndex') {
        this.isShow = true
        this.getPlugin()
        // 发送信息获取 插件版本
        window.postMessage({ 'CollectPlugin': true }, '*')
      }
    },
    CollectPluginConfig: {
      deep: true,
      handler: function (newVal, oldVal) {
        // 判断下版本是否一样
        if (parseFloat(this.CollectPluginConfig.version) > parseFloat(this.CollectConfig.version)) {
          this.updateShow = true
        } else {
          this.updateShow = false
        }
      }
    }
  },
  methods: {
    // 获取插件信息
    getPlugin () {
      this.$request.fetchCollectPlugin({ name: 'CollectPlus' }).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.CollectPluginConfig = res.data
        }
      })
    },
    close () {
      this.isShow = !this.isShow
    },
    download () {
      window.open('http://api.jeecms.com/MODULE-RES/plus/download?name=CollectPlus')
    },
    openCollect () {
      this.$alert('从右上角菜单 》 更多工具 》扩展程序可以进入 插件管理页面开启插件,也可以直接在地址栏输入 chrome://extensions 访问开启插件', '提示', {
        confirmButtonText: '确定'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.collectPlugin{
  width: 100%;
  background-color: #212E35;
  height:52px;
  opacity:0.9;
  font-size: 18px;
  color: #fff;
  text-align: center;
  line-height: 52px;
  position: relative;
  span{
    color: #16C5DF;
    cursor: pointer;
    text-decoration: underline;
  }
  .jee-svg-icon{
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
    font-size: 18px;
    color: #4A6B7B;
    fill: #4A6B7B;
  }
}
</style>
