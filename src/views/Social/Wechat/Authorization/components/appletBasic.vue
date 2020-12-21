<template>
  <section class="applet-basic-index">
    <div class="wp-box">
      <div class="wp-box__img">
        <el-image
          class="t-img"
          :src="form.form.headImg"
          fit="contain">
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
      </div>
      <div class="wp-box__cont">
        <div class="wp-box__name">{{form.form.wechatName}}</div>
        <div class="wp-box__info">主体信息： {{form.form.principalName}}</div>
      </div>
    </div>
    <base-form
      v-bind="form"
    >
    </base-form>
    <div class="wp-foot">
      <div class="form-item-title">
        <div class="jee-bg-light"></div>
        <h1>服务类目 &nbsp;&nbsp;
           <a @click="refreshList"><jee-icon iconClass="shuaxin"></jee-icon></a>
        </h1>
      </div>
      <ul class="wp-foot__cont">
        <li class="wp-foot__item"
          v-for="(item,index) in categorys"
          :key="index">
          {{item.firstClass}}
            <span v-if="item.secondClass">></span> {{item.secondClass}}
            <span v-if="item.thirdClass"> / </span>{{item.thirdClass}}
        </li>
      </ul>
    </div>
    <div class="wp-foot">
      <div class="form-item-title">
        <div class="jee-bg-light"></div>
        <h1>授权信息 &nbsp;&nbsp;
           <span class="t-label t-14 t-font-w400">
             （如出现功能异常或提示无权限，请尝试重新授权，赋予所有权限，<a class="jee-color" target="_blank"
              :href="$path + '/weChat/grantAuth?siteId=' + currentSiteId">重新授权</a>）</span>
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
  name: 'appletBasic',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      form: {
        api: 'wechatInfoGet',
        labelWidth: '100px',
        showSubmitButton: false,
        params: { id: this.$route.query.id },
        form: {
          funcInfo: ''
        },
        formItems: [
          {
            type: 'title',
            label: '小程序基本信息'
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
      options: [],
      categorys: []
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    name (newVal, oldVal) {
      if (newVal === 'basic') {
        this.fetchFormApi()
      }
    }
  },
  computed: {
    ...mapGetters(['currentSiteId'])
  },
  methods: {
    refreshList () {
      this.getCategory('同步成功')
    },
    // 授权
    authorization (btn) {
      if (this.currentSiteId) {
        window.open(this.$path + '/weChat/grantAuth?siteId=' + this.currentSiteId, '_blank')
      }
    },
    getCategory (msg) {
      this.$request.wechatInfoCategory({ id: this.form.params.id }).then(res => {
        if (msg) {
          this.$restBack(res, () => {
            this.categorys = res.data
          }, msg)
        } else {
          if (res.code === 200) {
            this.categorys = res.data
          }
        }
      })
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
        this.$emit('handleAuth', res.data.isDefaultAuth)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'basic') {
        this.fetchFormApi()
        this.getCategory()
      }
    })
  }
}
</script>

<style lang="scss" >
  .applet-basic-index{
    .wp-box{
      height: 100px;
      width: 100%;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 20px 20px;
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
        // min-width: 200px;
        margin-right: 30px;
        margin-left: 20px;
        font-size: 14px;
        color: #666666;
        margin-bottom: 30px;
        .el-tag{
          margin-right: 5px;
        }
      }
    }
  }
</style>
