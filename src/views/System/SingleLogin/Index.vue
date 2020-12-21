<template>
  <el-container direction="vertical" v-loading="form.loading" class="system-single-login-container">
    <base-header v-bind="headers"/>
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
      :options="{
        ftpOptions,
        ossOptions
      }"
    ></base-form>
  </el-container>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'

export default {
  name: 'singleLoginSetting',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        title: '操作说明',
        content: '单点登录功能需要安装jeesso统一身份认证系统后才能正常使用'
      },
      form: {
        api: 'fetchSingleLoginDetail',
        params: {},
        labelWidth: '236px',
        form: {
          openSso: false,
          appId: '',
          appSecret: ''
        },
        formItems: [
          {
            prop: 'openSso',
            label: '是否开启单点登录：',
            type: 'radio',
            options: [
              {
                value: false,
                label: '关闭'
              },
              {
                value: true,
                label: '开启'
              }
            ]
          },
          {
            prop: 'appId',
            label: '应用APPID：',
            type: 'textarea',
            hiddenKey: 'openSso',
            hiddenValue: true
          },
          {
            prop: 'appSecret',
            label: '应用Secret：',
            type: 'textarea',
            hiddenKey: 'openSso',
            hiddenValue: true
          }
        ],
        rules: {
          appId: [
            this.$rules.required()
          ],
          appSecret: [
            this.$rules.required()
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/sso', 'POST')
        }]
      }
    }
  },
  methods: {
    // 保存按钮提交
    handleConfirm (data) {
      this.form.loading = true
      this.$request.fetchSingleLoginUpdate(data).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
        }
        this.form.loading = false
      })
    },
    fetchFormApi () {
      this.form.loading = true
      this.$request[this.form.api]().then(res => {
        if (res.code === 200) {
          this.form.form = res.data
        }
        this.form.loading = false
      })
    }
  },
  mounted () {
    this.fetchFormApi()
  }
}
</script>
