<template>
  <section class="service-index">
    <iframe :src="url" width="100%" height="100%">
        <!-- IE：你们都看我干吗，我现在也是支持的 -->
    </iframe>
  </section>
</template>
<script>
export default {
  name: 'serviceIndex',
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
      let src = 'http://order.yun.jeecms.com/#/service/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host + '&prefix=' + prefix + '&siteId=' + localStorage.getItem('siteId') + '&siteName=' + localStorage.getItem('siteName')
      return src
    }
  }
}
</script>
<style>
.service-index {
  width:100%;
  height:100%;
  margin: -30px 0 0 -30px;
}
</style>
