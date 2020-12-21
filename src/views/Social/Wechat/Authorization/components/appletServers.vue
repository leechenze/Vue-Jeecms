<template>
  <section class="applet-servers-index">
    <base-header
      v-bind="headers"
      @handleRest="handleHeaderRest"
      />
    <base-form
      v-bind="form"
    >
    </base-form>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
export default {
  name: 'appletServers',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Rest',
            text: '重置合法域名',
            icon: 'shuaxin',
            disabled: !this._checkPermission('/wechatInfo/modifyDomain', 'GET')
          }
        ],
        showAlertIcon: false
      },
      form: {
        api: 'wechatInfoDisplayModifyDomainGet',
        labelWidth: '175px',
        showSubmitButton: false,
        params: { id: this.$route.query.id },
        form: {
          funcInfo: ''
        },
        formItems: [
          {
            type: 'title',
            label: '服务器域名',
            popoverText: '说明'
          },
          {
            prop: 'wsrequestdomain',
            label: 'scoket合法域名：',
            type: 'text'
          },
          {
            prop: 'requestdomain',
            label: 'request合法域名：',
            type: 'text'
          },
          {
            prop: 'uploaddomain',
            label: 'uploadFile合法域名：',
            type: 'text'
          },
          {
            prop: 'downloaddomain',
            label: 'downloadFile合法域名：',
            type: 'text'
          }
        ]
      }
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
      if (this.name === 'servers') {
        this.fetchFormApi()
      }
    }
  },
  methods: {
    handleHeaderRest (btn) {
      this.$request.wechatInfoModifyDomain(this.form.params).then(res => {
        this.$restBack(res, () => {
          this.form.form = res.data
        }, '重置成功')
      })
    },
    // 获取内容
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'servers') {
        this.fetchFormApi()
      }
    })
  }
}
</script>
