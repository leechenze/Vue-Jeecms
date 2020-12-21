<template>
<section class="org-prem-container left-container">
    <el-container>
      <el-aside>
        <div class="left-head">
          <base-header v-bind="asideHeaders"
            v-on:handleAdd="handleHeaderAdd"
          />
        </div>
          <div class="box-items">
            <drag-tree v-bind="tree" v-if="tree.currentNodeKey" @handleClick="handleTreeClick"></drag-tree>
          </div>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeTab">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :label="item.label" :name="item.name" :key="index">
              <component :is="item.component" :dataType="item.dataType" :dataPermStatus="1" name="orgId" :value="orgId"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
        <form-dialog
          ref="addDialog"
          :loading="addFormLoading"
          :form="addForm"
          :rules="addRules"
          :buttons="addButtons"
          :formItems="addFormItems"
          v-on:handleConfirm="handleConfirmAdd"
          v-on:handleConfirmRole="handleConfirmRole"
        ></form-dialog>
      </el-main>
    </el-container>
  </section>
</template>

<script>
import organize from './organize'
import MenusPermission from '@/views/System/User/Permission/MenusPermission'
import SiteGroupPermission from '@/views/System/User/Permission/SiteGroupPermission'
import SitePermission from '@/views/System/User/Permission/SitePermission'
import ColumnPermission from '@/views/System/User/Permission/ColumnPermission'

export default {
  name: 'organizePermission',
  mixins: [organize],
  components: {
    SiteGroupPermission,
    SitePermission,
    ColumnPermission,
    MenusPermission
  },
  data () {
    return {
      backUrl: '/system/organize/index',
      orgId: '',
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
      tree: {
        data: [],
        currentNodeKey: '',
        draggable: false,
        showLevel: false
      }
    }
  },
  methods: {
    // 弹出窗
    handleHeaderAdd () {
      this.$refs.addDialog.showDialog()
    },
    handleTreeClick (item, node) {
      this.orgId = item.id
      this.setCurrentNodeKey(item.id)
    },
    getTreeList () {
      if (this.organizeOptions instanceof Array) {
        this.addFormItems.find(d => d.prop === 'orgids').options = this.organizeOptions
        this.$request.fetchOrganizeList({ 'isVirtual': '', 'key': '', 'parentId': '' }).then(res => {
          if (res.code === 200) {
            this.tree.data = res.data
          }
        })
      }
    },
    getData () {
      if (this.organizeOptions.length < 1) {
        this.FetchOrganizeOptions()
      } else {
        this.getTreeList()
      }
      const { id } = this.$route.query
      if (id && id !== this.orgId) {
        this.orgId = id
        this.setCurrentNodeKey(id)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData()
    })
  },
  activated () {
    this.getData()
  },
  watch: {
    organizeOptions (newVal, oldVal) {
      if (newVal) {
        this.getTreeList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.org-prem-container{
  .box-items{
    padding: 0;
  }
}

</style>
