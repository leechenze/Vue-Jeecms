<template>
<!-- heyan -->
  <section class="wechat-applet-detail">
    <base-header
      v-bind="headers"
      @handleRevoke="handleHeaderRevoke"
      @handleReauthorization="handleHeaderReauthorization"
      />
    <el-tabs v-model="activeTab">
      <template v-for="(item, index) in tabs">
        <el-tab-pane :label="item.label" :name="item.name" :key="index">
          <label slot="label">{{item.label}}
            <!-- <jee-icon
            iconClass="caozuoshuoming1"
            :style="{fontSize: '16px'}"/> -->
            </label>
          <component :is="item.component" @addExperiencer="addExperiencer" @handleAuth="handleAuth" :name="activeTab"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import appletBasic from './components/appletBasic'
import appletEdition from './components/appletEdition'
import appletMember from './components/appletMember'
import appletServers from './components/appletServers'
import { mapGetters } from 'vuex'
export default {
  name: 'socialWechatAppletDetail',
  mixins: [baseHeader, baseForm],
  components: {
    appletBasic,
    appletEdition,
    appletMember,
    appletServers
  },
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Revoke',
            text: '取消授权',
            icon: 'quxiaoshouquan',
            disabled: !this._checkPermission('/wechatInfo', 'DELETE')
          },
          {
            type: 'Reauthorization',
            text: '重新授权',
            icon: 'chongxinshouquan',
            disabled: !this._checkPermission('/weChat/grantAuth', 'GET', true)
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      activeTab: 'basic',
      tabs: [
        {
          label: '基本设置',
          name: 'basic',
          component: 'appletBasic'
        },
        {
          label: '版本管理',
          name: 'edition',
          component: 'appletEdition'
        },
        {
          label: '成员管理',
          name: 'member',
          component: 'appletMember'
        },
        {
          label: '服务器域名',
          name: 'servers',
          component: 'appletServers'
        }
      ],
      isDefaultAuth: false
    }
  },
  computed: {
    ...mapGetters(['currentSiteId'])
  },
  inject: ['removeTab'],
  methods: {
    handleAuth (val) {
      this.isDefaultAuth = val
    },
    // 取消授权
    handleHeaderRevoke (btn) {
      let msg = '是否确认取消授权?'
      let self = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.wechatInfoRevoke({ ids: [self.$route.query.id] }).then(res => {
          self.$restBack(res, () => {
            self.removeTab(this.$route.fullPath)
            self.$routerLink('/social/wechat/authorization/index', 'list')
          })
        })
      }).catch(() => {})
    },
    // 重新授权
    handleHeaderReauthorization (btn) {
      this.authorization()
    },
    // 授权
    authorization (btn) {
      if (this.currentSiteId) {
        window.open(this.$path + '/weChat/grantAuth?siteId=' + this.currentSiteId, '_blank')
      }
    },
    addExperiencer () {
      this.activeTab = 'member'
    }

  },
  mounted () {
    this.$nextTick(() => {
      // this.fetchFormApi()
    })
  }
}
</script>
<style lang="scss">
 .wechat-applet-detail{
   .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
 }
</style>
