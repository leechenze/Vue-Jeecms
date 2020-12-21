<template>
  <section class="set-admin-index" v-loading="loading">
    <form-dialog
      ref="setAdminDialog"
      v-bind="edit"
      v-on:handleConfirm="handleConfirm"
    >
      <template #ids="scope">
        <div class="sa-wrap">
          <div class="sa-left">

              <search-header
      class="search-header"
              v-bind="searchHeader"
              :params="list.params"
              @handleSearch="handleSearchs"
            ></search-header>
            <base-table
              v-bind="list"
              @handleSelectionChange="handleSelectionChange"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            >
            </base-table>
          </div>
          <div class="sa-handle">
              <el-button size="mini"
                @click="toLeftList(adminList.selecteds)"
                :disabled="adminList.selectedKeys.length===0"
                 type="primary" icon="el-icon-arrow-left" circle></el-button>
              <el-button size="mini"
                @click="toRightList(list.selecteds)"
                :disabled="list.selectedKeys.length===0"
                type="primary" icon="el-icon-arrow-right" circle></el-button>
          </div>
          <div class="sa-right">
            <label class="label">已选用户：</label>
            <base-table
              v-bind="adminList"
              ref='rightTable'
              @handleSelectionChange="handleSelectionAdmin"
            >
            </base-table>
            <div class='footer-buttons'>
              <el-button plain size='small' @click='handleCancel'>取消</el-button>
              <el-button type='primary' size='small' @click="onConfirm">确认</el-button>
            </div>
          </div>
        </div>
      </template>
    </form-dialog>
  </section>
</template>

