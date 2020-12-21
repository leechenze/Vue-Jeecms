<template>
  <section class="security-index-container">
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleStart="handleHeaderStart"
      v-on:handleStop="handleHeaderStop"
      v-on:handleDelete="handleHeaderDelete"
    />
    <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
      @handleStatus="handleMemberStatus"
    ></base-table>
    <form-dialog
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      v-on:handleConfirm="handleConfirmAdd"
    >
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'
import { loginType } from '@/utils'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'vipMemberIndex',
  mixins: [baseHeader, baseTable, formDialog, searchHeader],
  data () {
    const columns = [
      {
        prop: 'username',
        label: '用户名',
        scopeType: 'link',
        href: '/vip/member/detail',
        minWidth: '80px'
      },
      {
        prop: 'email',
        label: '电子邮箱',
        minWidth: '80px'
      },
      {
        prop: 'userGroup.groupName',
        label: '所属会员组',
        minWidth: '80px'
      },
      {
        prop: 'userLevel.levelName',
        label: '会员等级',
        minWidth: '80px'
      },
      {
        prop: 'integral',
        label: '积分',
        minWidth: '80px'
      },
      {
        prop: 'sourceSite.name',
        label: '注册站点',
        minWidth: '80px'
      },
      {
        type: 'Status',
        scopeType: 'switch',
        prop: 'enabled',
        label: '状态',
        disabled: !this._checkPermission('/members/enable', 'POST') || !this._checkPermission('/members/disable', 'POST'),
        minWidth: '80px'
      }
    ]

    return {
      list: {
        columns,
        api: 'fetchMembersList',
        params: {
          senior: false,
          enabled: '',
          key: '',
          groupId: '',
          sourceSite: '',
          levelId: ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/members', 'DELETE')
          }
        ],
        handleColumnProp: {
          width: '75px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/members', 'POST')
          },
          {
            type: 'Start',
            text: '启用',
            icon: 'qiyong',
            disabled: !this._checkPermission('/members/enable', 'POST')
          },
          {
            type: 'Stop',
            text: '禁用',
            icon: 'jinyong',
            disabled: !this._checkPermission('/members/disable', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/members', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'sourceSite',
            label: '注册站点：',
            placeholder: '请选择注册站点',
            style: {
              width: '170px'
            },
            options: []
          },
          {
            type: 'select',
            value: 'enabled',
            label: '状态',
            style: {
              width: '105px'
            },
            placeholder: '请选择状态',
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '启用',
                value: true
              },
              {
                label: '禁用',
                value: false
              }
            ]
          },
          {
            type: 'select',
            value: 'groupId',
            label: '所属会员组：',
            style: {
              width: '120px'
            },
            placeholder: '请选择所属会员组',
            options: [],
            optionValue: 'id',
            optionLabel: 'groupName'
          },
          {
            type: 'select',
            value: 'levelId',
            label: '会员等级：',
            class: 'z-hidden-md-and-down',
            placeholder: '请选择会员等级',
            style: {
              width: '150px'
            },
            options: [],
            optionValue: 'id',
            optionLabel: 'levelName'
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入关键字',
            style: {
              width: '205px'
            }
          },
          {
            type: 'senior',
            value: 'senior',
            class: 'z-hidden-lg-and-up'
          }
        ]
      },
      addFormLoading: false,
      addForm: {
        status: true,
        integral: 0
      },
      addRules: {
        psword: [this.$rules.required()],
        username: [this.$rules.required(), this.$rules.cnEnNum()],
        email: [this.$rules.required(), this.$rules.email()],
        userGroup: [this.$rules.required()],
        userLevel: [this.$rules.required()],
        telephone: [this.$rules.required(), this.$rules.mobile()],
        psw: [this.$rules.required()],
        integral: [this.$rules.required()],
        realname: [this.$rules.required()],
        status: [this.$rules.required()]
      },
      addFormItems: [
        {
          prop: 'userImgId',
          label: '会员头像',
          type: 'imageUpload',
          urlProp: 'iconPath',
          option: {
            width: 160,
            height: 160
          }
        },
        {
          type: 'select',
          label: '所属会员组',
          prop: 'userGroup',
          optionValue: 'id',
          optionLabel: 'groupName',
          options: []
        },
        {
          label: '用户名',
          prop: 'username',
          maxlength: 50
        },
        {
          label: '密码',
          prop: 'psw',
          'show-password': true
        },
        {
          label: '重复密码',
          prop: 'psword',
          'show-password': true
        },
        {
          label: '电子邮箱',
          prop: 'email'
        },
        {
          label: '积分',
          prop: 'integral'
        },
        {
          type: 'switch',
          label: '会员状态',
          options: [
            {
              label: '启用',
              value: true
            },
            {
              label: '禁用',
              value: false
            }
          ],
          prop: 'status'
        },
        {
          label: '真实名字',
          prop: 'realname'
        },
        {
          label: '手机号',
          prop: 'telephone'
        },
        {
          type: 'radio',
          label: '性别',
          options: [
            {
              label: '男',
              value: 1
            },
            {
              label: '女',
              value: 2
            }
          ],
          prop: 'gender'
        },
        {
          type: 'textarea',
          label: '个性签名',
          height: '70px',
          prop: 'input_cxQXwC'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMembersDelete([row.id])
      })
    },
    // 表格状态操作按钮
    handleMemberStatus (row, index) {
      this.list.loading = true
      // console.log(row.enabled)
      if (row.enabled) {
        this.fetchMembersEnable([row.id])
      } else {
        this.fetchMembersDisable([row.id])
      }
    },
    // 顶部操作按钮启用
    handleHeaderStart () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量启用会员？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchMembersEnable(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 顶部操作按钮禁用
    handleHeaderStop () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量禁用会员？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchMembersDisable(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 顶部操作按钮新建
    handleHeaderCreate () {
      this.$routerLink('/vip/member/create')
      // this.$refs.addDialog.showDialog()
    },
    // 顶部操作按钮删除
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量删除会员？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchMembersDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 新增会员
    async handleConfirmAdd (data) {
      if (data.psw !== data.psword) {
        this.$message('密码和重复密码不相同！')
        return false
      }
      data.psw = await loginType(data.psw)
      data.json = {}
      data.json.input_cxQXwC = data.input_cxQXwC
      await this.$request.fetchMembersAdd(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('success')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 发送请求事件
    // 删除
    fetchMembersDelete (ids) {
      this.list.loading = true
      this.$request.fetchMembersDelete({ ids }).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 启用
    fetchMembersEnable (ids) {
      this.list.loading = true
      this.$request.fetchMembersEnable({ ids }).then(res => {
        if (res.code === 200) {
          this._messageSuccess('enabled')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 禁用
    fetchMembersDisable (ids) {
      this.list.loading = true
      this.$request.fetchMembersDisable({ ids }).then(res => {
        if (res.code === 200) {
          this._messageSuccess('disabled')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 会员组下拉列表
    fetchMembersGroupPull () {
      this.$request.fetchMembersGroupPull().then(res => {
        if (res.code === 200) {
          this.addFormItems.find(d => d.prop === 'userGroup').options = res.data
          this.searchHeader.searchItems.find(d => d.value === 'groupId').options = res.data
          this.searchHeader.searchItems.find(d => d.value === 'groupId').options.unshift({ groupName: '全部', id: '' })
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 会员等级下拉列表
    fetchMembersLevelList () {
      this.$request.fetchMembersLevelList().then(res => {
        if (res.code === 200) {
          this.searchHeader.searchItems.find(d => d.value === 'levelId').options = res.data
          this.searchHeader.searchItems.find(d => d.value === 'levelId').options.unshift({ levelName: '全部', id: '' })
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    }
  },
  mounted () {
    this.fetchMembersGroupPull()
    this.fetchMembersLevelList()
    this.FetchSitesOwnsite()
    this.searchHeader.searchItems.find(d => d.value === 'sourceSite').options = [
      {
        value: '',
        label: '所有'
      },
      ...this.ownSiteOptions
    ]
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '' } })
    }
  },
  watch: {
    'ownSiteOptions': function (newData) {
      this.searchHeader.searchItems.find(d => d.value === 'sourceSite').options = [
        {
          value: '',
          label: '所有'
        },
        ...newData
      ]
    }
  }
}
</script>

<style lang="scss">
.security-index-container{
    .el-button{
      margin-bottom: 0 !important;//删除操作说明新增样式
    }
}
</style>
