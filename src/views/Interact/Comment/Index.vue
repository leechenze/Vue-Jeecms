<template>
  <section class="interact-comment-index-container">
    <!-- <base-header v-bind="headers"
    /> -->
    <div class="lists">
      <p class="jee-color" @click="openShutup">禁言列表</p>
      <p class="jee-color" @click="openReport">举报列表<span v-if='reportNum>0'>（<span>{{reportNum}}</span>）</span></p>
    </div>

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
    ></search-header>
    <comment-table
      @handleBatchAll="handleBatchAll"
      @handleUesr='handleUesr'
      @handleIP='handleIP'
      @handleOpencomment='handleOpencomment'
      @handleOpenNews='handleOpenNews'
      @handleReferrer='handleReferrer'
      @handleNoReferrer='handleNoReferrer'
      @handlePass='handlePass'
      @handleBackPass='handleBackPass'
      @handleNoPass='handleNoPass'
      @handleToUesr='handleToUesr'
      @handleNoUesr='handleNoUesr'
      @handleNoIp='handleNoIp'
      @handleToIp='handleToIp'
      @handlePutReply='handlePutReply'
      @handleReply='handleReply'
      @handleDelete='handleDelete'
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      v-bind="list"
      :header='header'
      :footButtons="footButtons"
    >
    </comment-table>
    <form-dialog
      :title="causeTitle"
      ref="causeDialog"
      :form="causeForm"
      :rules="causeRules"
      :formItems="causeFormItems"
      v-on:handleConfirm="handleConfirmCause"
      :buttons="causeButtons"
      class="cause-dialog"
    ></form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import commentTable from '@/components/mixins/commentTable'
import formDialog from '@/components/mixins/formDialog'
import commentMixin from './commentMixin.js'
import {
  mapActions
} from 'vuex'

