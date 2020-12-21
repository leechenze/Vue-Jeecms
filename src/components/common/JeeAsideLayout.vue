<template>
  <el-container class='jee-aside-layout-container'>
    <el-aside :width="asideWidth">
      <el-container>
        <el-header v-if="!hiddenHeader" height='58px'>
          <slot name='asideHeader'></slot>
        </el-header>
        <el-main>
          <slot name='asideMain'></slot>
        </el-main>
      </el-container>
    </el-aside>
    <el-main :class="{scrollbar: showScrollbar}">
      <slot name='main'></slot>
    </el-main>
    <slot/>
  </el-container>
</template>
<script>
export default {
  name: 'JeeAsideLayout',
  props: {
    hiddenHeader: {
      type: Boolean,
      default: false
    },
    asideWidth: {
      type: String,
      default: '190px'
    },
    showScrollbar: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss" scoped>
.jee-aside-layout-container{
  height: 100%;
  .el-aside{
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    margin-right: 30px;
    .el-header{
      padding: 10px 0 10px 10px;
      border-bottom: 1px solid #e8e8e8;
    }
  }
}
</style>
