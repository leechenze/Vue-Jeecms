<script>
import moment from 'moment'
import Detail from './Detail'
import { loginType, deepClone } from '@/utils'

export default {
  extends: Detail,
  name: 'vipMemberCreate',
  computed: {
    formItems () {
      let formItems = []
      if (this.detail && this.detail.renderingField) {
        formItems = this.detail.renderingField[this.formListKey] || []
        // 密码设为不必填，置空
        const pwIndex = formItems.findIndex(d => d.type === 'password')
        if (pwIndex >= 0 && formItems.length < 10) {
          let rpwItem = deepClone(formItems[pwIndex])
          rpwItem.index = rpwItem.index + 0.5
          rpwItem.value.name = 'repassword'
          rpwItem.value.label = '重复密码'
          formItems.splice(pwIndex, 0, rpwItem)
        }
      }
      return formItems.sort((a, b) => a.index - b.index)
    }
  },
  methods: {
    moment,
    fetchMembersDetail () {
      const that = this
      this.loading = true
      this.$request.fetchMembersAdditionModel().then(res => {
        if (res.code === 200) {
          let dataField = {}
          res.data.enableJson.formListBase.forEach(d => {
            if (d.value.type === 'datetime' && d.value.isDefaultNow) {
              dataField[d.value.name] = that.moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
              dataField[d.value.name] = d.value.defaultValue
            }
          })
          this.detail = {
            id: '',
            renderingField: res.data.enableJson,
            dataField
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    async handleSubmit (e, btn) {
      this.getFormData.password = await loginType(this.getFormData.password)
      await this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$request.fetchMembersAdd(this.getFormData).then(res => {
            if (res.code === 200) {
              this._messageSuccess('create')
              this.removeTab(this.$route.fullPath)
              this.$routerLink('/vip/member/index', 'list')
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
