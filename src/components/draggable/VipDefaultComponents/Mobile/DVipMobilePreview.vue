<script>
import compoment from '@/components/draggable/CustomComponents/Input/DInputPreview'
export default {
  name: 'DVipMobilePreview',
  extends: compoment,
  data () {
    var phone = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          phone: value,
          id: this.form.id
        }
        this.$request.fetchSysPhoneUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('手机号码已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      phoneRule: phone
    }
  },
  computed: {
    getRules () {
      const { isRequired, rules } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.required())
      }
      if (rules instanceof Array && rules.length) {
        rules.forEach(r => {
          const { rule, params = [] } = r
          if (rule) formItemRules.push(this.$rules[rule](...params))
        })
      }
      formItemRules.push(
        { validator: this.phoneRule, trigger: 'blur' }
      )
      return formItemRules
    }
  }
}
</script>
