<template>
  <section class="logs-strategy-detail-container">
    <!-- <base-header v-bind="headers"
    /> -->
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
  name: 'logStrategy',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      form: {
        labelWidth: '200px',
        api: 'fetchLogsConfigs',
        params: {},
        form: {
        },
        formItems: [
          {
            type: 'text',
            prop: 'size',
            label: '当前日志数据表使用量：'
          },
          {
            type: 'number',
            mim: '0',
            prop: 'warnValue',
            label: '预警阀值(M)：',
            placeholder: '请输入预警阀值',
            maxlength: 2,
            explain: '数据库日志数据表超出该阀值后，系统将每日9点发送一次通知'
          },
          {
            type: 'number',
            mim: '0',
            prop: 'dangerValue',
            label: '告警阀值(M)：',
            placeholder: '请输入告警阀值',
            maxlength: 8,
            explain: '数据库日志数据表超出该阀值后，系统将每小时发送一次通知，其值必须大于预警阀值'
          },
          {
            type: 'textarea',
            autosize: { minRows: 5 },
            prop: 'noticeEmailList',
            label: '通知邮箱：',
            placeholder: '请输入通知邮箱',
            maxlength: 1500,
            explain: '当日志数据表达到预警或告警阀值后，系统会自动通知上述设置邮箱，多个使用 ；分割，系统必须开通邮箱服务器才能正常发送，最多上限100个'
          },
          {
            type: 'textarea',
            autosize: { minRows: 5 },
            prop: 'noticeSmsList',
            label: '预警/告警手机号：',
            placeholder: '请输入预警/告警手机号',
            explain: '当日志数据表达到预警或告警阀值后，系统会自动发短信通知上述手机号，多个使用 ；分割，系统必须开通短信服务器才能正常发送，最多上限100个',
            maxlength: 3000
          },
          {
            prop: 'warnSmsTmpId',
            label: '短信通知模板ID：',
            placeholder: '请输入短信平台中的模板ID',
            maxlength: 50
          }
        ],
        rules: {
          dangerValue: [this.$rules.minNum(0), this.$rules.maxNum(99999999)],
          warnValue: [this.$rules.minNum(0), this.$rules.maxNum(99999999)]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/logConfigs', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    handleConfirm (data) {
      this.form.loading = true
      this.$request.fetchLogsConfigsPut(data).then(res => {
        if (res.code === 200) {
          this.hideFormLoading()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.hideFormLoading()
        }
      }).then(this.hideFormLoading).catch(this.hideFormLoading)
    },
    fetchLogsConfigs () {
      this.form.loading = true
      this.$request.fetchLogsConfigs().then(res => {
        if (res.code === 200) {
          this.hideFormLoading()
          this.form.form = res.data
        }
      }).catch(this.hideFormLoading)
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
      }
    }
  },
  mounted () {
    this.fetchLogsConfigs()
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'logStrategy') {
        this.fetchLogsConfigs()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
