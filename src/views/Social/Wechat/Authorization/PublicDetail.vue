<template>
  <section class="wechat-public-detail">
    <base-header
      v-bind="headers"
      @handleRevoke="handleHeaderRevoke"
      @handleReauthorization="handleHeaderReauthorization"
      />
    <div class="wp-box">
      <div class="wp-box__img">
        <el-image
          class="t-img t-radius"
          :src="form.form.headImg"
          fit="contain">
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
      </div>
      <div class="wp-box__cont">
        <div class="wp-box__name">{{form.form.wechatName}}
          <el-tag class="tag-prim" size="mini" type="warning"
              v-if="form.form.isDefaultAuth">默认</el-tag></div>
        <div class="wp-box__info">主体信息： {{form.form.principalName}}</div>
      </div>
      <div class="wp-box__details">
        <base-header v-if="!form.form.isDefaultAuth"
          v-bind="headers2"
          @handleSet="handleHeaderSet"
        />
      </div>
    </div>
    <base-form
      v-bind="form"
    >
    </base-form>
    <div class="wp-foot">
      <div class="form-item-title">
        <div class="jee-bg-light"></div>
        <h1>授权信息 &nbsp;&nbsp;
           <span class="t-label t-14 t-font-w400">
             （如出现功能异常或提示无权限，请尝试重新授权，赋予所有权限，<a class="jee-color"
              @click="authorization">重新授权</a>）</span>
        </h1>
      </div>
      <ul class="wp-foot__cont" v-show="options.length >0">
        <li class="wp-foot__item"
          v-for="(item,index) in options"
          :key="index">
          <el-tag
            size="mini"
            :type="form.form.funcInfo.indexOf(item.value)>-1?'success':'danger'"
             effect="plain">{{form.form.funcInfo.indexOf(item.value)>-1?'已授权':'未授权'}}</el-tag>
          {{item.label}}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import { mapGetters } from 'vuex'
export default {
  name: 'socialWechatPublicDetail',
  mixins: [baseHeader, baseForm],
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
      headers2: {
        showType: 'hover',
        popoverData: {
          icon: 'wenti',
          popoverWidth: '280',
          popoverText: '在移动设备中使用微信快捷登录时，需要通过微信公众号进行登录授权；若站点中存在多个公众号，只能选择其中一个作为登录授权账号。此设置仅用于微信快捷登录，不影响其他功能。'
        },
        buttons: [
          {
            type: 'Set',
            text: '设置为登录授权账号',
            prim: true,
            size: 'mini',
            disabled: !this._checkPermission('/wechatInfo/default', 'GET')
          }
        ],
        title: '',
        showAlertIcon: true
      },
      form: {
        api: 'wechatInfoGet',
        labelWidth: '100px',
        showSubmitButton: false,
        params: { id: '' },
        form: {
          funcInfo: ''
        },
        formItems: [
          {
            type: 'title',
            label: '公众号基本信息'
          },
          {
            prop: 'headImg',
            label: '头像：',
            type: 'image',
            style: {
              width: '80px',
              height: '80px',
              backgroundColor: '#fafafa'
            }
          },
          {
            prop: 'qrcodeUrl',
            label: '二维码：',
            type: 'image',
            weChat: true,
            style: {
              width: '80px',
              height: '80px',
              backgroundColor: '#fafafa'
            }
          },
          {
            prop: 'globalId',
            label: '原始ID：',
            type: 'text'
          },
          {
            prop: 'appId',
            label: 'AppId：',
            type: 'text'
          },
          {
            prop: 'type',
            label: '类型：',
            type: 'text'
          },
          {
            prop: 'grantType',
            label: '接入方式：',
            type: 'text'
          },
          {
            prop: 'verifyStatus',
            label: '认证状态：',
            type: 'text'
          },
          {
            prop: 'createUser',
            label: '授权人：',
            type: 'text'
          },
          {
            prop: 'createTime',
            label: '授权时间：',
            type: 'text'
          }
        ]
      },
      options: []
    }
  },
  computed: {
    ...mapGetters(['currentSiteId'])
  },
  inject: ['removeTab'],
  methods: {
    // 取消授权
    handleHeaderRevoke (btn) {
      let msg = '是否确认取消授权?'
      if (this.form.form.isDefaultAuth) {
        msg = '需要取消此公众号的默认状态才能取消授权'
      }
      let self = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.wechatInfoRevoke({ ids: [this.form.params.id] }).then(res => {
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
    // 设为默认账号
    handleHeaderSet (btn) {
      this.$request.wechatInfoDefault({ id: this.form.params.id }).then(res => {
        this.$restBack(res, () => {
          this.fetchFormApi()
        })
      })
    },
    // 授权
    authorization (btn) {
      if (this.currentSiteId) {
        window.open(this.$path + '/weChat/grantAuth?siteId=' + this.currentSiteId, '_blank')
      }
    },
    // 获取文件内容
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
        this.form.form.grantType = res.data.grantType === 1 ? '授权接入' : ''
        this.form.form.type = res.data.type === 1 ? '公众号' : '小程序'
        this.form.form.verifyStatus = res.data.verifyStatus === 1 ? '未认证' : '已认证'
        this.form.form.wechatType = res.data.wechatType === 1 ? '普通订阅号' : '服务号'
        let arr = this.$enums.wechatPermission.filter(v => this.form.form.funcInfo.indexOf(v.value) > -1)
        let arr2 = this.$enums.wechatPermission.filter(v => this.form.form.funcInfo.indexOf(v.value) < 0)
        this.options = arr.concat(arr2)
      }
    }
  },
  activated () {
    if (this.$route.query.id && this.form.params.id !== this.$route.query.id) {
      this.form.params.id = this.$route.query.id
    }
    this.fetchFormApi()
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$route.query.id) {
        this.form.params.id = this.$route.query.id
      }
      this.fetchFormApi()
    })
  }
}
</script>

<style lang="scss">
  .wechat-public-detail{
    .el-tag.el-tag--warning.tag-prim{
      background-color: #F8E8DD;
      color: #FF6C00;
      margin-left: 5px;
      font-size: 12px;
      font-weight: 400;
      width: 38px;
      height: 20px;
    }
    .wp-box{
      height: 120px;
      width: 100%;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      margin-bottom: 20px;
      &__img{
        background-color: #fafafa;
        width: 80px;
        height: 80px;
        vertical-align: middle;
      }
      &__cont{
        padding-top: 20px;
        margin-left: 20px;
        vertical-align: middle;
        width: 380px;
      }
      &__name{
        font-size: 18px;
        color: #333333;
        line-height: 1;
        font-weight: 600;
        margin-bottom: 12px;
      }
      &__info{
        line-height: 1;
        font-size: 16px;
        color: #666666;
      }
      &__details{
        flex: 1;
        .base-header-container{
          header{
            padding-bottom: 0;
          }
        }
      }
    }
    .wp-foot{
      border-top: 1px solid #e8e8e8;
      padding-top: 10px;
      &__font{
        max-width: 1200px;
      }
      &__item{
        display: inline-block;
        min-width: 200px;
        margin-left: 20px;
        font-size: 14px;
        color: #666666;
        margin-bottom: 20px;
        .el-tag{
          margin-right: 5px;
        }
      }
    }
    .el-button{
      margin-bottom: 0 !important;//删除操作说明新增样式
    }
  }
</style>
