<template>
<section class="role-prem-container left-container">
    <el-container>
      <el-aside>
        <div class="left-head">
          <base-header v-bind="asideHeaders"
            v-on:handleAdd="handleHeaderAdd"
          />
        </div>
          <ul class="box-items">
            <li class="box-item jee-hover-color" @click="getRoleDetail(item)"
            :class="item.id == roleId?'jee-color':''"
             v-for="(item,index) in roleOptions" :key="index">{{item.roleName}}</li>
          </ul>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeTab">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :label="item.label" :name="item.name" :key="index">
              <component :is="item.component" :dataType="item.dataType" :dataPermStatus="2" name="roleId" :value="roleId"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
        <form-dialog
            ref="addDialog"
            :buttons="addButtons"
            :loading="addFormLoading"
            :form="addForm"
            :rules="addRules"
            :formItems="addFormItems"
            v-on:handleConfirm="handleConfirmAdd"
            v-on:handleConfirmRole="handleConfirmRole"
          ></form-dialog>
      </el-main>
    </el-container>
  </section>
</template>

<script>
import role from './role'
import MenusPermission from '@/views/System/User/Permission/MenusPermission'
import SiteGroupPermission from '@/views/System/User/Permission/SiteGroupPermission'
import SitePermission from '@/views/System/User/Permission/SitePermission'
import ColumnPermission from '@/views/System/User/Permission/ColumnPermission'

export default {
  name: 'rolePermission',
  mixins: [role],
  components: {
    SiteGroupPermission,
    SitePermission,
    ColumnPermission,
    MenusPermission
  },
  data () {
    return {
      backUrl: '/system/role/index',
      roleId: '',
      activeTab: '1',
      tabs: [
        {
          name: '1',
          label: '站群权限',
          component: 'SiteGroupPermission',
          dataType: 5,
          perName: 'roleId'
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
      ]
    }
  },
  methods: {
    getRoleDetail (item) {
      this.activeName = item.roleName
      this.roleId = item.id
    },
    handleHeaderAdd () {
      this.$refs.addDialog.showDialog()
    },
    getTreeList () {
      // this.getRoleList()
      if (this.organizeOptions instanceof Array) {
        this.addFormItems.find(d => d.prop === 'orgids').options = this.organizeOptions
      }
    },
    getRoleData () {
      const { id } = this.$route.query
      if (id && id !== this.roleId) {
        this.roleId = id
      }
      if (this.organizeOptions.length < 1) {
        this.FetchOrganizeOptions()
      } else {
        this.getTreeList()
      }
    }
  },
  watch: {
    organizeOptions (newVal, oldVal) {
      if (newVal) {
        this.getTreeList()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getRoleData()
    })
  },
  activated () {
    this.getRoleData()
  }
}
</script>

<style lang="scss" scoped>
  .role-prem-container{
    .box-items{
      padding: 0 9px;
    }
  }
</style>
