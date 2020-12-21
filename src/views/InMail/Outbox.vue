<template>
  <section class="inMail-index-outbox-container">

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
       @handleSearch="handleSearchs"
    ></search-header>
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
    >
      <template #title="scope">
        <div class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.title}}</div>
      </template>
    </base-table>
    <form-dialog
      title="查看"
      ref="lookDialog"
      :showCancel='false'
      :buttons="lookButtons">
      <div class="dialog-box">
        <div class="dialog-header">
          <div class='title'>{{message.title}}</div>
          <p><span class="label">收件人</span>：<span>{{message.username}}</span></p>
          <p><span class="label">发件时间</span>：<span>{{message.createTime}}</span></p>
        </div>
        <div class="dialog-content">
          <p>
            {{message.content}}
          </p>
        </div>
      </div>
    </form-dialog>
    <form-dialog
      title="新建站内信"
      ref="addDialog"
      class="new-message"
      labelWidth='auto'
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      v-on:handleConfirm="handleConfirmAdd">
      <template #user="scope">
        <el-input size="small" :disabled="true" v-model="addForm.user" placeholder="请选择收件人">
          <template slot="append"><el-button class="jee-bg-light-important" size="small" @click="choose" type="primary">选择</el-button></template>
        </el-input>
      </template>
    </form-dialog>
    <set-admin ref="setAdmin" v-on:handleConfirm="setAdminList"></set-admin>
  </section>
</template>

<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import baseHeader from '@/components/mixins/baseHeader'
import formDialog from '@/components/mixins/formDialog'
import setAdmin from './setAdmin'
export default {
  name: 'inMailIndex',
  mixins: [searchHeader, baseTable, baseHeader, formDialog],
  components: {
    setAdmin
  },
  data () {
    return {
      list: {
        showIndex: false,
        showPaginationSimple: false,
        showPagination: true,
        columns: [
          {
            prop: 'title',
            label: '标题',
            scopeType: 'slot',
            minWidth: '175px',
            showOverflowTooltip: true
          },
          {

            prop: 'content',
            label: '内容',
            minWidth: '175px',
            showOverflowTooltip: true
          },
          {
            prop: 'username',
            label: '收件人',
            minWidth: '175px'
          },
          {
            scopeType: 'time',
            prop: 'createTimes',
            label: '发件时间',
            minWidth: '175px'
          }
        ],
        api: 'fetchMessageOutbox',
        params: {
          startTime: '',
          endTime: '',
          username: '',
          title: '',
          content: '',
          type: 1
        },
        handleColumnProp: {
          label: '操作',
          width: '75'
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/message', 'DELETE')
          }
        ]
      },
      searchHeader: {
        searchItems: [
          {
            type: 'timePicker',
            value: 'time',
            startText: '发件开始时间',
            endText: '发件结束时间'
          },
          {
            type: 'select',
            value: 'type',
            options: [
              {
                label: '收件人',
                value: 1
              },
              {
                label: '标题',
                value: 2
              },
              {
                label: '内容',
                value: 3
              }
            ]
          },
          {
            type: 'searchInput',
            value: 'text',
            placeholder: '请输入相关信息'
          }
        ]
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/message', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/message', 'DELETE')
          }
        ],
        showAlertIcon: false,
        content: '操作说明'
      },
      lookButtons: [
        {
          text: '关闭',
          type: 'close'
        }
      ],
      message: {},
      addRules: {
        userId: [this.$rules.required()],
        user: [this.$rules.required()],
        title: [this.$rules.required()],
        content: [this.$rules.required()]
      },
      addFormItems: [
        {
          type: 'slot',
          prop: 'user',
          label: '收件人',
          placeholder: '请选择收件人'
        },
        {
          prop: 'title',
          label: '标题',
          placeholder: '请输入标题',
          maxlength: 50
        },
        {
          type: 'textarea',
          prop: 'content',
          maxlength: 500,
          autosize: { minRows: 8 },
          labelWidth: '0px',
          showWordLimit: true,
          placeholder: '请输入消息内容'
        }
      ],
      addFormLoading: false,
      addForm: {
        user: ''
      }
    }
  },
  computed: {

  },
  methods: {
    handleSearchs () {
      let params = this.list.params
      if (params.time) {
        params.startTime = params.time[0]
        params.endTime = params.time[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      if (params.text) {
        if (params.type === 1) {
          params.username = params.text
          params.title = ''
          params.content = ''
        } else if (params.type === 2) {
          params.title = params.text
          params.username = ''
          params.content = ''
        } else if (params.type === 3) {
          params.content = params.text
          params.username = ''
          params.title = ''
        }
      } else {
        params.username = ''
        params.title = ''
        params.content = ''
      }
      this.list.params = params
      this.fetchTableApi()
    },
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    setAdminList (data) {
      this.addForm.user = data.names
      this.addForm.userId = data.ids
    },
    choose () {
      this.$refs.setAdmin.showTheDialog()
    },
    handleConfirmAdd (data) {
      this.$request.fetchMessageAdd(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.recipientsList.data = []
          this.addFormLoading = false
        }
      })
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量删除消息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchMessageDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    rowHref (row) {
      let id = row.id
      this.$request.fetchMessage({ id }).then(res => {
        if (res.code === 200) {
          this.message = res.data
          this.$refs.lookDialog.showDialog()
        }
      })
    },
    handleTableDelete (data) {
      let ids = []
      ids.push(data.id)
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMessageDelete(ids)
      })
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 删除
    fetchMessageDelete (ids) {
      this.list.loading = true
      this.$request.fetchMessageDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    }
  }
}
</script>

<style lang="scss">
.inMail-index-outbox-container{
  .search-item-wrap:nth-child(2){
    width: 100px;
  }
  .jee-color{
    cursor: pointer;
  }
  .dialog-box{
    border:1px solid rgba(237,237,237,1);
    border-radius:0px 0px 4px 4px;
    .dialog-header{
      padding: 20px;
      border-bottom: 1px solid rgba(237,237,237,1);
      background:rgba(250,250,250,1);
      .title{
        color: #333333;
        font-size: 16px;
        font-weight: 600;
      }
      .label{
        color: #999999;
        width: 70px;
        font-size: 14px;
        display: inline-block;
        text-align: right;
        text-align-last: justify;
        margin-top: 10px;
      }
      span{
        color: #333333;
        font-size: 14px;
        font-weight: 500;
      }
    }
    .dialog-content{
      overflow: scroll;
      max-height: 355px;
      p{
        text-indent:28px;
        font-size: 14px;
        color: #333333;
        padding: 20px;
      }
    }
  }
  .base-header-container{
    margin-top: 10px;
  }
  .new-message{
    .el-input,
    .el-textarea{
      max-width: none;
    }
    .form-item-wrap:last-of-type{
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }
  }
  .table-box{
    width: 100%;
    display: flex;
    justify-content:space-between;
    .table1{
      width: 49%;
      .box-header{
        .el-row{
          padding: 7px 7px 0 7px;
          .search-item-wrap{
            width: 150px;
            margin-left: 10px;
          }
        }

      }
    }
    .table2{
      width: 49%;
      p{
        color: #333333;
        font-size:14px;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
