<template>
  <section class="comment-list-index">
    <comment-box :appId="id" @changeMsgId="changeMsgId" :isOpen="isOpen" ></comment-box>
    <div class="cl-wrap">
      <search-header
        v-if="commentType"
        v-bind="searchHeader"
        :params="list.params"
        @handleSearch="handleSearchs"
        @handleBtn="handleBtns"
      >
        <div class="fr">
          <el-switch @change="onComment" v-model="commentType"></el-switch> &nbsp;
          <span class="t-14" :class="{'jee-font-hover':commentType}">{{commentType?'关闭留言':'留言'}}</span>
        </div>
      </search-header>
      <div class="cl-search" v-else>
        <span class="cl-wrap__label t-label fl">当前文章暂未开启留言功能，右侧开启</span>
        <div class="fr">
          <el-switch @change="onComment" v-model="commentType"></el-switch> &nbsp;
          <span class="t-14" :class="{'jee-font-hover':commentType}">{{commentType?'关闭留言':'留言'}}</span>
        </div>
      </div>
      <base-table
        class="comment-table"
        v-bind="list"
        @handleSelectionChange="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSelected="handleTableSelected"
        @handleDisSelected="handleTableSelected"
        @handleReply="handleTableReply"
        @handleDelete="handleTableDelete"
      >
        <template #content="scope">
          <div>
            <div class="msg-box__item">
              <div class="msg-box__img">
                <head-info :infoData="scope.scope.row.wechatFans" :appId="list.params.appId"
                  :tags="tags"  @setTags="fetchTableApi" ></head-info>
              </div>
              <div class="msg-box__content">
                <div style="margin-bottom:4px;">
                  <span class="t-14 t-title" v-html="$showEmojiName(scope.scope.row.wechatFans.nickname)"></span>
                  <span class="t-14 t-label" style="margin-left:10px">{{$moment(scope.scope.row.commentTime,'YYYY-MM-DD HH:mm:ss',true)}}</span>
                  <span v-if="scope.scope.row.commentType"> &nbsp;
                    <jee-icon iconClass="sheweijingxuan" :style="{fill:'#FF9600',fontSize:'20px'}"></jee-icon></span>
                </div>
                <div class="msg-box__label t-14">{{scope.scope.row.content}}</div>
              </div>
            </div>
            <div class='msg-box__replycontent' v-if="scope.scope.row.replyContent">
              <div class='avatar-wrap'>
                <el-image :src='wechatInfo.headImg'></el-image>
              </div>
              <div class='content-wrap'>
                <div>
                  <span class="t-14 t-title">{{wechatInfo.wechatName}}</span>
                  <span class="t-14 t-label" style="margin-left:20px">{{$moment(scope.scope.row.replyTime,'YYYY-MM-DD HH:mm:ss',true)}}</span>
                </div>
                <div class='jee-border'>
                  <span>@</span>
                  <span v-html="$showEmojiName(scope.scope.row.wechatFans.nickname)"></span>
                  <span>：{{scope.scope.row.content}}</span>
                </div>
                <div>
                  <span>{{scope.scope.row.replyContent}}</span>
                </div>
              </div>
              <el-link :underline="false" class="t-14 msg-box-del"
                  @click="delReply(scope.scope.row)" >
                <jee-icon iconClass="tangchuangguanbi" :style="{marginRight:'10px'}"
                  class="jee-hover-fill link-icon"></jee-icon>删除
              </el-link>
            </div>
          </div>
        </template>
      </base-table>
      <form-dialog
        title="留言回复"
        ref="addDialog"
        :loading="addFormLoading"
        :form="addForm"
        :rules="addRules"
        :formItems="addFormItems"
        v-on:handleConfirm="handleConfirmAdd"
        :buttons="addButtons"
      >
      </form-dialog>
    </div>
  </section>
