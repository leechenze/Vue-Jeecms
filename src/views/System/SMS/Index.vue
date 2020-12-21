<template>
  <section class="service-index">
    <iframe :src="url" width="100%" height="100%">
        <!-- IE：你们都看我干吗，我现在也是支持的 -->
    </iframe>
  </section>
</template>

<script>
export default {
  name: 'sms',
  // mixins: [baseHeader, baseForm],
  data () {
    return {
      name: '服务市场'
    }
  },
  computed: {
    url () {
      let host = this.$path || window.location.host
      /* system-cms-prefix start */
      let prefix = 'cmsmanager'
      /* system-cms-prefix change let prefix = 'cmsadmin' system-cms-prefix change */
      /* system-cms-prefix end */
      // siteId 站点id    siteName 站点名称   type: 判断是否是短息服务类型    ShowHide: 判断是否有返回按钮
      let src = 'http://order.yun.jeecms.com/#/service/apply/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host + '&prefix=' + prefix + '&siteId=' + localStorage.getItem('siteId') + '&siteName=' + localStorage.getItem('siteName') + '&type=' + '短信服务' + '&ShowHide=' + true
      return src
    }
  },
  methods: {
  },
  created () {
  },
  watch: {
  }
}
</script>

<style>
.service-index {
  width:100%;
  height:100%;
}
</style>
<style lang="scss" scoped>
// .system-setting-container{
//   font-size: 16px;
//   header{
//     padding-bottom: 20px;
//     span{
//       padding-right: 10px;
//     }
//   }
//   .el-alert{
//     margin-bottom: 20px;
//   }
// }

</style>
