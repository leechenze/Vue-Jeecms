<template>
  <section class="interact-comment-report-container">
    <base-header v-bind="headers"
    />
    <comment-table
      ref='commentTable'
      @handleBatchAll="handleBatchAll"
      @handleUesr='handleUesr'
      @handleIP='handleIP'
      @handleOpenNews='handleOpenNews'
      @handleNoUesr='handleNoUesr'
      @handleNoIp='handleNoIp'
      @handleNoReport='handleTebNoReport'
      @handleDelete='handleDelete'
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      v-bind="list"
      :footButtons="footButtons"
    >
      <template #reports="scope">
        <div>
          <span>举报人：{{getReport(scope.scope).user.username}}</span>
          [ IP:<span>{{getReport(scope.scope).ip}}</span> ]
          <span style="margin-left:35px;">举报时间：{{$moment(getReport(scope.scope).createTime)}}</span>
          <span class="reports-i" @click="upReports(scope.scope.userCommentReports)">
            <i style="line-height: 2px; font-size: 30px;margin-left:32px;">...</i>
            <i class="reportsIcon">{{scope.scope.userCommentReports.length}}</i>
          </span>
        </div>
      </template>
    </comment-table>
    <form-dialog
      title="举报"
      ref="openReport"
      width='600px'
      :showCancel='noReport'
      :buttons="reportBtn"
      v-on:handleConfirm="handleConfirm"
    >
    <div class="dialog-box">
      <p class="title">
        <span class="user">举报人</span>
        <span>举报时间</span>
      </p>
      <p v-for="(rep,index) in reportsOpenList" :key='index'>
        <span class="user">{{rep.user.username}}[IP:<span>{{rep.ip}}</span>]</span>
        <span>{{$moment(rep.createTime)}}</span>
      </p>
    </div>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import commentTable from '@/components/mixins/commentTable'
import formDialog from '@/components/mixins/formDialog'
import commentMixin from './commentMixin.js'