</template>
<script>
import commentBox from './commentBox'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import headInfo from '../components/headInfo'
var columns = [
  {
    prop: 'content',
    label: '全部留言',
    scopeType: 'slot'
  }
]
export default {
  name: 'comment-list',
  mixins: [searchHeader, baseTable, formDialog],
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    wechatInfo: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    commentBox,
    headInfo
  },
  data () {
    return {
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'commentType',
            style: {
              width: '140px'
            },
            options: [
              {
                label: '全部留言',
                value: ''
              },
              {
                label: '精选留言',
                value: true
              }
            ]
          },
          {
            type: 'select',
            value: 'orderType',
            style: {
              width: '140px'
            },
            options: [
              {
                label: '默认排序',
                value: ''
              },
              {
                label: '留言时间倒序',
                value: 1
              },
              {
                label: '留言时间升序',
                value: 2
              }
            ]
          },
          {
            type: 'select',
            value: 'timeType',
            style: {
              width: '140px'
            },
            options: [
              {
                label: '所有留言',
                value: ''
              },
              {
                label: '最近五天',
                value: '1'
              },
              {
                label: '今天',
                value: '2'
              },
              {
                label: '昨天',
                value: '3'
              },
              {
                label: '前天',
                value: '4'
              }
            ]
          },
          {
            type: 'select',
            value: 'syncType',
            style: {
              width: '187px'
            },
            options: [
              {
                label: '关闭自动同步',
                value: ''
              },
              {
                label: '5分钟自动同步一次',
                value: '1'
              },
              {
                label: '10分钟自动同步一次',
                value: '2'
              },
              {
                label: '15分钟自动同步一次',
                value: '3'
              },
              {
                label: '30分钟自动同步一次',
                value: '4'
              },
              {
                label: '60分钟自动同步一次',
                value: '5'
              }
            ]
          },
          {
            type: 'henderBtns',
            disabled: false,
            text: '手动同步'
          },
          {
            type: 'searchInput',
            value: 'comment',
            style: {
              width: '222px'
            },
            placeholder: '留言内容'
          },
          {
            type: 'slot',
            value: 'commentType'
          }
        ]
      },
      tags: [],
      list: {
        showSelection: false,
        columns,
        api: '',
        params: {
          'appId': '',
          'msgDataId': '',
          'msgDataIndex': '',
          'commentType': '',
          'startTime': '',
          'endTime': '',
          'timeType': '',
          'orderType': '',
          'comment': '',
          'syncType': ''
        },
        handleColumn: [
          {
            type: 'Selected',
            name: '设为精选',
            icon: 'sheweijingxuan'
          },
          {
            type: 'DisSelected',
            name: '取消精选',
            icon: 'sheweijingxuan'
          },
          {
            type: 'Reply',
            name: '回复',
            icon: 'huifu'
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'tangchuangguanbi'
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '255px',
          align: 'left'
        }
      },
      addFormLoading: false,
      addForm: {
        reply: '',
        id: ''
      },
      addRules: {
        reply: [
          this.$rules.required()
        ]
      },
      addFormItems: [
        {
          type: 'textarea',
          prop: 'reply',
          placeholder: '请输入回复内容',
          label: '回复内容',
          autosize: { minRows: 4 },
          maxlength: 255
        }
      ],
      addButtons: [{
        text: '发送',
        type: 'Submit'
      }],
      commentType: false,
      isOpen: false
    }
  },
  methods: {
    handleSearchs () {
      let params = this.list.params
      let times = this.timeFilter(params.timeType)
      if (params.syncType) {
        this.syncTime(params.syncType)
      }
      params.startTime = times[0]
      params.endTime = times[1]
      this.list.params = params
      this.fetchTableApi()
    },
    syncTime (type) {
      let time = 0
      switch (type) {
        case '1':
          time = 5
          break
        case '2':
          time = 10
          break
        case '3':
          time = 15
          break
        case '4':
          time = 30
          break
        case '5':
          time = 60
          break
        default:
          time = 0
      }
      if (time > 0) {
        this.syncInterval(this.handleBtns, time * 60 * 1000)
      } else {
        clearInterval(this.intervalTime)
      }
    },
    syncInterval (fn, time) {
      this.intervalTime = setInterval(fn, time)
    },
    timeFilter (type) {
      let time = null
      let time2 = null
      switch (type) {
        case '1':
          time = this.$moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 5, 'YYYY-MM-DD', true)
          time2 = this.$moment(new Date().getTime(), 'YYYY-MM-DD', true)
          break
        case '2':
          time = time2 = this.$moment(new Date().getTime(), 'YYYY-MM-DD', true)
          break
        case '3':
          time = this.$moment(new Date().getTime() - 24 * 60 * 60 * 1000, 'YYYY-MM-DD', true)
          time2 = this.$moment(new Date().getTime(), 'YYYY-MM-DD', true)
          break
        case '4':
          time = this.$moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 2, 'YYYY-MM-DD', true)
          time2 = this.$moment(new Date().getTime(), 'YYYY-MM-DD', true)
          break
        default:
          time = time2 = ''
          break
      }
      return [time, time2]
    },
    handleTableSelected (data, btn) {
      // 设为精选
      let params = {
        id: data.id,
        fansId: data.wechatFans.id
      }
      if (!data.commentType) {
        this.$request.fetchWechatcommentMarkelect(params).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          }, '设置成功')
        })
      } else {
        this.$request.fetchWechatcommentUnmarkelect(params).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      }
    },
    handleTableReply (row, btn) {
      // 回复
      this.addForm.id = row.id
      this.$refs.addDialog.showDialog()
    },
    handleConfirmAdd (form) {
      this.$request.fetchWechatcommentReply(form).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, '回复成功')
      })
    },
    onComment (val) {
      let params = {
        'appId': this.list.params.appId,
        'msgDataId': this.list.params.msgDataId,
        'msgDataIndex': this.list.params.msgDataIndex
      }
      // 可留言
      if (val) {
        this.$request.fetchWechatcommentOn(params).then(res => {
          // res
          this.$restBack(res, () => {
            this.isOpen = true
          }, '设置成功')
        })
      } else {
        this.$request.fetchWechatcommentOff(params).then(res => {
          // res
          this.$restBack(res, () => {
            this.isOpen = true
          })
        })
      }
    },
    handleTableDelete (data, btn) {
      // 删除
      this.$confirm('是否删除该留言', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        let params = {
          id: data.id
        }
        this.$request.fetchWechatcommentDelete(params).then(res => {
          this.$restBack(res, () => {
            this.handleBtns()
            // this.fetchTableApi()
          })
        })
      }).catch(() => {})
    },
    delReply (row) {
      // 删除
      this.$confirm('是否删除该回复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        let params = {
          id: row.id
        }
        this.$request.fetchWechatcommentReplyDelete(params).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      }).catch(() => {})
    },
    // 手动同步
    handleBtns () {
      let params = {
        'appId': this.list.params.appId,
        'month': this.list.params.month,
        'year': this.list.params.year
      }
      this.$request.fetchWechatcommentHand(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, '同步成功')
      })
    },
    changeMsgId (data, params) {
      if (data.msgDataId) {
        this.list.params.appId = data.appId
        this.list.params.msgDataId = data.msgDataId
        this.list.params.msgDataIndex = data.msgDataIndex
        this.list.params.month = params.month
        this.list.params.year = params.year
        this.isOpen = false
        this.commentType = !!data.open
        this.list.api = 'fetchWechatcommentPage'
        this.fetchTableApi()
      } else {
        this.searchHeader.searchItems.find(t => t.type === 'henderBtns').disabled = true
        this.list.data = []
        this.list.columns[0].label = '全部留言'
      }
      if (!this.tags.length) {
        this.getTags()
      }
    },
    // 获取标签列表
    getTags () {
      if (this.list.params.appId) {
        let params = { appId: this.list.params.appId }
        this.$request.wechattagsApp(params).then(res => {
          if (res.code === 200) {
            this.tags = res.data.tagList
          }
        })
      }
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          if (d.wechatFans.tagidList) {
            let tags = this.tags.filter(v => d.wechatFans.tagidList.indexOf(v.id) > -1)
            d.wechatFans.tags = tags.map(v => { return v.tagName })
          }
          d.hiddenSelected = d.commentType
          d.hiddenDisSelected = !d.commentType
          d.hiddenReply = d.replyContent
          return d
        })
        this.list.totalCount = res.data.totalElements
        this.list.columns[0].label = `全部留言（${res.data.totalElements}条）`
      }
    }
  }
}
</script>

