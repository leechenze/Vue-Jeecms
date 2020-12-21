<template>
<!-- 待办详情 -->
  <section class="interact-vote-toDeal">

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
      <!-- 动作 -->
      <template #lastActionName="scope">
        <span :class="scope.scope.row.lastActionCode">{{scope.scope.row.lastActionName}}</span>
      </template>
      <!-- 操作 -->
      <template #handle="scope">
        <el-link
          :underline='false'
          @click="handleClickPreview(scope.scope.row.previewUrl)"
        >
        <jee-icon iconClass="yulang"/>预览</el-link>
        <template v-for="(item, index) in scope.scope.row.actions">
          <el-link
            :key="index"
            :underline='false'
            :disabled="!_checkPermission('/task/questionnaire/audit', 'GET')"
            @click="handleClickAction(item, scope.scope.row.contentId)"
          ><jee-icon iconClass="shenghetongguo" v-if="item.code=='agree'" style="font-size:14px"/><jee-icon iconClass="shenghebutongguo" v-if="item.code=='disagree'" style="font-size:14px"/>{{item.name}}</el-link>
        </template>
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
  name: 'toDeal',
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
      questionnaireId: '',
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
      if (row.contentId) {
        this.$routerLink('/interact/vote/detail', 'Edit', { id: row.contentId, link: 'editQues', isHiddenAll: true, isAdd: false })
      }
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
        questionnaireId: this.contentId
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
    }
  },
  watch: {
    activeName: function (name) {
      if (name === 'toDeal') {
        this.list.api = 'fetchTaskQuestionnaireToDeal'
        this.fetchTableApi()
      }
    }
  }
}
</script>
<style lang="scss">
.interact-vote-toDeal{
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
