<template>
  <section class="vip-grade-container">
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
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
    >
    <template #levelName="scope">
      <el-link :underline="false" :disable="!_checkPermission('/memberLevel', 'GET')" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.levelName}}</el-link>
    </template>
    </base-table>
    <form-dialog
      :title="dialogVip"
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      :buttons="addbuttons"
      v-on:handleConfirm="handleConfirmAdd">
    <template #integralMin="scope">
      <div class="integral">
        <el-input v-model="addForm.integralMin" maxlength="11" placeholder="请输入最小值">
        </el-input>-<el-input v-model="addForm.integralMax" maxlength="11" placeholder="请输入最大值"  @keyup.native="number"></el-input>
      </div>
    </template>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'
import { mapActions } from 'vuex'
const columns = [
  {
    prop: 'levelName',
    label: '等级名',
    scopeType: 'slot'
  },
  {
    prop: 'logoResource.url',
    scopeType: 'img',
    label: '等级图标'
  },
  {
    prop: 'integral',
    label: '所需积分'
  },
  {
    prop: 'remark',
    label: '描述',
    showOverflowTooltip: true,
    width: '300px'
  }
]

export default {
  name: 'vipGrade',
  mixins: [baseHeader, baseTable, formDialog, searchHeader],
  data () {
    var numberMax = (rule, value, callback) => {
      if (this.addForm.integralMax) {
        var num = (this.addForm.integralMax - value)
        if (num < 0) {
          callback(new Error('最大值不能小于最小值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      list: {
        columns,
        api: 'fetchMemberLevelList',
        params: {},
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/memberLevel', 'DELETE')
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
            disabled: !this._checkPermission('/memberLevel', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/memberLevel', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'levelName',
            placeholder: '请输入等级名'
          }
        ]
      },
      addFormLoading: false,
      addForm: {
        id: '',
        integralMax: 0,
        levelName: '',
        integralMin: 0,
        levelIcon: '',
        logoResourceUrl: ''
      },
      addRules: {
        integralMin: [this.$rules.required(), this.$rules.rangeNum(0, 32767), this.$rules.number(), { validator: numberMax, trigger: 'blur' }],
        levelName: [this.$rules.required()]
      },
      addFormItems: [
        {
          prop: 'levelName',
          label: '等级名',
          placeholder: '请输入会员等级名',
          maxlength: 15
        },
        {
          type: 'imageUpload',
          prop: 'levelIcon',
          label: '图标',
          urlProp: 'logoResourceUrl'
        },
        {
          type: 'slot',
          prop: 'integralMin',
          label: '所需积分',
          explain: '请输入大于0的整数'
        },
        {
          type: 'textarea',
          prop: 'remark',
          label: '备注',
          height: '80px',
          maxlength: 50
        }
      ],
      dialogVip: '新建会员等级'
    }
  },
  computed: {
    addbuttons () {
      return [
        {
          text: '保存',
          type: 'Submit',
          disabled: !this._checkPermission('/memberLevel', this.addForm.id ? 'POST' : 'PUT')
        }
      ]
    }
  },
  methods: {
    ...mapActions('vip', ['FetchMembersLevelOptions']),
    number () {
      // eslint-disable-next-line no-useless-escape
      this.addForm.integralMax = this.addForm.integralMax.replace(/[^\.\d]/g, '')
      this.addForm.integralMax = this.addForm.integralMax.replace('.', '')
    },
    rowHref (row) {
      this.$request.fetchMemberLevelDetail(row).then(res => {
        if (res.code === 200) {
          this.addForm = res.data
          if (res.data.logoResource) this.addForm.logoResourceUrl = res.data.logoResource.url
          this.dialogVip = '会员等级详情'
          this.$refs.addDialog.showDialog()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMemberLevelDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.dialogVip = '新建会员等级'
      this.addForm = {
        id: '',
        integralMax: 0,
        levelName: '',
        integralMin: 0,
        levelIcon: '',
        logoResourceUrl: ''
      }
      this.$nextTick(() => {
        this.$refs.addDialog.showDialog()
        this.$refs.addDialog.$refs.form.clearValidate()
      })
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量会员等级？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchMemberLevelDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 新建保存
    handleConfirmAdd (data) {
      if (data.id) {
        this.fetchMemberLevelPut(data)
      } else {
        this.fetchMemberLevelAdd(data)
      }
    },
    // 修改访问
    fetchMemberLevelPut (data) {
      delete data.logoResourceUrl
      delete data.logoResource
      this.$request.fetchMemberLevelPut(data).then(res => {
        if (res.code === 200) {
          this.FetchMembersLevelOptions(true)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 新建访问
    fetchMemberLevelAdd (data) {
      delete data.logoResourceUrl
      delete data.logoResource
      this.$request.fetchMemberLevelAdd(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.FetchMembersLevelOptions(true)
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 发送请求事件
    fetchMemberLevelDelete (ids) {
      this.list.loading = true
      this.$request.fetchMemberLevelDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.FetchMembersLevelOptions(true)
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        for (var i = 0; i < this.list.data.length; i++) {
          this.list.data[i].integral = ''
          this.list.data[i].integral += this.list.data[i].integralMin
          this.list.data[i].integral += '-'
          this.list.data[i].integral += this.list.data[i].integralMax
        }
        this.list.totalCount = res.data.totalElements
      }
    }
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '' } })
    }
  }
}
</script>

<style lang="scss">
  .vip-grade-container{
    .integral{
      display: flex;
      justify-content: space-between;
      padding-right: 75px;
      .el-input{
        width: 140px;
      }
    }
    .el-button{
      margin-bottom: 0 !important;//删除操作说明新增样式
    }
  }
</style>
