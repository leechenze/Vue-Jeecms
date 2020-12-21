<template>
  <section class="black-list-index">
    <base-header
      v-bind="headers"
      @handleMove="handleHeaderMove"
      @handleSync="handleHeaderSync"
      >
        <template slot>
          <div class="input-right">
            <el-input
              v-model="list.params.nicknames"
              maxlength="50"
              @keyup.enter.native="handleSearchs($event)"
              size="medium" placeholder="搜索昵称"
              style="width:223px"
            >
              <el-button slot="append"
                style="height:36px;"
                size="small" class="jee-bg-light-important"
                @click="handleSearchs($event)">
                <jee-icon iconClass="xiazai15" style="fill: #ffffff"></jee-icon>
              </el-button>
            </el-input>
          </div>
        </template>
    </base-header>
    <base-table
        v-bind="list"
        @handleSelectionChange="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @handleMove="handleTableMove"
      >
      <template #nickname="scope">
        <div class="wechat-name-box">
          <div v-html="$showEmojiName(scope.scope.row.nickname)"></div>
          <div class="t-label t-14" style="margin-top:20px"
            v-if="scope.scope.row.tagidList === ''">无标签
              <!-- <set-tags
              :tags="tags"
              :appId="id"
              :data="scope.scope.row"
              @setTags="fetchTableApi" ></set-tags> -->
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
            <!-- <set-tags
              :tags="tags"
              :appId="id"
              :data="scope.scope.row"
              @setTags="fetchTableApi" ></set-tags> -->
          </div>
        </div>
      </template>
    </base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
const columns = [
  {
    prop: 'headimgurl',
    label: '粉丝头像',
    scopeType: 'img',
    minWidth: '85px',
    hasPath: true,
    style: {
      width: '50px',
      height: '50px',
      margin: '15px 0'
    }
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
  name: 'black-list',
  mixins: [baseHeader, baseTable],
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
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Move',
            prim: true,
            text: '批量移出黑名单',
            icon: 'yichu',
            disabled: !this._checkPermission('/wechatfans/cancelblack', 'POST')
          },
          {
            type: 'Sync',
            prim: true,
            text: '同步黑名单',
            icon: '',
            disabled: false
          }
        ],
        showAlertIcon: false
      },
      list: {
        columns,
        api: '',
        params: {
          'appId': this.id,
          'nickname': '',
          'nicknames': ''
        },
        handleColumn: [
          {
            type: 'Move',
            name: '移出黑名单',
            icon: 'yichu',
            disabled: !this._checkPermission('/wechatfans/cancelblack', 'POST')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          align: 'left',
          width: '135px'
        }
      },
      tags: []
    }
  },
  watch: {
    id (newVal) {
      if (this.name === 'blackList' && this.id) {
        this.list.api = 'fetchWechatfansBlackList'
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    },
    name (newVal, oldVal) {
      if (this.name === 'blackList' && this.id) {
        this.list.api = 'fetchWechatfansBlackList'
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'blackList' && this.id) {
        this.list.api = 'fetchWechatfansBlackList'
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    })
  },
  methods: {
    getTags () {
      if (this.id) {
        let params = { appId: this.id }
        this.$request.wechattagsApp(params).then(res => {
          if (res.code === 200) {
            this.tags = res.data.tagList
          }
        })
      }
    },
    handleHeaderMove (btn) {
      let ids = this.list.selectedKeys
      if (ids.length > 0) {
        let params = {
          appId: this.id,
          ids: ids
        }
        this.moveBlack(params)
      } else {
        this.$message('请至少选择一位粉丝进行操作')
      }
    },
    handleHeaderSync () {
      if (this.id) {
        let params = {
          appId: this.id
        }
        this.$request.fetchWechatfansSyncblack(params).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          }, '同步成功')
        })
      }
    },
    handleTableMove (data, btn) {
      let params = {
        appId: this.id,
        ids: [data.id]
      }
      this.moveBlack(params)
    },
    moveBlack (data) {
      this.$confirm('确认移出黑名单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchWechatfansCancelblack(data).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      }).catch(() => {})
    },
    handleSearchs () {
      let params = this.list.params
      if (params.nicknames) {
        params.nickname = this.$emojiCodeName(params.nicknames)
      }
      this.list.params = params
      this.fetchTableApi()
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .black-list-index{
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
  }
</style>