export default {
  name: 'interactCommentReport',
  mixins: [commentTable, baseHeader, formDialog, commentMixin],
  data () {
    const statusList = [
      {
        prop: 'isReport',
        scopeType: 'status',
        showColunms: 'isReport',
        options: [
          {
            label: '【举报】',
            value: true,
            color: '#FF0000'
          }
        ]
      }
    ]
    return {
      list: {
        api: 'fetchUsercommentReportList',
        statusList,
        commentsNum: [],
        reports: 'reports',
        footButtons: [],
        showComment: false,
        showReports: true,
        params: {
        },
        header: {
          showAlertIcon: false,
          buttons: [
            // {
            //   type: 'All',
            //   btn: 'NoUser',
            //   text: '禁止用户评论',
            //   icon: 'jinyong',
            //   disabled: !this._checkPermission('/usercomment/plus/stop', 'PUT')
            // },
            // {
            //   type: 'All',
            //   btn: 'NoIp',
            //   text: '禁止IP评论',
            //   icon: 'jinyong',
            //   disabled: !this._checkPermission('/usercomment/plus/stop', 'PUT')
            // },
            {
              type: 'All',
              btn: 'CancelReport',
              text: '取消举报',
              icon: 'quxiaojunbao',
              disabled: !this._checkPermission('/usercomment/report', 'DELETE')
            },
            {
              type: 'All',
              btn: 'Delete',
              text: '删除评论',
              icon: 'delete',
              disabled: !this._checkPermission('/usercomment', 'DELETE')
            }
          ]
        }
      },
      reportsOpenList: [],
      reportBtn: [
        {
          text: '关闭',
          type: 'Submit'
        }
      ],
      noReport: false
    }
  },
  computed: {
    footButtons () {
      return [
        // {
        //   type: 'NoUesr',
        //   icon: 'jinyong',
        //   text: '禁止用户评论',
        //   disabled: !this._checkPermission('/usercomment/plus/stop', 'PUT')
        // },
        // {
        //   type: 'NoIp',
        //   icon: 'jinyong',
        //   text: '禁止IP评论',
        //   disabled: !this._checkPermission('/usercomment/plus/stop', 'PUT')
        // },
        {
          type: 'NoReport',
          icon: 'quxiaojunbao',
          text: '取消举报',
          disabled: !this._checkPermission('/usercomment/report', 'PUT')
        },
        {
          type: 'Delete',
          icon: 'delete',
          text: '删除评论',
          disabled: !this._checkPermission('/usercomment', 'DELETE')
        }
      ]
    }
  },
  methods: {
    getReport (row) {
      if (row.userCommentReports instanceof Array && row.userCommentReports.length) {
        let r = row.userCommentReports[0]
        if (!r.user) {
          r.user = {}
        }
        return r
      }
      return {
        user: {}
      }
    },
    upReports (data) {
      this.reportsOpenList = data
      this.$refs.openReport.showDialog()
    },
    handleConfirm () {
      this.$refs.openReport.handleCancel()
    },
    // 点击名字
    handleUesr (data, index) {
      this.$routerLink('/interact/comment/member?userId=' + data.user.id)
    },
    // 点击IP
    handleIP (data, index) {
      this.$routerLink('/interact/comment/ip?precisionIp=' + data.ip)
    },
    // 点击新闻
    handleOpenNews (data, index) {
      if (data.content && data.content.urlWhole) {
        window.open(data.content.urlWhole)
      } else {
        this.$message('没有浏览地址')
      }
    },
    // 回调
    fetchContentCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 表格禁止用户
    handleNoUesr (data) {
      let obj = {}
      obj.id = data.id
      obj.isIp = false
      this.$confirm('是否确定禁止用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentPlusStop(obj)
      })
    },
    // 表格禁止IP
    handleNoIp (data) {
      let obj = {}
      obj.id = data.id
      obj.isIp = true
      this.$confirm('是否确定禁止IP？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentPlusStop(obj)
      })
    },
    // 表格取消举报
    handleTebNoReport (data) {
      let ids = []
      ids.push(data.id)
      this.$confirm('是否确定取消举报？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchUsercommentReportDelete(ids)
      })
    },
    // 表格删除评论
    handleDelete (data) {
      let ids = []
      ids.push(data.id)
      this.$confirm('是否确定删除评论？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentDelete(ids)
      })
    },
    // 批量禁止用户
    changeAuditUser (ids) {
      let data = {}
      data.ids = ids
      data.status = 1
      this.$confirm('是否确定批量禁止用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      })
    },
    // 批量禁止IP
    changeAuditNoIP (ids) {
      let data = {}
      data.ids = ids
      data.status = 2
      this.$confirm('是否确定批量禁止IP？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      })
    },
    // 批量删除
    changeCommentDelete (ids) {
      this.$confirm('是否确定批量删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentDelete(ids)
      })
    },
    // 批量取消举报
    changeCommentCancelReport (ids) {
      this.$confirm('是否确定批量取消举报？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchUsercommentReportDelete(ids)
      })
    },
    // 批量点击
    handleBatchAll (ids, btn) {
      if (ids.length > 0) {
        switch (btn.btn) {
          case 'NoUser':
            // 禁止用户
            this.changeAuditUser(ids, 1)
            break
          case 'NoIp':
            // 禁止IP
            this.changeAuditNoIP(ids, 1)
            break
          case 'CancelReport':
          // 取消举报
            this.changeCommentCancelReport(ids, 1)
            break
          case 'Delete':
            // 删除评论
            this.changeCommentDelete(ids, 1)
            break
          default:
            break
        }
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 接口访问
    // 新增禁止
    fetchInteractUsercommentPlusStop (data) {
      this.$request.fetchInteractUsercommentPlusStop(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchCommentApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 删除
    fetchInteractUsercommentDelete (ids) {
      this.$request.fetchInteractUsercommentDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$refs.commentTable.handleCheckAll(false)
          this.fetchCommentApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 取消举报
    fetchUsercommentReportDelete (ids) {
      this.$request.fetchUsercommentReportDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '取消成功',
            type: 'success'
          })
          this.fetchCommentApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    }
  }
}
</script>

<style lang="scss">
.interact-comment-report-container{
  .comment-table-container .head-checkall{
    margin-top: 10px;
  }
  .reports-i{
    cursor: pointer;
  }
  .reportsIcon{
    position: absolute;
    right: 13px;
    top: -11px;
    width: 18px;
    height: 18px;
    background: rgba(255,0,0,1);
    border-radius: 50%;
    color: white;
    text-align: center;
    line-height: 18px;
  }
  .dialog-box{
    width: 528px;
    border:1px solid rgba(237,237,237,1);
    border-radius:4px 4px 0px 0px;
    p{
      padding: 0 20px;
      height: 43px;
      line-height: 43px;
      color: #666666;
      font-size: 14px;
      border-bottom:1px solid rgba(237,237,237,1);
      .user{
        display: inline-block;
        width: 300px;
      }
    }
    p:last-child{
      border-bottom: none;
    }
    .title{
      background: #f9f9f9;
    }
  }
}
</style>