export default {
  name: 'interactCommentIndex',
  mixins: [commentTable, searchHeader, baseHeader, formDialog, commentMixin],
  data () {
    return {
      causeTitle: '编辑回复',
      list: {
        api: 'fetchInteractUsercommentList',
        title: 'content.channel.name',
        titleText: 'content.title',
        data: [],
        showCheckAll: 'head',
        params: {
          senior: false,
          selectID: '',
          fuzzySearch2: '',
          fuzzySearch1: '',
          criticalTimes: [],
          replyTimes: [],
          status: '',
          isReply: '',
          channel: [''],
          startTime: '',
          endTime: '',
          replyStartTime: '',
          replyEndTime: '',
          fuzzySearch: '',
          userName: '',
          ip: '',
          commentText: '',
          replytText: '',
          title: '',
          isTop: ''
        },
        filterParams: ['channel'],
        ids: []
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'status',
            placeholder: '请选择审核状态',
            label: '审核状态：',
            style: {
              width: '150px'
            },
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '待审核',
                value: 0
              },
              {
                label: '审核通过',
                value: 1
              },
              {
                label: '审核未通过',
                value: 2
              }
            ]
          },
          {
            type: 'cascader',
            value: 'channel',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            style: {
              width: '150px'
            },
            placeholder: '请选择栏目',
            label: '选择栏目：',
            options: []
          },
          {
            type: 'select',
            value: 'isTop',
            placeholder: '请选择是否推荐',
            label: '是否推荐：',
            style: {
              width: '105px'
            },
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '是',
                value: true
              },
              {
                label: '否',
                value: false
              }
            ]
          },
          {
            type: 'select',
            value: 'isReply',
            placeholder: '请选择回复状态',
            label: '回复状态：',
            class: 'z-hidden-lg-and-down',
            style: {
              width: '105px'
            },
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '未回复',
                value: false
              },
              {
                label: '已回复',
                value: true
              }
            ]
          },
          {
            type: 'timePicker',
            value: 'criticalTimes',
            hiddenKey: 'senior',
            hiddenValue: true,
            startText: '起始评论时间',
            endText: '截止评论时间'
          },
          {
            type: 'timePicker',
            value: 'replyTimes',
            hiddenKey: 'senior',
            hiddenValue: true,
            startText: '起始回复时间',
            endText: '截止回复时间'
          },
          {
            type: 'select',
            value: 'selectID',
            placeholder: '请选择',
            options: [
              {
                label: '模糊搜索',
                value: ''
              },
              {
                label: '评论人',
                value: 1
              },
              {
                label: '评论Ip',
                value: 2
              },
              {
                label: '评论内容',
                value: 3
              },
              {
                label: '回复内容',
                value: 4
              },
              {
                label: '文章标题',
                value: 5
              }
            ],
            style: {
              width: '120px'
            },
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'searchInput',
            value: 'fuzzySearch1',
            placeholder: '评论人/IP/评论内容/回复内容/文章标题',
            hiddenKey: 'senior',
            style: {
              width: '328px'
            },
            hiddenValue: false
          },
          {
            type: 'searchInput',
            value: 'fuzzySearch2',
            placeholder: '请输入搜索内容',
            fuzzySearch2: true,
            hiddenKey: 'senior',
            style: {
              width: '160px'
            },
            hiddenValue: true
          },
          {
            type: 'senior',
            value: 'senior'
          }
        ]
      },
      causeForm: {

      },
      causeRules: {
        replytText: [this.$rules.required()]
      },
      causeFormItems: [
        {
          prop: 'replytText',
          type: 'textarea',
          autosize: { minRows: 3 },
          maxlength: 150
        }
      ],
      causeButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      rowId: '',
      reportNum: null
    }
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    // 打开禁言列表
    openShutup () {
      this.$routerLink('/interact/comment/forbid/index')
    },
    // 打开举报列表
    openReport () {
      this.$routerLink('/interact/comment/report')
    },
    // 点击名字
    handleUesr (data, index) {
      this.$routerLink('/interact/comment/member?userId=' + data.user.id)
    },
    // 点击IP
    handleIP (data, index) {
      this.$routerLink('/interact/comment/ip?precisionIp=' + data.ip)
    },
    handleOpencomment (data, index) {
      this.$routerLink('/interact/comment/Content?contentId=' + data.content.id)
    },
    handleOpenNews (data, index) {
      if (data.content && data.content.urlWhole) {
        window.open(data.content.urlWhole)
      } else {
        this.$message('没有浏览地址')
      }
    },
    // 搜索处理
    handleSearchs () {
      this.list.pageNo = 1
      var params = this.list.params
      if (params.channel.length > 0) {
        params.channelId = params.channel[params.channel.length - 1]
      }
      if (params.senior) {
        params.fuzzySearch1 = ''
      } else {
        params.fuzzySearch2 = ''
        params.selectID = ''
        params.userName = ''
        params.ip = ''
        params.commentText = ''
        params.replytText = ''
        params.title = ''
        params.startTime = ''
        params.endTime = ''
        params.replyStartTime = ''
        params.replyEndTime = ''
      }
      if (params.criticalTimes) {
        params.startTime = params.criticalTimes[0]
        params.endTime = params.criticalTimes[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      if (params.replyTimes) {
        params.replyStartTime = params.replyTimes[0]
        params.replyEndTime = params.replyTimes[1]
      } else {
        params.replyStartTime = ''
        params.replyEndTime = ''
      }
      if (!params.fuzzySearch2) {
        params.fuzzySearch = params.fuzzySearch1
      } else if (!params.selectID) {
        params.fuzzySearch = params.fuzzySearch2
      } else if (params.selectID === 1) {
        params.userName = params.fuzzySearch2
      } else if (params.selectID === 2) {
        params.ip = params.fuzzySearch2
      } else if (params.selectID === 3) {
        params.commentText = params.fuzzySearch2
      } else if (params.selectID === 4) {
        params.replytText = params.fuzzySearch2
      } else if (params.selectID === 5) {
        params.title = params.fuzzySearch2
      }
      if (params.fuzzySearch2 === '') {
        params.userName = ''
        params.ip = ''
        params.commentText = ''
        params.replytText = ''
        params.title = ''
      }
      this.list.params = params
      this.fetchCommentApi()
    },
    // 回调
    fetchContentCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    // 推荐
    handleReferrer (data) {
      let obj = {}
      obj.id = data.id
      obj.top = true
      this.$confirm('是否确定推荐？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentTop(obj)
      })
    },
    // 取消推荐
    handleNoReferrer (data) {
      let obj = {}
      obj.id = data.id
      obj.top = false
      this.$confirm('是否确定取消推荐？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentTop(obj)
      })
    },
    // 审核通过
    handlePass (data) {
      let obj = {}
      obj.ids = []
      obj.ids.push(data.id)
      obj.status = 1
      this.$confirm('是否确定审核通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentStatus(obj)
      })
    },
    // 审核不通过
    handleNoPass (data) {
      let obj = {}
      obj.ids = []
      obj.ids.push(data.id)
      obj.status = 2
      this.$confirm('是否确定审核不通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentStatus(obj)
      })
    },
    // 取消用户禁止
    handleToUesr (data) {
      let obj = {}
      obj.id = data.id
      obj.isIp = false
      this.$confirm('是否确定取消用户禁止？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentCancelStop(obj)
      })
    },
    // 禁止用户
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
    // 禁止IP
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
    // 取消IP禁止
    handleToIp (data) {
      let obj = {}
      obj.id = data.id
      obj.isIp = true
      this.$confirm('是否确定禁止IP？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentCancelStop(obj)
      })
    },
    // 删除评论
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
    // 修改回复
    handlePutReply (data) {
      this.rowId = data.id
      this.causeForm = { isUpdate: true }
      this.causeTitle = '修改回复'
      this.$refs.causeDialog.showDialog()
    },
    // 回复
    handleReply (data) {
      this.rowId = data.id
      this.causeForm = { isUpdate: false }
      this.causeTitle = '编辑回复'
      this.$refs.causeDialog.showDialog()
    },
    // 编辑回复
    handleConfirmCause (data) {
      if (this.rowId) {
        data.id = this.rowId
        this.fetchInteractUsercommentReply(data)
      }
    },
    // 撤回审核
    handleBackPass (data) {
      let obj = {}
      obj.ids = []
      obj.ids.push(data.id)
      obj.status = 3
      this.$confirm('是否确定撤回审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentStatus(obj)
      })
    },
    // 批量审核通过
    changeAuditPass (ids) {
      let data = {}
      data.ids = ids
      data.status = 1
      this.$confirm('是否确定批量审核通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentStatus(data)
      })
    },
    // 批量审核不通过
    changeAuditNoPass (ids) {
      let data = {}
      data.ids = ids
      data.status = 2
      this.$confirm('是否确定批量审核不通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchInteractUsercommentStatus(data)
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
    // 批量点击
    handleBatchAll (ids, btn) {
      if (ids.length > 0) {
        switch (btn.btn) {
          case 'Pass':
            // 审核通过
            this.changeAuditPass(ids, 1)
            break
          case 'NoPass':
            // 审核不通过
            this.changeAuditNoPass(ids, 1)
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
    // 修改审核状态
    fetchInteractUsercommentStatus (data) {
      this.$request.fetchInteractUsercommentStatus(data).then(res => {
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
          this.fetchCommentApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 推荐
    fetchInteractUsercommentTop (data) {
      this.$request.fetchInteractUsercommentTop(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchCommentApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 取消禁止
    fetchInteractUsercommentCancelStop (data) {
      this.$request.fetchInteractUsercommentCancelStop(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchCommentApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
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
    // 回复
    fetchInteractUsercommentReply (data) {
      this.$request.fetchInteractUsercommentReply(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchCommentApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 查询列表数量
    fetchInteractUsercommentCount (data) {
      this.$request.fetchInteractUsercommentCount(data).then(res => {
        if (res.code === 200) {
          this.reportNum = res.data.reportNum
        }
      })
    },
    // 栏目联级选择器
    fetchChannelTreeOption () {
      this.$request.fetchChannelTreeOption().then(res => {
        if (res.code === 200 && res.data instanceof Array) {
          this.searchHeader.searchItems.find(d => d.value === 'channel').options = res.data
          this.searchHeader.searchItems.find(d => d.value === 'channel').options.unshift({ name: '全部', id: '', value: '' })
        }
      })
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    this.fetchChannelTreeOption(this.currentSiteId)
    this.fetchInteractUsercommentCount()
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchCommentApi()
      this.fetchInteractUsercommentCount()
      this.$router.push({ query: { type: '' } })
    }
  }
}
</script>

<style lang="scss">
.interact-comment-index-container{
  .lists{
    width: 220px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    p{
      cursor:pointer;
    }
  }
  .cause-dialog .el-dialog__body .el-form .el-form-item__content{
    margin-left: 0 !important;
    .el-textarea{
      max-width: 540px;
      width: 540px;
    }
  }
}
</style>
