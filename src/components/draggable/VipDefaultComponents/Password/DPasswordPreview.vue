<script>
import compoment from '@/components/draggable/CustomComponents/Input/DInputPreview'
export default {
  name: 'DPasswordPreview',
  extends: compoment,
  data () {
    return {
      inputType: 'password'
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
      var pswRepeat = (rule, value, callback) => {
        if (rule.field === 'repassword' && this.form.password && value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      formItemRules.push(
        { validator: pswRepeat, trigger: ['blur', 'change'] }
      )
      return formItemRules
    }
  }
}
</script>
