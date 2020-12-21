<template>
  <section class="security-index-container">
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
      @handleStatus="handleModelStatus"
    >
    <template #cronName="scope">
      <el-link :underline="false" class="cron-name-link jee-color" type="primary"  @click="rowHref(scope.scope.row)"
        :disabled="!_checkPermission('/jobs', 'PUT')"
      >{{scope.scope.row.cronName}}</el-link>
    </template>
    </base-table>
    <form-dialog
      :title='title'
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      :buttons='buttons'
      @getTheNod='getTheNod'
      v-on:handleConfirm="handleConfirmAdd"
    >
      <template #execCycleType="scope">
        <el-radio-group v-model="scope.form.execCycleType" class="exec-cycle-type">
          <div class='execute-period'>
            <el-radio :label="1">每隔</el-radio>
            <el-input-number size='small' v-model="scope.form.intervalNum" :min="1" :max="99999999"></el-input-number>
            <el-select popper-class="jee-border"  size='small' v-model="scope.form.intervalType" placeholder="请选择"
              style="width:100px"
            >
              <el-option
                v-for="item in scope.item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="cron-expression">
            <el-radio :label="2">使用Cron表达式</el-radio>
            <el-input v-if="scope.form.execCycleType === 2" v-model="scope.form.cron" maxlength="50" placeholder="请输入cron表达式" size='small'>
              <el-button slot="append" class="jee-bg-light-important" size="small" @click="handleBuildCron">生成</el-button>
            </el-input>
          </div>
          <crontabDialog
            ref="crontabDialog"
            v-model="scope.form.cron"
          />
        </el-radio-group>
      </template>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'
import crontabDialog from '@/components/crontabDialog/Index'