<style lang="scss">
  .comment-list-index{
    display: flex;
    height: 100%;
    .cl-wrap{
      flex: 1;
      &__label{
        font-size: 14px;
      }
      .cl-search{
        height: 50px;
        line-height: 50px;
        width: 100%;
        position: relative;
      }
    }
    .msg-box{
      &__item{
        padding: 20px 0;
        min-height: 50px;
        box-sizing: border-box;
        display: flex;
      }
      &__flex{
        display: flex;
        width: 100%;
      }
      &__img{
        margin-right: 20px;
        min-width: 50px;
        width: 50px;
        height: 50px;
        border-radius: 4px;
        position: relative;
        bottom: 15px;
      }
      &__content{
        width: 100%;
      }
      &__cont{
        font-size: 14px;
        max-width: 650px;
        line-height: 1;
        flex: 1;
      }
      &__name{
        color: #333333;
        margin-bottom: 8px;
        margin-top: 5px;
      }
      &__label{
        color: #999999;
      }
      &__time{
        margin-top: 5px;
        color: #999999;
        min-width: 245px;
        position: relative;
        line-height: 1;
      }
      &__reply{
        color: #0ABF41;
        margin-left: 30px;
      }
      &__replycontent{
        padding: 20px 0 20px 0px;
        margin-left: 50px;
        display: flex;
        border-top: 1px solid #e8e8e8;
        .avatar-wrap{
          width: 50px;
          height: 50px;
          margin-right: 20px;
          border-radius: 4px;
        }
        .content-wrap{
          >div:nth-of-type(2){
            color: #999999;
            padding-left: 20px;
            border-left-width: 3px;
            border-left-style: solid;
            line-height: 20px;
            margin: 6px 0;
          }
          >div:nth-of-type(1){
            color: #666666;
          }
        }
      }
      &__btn{
        margin-top: 5px;
        min-width: 65px;
        margin-left: 110px;
        line-height: 1;
        cursor: pointer;
        .jee-svg-icon{
          margin-right:8px;
        }
      }
      &__comment{
        margin-top: 20px;
        box-sizing: border-box;
        padding: 20px 20px 0;
      }
    }
    .msg-box-del{
      position: absolute;
      right: -57px;
      top: 115px;
      z-index: 1;
    }
    .comment-table{
      .el-table{
        &__body-wrapper{
          .el-table__body{
            .el-table__row{
              .is-left{
                position: relative;
                padding-top: 20px !important;
                vertical-align: top;
              }
            }
          }
        }
        .jee-svg-icon.sheweijingxuan{
          font-size: 14px;
        }
      }
    }
  }
</style>
