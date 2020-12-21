<template>
  <section class="user-prem-container">
    <!-- <base-header v-bind="headers"/> -->
    <el-tabs v-model="activeTab">
      <template v-for="(item, index) in tabs">
        <el-tab-pane :label="item.label" :name="item.name" :key="index">
          <component :is="item.component" :dataType="item.dataType" name="userId" :dataPermStatus="3" :value="userId"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import MenusPermission from '@/views/System/User/Permission/MenusPermission'
import SiteGroupPermission from '@/views/System/User/Permission/SiteGroupPermission'
import SitePermission from '@/views/System/User/Permission/SitePermission'
import ColumnPermission from '@/views/System/User/Permission/ColumnPermission'

export default {
  name: 'userPermission',
  mixins: [baseHeader],
  components: {
    MenusPermission,
    SiteGroupPermission,
    SitePermission,
    ColumnPermission
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        content: '操作说明'
      },
      backUrl: '/system/user/index',
      activeTab: '1',
      tabs: [
        {
          name: '1',
          label: '站群权限',
          component: 'SiteGroupPermission',
          dataType: 5
        },
        {
          name: '2',
          label: '菜单类权限',
          component: 'MenusPermission',
          dataType: 4
        },
        {
          name: '3',
          label: '站点类权限',
          component: 'SitePermission',
          dataType: 1
        },
        {
          name: '4',
          label: '栏目类权限',
          component: 'ColumnPermission',
          dataType: 2
        },
        {
          name: '5',
          label: '文档类权限',
          component: 'ColumnPermission',
          dataType: 3
        }
      ],
      userId: ''
    }
  },
  mounted () {
    const { id } = this.$route.query
    if (id) this.userId = id
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.userId) {
      this.userId = id
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-prem-container{
    .box-items{
      padding: 0 9px;
    }
  }
</style>
