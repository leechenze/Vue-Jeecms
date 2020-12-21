<template>
  <div class="route-view-container scrollbar">
    <keep-alive :include="includes" style="height: 100%">
      <router-view v-if="includes.includes($route.name)"/>
    </keep-alive>
    <router-view v-if="!includes.includes($route.name)"/>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'RouteView',
  computed: {
    // :include="includes" bug:只有同级目录下才有效
    ...mapState('permission', ['excludes', 'includes'])
  }
}
</script>
<style lang="scss" scoped>
.route-view-container{
  height: calc(100% - 43.5px);
  overflow-x: hidden;
  overflow-y: overlay;
  box-sizing: border-box;
  padding: 30px 30px 0;
}
</style>
