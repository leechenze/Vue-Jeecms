<template>
<!-- 单点登录详情 -->
  <section class="system-single-login-index-container">
    <base-header v-bind="headers"/>
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    ></base-form>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
export default {
  name: 'SingleLoginSetting',
  mixins: [baseHeader, baseForm],
  data () {
    const options = [
      {
        value: '1',
        label: '是'
      },
      {
        value: '0',
        label: '否'
      }
    ]
    return {
      headers: {
        title: '操作说明'
      },
      form: {
        labelWidth: '140px',
        form: {
          openSso: '0',
          appId: '',
          appSecret: ''
        },
        formItems: [
          {
            prop: 'openSso',
            label: '是否开启单点登录：',
            type: 'radio',
            options
          },
          {
            prop: 'appId',
            label: '应用APPID：',
            hiddenKey: 'openSso',
            hiddenValue: '1',
            type: 'textarea',
            height: '100px',
            placeholder: '请输入应用APPID'
          },
          {
            prop: 'appSecret',
            label: '应用Secret',
            hiddenKey: 'openSso',
            hiddenValue: '1',
            type: 'textarea',
            height: '100px',
            placeholder: '请输入应用Secret'
          }
        ],
        rules: {
          appId: [
            this.$rules.required(),
            this.$rules.max(255)
          ],
          appSecret: [
            this.$rules.required(),
            this.$rules.max(1500)
          ]
        }
      }
    }
  },
  methods: {
    getSetDetail () {
      this.$request.fetchSoo({}).then(res => {
        if (res.code === 200) {
          this.appId = res.data.appId
          this.appSecret = res.data.appSecret
          this.openSso = res.data.openSso
        }
      })
    },
    handleConfirm () {
      this.form.loading = true
      let params = {
        'openSso': this.form.form.openSso,
        'appId': this.form.form.appId,
        'appSecret': this.form.form.appSecret
      }
      this.$request.fetchSaveSoo(params).then(res => {
        if (res.code === 200) {
          this.hideFormLoading()
          this.getSetDetail()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      }).catch(this.hideFormLoading)
    }
  },
  mounted () {
    this.getSetDetail()
  },
  activated () {
    this.getSetDetail()
  }
}
</script>
<style lang="scss">
.system-single-login-index-container{

}
</style>
