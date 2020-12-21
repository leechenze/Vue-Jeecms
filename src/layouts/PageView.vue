<template>
  <el-container class="page-view-container">
    <el-main class="scrollbar">
      <slot></slot>
      <route-view height="100%" v-if="!noRoute"/>
    </el-main>
  </el-container>
</template>
<script>
import RouteView from './RouteView'

export default {
  components: {
    RouteView
  },
  props: {
    noRoute: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
body .page-view-container.el-container {
  height: calc(100vh - 92px);
  padding: 20px 30px 30px 20px;
  background-color: #ffffff;
}
</style>
