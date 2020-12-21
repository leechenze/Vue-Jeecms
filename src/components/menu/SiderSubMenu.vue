<template>
  <!-- 侧栏导航 -->
  <el-aside :width="collapsed? '0':'175px'" class="sider-menu-children-container scrollbar">
    <div class="title">{{$t('menus.'+menuTitle)}}</div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      @select="onSelect"
      v-for="(menu, index) in menuData" :key="index"
    >
      <template v-for="(item, index) in menu.children" >
        <div
          v-show="menuPath.startsWith(menu.path) && !filterMenus.includes(item.name)"
          class="menu-item-wrap"
          :key="index"
        >
          <el-submenu
            class="jee-sider-sub-menu-item"
            :index="item.path"
            v-if="item.children && item.children.filter(c=>!c.hidden).length"
          >
            <template slot="title">
              <span>{{item.hidden ? '':$t('menus.'+item.name)}}</span>
            </template>
            <el-menu-item
              class="jee-sider-sub-menu-item"
              :index="subItem.path"
              v-for="(subItem, index) in item.children"
              :key="index"
            >
              <div class="dot"></div>
              <span slot="title">{{$t('menus.'+subItem.name)}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            class="jee-sider-sub-menu-item"
            v-else-if="item"
            :index="item.path"
          >
            <span slot="title">{{item.hidden ? '':$t('menus.'+item.name)}}</span>
          </el-menu-item>
        </div>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'SiderSubMenu',
  props: {
    collapsed: {
      type: Boolean,
      default: true
    },
    menuData: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    menuPath: {
      type: String,
      required: true,
      default: ''
    },
    menuTitle: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      filterMenus: []
    }
  },
  methods: {
    // 设置过滤列表
    setFilterMenus () {
      this.filterMenus = this.memberRegisterExamine === '1' ? [] : ['vipCheckPending']
    },
    onSelect (index, indexPath) {
      this.$routerLink(index)
    }
  },
  computed: {
    ...mapGetters(['setting']),
    // 会员注册是否需要审核
    memberRegisterExamine () {
      const { memberRegisterExamine } = this.setting.attrs || {}
      return memberRegisterExamine
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  watch: {
    memberRegisterExamine (newData) {
      this.setFilterMenus()
    }
  },
  mounted () {
    this.setFilterMenus()
  }
}
</script>

<style lang="scss">
// @import '../../assets/theme/grayBlue/index.scss';

.sider-menu-children-container{
  background-color: #eceff1;
  transition: width ease-out 400ms;
  text-align: left;
  overflow-x: hidden;
  overflow-y: overlay;
  padding-bottom: 50px;
  .title {
    color: #666666;
    font-size: 20px;
    line-height: 20px;
    padding: 23px 0 25px 0;
    margin-left: 19px;
    border-bottom: 1px solid #DDE3E6;
    white-space: nowrap;
  }
  .el-menu-vertical .menu-item-wrap{
    border-right: 0;
    .el-menu-item {
      height: auto;
      background-color: #eceff1;
      // color: #333333;
      span{
        line-height: 50px;
        font-size: 16px;
        display: block;
      }
      &.is-active,
      &:hover{
        // color: #1EC6DF;
        background-color: #ffffff;
      }

    }
    .el-submenu{
      .el-submenu__title{
        background-color: #eceff1;
        font-size: 16px;
        &.is-active{
          background-color: #eceff1;
        }
        &:hover{
          // color: #1EC6DF;
          background-color: #ffffff;
        }
      }
      .el-menu-item{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 40px;
        span{
          line-height: 40px;
          font-size: 14px;
        }

        .dot{
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #666666;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
