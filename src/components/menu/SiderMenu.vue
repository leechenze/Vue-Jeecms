<template>
  <!-- 侧栏导航 -->
  <el-aside width="76px" class="sider-menu-container jee-bg-primary scrollbar">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      text-color="#fff"
      active-text-color="#fff"
      @select="onSelect"
    >
      <el-menu-item
        class="jee-sider-menu-item"
        :index="item.path"
        v-for="(item, index) in menuData.filter(m => !m.hidden)"
        :key="index"
        style="paddingLeft: 0;"
      >
        <jee-icon :iconClass="item.icon"></jee-icon>
        <span slot="title">{{$t('menus.'+item.name)}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'SiderMenu',
  props: {
    menuData: {
      type: Array,
      required: true
    },
    activeMenu: {
      type: String
    }
  },
  methods: {
    onSelect (index, indexPath) {
      let collapsed = false
      const selectMenu = this.menuData.find(m => m.path === index)
      if (!(selectMenu && selectMenu.children && selectMenu.children.filter(m => !m.hidden).length)) {
        collapsed = true
        this.$routerLink(index)
      }
      this.$emit('menuSelect', index, collapsed)
    }
  }
}
</script>

<style lang="scss" scoped>
.sider-menu-container{
  overflow-x: hidden;
  overflow-y: overlay;
  .el-menu-vertical{
    border-right: 0;
    text-align: center;
    .el-menu-item{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: auto;
      height: 70px;
      background-color: #546E7A;
      padding: 0;
      &.is-active,
      &:hover{
        background-color: #1EC6DF;
      }
      .jee-svg-icon{
        fill: #ffffff;
        font-size: 20px;
      }
      span{
        padding-top: 7px;
        line-height: 18px;
        white-space: normal;
      }
    }
  }
}
</style>
