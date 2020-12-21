<template>
  <jee-aside-layout class="config-site-permission-container">
    <el-button
      slot="asideHeader"
      size="medium"
      type='primary'
      @click="handleHeaderRecycle()"
      :disabled="!_checkPermission('/sites/recycle', 'GET')"
    >
      <jee-icon iconClass="huishouzhan"></jee-icon>站点回收站
    </el-button>
    <drag-tree
      slot="asideMain"
      v-if="siteTree.currentNodeKey"
      v-bind="siteTree"
      @handleClick="handleClick"
    ></drag-tree>
    <section slot="main">
      <base-header v-bind="columnHeaders"/>
      <el-tabs v-model="currentTab">
        <template v-for="(tab, index) in tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="index">
            <component :is="tab.component" name="siteId" :value="id" :key="index"  :tabIndex="currentTab" />
          </el-tab-pane>
        </template>
      </el-tabs>
    </section>
    <table-dialog
      ref="recycleBin"
      v-bind="tablelist"
      @handleSelectionChange="handleTableDialogSelectionChange"
      @handleBtnDelete='recycleBinDelete'
      @handleBtnRestore='recycleBinRestore'
    ></table-dialog>
    <msg-dialog
      v-bind="msgDialog"
      v-on:handleConfirm="handleConfirmMsg"
      v-on:handleCancel="hideMsgDialog"
    />
  </jee-aside-layout>
</template>

<script>
import sites from './../sites'
import baseHeader from '@/components/mixins/baseHeader'
import OrgPermission from './OrgPermission'
import UserPermission from './UserPermission'

export default {
  name: 'configSitePermissionSite',
  mixins: [baseHeader, sites],
  components: {
    OrgPermission,
    UserPermission
  },
  data () {
    return {
      // headers: {
      //   title: '操作说明',
      //   content: '这里是站点权限分配'
      // },
      id: '',
      siteTree: {
        loading: false,
        showLevel: false,
        data: [],
        currentNodeKey: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      },
      currentTab: 'org',
      tabs: [
        {
          label: '组织及角色',
          name: 'org',
          component: 'OrgPermission'
        },
        {
          label: '用户',
          name: 'user',
          component: 'UserPermission'
        }
      ]
    }
  },
  inject: ['removeTab'],
  computed: {
    columnHeaders () {
      if (this.currentTab === 'org') {
        return {
          content: '设置组织及角色对本条站点数据的管理权限',
          title: '操作说明：'
        }
      } else {
        return {
          content: '设置用户对本条站点数据的管理权限',
          title: '操作说明：'
        }
      }
    }
  },
  methods: {
    // 点击站点
    handleClick (data) {
      this.id = data.id
      this.siteTree.currentNodeKey = ''
      this.$nextTick(() => {
        this.siteTree.currentNodeKey = Number(data.id)
      })
    },
    // 获取树结构
    fetchSiteseList () {
      this.siteTree.loading = true
      this.$request.fetchSiteseList().then(res => {
        if (res.code === 200) {
          this.siteTree.data = res.data
        }
        this.siteTree.loading = false
      }).catch(() => {
        this.siteTree.loading = false
      })
    }
  },
  activated () {
    const { id } = this.$route.query
    if (id) {
      this.id = id
      this.siteTree.currentNodeKey = Number(id)
    }
  },
  mounted () {
    this.fetchSiteseList()
  }
}
</script>

<style lang="scss">

</style>
