<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>
<script>
import {
  mapActions
} from 'vuex'

export default {
  name: 'APP',
  methods: {
    ...mapActions('app', ['changeTheme', 'changeLang'])
  },
  created () {
    const theme = window.localStorage.getItem('theme') || 'custom-grayBlue'
    this.changeTheme(theme)
    const lang = window.localStorage.getItem('lang') || 'cn'
    this.changeLang(lang)
    this.$i18n.locale = lang
    /* system-cms-prefix start */
    window.localStorage.setItem('base', `${process.env.VUE_APP_API_HOST}/cmsmanager`)
    /* system-cms-prefix change
    window.localStorage.setItem('base', `${process.env.VUE_APP_API_HOST}/cmsadmin`)
    system-cms-prefix change */
    /* system-cms-prefix end */
  }
}
</script>

<style lang="scss">
.app-container{
  height: 100vh!important;
  -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
