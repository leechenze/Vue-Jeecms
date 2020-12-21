<template>
  <section class="social-WeChat-applet-drafts">
    <el-button @click="redraw" class="top-btn" type="primary" size="small"
      :disabled="!_checkPermission('/miniprogramCode/synch/draft', 'GET')"
    ><jee-icon class="tongbu" iconClass="tongbu"></jee-icon>同步</el-button>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleAdd="handleTableAdd"
    >
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
          codeType: 1
        },
        handleColumn: [
          {
            type: 'Add',
            name: '添加到模板库',
            icon: 'tianjia',
            disabled: !this._checkPermission('/miniprogramCode/template', 'PUT')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '200'
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
    handleTableAdd (row) {
      this.$confirm('是否确定添加到模板库？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchWechatMiniprogramCodeTemplate(row.id)
      })
    },
    // 同步
    redraw () {
      this.$request.fetchWechatMiniprogramCodeSynchDraft().then(res => {
        if (res.code === 200) {
          this.$message({
            message: '同步成功',
            type: 'success'
          })
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 添加到模板库
    fetchWechatMiniprogramCodeTemplate (id) {
      this.list.loading = true
      this.$request.fetchWechatMiniprogramCodeTemplate({ id }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
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

<style lang="scss">
  .social-WeChat-applet-drafts{
    .top-btn{
      margin-bottom: 20px;
    }
    .tongbu{
      font-size: 14px;
      margin-right: 5px;
    }
  }
</style>