export default {
  name: 'configTiming',
  mixins: [baseHeader, baseTable, formDialog, searchHeader],
  data () {
    var cronName = (rule, value, callback) => {
      if (value) {
        var params = {
          cronName: value,
          id: this.addForm.id
        }
        this.$request.fetchjobsUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('任务名称有重复'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    var cron = (rule, value, callback) => {
      if (value) {
        const val = value.split(' ')
        if (val.length !== 7) {
          callback(new Error('周期表达式不正确'))
        } else if (val[3] !== '?' && val[5] !== '?') {
          callback(new Error('日期与星期必须有一个为“不指定”'))
        } else {
          callback()
        }
      }
    }
    const columns = [
      {
        scopeType: 'slot',
        prop: 'cronName',
        label: '任务名称'
      },
      {
        prop: 'cronType',
        label: '任务类型',
        formatter: (row, column, cellValue, index) => {
          const options = [
            {
              label: '定时发布首页静态页',
              value: 1
            },
            {
              label: '定时发布栏目静态页',
              value: 2
            },
            {
              label: '定时发布内容静态页',
              value: 3
            },
            {
              label: '定时定时数据库备份',
              value: 4
            }
          ]
          const opt = options.find(d => d.value === cellValue)
          return opt ? opt.label : ''
        }
      },
      {
        prop: 'createUser',
        label: '创建人'
      },
      {
        prop: 'createTime',
        label: '创建时间',
        type: 'time'
      },
      {
        prop: 'status',
        label: '状态',
        scopeType: 'switch',
        type: 'Status',
        disabled: !this._checkPermission('/jobs/enabledJobs', 'POST') || !this._checkPermission('/jobs/disabledJobs', 'POST')
      }
    ]
    return {
      list: {
        columns,
        api: 'fetchjobsList',
        params: {},
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/jobs', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '75px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/jobs', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/jobs', 'DELETE')
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
            value: 'cronName',
            placeholder: '请输入任务名称'
          }
        ]
      },
      title: '新建',
      addFormLoading: false,
      addForm: {
        cronName: '',
        isAll: true,
        channelIds: [],
        startTime: '',
        status: true,
        remark: '',
        intervalType: 1,
        execCycleType: 1,
        intervalNum: 1,
        cronType: 1,
        cron: ''
      },
      addRules: {
        cronType: [this.$rules.required()],
        cron: [
          this.$rules.required(),
          { validator: cron, trigger: 'blur' }
        ],
        cronName: [this.$rules.required(), { validator: cronName, trigger: 'blur' }],
        startTime: [this.$rules.required()],
        execCycleType: [this.$rules.required()],
        status: [this.$rules.required()],
        channelIds: [this.$rules.requiredArray()]
      },
      addFormItems: [
        {
          prop: 'cronName',
          label: '定时任务名称',
          placeholder: '请输入任务名称',
          maxlength: 50
        },
        {
          type: 'select',
          label: '定时任务类型',
          prop: 'cronType',
          options: [
            {
              value: 1,
              label: '发布首页静态页'
            },
            {
              value: 2,
              label: '发布栏目静态页'
            },
            {
              value: 3,
              label: '发布内容静态页'
            },
            {
              value: 4,
              label: '定时数据库备份'
            }
          ]
        },
        {
          type: 'checkbox',
          prop: 'isAll',
          label: '选择栏目',
          class: 'z-checkbox-single',
          options: [
            {
              value: true,
              label: '所有栏目'
            }
          ],
          hiddenFunc: (item) => {
            if (item.cronType === 2 || item.cronType === 3) {
              return true
            } else {
              return false
            }
          }
        },
        {
          type: 'checkTree',
          prop: 'channelIds',
          labelWidth: '166px',
          tree: [],
          props: {
            label: 'name',
            value: 'id'
          },
          hiddenFunc: (item) => {
            if ((item.cronType === 2 || item.cronType === 3) && !item.isAll) {
              return true
            } else {
              return false
            }
          }
        },
        {
          type: 'timePicker',
          prop: 'startTime',
          label: '起始时间',
          placeholder: '选择时间',
          pickerOptions: {
            disabledDate (time) {
              return time.getTime() < Date.now() - 8.64e6
            }
          }
        },
        {
          type: 'slot',
          prop: 'execCycleType',
          label: '执行方式',
          options: [
            {
              value: 1,
              label: '分钟'
            },
            {
              value: 2,
              label: '小时'
            },
            {
              value: 3,
              label: '天'
            }
          ]
        },
        {
          type: 'switch',
          prop: 'status',
          label: '状态'
        },
        {
          type: 'textarea',
          prop: 'remark',
          label: '备注',
          height: '100px',
          maxlength: 85,
          showWordLimit: true,
          autosize: { minRows: 3, maxRows: 5 }
        }
      ],
      buttons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ]
    }
  },
  components: {
    crontabDialog
  },
  methods: {
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchjobsDelete([row.id])
      })
    },
    rowHref (row) {
      this.fetchjobsDetail(row)
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.addFormItems.find(d => d.prop === 'cronType').disabled = false
      this.title = '新建'
      this.addForm = {
        cronName: '',
        isAll: true,
        channelIds: [],
        startTime: '',
        status: true,
        remark: '',
        intervalType: 1,
        execCycleType: 1,
        intervalNum: 1,
        cronType: 1,
        cron: ''
      }
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量删除任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchjobsDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    getTheNod (data) {
      this.addForm.checkedKeys = data
    },
    // 改变状态
    handleModelStatus (row, index) {
      if (row.status) {
        this.fetchjobsEnabledJobs([row.id])
      } else {
        this.fetchjobsDisabledJobs([row.id])
      }
    },
    // 新建任务
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      this.list.loading = true
      data.channelIds = data.checkedKeys
      if (data.id) {
        this.$request.fetchjobsPut(data).then(res => {
          if (res.code === 200) {
            this._messageSuccess('update')
            this.fetchTableApi()
          }
          this.addFormLoading = false
          this.list.loading = false
        }).catch(() => {
          this.addFormLoading = false
          this.list.loading = false
        })
      } else {
        this.$request.fetchjobsAdd(data).then(res => {
          if (res.code === 200) {
            this._messageSuccess('create')
            this.fetchTableApi()
          }
          this.addFormLoading = false
          this.list.loading = false
        }).catch(() => {
          this.addFormLoading = false
          this.list.loading = false
        })
      }
    },
    // 请求
    // 详情
    fetchjobsDetail (row) {
      this.$request.fetchjobsDetail(row).then(res => {
        if (res.code === 200) {
          this.addForm = res.data
          this.title = '编辑'
          this.addFormItems.find(d => d.prop === 'cronType').disabled = true
          this.$refs.addDialog.showDialog()
        }
      })
    },
    // 启用
    fetchjobsEnabledJobs (ids) {
      this.$request.fetchjobsEnabledJobs({ ids }).then(res => {
        if (res.code === 200) {
          this._messageSuccess('handle')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 禁用
    fetchjobsDisabledJobs (ids) {
      this.$request.fetchjobsDisabledJobs({ ids }).then(res => {
        if (res.code === 200) {
          this._messageSuccess('handle')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 删除
    fetchjobsDelete (ids) {
      this.list.loading = true
      this.$request.fetchjobsDelete({ ids }).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    fetchChannelGetAllTree () {
      this.$request.fetchChannelGetAllTree().then(res => {
        if (res.code === 200) {
          this.addFormItems.find(d => d.prop === 'channelIds').tree = res.data
        }
      }).catch(() => {
      })
    },
    // 弹出周期设置
    handleBuildCron () {
      this.$refs.crontabDialog.showDialog()
    }
  },
  mounted () {
    this.fetchChannelGetAllTree()
  }
}
</script>

<style lang="scss">
.security-index-container{
  .exec-cycle-type{
    .execute-period{
      display: flex;
      align-items: center;
      .el-radio{
        margin-right: 0;
        .el-radio__label{
          color: #333333;
        }
      }
      .el-input-number{
        margin: 0 10px;
        width: 130px;
      }
      .el-select{
        width: 123px;
      }
    }
    .cron-expression{
      padding-top: 15px;
      .el-input{
        margin-top: 20px;
      }
      .el-radio{
        .el-radio__label{
          color: #333333;
        }
      }
    }
    .cron-name-link{
      .el-link--inner{
        font-size: 14px;
      }
    }
  }
  .el-button{
      margin-bottom: 0 !important;//删除操作说明新增样式
    }
}
</style>
