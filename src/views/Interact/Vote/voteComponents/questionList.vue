<template>
<!-- 问卷调查列表 -->
  <section class="interact-vote-index-container">
    <base-header v-bind="headers"
      v-on:handleAdd="handleHeaderLink"
      v-on:handleSubmitReview="handleHeaderSubmitReview"
      v-on:handlePassReview="handleHeaderPassReview"
      v-on:handleDisPassReview="handleHeaderDisPassReview"
      v-on:handleIssue="handleHeaderIssue"
      v-on:handlePause="handleHeaderPause"
      v-on:handleDelete="handleHeaderDelete"
    />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
    ></search-header>
    <base-table
      v-bind="list"
      @handleIssue="handleTableIssue"
      @handlePause="handleTablePause"
      @handleCopy="handleTableCopy"
      @handlePreview="handleTablePreview"
      @handleEdit="handleTableEdit"
      @handleBack="handleTableBack"
      @handleDelete="handleTableDelete"
      v-on:handleSelectionChange="handleMultipleSelect"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
    >
    <template #title="scope">
      <div class="jee-color titleBox">
        <div @click="toLinkAddress(scope.scope.row)" v-if="scope.scope.row.status===3||scope.scope.row.status===4">
          <jee-icon iconClass="lianjiexingyinyong"></jee-icon>
        </div>
        <p class="voteTitle" @click="toEdit(scope.scope.row)">{{scope.scope.row.title}}</p>
      </div>
    </template>
    <template #status="scope">
      <div :style="classObject(scope.scope.row)" :class='{"jee-color":scope.scope.row.status === 1}'><span>{{judgeState(scope.scope.row)}}</span><span v-if='scope.scope.row.status ===0 && workFlow' :class="[scope.scope.row.checkStatus?'unreviewed':'reviewed' ]">({{ scope.scope.row.checkStatus ? '已审核':'未审核'}})</span></div>
    </template>
    <template #answerCount="scope">
      <div @click="answerGoto(scope.scope.row,$event)" :style="classGoto(scope.scope.row)" :class='{"jee-color":scope.scope.row.answerCount >0}'>{{scope.scope.row.answerCount}}</div>
    </template>
    </base-table>
    <form-dialog
        ref="copyDialog"
        title="复制"
        :form="copyForm"
        :formItems="copyFormItems"
        :buttons="copyButtons"
        :rules="copyRules"
        @handleConfirm="handleConfirmCopy"
      ></form-dialog>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
