<template>
  <section class="social-WeChat-applet-template">
    <el-button @click="redraw" class="top-btn" type="primary" size="small"
      :disabled="!_checkPermission('/miniprogramCode/synch/template', 'GET')"
    ><jee-icon class="tongbu" iconClass="tongbu"></jee-icon>同步</el-button>
      <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
      v-on:handleAdd="handleTableAdd"
    >
    <template #codeDesc="scope">
      <span v-text="scope.scope.row.codeDesc"></span><span class="green" v-if="scope.scope.row.isNew">最新</span>
    </template>
    </base-table>
  </section>
</template>

<script>
import baseTable from '@/components/mixins/baseTable'
export default {
  mixins: [baseTable],
  data () {
    return {
      list: {
        showSelection: false,
        showIndex: false,
        columns: [
          {
            prop: 'id',
            label: 'ID',
            minWidth: '175px'
          },
          {
            prop: 'codeVersion',
            label: '版本号',
            minWidth: '175px'
          },
          {
            scopeType: 'slot',
            prop: 'codeDesc',
            label: '描述',
            minWidth: '200px'
          },
          {
            scopeType: 'time',
            prop: 'submitTimeStr',
            label: '最近提交时间',
            minWidth: '175px'
          }
        ],
        api: 'fetchWechatMiniprogramCodePage',
        params: {
          codeType: 2
        },
        handleColumn: [
          {
            type: 'Add',
            name: '设置为最新版本',
            icon: 'shezhishedingpeizhibanshou',
            disabled: !this._checkPermission('/miniprogramCode/template/status', 'PUT')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/miniprogramCode/template', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '220'
        }
      }
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    name (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchTableApi()
      }
    }
  },
  methods: {
    // 同步
    redraw () {
      this.$request.fetchWechatMiniprogramCodeSynchTemplate().then(res => {
        if (res.code === 200) {
          this.$message({
            message: '同步成功',
            type: 'success'
          })
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    handleTableAdd (row) {
      this.$confirm('是否确定设置为最新版本？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchWechatMiniprogramCodeTemplateStatus(row.id)
      })
    },
    handleTableDelete (row) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchWechatMiniprogramCodeTemplateDelete(row.id)
      })
    },
    fetchWechatMiniprogramCodeTemplateDelete (id) {
      this.list.loading = true
      this.$request.fetchWechatMiniprogramCodeTemplateDelete({ id }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchWechatMiniprogramCodeTemplateStatus (id) {
      this.list.loading = true
      this.$request.fetchWechatMiniprogramCodeTemplateStatus({ id }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        for (var i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].isNew) {
            res.data.content[i].disabled = true
          }
        }
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>

<style lang="scss">
  .social-WeChat-applet-template{
    .top-btn{
      margin-bottom: 20px;
    }
    .tongbu{
      font-size: 14px;
      margin-right: 5px;
    }
    .green{
      display: inline-block;
      font-size: 12px;
      line-height: 20px;
      margin-left: 10px;
      width:40px;
      height:20px;
      background:#d0f2db;
      color: #1CC04E;
      text-align: center;
      border-radius:2px;
    }
  }
</style>
