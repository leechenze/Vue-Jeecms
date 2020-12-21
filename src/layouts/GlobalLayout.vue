<template>
  <!-- 最大布局容器 -->
  <el-container>
    <collect-plugin/>
    <!-- 头部布局 -->
    <el-header height="50px">
      <global-header
        :collapsed="collapsed"
        @toggleCollapse="toggleCollapse"/>
    </el-header>
    <!-- 头部以下主体布局 -->
    <el-main>
      <el-container>
        <!-- 侧栏一级导航布局 -->
        <sider-menu
          :menuData="menuData"
          :activeMenu="activeMenu"
          @menuSelect="onMenuSelect"
        />
        <sider-sub-menu
          :menuData="menuData"
          :collapsed="collapsed"
          :menuPath="activeMenu"
          :menuTitle="menuTitle"
        />
        <!-- 右侧页面区 -->
        <el-main>
          <slot></slot>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import GlobalHeader from './GlobalHeader'
import SiderMenu from '../components/menu/SiderMenu'
import SiderSubMenu from '../components/menu/SiderSubMenu'
import { mapGetters } from 'vuex'
import collectPlugin from '../components/plugin/CollectPlugin'

export default {
  name: 'GlobalLayout',
  components: { SiderMenu, SiderSubMenu, GlobalHeader, collectPlugin },
  data () {
    return {
      collapsed: true,
      menuTitle: '',
      activeMenu: ''
    }
  },
  computed: {
    ...mapGetters([
      'routes'
    ]),
    menuData () {
      // return this.routes.find((item) => item.path === '/').
      return this.routes
    }
  },
  methods: {
    // 点击收缩开关，部分页面不允许展开
    toggleCollapse () {
      const menu = this.menuData.find(d => this.activeMenu.startsWith(d.path))
      if (menu) {
        if (!(menu.children instanceof Array && menu.children.find(d => d.hidden === false))) {
          this.collapsed = true
          return
        }
      }
      this.collapsed = !this.collapsed
      // const closeMenus = ['workplaceIndex', 'columnIndex', 'contentIndex']
      // this.collapsed = closeMenus.includes(this.$route.name) || !this.collapsed
    },
    onMenuSelect (path, collapsed) {
      this.collapsed = collapsed
      this.activeMenu = path
      this.menuTitle = this.menuData.find(m => path.startsWith(m.path)).name
    },
    changeRoute (path) {
      if (path === '/') {
        this.activeMenu = ''
        this.menuTitle = ''
        this.collapsed = true
        return
      }
      const activeMenu = this.menuData.find(m => path.startsWith(m.path))
      if (activeMenu) {
        this.activeMenu = activeMenu.path
        this.menuTitle = activeMenu.name
        if (activeMenu.children && activeMenu.children.filter(m => !m.hidden).length) {
          this.collapsed = false
        } else {
          this.collapsed = true
        }
      }
    }
  },
  watch: {
    $route (route) {
      this.changeRoute(route.path)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const path = this.$route.path
      this.changeRoute(path)
    })
  }
}
</script>