const columns = [
  {
    prop: 'title',
    label: '标题',
    scopeType: 'slot',
    width: '153px'
  },
  {
    prop: 'createUser',
    label: '创建人'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    minWidth: '175px'
  },
  {
    prop: 'status',
    label: '状态',
    scopeType: 'slot',
    minWidth: '120px'
  },
  {
    prop: 'beginTime',
    label: '开始时间',
    minWidth: '175px'
  },
  {
    prop: 'endTime',
    label: '结束时间',
    minWidth: '175px'
  },
  {
    prop: 'answerCount',
    label: '答卷',
    scopeType: 'slot'
  }
]
export default {
  name: 'questionList',
  mixins: [baseHeader, searchHeader, baseTable, formDialog],
  props: {
    activeName: {
      type: String,
      default: ''
    }
  },
  data () {
    var options = [
      {
        value: '',
        label: '全部'
      },
      /* workflow-plugin start */
      {
        value: 1,
        label: '流转中'
      },
      /* workflow-plugin end */
      {
        value: 0,
        label: '未发布'
      },
      {
        value: 3,
        label: '进行中'
      },
      {
        value: 4,
        label: '已结束'
      },
      {
        value: 2,
        label: '已驳回'
      }
    ]
    return {
      workFlow: '',
      copyFormItems: [
        {
          prop: 'title',
          label: '新问卷标题',
          maxlength: 50
        }
      ],
      copyForm: {
        'title': '',
        'id': ''
      },
      copyButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      copyRules: {
        title: [
          this.$rules.required()
        ]
      },
      list: {
        columns,
        api: 'fetchQuestionnairePage',
        params: {
          'status': '',
          'beginTime': '',
          'endTime': '',
          'times': [],
          'title': ''
        },
        filterParams: ['times'],
        handleColumn: [
          {
            type: 'Issue',
            name: '发布',
            icon: 'fabu',
            disabled: !this._checkPermission('/questionnaire/release', 'PUT'),
            iconStyle: {
              fontSize: '14px'
            }
          },
          {
            type: 'Pause',
            name: '暂停',
            icon: 'ai06',
            disabled: !this._checkPermission('/questionnaire/pause', 'PUT'),
            iconStyle: {
              fontSize: '14px'
            }
          },
          {
            type: 'Copy',
            name: '复制',
            icon: 'fuzhi',
            disabled: !this._checkPermission('/questionnaire/copy', 'POST'),
            iconStyle: {
              fontSize: '14px'
            }
          },
          {
            type: 'Preview',
            name: '预览',
            icon: 'yulang',
            disabled: !this._checkPermission('/questionnaire', 'GET')
          },
          {
            type: 'Edit',
            name: '编辑',
            icon: 'bianji',
            disabled: !this._checkPermission('/questionnaire', 'GET')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/questionnaire', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '370',
          align: 'left'
        }

      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian',
            href: '/interact/vote/create',
            disabled: !this._checkPermission('/questionnaire', 'POST')
          },
          {
            type: 'SubmitReview',
            text: '提交审核',
            icon: 'shenhe1',
            disabled: !this._checkPermission('/questionnaire/submit', 'PUT'),
            isHidden: ''
          },
          {
            type: 'Issue',
            text: '发布',
            icon: 'fabu',
            disabled: !this._checkPermission('/questionnaire/release', 'PUT')
          },
          {
            type: 'Pause',
            text: '暂停',
            icon: 'ai06',
            disabled: !this._checkPermission('/questionnaire/pause', 'PUT')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/questionnaire', 'DELETE')
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
            label: '状态：',
            value: 'status',
            style: {
              width: '150px'
            },
            options
          },
          {
            type: 'timePicker',
            value: 'times',
            style: {
              width: '400px'
            }
          },
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
    // 多选操作
    handleMultipleSelect (data) {
      var ids = data.map(v => v[this.list.rowKey || 'id'])
      this.list.selectedKeys = ids
      var status = data.map(v => v.status)
      console.log(ids, status)
      // 判断顶部操作提交审核按钮是否禁用
      if (ids.length > 0) {
        if (status.find(v => v !== 0 && v !== 2)) {
          this.headers.buttons.find(v => v.type === 'SubmitReview').disabled = true
        } else {
          this.headers.buttons.find(v => v.type === 'SubmitReview').disabled = !this._checkPermission('/questionnaire/submit', 'PUT')
        }
      } else {
        this.headers.buttons.find(v => v.type === 'SubmitReview').disabled = !this._checkPermission('/questionnaire/submit', 'PUT')
      }
      // 判断顶部操作发布按钮是否禁用
      if (this.workFlow) {
        if (ids.length > 0) {
          if (data.find(v => v.status !== 0 || v.checkStatus === false)) {
            this.headers.buttons.find(v => v.type === 'Issue').disabled = true
          } else {
            this.headers.buttons.find(v => v.type === 'Issue').disabled = !this._checkPermission('/questionnaire/release', 'PUT')
          }
        } else {
          this.headers.buttons.find(v => v.type === 'Issue').disabled = !this._checkPermission('/questionnaire/release', 'PUT')
        }
      } else {
        if (ids.length > 0) {
          if (status.find(v => v !== 0)) {
            this.headers.buttons.find(v => v.type === 'Issue').disabled = true
          } else {
            this.headers.buttons.find(v => v.type === 'Issue').disabled = !this._checkPermission('/questionnaire/release', 'PUT')
          }
        } else {
          this.headers.buttons.find(v => v.type === 'Issue').disabled = !this._checkPermission('/questionnaire/release', 'PUT')
        }
      }
      // 判断顶部操作暂停按钮是否禁用
      if (ids.length > 0) {
        if (status.find(v => v !== 3 && v !== 4) >= 0) {
          this.headers.buttons.find(v => v.type === 'Pause').disabled = true
        } else {
          this.headers.buttons.find(v => v.type === 'Pause').disabled = !this._checkPermission('/questionnaire/pause', 'PUT')
        }
      } else {
        this.headers.buttons.find(v => v.type === 'Pause').disabled = !this._checkPermission('/questionnaire/pause', 'PUT')
      }
    },
    // 顶部操作按钮
    // 提交审核
    handleHeaderSubmitReview () {
      if (this.list.selectedKeys.length > 0) {
        this.$request.fetchquestionnaireSubmit({
          'ids': this.list.selectedKeys
        }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          }, '提交成功')
        })
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 提交审核按钮是否隐藏
    SubmitReview () {
      if (this.workFlow) {
        this.headers.buttons.find(v => v.type === 'SubmitReview').isHidden = false
      } else {
        this.headers.buttons.find(v => v.type === 'SubmitReview').isHidden = true
      }
    },
    // 提交通过
    handleHeaderPassReview () {

    },
    // 审核不通过
    handleHeaderDisPassReview () {

    },
    // 发布
    handleHeaderIssue () {
      if (this.list.selectedKeys.length > 0) {
        this.$request.fetchQuestionnaireRelease({
          'ids': this.list.selectedKeys
        }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          }, '发布成功')
        })
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 暂停
    handleHeaderPause () {
      if (this.list.selectedKeys.length > 0) {
        this.$request.fetchQuestionnairePause({
          'ids': this.list.selectedKeys
        }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          }, res.message)
        })
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 删除
    handleHeaderDelete () {
      if (this.list.selectedKeys.length > 0) {
        this.deletePort(this.list.selectedKeys)
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 删除接口
    deletePort (ids) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchQuestionnaireDelete({
          'ids': ids
        }).then(res => {
          this.$restBack(res, () => {
            this.handleSearchs()
          }, '删除成功')
        })
      }).catch(() => {})
    },
    // 判断状态
    judgeState (row) {
      if (row.status === 1) {
        return '流转中'
      } else if (row.status === 0) {
        return '未发布'
      } else if (row.status === 3) {
        return '进行中'
      } else if (row.status === 4) {
        return '已结束'
      } else if (row.status === 2) {
        return '已驳回'
      }
    },
    // 判断状态颜色
    classObject (row) {
      if (row.status === 0) {
        return { color: '#666666' }
      } else if (row.status === 2) {
        return { color: '#FF0000' }
      } else if (row.status === 3) {
        return { color: '#6AC043' }
      } else if (row.status === 4) {
        return { color: '#666666' }
      }
    },
    // 判断复制操作状态
    operateBackCopy () {
      this.list.data = this.list.data.map(v => {
        if (v.status === 1 || v.status === 2) {
          v.hiddenCopy = true
        } else {
          v.hiddenCopy = false
        }
        return v
      })
    },
    // 判断撤回编辑操作状态
    operateBackEdit () {
      this.list.data = this.list.data.map(v => {
        if (v.status === 1) {
          v.hiddenEdit = true
        } else {
          v.hiddenBack = true
        }
        return v
      })
    },
    // 判断发布暂停操作状态
    operatePauseIssue () {
      this.list.data = this.list.data.map(v => {
        if (this.workFlow) {
          if (v.status === 0 && v.checkStatus) {
            v.hiddenPause = true
          } else if (v.status === 3 || v.status === 4) {
            v.hiddenIssue = true
          } else {
            v.hiddenPause = true
            v.hiddenIssue = true
          }
        } else {
          if (v.status === 0) {
            v.hiddenPause = true
          } else if (v.status === 3 || v.status === 4) {
            v.hiddenIssue = true
          } else {
            v.hiddenPause = true
            v.hiddenIssue = true
          }
        }
        return v
      })
    },
    // 图标链接跳转
    toLinkAddress (row) {
      this.$routerLink('/interact/vote/detail', 'Edit', { link: 'linkAddress', status: row.status, id: row.id })
    },
    // 标题跳转
    toEdit (row) {
      if (row.status === 3) {
        this.$confirm('此问卷处于进行中状态，编辑问卷时问卷会暂停发布，将导致正在填写此问卷的用户无法提交而必须重新填写，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$routerLink('/interact/vote/detail', 'Edit', { link: 'editQues', id: row.id })
        }).catch(() => {})
      } else {
        this.$routerLink('/interact/vote/detail', 'Edit', { link: 'editQues', id: row.id })
      }
    },
    // 判断答卷跳转
    answerGoto (row, e) {
      if (row.answerCount > 0) {
        row.params = {
          id: row.id,
          link: 'statistical',
          type: 'Edit',
          status: row.status
        }
        this.handleTableRoutePush('/interact/vote/detail', row, e)
      }
    },
    // 答卷跳转样式
    classGoto (row) {
      if (row.answerCount > 0) {
        return { cursor: 'pointer' }
      }
    },
    // 发布
    handleTableIssue (data) {
      this.$request.fetchQuestionnaireRelease({
        'ids': [data.id]
      }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, res.message)
      })
    },
    // 暂停
    handleTablePause (data) {
      this.$request.fetchQuestionnairePause({
        'ids': [data.id]
      }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, res.message)
      })
    },
    // 复制
    handleTableCopy (data) {
      this.copyForm.id = data.id
      this.$refs.copyDialog.showDialog()
    },
    // 预览
    handleTablePreview (data) {
      console.log(data)
      if (data.previewUrl) {
        window.open(data.previewUrl)
      } else {
        this.$message('当前没有预览地址')
      }
    },
    // 编辑
    handleTableEdit (data) {
      this.toEdit(data)
    },
    // 撤回
    handleTableBack (data) {
      console.log(data.id)
      this.$request.fetchQuestionnaireWithdraw({
        'id': data.id
      }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, res.message)
      })
    },
    // 删除
    handleTableDelete (data) {
      this.deletePort([data.id])
    },
    // 提交新问卷标题
    handleConfirmCopy (data, btn) {
      console.log(data, btn)
      this.$request.fetchQuestionnaireCopy(data).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, '复制成功')
      })
    },
    handleSearchs () {
      var params = this.list.params
      if (params.times) {
        params.beginTime = params.times[0]
        params.endTime = params.times[1]
      } else {
        params.beginTime = ''
        params.endTime = ''
      }
      this.list.params = params
      this.list.pageNo = 1
      this.fetchTableApi()
      console.log(this.headers.buttons)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
        this.operateBackCopy()
        this.operateBackEdit()
        this.operatePauseIssue()
      }
      this.hideTableLoading()
    },
    getWorkflow () {
      this.$request.fetchQuestionnaireWorkflow({}).then(res => {
        if (res.code === 200) {
          this.workFlow = res.data
          this.SubmitReview()
          console.log(this.workFlow)
        }
      })
    }
  },
  watch: {
    activeName: function (name) {
      if (name === 'questList') {
        this.fetchTableApi()
      }
    }
  },
  mounted () {
    this.getWorkflow()
  },
  activated () {
    this.getWorkflow()
  }
}
</script>
<style lang="scss">
.interact-vote-index-container{
  .base-header-container{
     header{
       padding-bottom: 10px!important;
     }
     .tip{
       padding-bottom: 10px;
     }
  }
  .titleBox{
    display: flex;
    cursor: pointer;
  }
  .voteTitle{
    padding-left: 10px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .reviewed{
    color: #FF9300;
  }
  .unreviewed{
    color: #6AC043;
  }
}
</style>
