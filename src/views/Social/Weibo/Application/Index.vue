<template>
  <section class="social-application-index">
    <base-header v-bind="headers"/>
    <base-form
      style="padding-top:10px"
      ref="baseForm"
      v-bind="form"
      @handleConfirm="handleConfirm"
    ></base-form>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
export default {
  name: 'socialWeiboApplication',
  mixins: [baseForm, baseHeader],
  data () {
    return {
      headers: {
        title: '操作说明',
        content: '填写站点对应的微博应用的ID和密钥；'
      },
      form: {
        api: 'weiboSetGet',
        labelWidth: '235px',
        params: {},
        form: {
          'appId': '',
          'appSecret': '',
          'description': ''
        },
        formItems: [
          {
            prop: 'appId',
            label: 'App Key/client ID（应用ID）：',
            maxlength: 50,
            hrefText: '点击获取应用',
            href: 'https://open.weibo.com/'
          },
          {
            prop: 'appSecret',
            label: 'App Secret（应用秘钥）：',
            maxlength: 50
          },
          {
            prop: 'description',
            label: '备注：',
            maxlength: 50,
            type: 'textarea',
            autosize: { minRows: 3 }
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
        request: true,
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/weiboSet', 'POST')
        }]
      }
    }
  },
  methods: {
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = Object.assign(this.form.form, res.data)
      }
    },
    handleConfirm (data) {
      var params = data
      this.$request.weiboSetAdd(params).then(res => {
        this.$restBack(res, () => {
          this.fetchFormApi()
        }, '保存成功')
      })
    }
  },
  mounted () {
    this.fetchFormApi()
  }
}
</script>
