<template>
  <section class="log-system-index-container">
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
    />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
      @handleBtnSearch='handleEventBtnSearch'
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleRecover="handleTableRecover"
    >
    <template #backupName="scope">
      <p class="jee-color" @click="logDetail(scope.scope.row)"><span>{{scope.scope.row.backupName}}</span></p>
    </template>
    </base-table>
    <form-dialog
      title="新增备份"
      ref="addLogDialog"
      :loading="addFormLoading"
      :formItems="addLogFormItems"
      :form="addLogForm"
      :rules="addLogRules"
      :buttons="addLogButtons"
      v-on:handleConfirm="handleConfirmAdd">
    </form-dialog>
    <form-dialog
      title="备份详情"
      ref="logDialog"
      :formItems="logFormItems"
      :form="logForm"
      :buttons="logButtons">
    </form-dialog>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import searchHeader from '@/components/mixins/searchHeader'
import formDialog from '@/components/mixins/formDialog'

const columns = [
  {
    prop: 'backupName',
    label: '备份名称',
    scopeType: 'slot',
    minWidth: '200px'
  },
  {
    scopeType: 'time',
    prop: 'startTime',
    label: '备份数据开始时间',
    minWidth: '150px'
  },
  {
    scopeType: 'time',
    prop: 'endTime',
    label: '备份数据结束时间',
    minWidth: '150px'
  },
  {
    prop: 'remark',
    label: '备注',
    showOverflowTooltip: true
  },
  {
    scopeType: 'time',
    prop: 'createTime',
    label: '备份时间',
    minWidth: '150px'
  }
]
export default {
  name: 'logBackups',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    return {
      list: {
        columns,
        api: 'fetchLogBackupsPage',
        params: {
          logCategory: 1
        },
        handleColumn: [
          {
            type: 'Recover',
            name: '恢复',
            icon: 'ic_restore_page_px',
            disabled: !this._checkPermission('/logBackups/restore', 'GET')
          }
        ],
        handleColumnProp: {
          label: '操作选项'
        },
        showSelection: false
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新增备份',
            icon: 'xinjian',
            disabled: !this._checkPermission('/logBackups/save', 'POST')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'backupName',
            label: '备份名称：',
            placeholder: '请输入备份名称'
          },
          {
            type: 'dataPicker',
            value: 'time1',
            label: '备份数据时间',
            rangeText: '-'
          },
          {
            type: 'dataPicker',
            value: 'time2',
            label: '备份时间',
            rangeText: '-'
          },
          {
            btnType: 'Search',
            type: 'henderBorderBtn',
            text: '搜索',
            icon: 'xiazai15'
          }
        ]
      },
      logFormItems: [
        {
          type: 'text',
          label: '备份名称',
          prop: 'backupName'
        },
        {
          type: 'text',
          label: '备份数据起始时间',
          prop: 'startTime'
        },
        {
          type: 'text',
          label: '备份数据结束时间',
          prop: 'endTime'
        },
        {
          type: 'text',
          label: '备份数据量',
          prop: 'dataCount'
        },
        {
          type: 'text',
          label: '备份时间',
          prop: 'createTime'
        },
        {
          type: 'text',
          label: '备注',
          prop: 'remark'
        }
      ],
      logForm: {},
      logButtons: [],
      addFormLoading: false,
      addLogForm: {},
      addLogRules: {
        backupName: [this.$rules.required()],
        Time: [this.$rules.required()]
      },
      addLogFormItems: [
        {
          label: '备份名称',
          prop: 'backupName',
          placeholder: '请输入备份名称',
          maxlength: 50
        },
        {
          type: 'timePicker',
          timeType: 'datetimerange',
          label: '备份数据起始时间',
          prop: 'Time',
          pickerOptions: {
            disabledDate (time) {
              return time.getTime() > Date.now() - 8.64e5
            }
          }
        },
        {
          type: 'textarea',
          autosize: { minRows: 3 },
          label: '备注',
          prop: 'remark',
          maxlength: 500
        }
      ],
      addLogButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ]
    }
  },
  components: {
  },
  methods: {
    // 搜索
    handleSearchs () {
      var params = this.list.params
      if (params.time1) {
        params.startTime = params.time1[0]
        params.endTime = params.time1[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      if (params.time2) {
        params.beginDate = params.time2[0]
        params.endDate = params.time2[1]
      } else {
        params.beginDate = ''
        params.endDate = ''
      }
      this.list.params = params
      this.fetchTableApi()
    },
    // 打开备注详情
    logDetail (row) {
      this.$request.fetchLogBackups(row).then(res => {
        if (res.code === 200) {
          this.logForm = res.data
          this.$refs.logDialog.showDialog()
        }
      })
    },
    // 新建备份
    handleHeaderCreate () {
      this.addLogForm = {}
      this.$refs.addLogDialog.showDialog()
    },
    // 新建确认
    handleConfirmAdd (data) {
      data.startTime = data.Time[0]
      data.endTime = data.Time[1]
      this.$request.fetchLogBackupsSave(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加备份成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      })
    },
    handleTableRecover (data) {
      this.$confirm('恢复操作将备份文件中的数据导入到数据库中，如数据库已存在相同记录，将自动跳过，请是否确认继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchLogBackupsRestore({ id: data.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '恢复备份成功',
              type: 'success'
            })
            this.fetchTableApi()
          }
        })
      })
    },
    handleEventBtnSearch () {
      this.handleSearchs()
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
