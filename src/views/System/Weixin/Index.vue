<template>
  <div class="system-setting-container">
    <base-header v-bind="headers"/>
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    >
      <template #messageValidateToken="scope">
        <el-input v-model="scope.form[scope.item.prop]" maxlength="16" placeholder="请输入消息验证Token">
          <el-button slot="append" class="jee-bg-light-important" size="small" @click="generationToken">自动生成</el-button>
        </el-input>
      </template>
      <template #messageDecryptKey="scope">
        <el-input v-model="scope.form[scope.item.prop]" maxlength="43" placeholder="请输入消息加密Key">
          <el-button slot="append" class="jee-bg-light-important" size="small" @click="generationKey">自动生成</el-button>
        </el-input>
      </template>
    </base-form>
  </div>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import { randomWord } from '@/utils'

export default {
  name: 'weixin',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '设置微信开放平台应用，设置成功之后即可使用授权方式接入微信公众号选项不可填写的为系统与微信开放平台对接的固定信息，不能修改，可将自动生成好的信息直接填入微信开放平台应用中'
      },
      form: {
        api: 'fetchWeiXinDetail',
        labelWidth: '236px',
        form: {
        },
        formItems: [
          {
            type: 'title',
            label: '应用基本信息'
          },
          {
            prop: 'name',
            label: '名称:',
            placeholder: '请输入应用名称',
            maxlength: 150
          },
          {
            prop: 'appId',
            label: 'AppId:',
            placeholder: '请输入应用AppId',
            maxlength: 50
          },
          {
            prop: 'appSecret',
            label: 'AppSecret:',
            placeholder: '请输入应用AppSecret',
            maxlength: 150
          },
          {
            type: 'title',
            label: '授权流程相关'
          },
          {
            type: 'text',
            prop: 'domainText',
            label: '授权发起页域名：',
            explain: '{domain}为程序部署域名，在创建微信开放平台应用时，请将该地址中{domain}更改为实际访问域名然后再填入对应的选项中'
          },
          {
            type: 'text',
            prop: 'urLText',
            label: '授权事件接收URL：',
            explain: '{domain}为程序部署域名，在创建微信开放平台应用时，请将该地址中{domain}更改为实际访问域名然后再填入对应的选项中'
          },
          {
            type: 'title',
            label: '授权后实现业务'
          },
          {
            type: 'slot',
            prop: 'messageValidateToken',
            label: '消息校验Token:',
            placeholder: '请输入消息验证Token',
            explain: '只能是字母和数字，如不清楚如何获取规定字符串，请点自动生成，再将生成字符串填入微信开放平台'
          },
          {
            type: 'slot',
            prop: 'messageDecryptKey',
            label: '消息加解密Key:',
            placeholder: '请输入消息加密Key',
            explain: '必须是长度为43的字符串，只能是字母和数字，如不清楚如何获取规定字符串，请点自动生成，再将生成字符串填入微信开放平台'
          },
          {
            type: 'text',
            prop: 'newsText',
            label: '消息与事件接收URL：',
            explain: '{domain}为程序部署域名，在创建微信开放平台应用时，请将该地址中{domain}更改为实际访问域名然后再填入对应的选项中(注：$APPID$不需要替换)'
          },
          {
            type: 'text',
            prop: 'publicText',
            label: '公众号开放域名：',
            explain: '{domain}为程序部署域名，在创建微信开放平台应用时，请将该地址中{domain}更改为实际访问域名然后再填入对应的选项中'
          }
        ],
        rules: {
          name: [this.$rules.required()],
          appId: [this.$rules.required()],
          appSecret: [this.$rules.required()],
          messageValidateToken: [this.$rules.required(), this.$rules.enNum(), this.$rules.min(16), this.$rules.haveCnEnNum()],
          messageDecryptKey: [this.$rules.required(), this.$rules.enNum(), this.$rules.min(43), this.$rules.haveCnEnNum()]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/weChatSetUp', 'PUT')
        }]
      }
    }
  },
  methods: {
    generationToken () {
      this.form.form.messageValidateToken = randomWord(false, 16)
    },
    generationKey () {
      this.form.form.messageDecryptKey = randomWord(false, 43)
    },
    handleConfirm (data) {
      this.form.loading = true
      const api = data.id ? 'fetchWeiXinUpdate' : 'fetchWeiXinCreate'
      this.$request[api](data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
        this.form.loading = false
      }).catch(() => {
        this.form.loading = false
      })
    }
  },
  created () {
    this.$request.fetchWeiXinDetail().then(res => {
      if (res.code === 200) {
        this.form.form = res.data
        this.form.form.urLText = '{domian}/weChat/authCallBack'
        this.form.form.domainText = '{domain}'
        this.form.form.newsText = '{domain}/weChat/keyword/reply/$APPID$'
        this.form.form.publicText = '{domain}'
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.system-setting-container{
  font-size: 16px;
  .jee-bg-light-important{
    height: 40px;
    width: 100px !important;
  }
}
</style>
