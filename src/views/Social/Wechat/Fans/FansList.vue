<template>
  <section class="fans-list-index" v-loading="loading">
    <search-header
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
    ></search-header>
    <el-container >
      <el-aside width="290px" class="t-border fans-list-aside">
        <fans-aside
          @tagIdSel="tagIdSel"
          @tagList="getTagList"
          :appId="id"
          :tagid="list.params.tagid"></fans-aside>
      </el-aside>
      <el-main>
        <div class="fans-handle t-top">
           <el-button  v-for="(btn,btnIndex) in submitBtns"  :key="btnIndex"
              v-bind="btn" type="empty" size="mini"
              @click="handleSubmitBtn(btn)">{{$t(btn.text)}}</el-button>
        </div>
        <base-table
          v-bind="list"
          @handleSelectionChange="handleSelectionChange"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @handleSend="handleTableSend"
        >
          <template #headimgurl="scope">
            <head-info :infoData="scope.scope.row" :appId="id" type="fans"
               :tags="tags"  @setTags="fetchTableApi"></head-info>
          </template>
          <template #nickname="scope">
            <div class="wechat-name-box">
              <div v-html="$showEmojiName(scope.scope.row.nickname)"></div>
              <div class="t-label t-14" style="margin-top:20px"
                v-if="scope.scope.row.tagidList === ''">无标签
                  <set-tags
                  :tags="tags"
                  :appId="id"
                  :data="scope.scope.row"
                  @setTags="fetchTableApi" ></set-tags>
                </div>
              <div class="wechat-name-tag" v-else>
                <el-tag
                  v-for="(item,index) in scope.scope.row.tags"
                  :key="item"
                  v-show="index<3"
                  type="info"
                  size="mini"
                  effect="plain">
                  {{ item }}
                </el-tag>
                <span class="t-label" v-show="scope.scope.row.tags.length>3">共{{scope.scope.row.tags.length}}个标签</span>&nbsp;
                <set-tags
                  :tags="tags"
                  :appId="id"
                  :data="scope.scope.row"
                  @setTags="fetchTableApi" ></set-tags>
              </div>
            </div>
          </template>
        </base-table>
      </el-main>
    </el-container>
    <form-dialog
      ref="editDialog"
      class="t-check"
      v-bind="edit"
      v-on:handleConfirm="handleConfirm"
    >
    </form-dialog>
  </section>
</template>

<script>
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import fansAside from './fansAside'
import setTags from './setTags'
import headInfo from '../components/headInfo'

