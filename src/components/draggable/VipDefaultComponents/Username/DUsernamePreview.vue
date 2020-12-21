<script>
import compoment from '@/components/draggable/CustomComponents/Input/DInputPreview'
export default {
  name: 'DUsernamePreview',
  extends: compoment,
  computed: {
    getRules () {
      const { isRequired, inputLimit, rules, disabled } = this.option
      let formItemRules = []
      if (!disabled) {
        formItemRules.push(
          {
            validator: this.validatorName,
            trigger: ['blur', 'change']
          }
        )
      }
      if (isRequired) {
        formItemRules.push(this.$rules.required())
      }
      if (inputLimit) {
        formItemRules.push(this.$rules[inputLimit]())
      }
      if (rules instanceof Array && rules.length) {
        rules.forEach(r => {
          const { rule, params = [] } = r
          if (rule) formItemRules.push(this.$rules[rule](...params))
        })
      }
      return formItemRules
    }
  },
  methods: {
    validatorName (rule, value, callback) {
      var params = {
        username: value
      }
      this.$request.fetchSysUsernameUnique(params).then(res => {
        if (res.code === 200) {
          if (res.data) {
            callback()
          } else {
            callback(new Error('用户名已存在'))
          }
        } else {
          callback(new Error(res.message))
        }
      })
    }
  }
}
</script>
