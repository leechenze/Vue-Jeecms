<script>
import compoment from '@/components/draggable/CustomComponents/Input/DInputPreview'
export default {
  name: 'DVipEmailPreview',
  extends: compoment,
  data () {
    var email = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          mail: value,
          id: this.form.id
        }
        this.$request.fetchSysMailUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('邮箱已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      emailRule: email
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
        { validator: this.emailRule, trigger: 'blur' }
      )
      return formItemRules
    }
  }
}
</script>