const columns = [
  {
    prop: 'headimgurl',
    label: '粉丝头像',
    scopeType: 'slot',
    minWidth: '85px'
  },
  {
    prop: 'nickname',
    label: '粉丝昵称',
    scopeType: 'slot',
    minWidth: '400px'
  },
  {
    prop: 'subscribeTimes',
    label: '关注时间',
    minWidth: '170px'
  }
]
export default {
  name: 'fans-list',
  mixins: [searchHeader, baseTable, formDialog],
  components: {
    fansAside,
    setTags,
    headInfo
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    id (newVal) {
      if (newVal && this.name === 'fansList') {
        this.list.api = 'fetchWechatfansPage'
        this.list.params.appId = newVal
        this.fetchTableApi()
      }
    },
    name (newVal, oldVal) {
      if (newVal === 'fansList' && this.id) {
        this.list.api = 'fetchWechatfansPage'
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.submitBtns.find(v => v.bthType === 'SyncFans').disabled = true
      this.submitBtns.find(v => v.bthType === 'Blacklist').disabled = true
      if (this.name === 'fansList' && this.id) {
        this.list.api = 'fetchWechatfansPage'
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    })
  },
  data () {
    return {
      loading: false,
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            label: '粉丝昵称:',
            value: 'nicknames'
          }
        ]
      },
      list: {
        columns,
        api: '',
        params: {
          'appId': '',
          'nickname': '',
          'nicknames': '',
          'tagid': ''
        },
        handleColumn: [
          {
            type: 'Send',
            name: '发送消息',
            href: '/social/wechat/fans/send',
            icon: 'zhifeiji-aqg',
            disabled: !this._checkPermission('/wechatfans/send', 'POST')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          align: 'left',
          width: '120px'
        }
      },
      submitBtns: [
        {
          text: '设置标签',
          bthType: 'SetTags',
          disabled: !this._checkPermission('/wechattags/set', 'POST')
        },
        {
          text: '同步所有粉丝',
          bthType: 'SyncFanAll',
          disabled: !this._checkPermission('/wechatfans/sync', 'GET')
        },
        {
          text: '同步选中粉丝',
          bthType: 'SyncFans',
          disabled: !this._checkPermission('/wechatfans/syncFans', 'POST')
        },
        {
          text: '加入黑名单',
          bthType: 'Blacklist',
          disabled: !this._checkPermission('/wechatfans/black', 'POST')
        }
      ],
      edit: {
        title: '设置标签',
        labelWidth: '0px',
        formLoading: false,
        form: {
          'appId': this.id,
          'tagids': [],
          'ids': []
        },
        rules: {},
        buttons: [
          {
            text: '确认',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            prop: 'tagids',
            type: 'checkbox',
            optionLabel: 'tagName',
            optionValue: 'id',
            options: []
          }
        ]
      },
      tags: []
    }
  },
  methods: {
    handleSearchs () {
      let params = this.list.params
      let s = /^[\u4e00-\u9fa5]{0,}$/
      if (s.test(params.nicknames)) {
        params.nickname = this.$emojiCodeName(params.nicknames)
      } else {
        params.nickname = params.nicknames
      }
      this.list.params = params
      this.fetchTableApi()
    },
    // 发送消息
    handleTableSend (data, i, btn) {
      let query = {
        appId: data.appId,
        openid: data.openid
      }
      this.$routerLink(btn.href, 'link', query)
    },
    // 标签列表
    getTagList (data) {
      this.tags = data
      this.edit.formItems.find(v => v.prop === 'tagids').options = data
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          if (d.tagidList) {
            let tags = this.tags.filter(v => d.tagidList.indexOf(v.id) > -1)
            d.tags = tags.map(v => { return v.tagName })
          }
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    // 标签选择
    tagIdSel (val) {
      this.list.params.tagid = val
      this.fetchTableApi()
    },
    // 选择
    handleSelectionChange (data) {
      var ids = data.map(v => v[this.list.rowKey])
      this.list.selectedKeys = ids
      if (ids.length > 0) {
        this.submitBtns.find(v => v.bthType === 'SyncFans').disabled = !this._checkPermission('/wechatfans/syncFans', 'POST')
        this.submitBtns.find(v => v.bthType === 'Blacklist').disabled = !this._checkPermission('/wechatfans/black', 'POST')
      } else {
        this.submitBtns.find(v => v.bthType === 'SyncFans').disabled = true
        this.submitBtns.find(v => v.bthType === 'Blacklist').disabled = true
      }
    },

    // 按钮组
    handleSubmitBtn (btn) {
      let ids = this.list.selectedKeys
      let params = {}
      switch (btn.bthType) {
        case 'SetTags':
          if (ids.length > 0) {
            this.edit.form.ids = ids
            this.$refs.editDialog.showDialog()
          } else {
            this.$message('请至少选择一位粉丝')
          }
          break
        case 'SyncFanAll':
          this.loading = true
          params = {
            appId: this.id
          }
          this.$request.fetchWechatfansSync(params).then(res => {
            this.$restBack(res, () => {
              this.fetchTableApi()
            })
            this.loading = false
          })
          break
        case 'SyncFans':
          this.loading = true
          if (ids.length > 0) {
            params = {
              appId: this.id,
              ids: ids
            }
            this.$request.fetchWechatfansSyncFans(params).then(res => {
              this.$restBack(res, () => {
                this.fetchTableApi()
              })
              this.loading = false
            })
          } else {
            this.$message('请至少选择一位粉丝')
            this.loading = false
          }

          break
        case 'Blacklist':
          if (ids.length > 0) {
            this.$confirm(
              '加入黑名单后，你将无法接收该用户发来的消息，且该用户无法接收公众号发出的消息，无法参与留言和赞赏，确认加入黑名单？',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
              params = {
                appId: this.id,
                ids: ids
              }
              this.$request.fetchWechatfansBlack(params).then(res => {
                this.$restBack(res, () => {
                  this.fetchTableApi()
                })
              })
            }).catch(() => {})
          } else {
            this.$message('请至少选择一位粉丝')
          }

          break
      }
    },
    // 设置标签
    handleConfirm (data) {
      let params = {
        'appId': this.id,
        'tagids': data.tagids,
        'ids': data.ids
      }
      this.$request.fetchWechattagsSet(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, '设置成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .fans-list-index{
    .el-container{
      .fans-list-aside{
        position: relative;
        left: 1px;
        height: calc(100vh - 268px);
      }
      .wechat-name-box{
        line-height: 1;
        .set-tags{
          cursor: pointer;
        }
      }
      .wechat-name-tag{
        margin-top: 10px;
        .el-tag{
          margin-right: 10px;
          padding: 1px 19px;
          height: 22px;
          border-radius: 10px;
          background-color: #ffffff;
          border: 1px solid #e8e8e8;
        }
      }
      .fans-handle{
        padding: 8px 20px;
        border-right: 1px solid #e8e8e8;
      }
    }
  }
</style>