<script>
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
const columns = [
  {
    prop: 'username',
    label: '用户名'
  },
  {
    prop: 'userExt.realname',
    label: '真实姓名',
    showOverflowTooltip: true
  },
  {
    prop: 'orgName',
    label: '所属组织'
  },
  {
    prop: 'roleNames',
    label: '所属角色',
    minWidth: '120px'
  }
]
export default {
  name: 'set-admin',
  mixins: [formDialog, searchHeader, baseTable],
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'desc'
        }
      }
    }
  },
  data () {
    return {
      ids: [],
      loading: false,
      list: {
        columns,
        api: 'fetchUsersSafeManagePage',
        showPaginationSimple: true,
        showPagination: false,
        params: {
          'orgid': '',
          'roleid': '',
          'key': '',
          'orgids': ''
        },
        selecteds: [],
        filterParams: ['orgids'],
        tableProps: {
          height: '408px'
        }
      },
      adminList: {
        loading: false,
        columns,
        api: '',
        showPagination: false,
        params: {},
        selectedKeys: [],
        selecteds: [],
        data: [],
        showIndex: false,
        tableProps: {
          height: '408px'
        }
      },
      getData: [], // 总列表数据
      searchHeader: {
        searchItems: [
          {
            type: 'cascader',
            value: 'orgids',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            placeholder: '所属组织',
            options: [],
            style: {
              width: '140px'
            },
            clearable: true
          },
          {
            type: 'select',
            value: 'roleid',
            placeholder: '所属角色',
            optionLabel: 'roleName',
            optionValue: 'id',
            options: [],
            style: {
              width: '140px'
            },
            clearable: true
          },
          {
            type: 'searchInput',
            value: 'key',
            style: {
              width: '196px',
              minWidth: '196px'
            },
            placeholder: '用户名/真实姓名'
          }
        ]
      },
      edit: {
        width: '1190px',
        labelWidth: '0px',
        title: '选择用户',
        showFoot: false,
        formLoading: false,
        form: {
          ids: []
        },
        rules: {},
        buttons: [
          {
            text: '确认',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            type: 'slot',
            prop: 'ids'
          }
        ]
      },
      name: ''
    }
  },
  methods: {
    handleSearchs () {
      var arr = this.list.params.orgids
      if (arr instanceof Array && arr.length > 0) {
        this.list.params.orgid = arr[arr.length - 1]
      } else {
        this.list.params.orgid = ''
      }
      this.fetchTableApi()
    },
    // 穿梭框逻辑
    handleSelectionAdmin (data) {
      this.handleSelectionChange(data, 'adminList')
    },
    handleSelectionChange (data, name = 'list') {
      var ids = data.map(v => v[this[name].rowKey])
      this[name].selectedKeys = ids
      this[name].selecteds = data
    },
    // 向左向右移动
    toRightList (data) {
      // var arr = []
      this.adminList.data = this.adminList.data.concat(data)
      this.tableFilter(this.adminList.data)
      this.$nextTick(() => {
        if (data instanceof Array && data.length) {
          data.forEach(row => {
            this.$refs.rightTable.$refs.baseTable.toggleRowSelection(row)
          })
        }
      })
    },
    toLeftList (data) {
      var ids = data.map(v => { return v.id })
      var arr = this.adminList.data
      this.list.data = this.list.data.concat(data)
      this.adminList.data = arr.filter(v => ids.indexOf(v.id) < 0)
      this.tableFilter(this.adminList.data)
    },
    // 显示弹窗
    showTheDialog (data, ids, name) {
      this.ids = ids || []
      this.name = name
      this.adminList.data = data || []
      this.fetchOrganizeList()
      this.fetchRolesList()
      this.fetchTableApi()
      this.$refs.setAdminDialog.showDialog()
    },
    handleCancel () {
      this.$refs.setAdminDialog.handleCancel()
    },
    onConfirm () {
      if (this.name === 'safeAdmins') {
        var ids = this.adminList.data.map(v => v.id)
        if (ids.length === 0) {
          this.$message('请至少选择一位管理员！')
          return
        }
        let params = {
          safeUserIds: ids
        }
        this.loading = true
        this.$request.fetchSafeManageCheckUser(params).then(res => {
          if (res.code === 200) {
            this.$refs.setAdminDialog.handleConfirm({
              type: 'Submit'
            })
          }
          this.loading = false
        })
      } else {
        this.$refs.setAdminDialog.handleConfirm({
          type: 'Submit'
        })
      }
    },
    handleConfirm (data) {
      var ids = this.adminList.data.map(v => v.id)
      var names = this.adminList.data.map(v => v.username).join(',')
      this.$emit('handleConfirm', { ids: ids, names: names, name: this.name, arr: this.adminList.data })
    },
    // api接口请求
    fetchAdminTableApi () {
      this.adminList.loading = true
      if (this.adminList.api) {
        try {
          let data = {
            page: this.adminList.pageNo,
            size: this.adminList.pageSize,
            ...this.adminList.params
          }
          this.adminList.selectedKeys = []
          return this.$request[this.adminList.api](this.handleFilterParams(data, 'adminList'))
            .then(this.fetchAdminTableCallBack)
            .then(this.hideAdminTableLoading)
            .catch(this.hideAdminTableLoading)
        } catch (error) {
          console.log(error)
          this.adminList.loading = false
        }
      } else {
        return new Promise((resolve, reject) => {
          this.adminList.loading = false
          resolve()
        }).catch(this.hideAdminTableLoading)
      }
    },
    hideAdminTableLoading () {
      this.adminList.loading = false
    },
    fetchOrganizeList () {
      this.$request.fetchOrganizeList({ 'isVirtual': '', 'key': '', 'parentId': '' }).then(res => {
        if (res.code === 200) {
          this.searchHeader.searchItems[0].options = res.data
        }
      })
    },
    fetchRolesList () {
      this.$request.fetchRolesList().then(res => {
        if (res.code === 200) {
          this.searchHeader.searchItems[1].options = res.data
        }
      })
    },
    // 表格显示用户
    tableFilter (data) {
      if (data instanceof Array) {
        var ids = data.map((d, i) => {
          return d.id
        })
        this.list.data = this.getData.filter(v => ids.indexOf(v.id) < 0)
      }
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        if (res.data.content instanceof Array) {
          this.getData = res.data.content.map((d, i) => {
            // if (this.ids.indexOf(d.id) > -1) {
            //   this.adminList.data.push(d)
            // }
            d.disabled = !d.enabled
            return d
          })
          this.tableFilter(this.adminList.data)
          this.list.totalCount = res.data.totalElements
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .set-admin-index{
    .el-table{
      min-height: 396px;
    }
    .sa-wrap{
      display: flex;
      .sa-left,.sa-right{
        width: 517px;
        .label{
          color: #333333;
          font-size:14px;
          padding: 25px 0 20px;
          display: block;
          line-height: 1;
        }
        .search-header{
          .el-row{
            padding: 7px 0 0 ;
            background-color: #fff;
            .search-item-wrap{
              margin-left: 0;
            }
            .search-item-wrap + .search-item-wrap{
              margin-left: 20px;
            }
          }
        }
        .footer-buttons{
          display: flex;
          justify-content: flex-end;
          padding-top: 30px;
        }
      }
      .sa-handle{
        width: 86px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .el-button{
          margin: 12px 0;
        }
      }
    }
    .el-dialog__body{
      margin-bottom: 0 !important;
    }
  }
</style>
