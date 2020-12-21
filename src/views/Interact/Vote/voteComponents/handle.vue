<template>
<!-- 已办详情 -->
  <section class="interact-vote-handle">

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
      @handleCurrentChange="handleCurrentChange">
      <!-- 标题 -->
      <template #title="scope">
        <span class="jee-color" @click="handleClickDetail(scope.scope.row)">{{scope.scope.row.title}}</span>
      </template>
      <!-- 操作撤回 -->
      <template #handle2="scope">
        <el-link
          :underline='false'
          @click="handleClickPreview(scope.scope.row.previewUrl)"
        ><jee-icon iconClass="yulang"/>预览</el-link>
        <el-link
          v-if="scope.scope.row.allowRevoke"
          :underline='false'
          :disabled="!_checkPermission('/task/questionnaire/revoke', 'GET')"
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
import searchHeader from '@/components/mixins/searchHeader'
export default {
  name: 'handle',
  mixins: [baseTable, formDialog, searchHeader],
  props: {
    activeName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: {
        api: '',
        params: {
          'title': ''
        },
        columns: [
          {
            scopeType: 'slot',
            label: '标题',
            prop: 'title'
          },
          {
            label: '当前节点',
            prop: 'nodeName'
          },
          {
            scopeType: 'slot',
            label: '操作选项',
            prop: 'handle2'
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
      ],
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'title',
            placeholder: '按标题搜索',
            style: {
              width: '335px'
            }
          }
        ]
      }
    }
  },
  methods: {
    handleSearchs () {
      this.fetchTableApi()
    },
    // 表格数据
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 跳转详情
    handleClickDetail (row) {
      if (row.contentId) this.$routerLink('/interact/vote/detail', 'Edit', { link: 'editQues', id: row.contentId, isHiddenAll: true })
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
      this.$request.fetchTaskQuestionnaireAudit(params).then(res => {
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
      this.$request.fetchTaskQuestionnaireRevoke({ questionnaireId: row.contentId }).then(res => {
        if (res.code === 200) {
          this.$message.success('撤回成功')
          this.fetchTableApi()
        }
        this.list.loading = false
      }).catch(() => {
        this.list.loading = false
      })
    }
  },
  watch: {
    activeName: function (name) {
      if (name === 'handle') {
        this.list.api = 'fetchTaskQuestionnaireHandle'
        this.fetchTableApi()
      }
    }
  }
}
</script>
<style lang="scss">
.interact-vote-handle{
  .el-table{
    .jee-color{
      cursor: pointer;
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
