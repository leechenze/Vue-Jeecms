<template>
  <section class='to-deal-table-container'>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <!-- 标题 -->
      <template #title="scope">
        <span>[{{scope.scope.row.channelName}}]</span>
         <!-- @click="handleClickDetail(scope.scope.row)" 修改 -->
        <span class="jee-color" :title="scope.scope.row.title">{{scope.scope.row.title}}</span>
      </template>
      <!-- 动作 -->
      <template #lastActionName="scope">
        <span :class="scope.scope.row.lastActionCode">{{scope.scope.row.lastActionName}}</span>
      </template>
      <!-- 操作 -->
      <template #handle="scope">
        <el-link
          :underline='false'
          @click="handleClickPreview(scope.scope.row.previewUrl)"
        >预览</el-link>
        <template v-for="(item, index) in scope.scope.row.actions">
          <el-link
            :key="index"
            :underline='false'
            :disabled="!_checkPermission('/task/audit', 'GET')"
            @click="handleClickAction(item, scope.scope.row.contentId)"
          >{{item.name}}</el-link>
        </template>
      </template>
      <!-- 操作撤回 -->
      <template #handle2="scope">
        <el-link
          :underline='false'
          @click="handleClickPreview(scope.scope.row.previewUrl)"
        >预览</el-link>
        <el-link
          v-if="scope.scope.row.allowRevoke"
          :underline='false'
          :disabled="!_checkPermission('/task/revoke', 'GET')"
          @click="handleClickRevoke(scope.scope.row)"
        >撤回</el-link>
      </template>
    </base-table>
    <form-dialog
      ref="addDialog"
      :title='actionName'
      :loading="addFormLoading"
      :form="addForm"
      :formItems="addFormItems"
      :buttons="addFormButton"
      @handleConfirm="handleConfirmAdd"
    ></form-dialog>
  </section>
</template>
<script>
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'

export default {
  name: 'ToDealTable',
  mixins: [baseTable, formDialog],
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      list: {
        api: 'fetchTaskToDeal',
        params: this.params,
        columns: [
          {
            scopeType: 'slot',
            label: '标题',
            prop: 'title'
          },
          {
            scopeType: 'slot',
            label: '上次动作',
            prop: 'lastActionName'
          },
          {
            label: '操作人',
            prop: 'lastActionUsers',
            formatter: (row, column, cellValue, index) => {
              return cellValue instanceof Array ? cellValue.join(' ') : cellValue
            }
          },
          {
            label: '流转剩余时间',
            prop: 'displayRemainTime'
          },
          {
            scopeType: 'slot',
            label: '操作选项',
            prop: 'handle'
          }
        ],
        showIndex: true,
        showSelection: false
      },
      contentId: '',
      actionId: '',
      actionName: '',
      addFormLoading: false,
      addForm: {
        reason: ''
      },
      addFormItems: [
        {
          prop: 'reason',
          label: '意见',
          type: 'textarea',
          placeholder: '请输入您的意见',
          maxlength: 300,
          height: 'auto',
          autosize: { minRows: 4 },
          'show-word-limit': true
        }
      ],
      addFormButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ]
    }
  },
  watch: {
    params: {
      handler (val) {
        this.list.params = val
      },
      deep: true
    }
  },
  methods: {
    // 表格数据
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 跳转详情
    handleClickDetail (row) {
      if (row.contentId) this.$router.push({ name: 'contentDetail', query: { id: row.contentId } })
    },
    // 操作选项
    handleClickAction (item, contentId) {
      this.contentId = contentId
      this.actionId = item.id
      this.actionName = item.name
      this.$refs.addDialog.showDialog()
    },
    // 预览
    handleClickPreview (url) {
      if (url.startsWith('http')) window.open(url)
    },
    // 提交意见
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      const params = {
        ...data,
        actionId: this.actionId,
        contentId: this.contentId
      }
      this.$request.fetchTaskAudit(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('handle')
          this.fetchTableApi()
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 撤回
    handleClickRevoke (row) {
      this.list.loading = true
      this.$request.fetchTaskRevoke({ contentId: row.contentId }).then(res => {
        if (res.code === 200) {
          this.$message.success('撤回成功')
          this.fetchTableApi()
        }
        this.list.loading = false
      }).catch(() => {
        this.list.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.to-deal-table-container{
  .el-table{
    .jee-color{
      // cursor: pointer;
    }
    .submit{
      color:#6AC043;
      // color:#FF9300;
    }
    .agree{
      color:#6AC043;
    }
    .disagree{
      color:#FF0000;
    }
    .sysdisagree{
      color: #B3B3B3;
    }
    .el-link + .el-link{
      padding-left: 24px;
    }
  }
}
</style>
