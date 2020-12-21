<template>
  <section class="secret-to-secret-index">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
    />
    <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
    >
    </search-header>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <!-- <template #userExt="scope">
        <span class="table-secret-type" >{{scope.scope.row.userExt.realname || '--'}}</span>
      </template>
      <template #userExt="scope">
        <span class="table-secret-type" >{{scope.scope.row.userExt.linephone || '18501704326'}}</span>
      </template> -->
      <template #enabled="scope">
        <span class="table-secret-type" >{{scope.scope.row.enabled?'启用':'禁用'}}</span>
      </template>
      <template #userSecretId="scope">
        <el-select class="secret-item-select" @change="handSecretData(scope.scope.row)" v-model="scope.scope.row.userSecretId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </base-table>
    <!-- 批量弹窗 -->
    <el-dialog
      title="批量设置密级"
      :visible.sync="secretShow"
      width="483px"
      :before-close="handleClose">
      <div class="secret-dialog">
        <label class="secret-dialog-label">
          <span class="secret-dialog-title">*</span> 设置人员密级:
        </label>
        <el-select v-model="secretsList"  @change="handSecretDialogData" class="secret-dialog-select" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="secretShow = false">取 消</el-button>
        <el-button type="primary" @click="handSecretShowBut">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
const columns = [
  {
    prop: 'username',
    label: '用户名',
    maxWidth: '230px',
    minWidth: '100px'
  },
  {
    prop: 'realname',
    label: '真实姓名',
    maxWidth: '230px',
    minWidth: '80px'
  },
  {
    prop: 'orgName',
    label: '所属组织',
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'roleNames',
    label: '所属角色',
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'linephone',
    label: '座机号',
    maxWidth: '160px',
    minWidth: '120px'
  },
  {
    prop: 'telephone',
    label: '手机号',
    maxWidth: '160px',
    minWidth: '120px'
  },
  {
    prop: 'email',
    label: '电子邮箱',
    maxWidth: '160px',
    minWidth: '130px'
  },
  {
    prop: 'enabled',
    label: '状态',
    scopeType: 'slot',
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'createUser',
    label: '创建人',
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    maxWidth: '180px',
    minWidth: '160px'
  },
  {
    prop: 'userSecretId',
    label: '设置人员密级',
    scopeType: 'slot',
    maxWidth: '300px',
    minWidth: '180px'
  }
]
export default {
  name: 'to-secret',
  mixins: [searchHeader, baseTable, baseHeader],
  components: {
  },
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  watch: {
    'tabName': function (item) {
      if (item === this.navName) {
        this.list.api = this.urlApi
        this.fetchTableApi()
      }
    }
  },
  data () {
    return {
      secretShow: false,
      secretsList: '',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '密级一',
          value: 1
        },
        {
          label: '密级二',
          value: 2
        },
        {
          label: '密级三',
          value: 3
        }
      ],
      columns,
      urlApi: 'fetchUsersecretNosetpage',
      navName: 'toSecret',
      list: {
        showSelection: true,
        columns: [],
        showIndex: true,
        isIndexFixed: true,
        SerialNumber: 1, // 保存数据
        indexLabel: '序号',
        indexWidth: '60',
        api: 'fetchUsersecretNosetpage',
        params: {
          orgids: [''],
          key: '',
          orgid: '',
          roleid: '',
          enabled: '',
          userSecretId: ''
        },
        filterParams: ['region', 'times', 'orgids'],
        fields: [],
        tableProps: {
          maxHeight: 550
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '批量设置密级',
            icon: 'shezhiquzhi'
            // disabled: !this._checkPermission('/resource', 'POST')
          }
        ],
        showAlertIcon: false
      },
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
            // style: {
            //   width: '163px'
            // },
            label: '所属组织：',
            placeholder: '请选择',
            options: []
          },
          {
            type: 'select',
            value: 'roleid',
            label: '所属角色：',
            optionLabel: 'roleName',
            optionValue: 'id',
            options: []
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入关键字'
          }
        ]
      },
      allOption: [
        {
          label: '所有',
          value: ''
        }
      ],
      arrOption: [
        {
          name: '所有',
          id: ''
        }
      ]
    }
  },
  methods: {
    handSecretDialogData (data) {
      this.list.params.userSecretId = data
    },
    // 批量操作确定按钮
    handSecretShowBut (data) {
      if (!this.list.params.userSecretId) {
        this.$message('请选择人员密级')
        return
      }
      this.$request.fetchUserSecretIds({ userSecretId: this.list.params.userSecretId, users: this.list.selectedKeys }).then(res => {
        if (res.code === 200) {
          this.list.params.userSecretId = ''
          this.secretShow = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      })
    },
    // 选择密级
    handSecretData (data) {
      let arr = []
      arr.push(data.id)
      this.$request.fetchUserSecretIds({ userSecretId: data.userSecretId, users: arr }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      })
    },
    // 显示批量操作的弹窗
    handleHeaderCreate () {
      if (this.list.selectedKeys.length === 0) {
        this.$message('请选择一条数据')
      } else {
        this.secretsList = ''
        this.secretShow = true
      }
    },
    handleSearchs (data) {
      if (data instanceof Array) {
        this.list.params.orgid = data[data.length - 1]
      }
      this.fetchTableApi()
    },
    // 站点查看详情
    bandSiteData (item) {
    },
    // 弹窗关闭
    handleClose () {
      this.secretShow = false
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          d.linephone = d.userExt.linephone || ''
          d.realname = d.userExt.realname || ''
          if (!d.userSecret) {
            d.userSecretId = ''
            d.userSecretname = ''
          } else {
            d.userSecretId = d.userSecret.id
            d.userSecretname = d.userSecret.name
          }
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    fetchUserSecretsList () {
      this.$request.fetchUserSecretsList().then(res => {
        if (res.code === 200) {
          this.options = res.data
        }
      })
    },
    fetchOrganizeList () {
      this.$request.fetchOrganizeList({ 'isVirtual': '', 'key': '', 'parentId': '' }).then(res => {
        if (res.code === 200) {
          res.data.map((d, i) => {
            // d.label = d.name
            // d.value = d.id
            this.searchHeader.searchItems.find(d => d.value === 'orgids').options = this.arrOption.concat(d)
            return d
          })
        }
      })
    },
    fetchRolesList () {
      this.$request.fetchRolesList().then(res => {
        if (res.code === 200) {
          let arr = [
            {
              roleName: '所有',
              id: ''
            }
          ]
          this.searchHeader.searchItems.find(d => d.value === 'roleid').options = arr.concat(res.data)
        }
      })
    }
  },
  activated () {
  },
  mounted () {
    this.fetchUserSecretsList()
    this.fetchOrganizeList()
    this.fetchRolesList()
    this.$nextTick(() => {
      this.list.columns = this.columns
    })
  }
}
</script>
<style lang="scss">
  .secret-to-secret-index{
    .secret-dialog{
      display: flex;
      align-items: center;
      .secret-dialog-label{
        color: #666666;
        .secret-dialog-title{
          color: #FF0000;
        }
      }
      .secret-dialog-select{
        flex: 8;
        margin-left: 20px;
        .el-input{
          .el-input__inner{
            height: 32px;
            line-height: 32px;
          }
          .el-input__icon{
            line-height: 32px;
          }
        }
      }

    }
    .secret-item-select{
      .el-input{
        .el-input__inner{
          height: 32px;
          line-height: 32px;
        }
        .el-input__icon{
          line-height: 32px;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .secret-to-secret-index{
    .secret-dialog-title{

    }
  }
</style>
