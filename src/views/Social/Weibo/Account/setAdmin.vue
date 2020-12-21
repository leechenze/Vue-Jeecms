<template>
  <section class="set-admin-index">
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
              ref='selectTable'
              v-bind="adminList"
              @handleSelectionChange="handleSelectionAdmin"
            >
            </base-table>
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
import { mapGetters, mapActions } from 'vuex'
const columns = [
  {
    prop: 'username',
    label: '用户名'
  },
  {
    prop: 'userExt.realname',
    label: '真实姓名'
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
      list: {
        columns,
        api: 'fetchSysUsersPage',
        showPaginationSimple: true,
        showPagination: false,
        params: {
          'enabled': true,
          'orgid': '',
          'roleid': '',
          'key': '',
          'userSecretId': '',
          'orgids': ['']
        },
        selecteds: [],
        filterParams: ['orgids']
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
        showIndex: false
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
            placeholder: '请选择',
            clearable: true,
            options: [],
            style: {
              width: '100px'
            }
          },
          {
            type: 'select',
            value: 'roleid',
            placeholder: '请选择',
            clearable: true,
            optionLabel: 'roleName',
            optionValue: 'id',
            options: [],
            style: {
              width: '100px'
            }
          },
          {
            type: 'searchInput',
            value: 'key',
            style: {
              width: '170px'
            },
            placeholder: '用户名/真实姓名'
          }
        ]
      },
      edit: {
        width: '1010px',
        labelWidth: '0px',
        title: '设置管理员',
        formLoading: false,
        form: {
          ids: []
        },
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
      }
    }
  },
  computed: {
    ...mapGetters(['organizeOptionsAll', 'roleOptions'])
  },
  mounted () {
    this.$nextTick(() => {
      if (this.organizeOptionsAll && this.organizeOptionsAll.length <= 0) {
        this.FetchOrganizeOptionsAll()
        this.FetchRoleOptions()
      }
    })
  },
  watch: {
    'adminList.data': function (newData) {
      if (newData instanceof Array && newData.length > 0) {
        setTimeout(() => {
          newData.forEach(row => {
            this.$refs.selectTable.$refs.baseTable.toggleRowSelection(row)
          })
        }, 100)
      }
    }
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptionsAll', 'FetchRoleOptions']),
    handleSearchs () {
      var arr = (this.list.params.orgids && this.list.params.orgids[0]) ? this.list.params.orgids : []
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
    },
    toLeftList (data) {
      var ids = data.map(v => { return v.id })
      var arr = this.adminList.data
      this.list.data = this.list.data.concat(data)
      this.adminList.data = arr.filter(v => ids.indexOf(v.id) < 0)
      this.tableFilter(this.adminList.data)
    },
    // 显示弹窗
    showTheDialog (data, btn, params, api) {
      if (api) {
        this.adminList.params = params
        this.adminList.api = api
        this.fetchAdminTableApi()
        this.$refs.setAdminDialog.showDialog()
      } else {
        this.$refs.setAdminDialog.showDialog()
        if (data instanceof Array) {
          this.adminList.data = data
          this.tableFilter(data)
        }
      }
      if (this.organizeOptionsAll instanceof Array && this.organizeOptionsAll.length <= 0) {
        this.FetchOrganizeOptionsAll(true)
        this.FetchRoleOptions()
      }
      let arr = [{ name: '全部', id: '' }]
      let arr2 = [{ roleName: '全部', id: '' }]
      this.searchHeader.searchItems.find(v => v.value === 'orgids').options = arr.concat(this.organizeOptionsAll)
      this.searchHeader.searchItems.find(v => v.value === 'roleid').options = arr2.concat(this.roleOptions)
    },
    handleConfirm (data) {
      var ids = this.adminList.data.map(v => { return v.id })
      if (ids.length > 0) {
        this.$emit('handleConfirm', { ids: ids, ...this.adminList.params })
      } else {
        this.$message('请选择用户')
      }
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
    fetchAdminTableCallBack (res) {
      if (res.code === 200) {
        if (res.data instanceof Array) {
          this.adminList.data = res.data.map((d, i) => {
            return d
          })
          this.tableFilter(res.data)
          let arr = [{ name: '全部', id: '' }]
          let arr2 = [{ roleName: '全部', id: '' }]
          this.searchHeader.searchItems.find(v => v.value === 'orgids').options = arr.concat(this.organizeOptionsAll)
          this.searchHeader.searchItems.find(v => v.value === 'roleid').options = arr2.concat(this.roleOptions)
        }
      }
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        if (res.data.content instanceof Array) {
          this.getData = res.data.content.map((d, i) => {
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
