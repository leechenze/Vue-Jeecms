<template>
  <section class="system-backup-index-container">
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
      v-on:handleDownload="handleTableDownload"
      v-on:handleRecover="handleTableRecover"
    ></base-table>
    <form-dialog
      title="数据备份"
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      v-on:handleConfirm="handleConfirmAdd"
      :buttons="addButtons"
    >
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'

const columns = [
  {
    prop: 'filename',
    label: '文件名'
  },
  {
    prop: 'humanFileSize',
    label: '大小'
  },
  {
    prop: 'createTime',
    label: '备份时间'
  },
  {
    prop: 'remark',
    label: '备注'
  }
]
export default {
  name: 'backup',
  mixins: [baseHeader, baseTable, formDialog],
  data () {
    return {
      list: {
        columns,
        api: 'fetchSystemDatabaseBackupPage',
        params: {},
        showSelection: false,
        showIndex: true,
        handleColumn: [
          {
            type: 'Download',
            name: '下载',
            icon: 'wenjianxiazai'
          },
          {
            type: 'Recover',
            name: '恢复',
            icon: 'ic_restore_page_px'
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete'
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '300'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '数据备份',
            icon: 'beifenmian'
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '数据备份支持mysql、sqlserver、oracle三种数据库'
      },
      addFormLoading: false,
      addForm: {
      },
      addRules: {
      },
      addFormItems: [
        {
          type: 'textarea',
          prop: 'remark',
          label: '备注',
          placeholder: '请输入备份信息',
          autosize: { minRows: 4 },
          maxlength: 255
        }
      ],
      addButtons: [{
        text: '保存',
        type: 'Submit'
      }]
    }
  },
  methods: {
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleConfirmAdd (data) {
      this.$request.fetchSystemDatabaseBackupNew(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '备份成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      })
    },
    handleTableDelete (data) {
      this.$confirm('是否确定删除备份？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchSystemDatabaseBackupDelete(data).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchTableApi()
          }
        })
      })
    },
    handleTableDownload (data) {
      this.$confirm('是否确定下载备份？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchSystemDatabaseBackupDownload(data).then(res => {
          this.$exportClick(res, '数据备份.jcbak')
        })
      })
    },
    handleTableRecover (data) {
      this.$confirm('是否确定还原备份？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchSystemDatabaseBackupRecovery(data).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '还原成功',
              type: 'success'
            })
            this.fetchTableApi()
          }
        })
      })
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
