<template>
  <section class="wechat-public-index">
    <base-header
      v-show="name === 'wechatPublic'||(name !== 'wechatPublic'&&list.data.length<1)"
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      />
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleReauthorization="handleTableReauthorization"
      @handleRevokeauthorization="handleTableRevokeauthorization"
      @handleSetAdmin="handleTableSetAdmin"
    >
      <template #wechatName="scope">
        <div class="resource-wrap">
          <el-image
            class="resource-img"
            :src="scope.scope.row.headImg"
            fit="contain">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
          </el-image>
          <div class="resource-name">
            <el-link :underline='false' type='primary' class="jee-color"
              @click="wechatDetail(scope.scope.row)"
              :title="scope.scope.row.wechatName"
              :disabled="!_checkPermission('/wechatInfo', 'GET')"
              >{{scope.scope.row.wechatName}}</el-link>
            <div>
              <el-tag class="tag-prim" size="mini" type="warning"
              v-if="scope.scope.row.type === 1&&scope.scope.row.isDefaultAuth">默认</el-tag>
            </div>
          </div>
        </div>
      </template>
      <template #verifyStatus="scope">
        <span>
          <jee-icon
            v-if="scope.scope.row.verifyStatus === 2"
            iconClass="web__yirenzheng"
            :style="{iconFont:'14px',fill:'#02C33D'}"></jee-icon>
          <jee-icon v-else
            iconClass="web__weirenzheng"
            :style="{iconFont:'14px',fill:'#ff0000'}"></jee-icon>
          {{scope.scope.row.verifyStatus === 2?'已认证':'未认证'}}
        </span>
      </template>
    </base-table>
    <set-admin ref="setAdmin" @handleConfirm="setAdminList"></set-admin>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import { mapGetters } from 'vuex'
import setAdmin from '../../Weibo/Account/setAdmin'
var columns = [
  {
    prop: 'id',
    label: '序号'
  },
  {
    prop: 'wechatName',
    label: '账号',
    minWidth: '300px',
    scopeType: 'slot'
  },
  {
    prop: 'wechatType',
    label: '类型',
    minWidth: '120px',
    formatter: (row, column, cellValue, index) => {
      if (row.type === 1) {
        if (row.wechatType === 1) {
          return '普通订阅号'
        } else {
          return '服务号'
        }
      } else {
        return '微信小程序'
      }
    }
  },
  {
    prop: 'verifyStatus',
    label: '是否认证',
    scopeType: 'slot',
    minWidth: '135px'
  },
  {
    prop: 'createUser',
    label: '授权人',
    minWidth: '135px'
  },
  {
    prop: 'createTime',
    label: '授权时间',
    minWidth: '165px'
  }
]
export default {
  name: 'wechatPublic',
  mixins: [baseHeader, baseTable],
  components: {
    setAdmin
  },
  data () {
    return {
      theName: 'wechatPublic',
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新增授权',
            icon: 'xinzengshouquan',
            disabled: !this._checkPermission('/weChat/grantAuth', 'GET', true)
          }
        ],
        showAlertIcon: false
      },
      list: {
        columns,
        api: 'fetchWechatInfoPage',
        params: {
          'type': 1
        },
        handleColumn: [
          {
            type: 'Revokeauthorization',
            name: '取消授权',
            icon: 'quxiaoshouquan',
            disabled: !this._checkPermission('/wechatInfo', 'DELETE')
          },
          {
            type: 'Reauthorization',
            name: '重新授权',
            icon: 'chongxinshouquan',
            disabled: !this._checkPermission('/weChat/grantAuth', 'GET', true)
          },
          {
            type: 'SetAdmin',
            name: '设置管理员',
            icon: 'guanliyuan',
            disabled: !this._checkPermission('/wechatInfo/coreUser', 'POST')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '325px',
          align: 'left'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['currentSiteId'])
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    name (newVal, oldVal) {
      if (newVal === this.theName) {
        this.getPubData()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === this.theName) {
        this.getPubData()
      }
    })
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.getPubData()
      this.$router.push({ query: { type: '', ...this.$route.query } })
    }
  },
  methods: {
    getPubData () {
      this.list.params.type = this.name === 'wechatPublic' ? 1 : 2
      if (this.name === 'wechatPublic') {
        let obj = {
          prop: 'userNames',
          label: '管理员',
          minWidth: '135px'
        }
        this.list.columns.splice(6, 1, obj)
      } else if (this.list.columns.length > 6) {
        this.list.columns.splice(6, 1)
      }
      this.fetchTableApi()
    },
    handleHeaderAdd (btn) {
      if (this.currentSiteId) {
        window.open(this.$path + '/weChat/grantAuth?siteId=' + this.currentSiteId, '_blank')
      }
    },
    // 重新授权
    handleTableReauthorization (data, btn) {
      this.handleHeaderAdd()
    },
    // 设置管理员
    handleTableSetAdmin (data, btn) {
      var params = {
        'id': data.id
      }
      this.$refs.setAdmin.showTheDialog(data, btn, params, 'wechatInfoCoreUserList')
    },
    setAdminList (data) {
      var params = {
        'id': data.id,
        'userIds': data.ids
      }
      this.$request.wechatInfoCoreUserAdd(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    // 取消授权
    handleTableRevokeauthorization (data, btn) {
      let msg = '是否确认取消授权?'
      if (data.isDefaultAuth && this.list.params.type === 1) {
        msg = '需要取消此公众号的默认状态才能取消授权'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.wechatInfoRevoke({ ids: [data.id] }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      }).catch(() => {})
    },
    // 查看公众号详情
    wechatDetail (row) {
      if (this.name !== 'wechatPublic') {
        this.$routerLink('/social/wechat/applet/detail', 'detail', { id: row.id, appId: row.appId })
      } else {
        this.$routerLink('/social/wechat/public/detail', 'detail', { id: row.id })
      }
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        if (res.data.content) {
          this.list.data = res.data.content.map((d, i) => {
            if (this.list.params.type === 2) {
              d.hiddenSetAdmin = true
            }
            return d
          })
        } else {
          this.list.data = []
        }

        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .wechat-public-index{
    // table 名称
    .el-tag.el-tag--warning.tag-prim{
      background-color: #F8E8DD;
      color: #FF6C00;
      // margin-left: 5px;
      font-size: 12px;
      width: 38px;
      height: 20px;
    }
    .resource-wrap{
      padding: 20px 0;
    }
    .resource-img{
      width: 80px !important;
      height: 80px !important;
      box-sizing: border-box;
      margin-right: 20px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      background-color: #FAFAFA;
      display: inline-block;
      vertical-align: middle;
      .el-image__inner{
        max-width: 100%;
        max-height: 100%;
      }
    }
    .resource-name{
      display: inline-block;
      overflow: hidden;
      vertical-align: middle;
      cursor: pointer;
      font-size: 14px;
      min-width: 90px;
      line-height: 24px;
    }
  }
</style>
