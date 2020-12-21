export default {
  props: {
    value: {
      type: [String, Number, Object, Array, Boolean],
      default: ''
    },
    form: {
      type: Object,
      default: () => ({})
    },
    option: {
      type: Object,
      default: () => ({})
    },
    isValidator: {
      type: Boolean,
      default: true
    },
    cssConfig: {
      type: Object,
      default: () => ({})
    },
    deviceTab: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      loading: false,
      banVal: '',
      banShow: false,
      options: []
    }
  },
  computed: {
    val: {
      get () {
        if (typeof this.value === 'string' && this.value.indexOf('[NextPage][/NextPage]') !== -1) {
          this.value = this.value.replace('[NextPage][/NextPage]', '<hr/>')
        }
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    getRules () {
      const { isRequired, isInputLimit, inputLimit, rules, isOtherOption, isOtherOptionRequired } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.required())
      }
      if (isInputLimit && inputLimit) {
        formItemRules.push(this.$rules[inputLimit]())
      }
      if (rules instanceof Array && rules.length) {
        rules.forEach(r => {
          const { rule, params = [] } = r
          if (rule) formItemRules.push(this.$rules[rule](...params))
        })
      }
      if (isOtherOption && isOtherOptionRequired) {
        formItemRules.push({
          validator: this.otherOptionValidator,
          trigger: ['blur', 'change']
        })
      }
      return formItemRules
    },
    getOptions () {
      return this.option.options
    }
  },
  watch: {
    cssConfig (newVal) {
      if (newVal) {
        this.setStyle(newVal)
      }
    }
  },
  created () {
    if (this.option) {
      let obj = {
        fieldName: this.option.name || '',
        modelId: this.form.modelId || ''
      }
      this.$set(this.option, 'modeObj', obj)
      if (this.uploadOption) {
        this.$set(this.uploadOption, 'modeObj', obj)
      }
    }
  },
  mounted () {
    if (this.option) {
      let obj = {
        fieldName: this.option.name || '',
        modelId: this.form.modelId || ''
      }
      this.$set(this.option, 'modeObj', obj)
      if (this.uploadOption) {
        this.$set(this.uploadOption, 'modeObj', obj)
      }
    }
    if (this.cssConfig) {
      this.setStyle(this.cssConfig)
    }
  },
  methods: {
    replace (val, callback) {
      // 文本类违禁词
      if (this.form.banJson && this.form.banJson[this.option.name] && this.form.banJson[this.option.name].txt) {
        let tempList = []
        if (this.form.banJson[this.option.name].isAllTxt) {
          let texts = val.split('</p>')
          texts.forEach((d, index) => {
            if (d.indexOf('<img ') !== -1) {
              if (d.substring(3, d.indexOf('<img ')) !== '') {
                tempList.push(d.substring(3, d.indexOf('<img ')))
              } else if (d.substring(d.indexOf('</img>')) !== '') {
                tempList.push(d.substring(d.indexOf('">')))
              }
            } else {
              if (d.split('<p>')[1] !== undefined) {
                tempList.push(d.split('<p>')[1])
              }
            }
          })
        } else {
          this.form.banJson[this.option.name].txt.forEach(d => {
            if (d.indexOf(' ') !== -1) {
              let dList = d.split(' ')
              dList.forEach(i => {
                if (tempList.indexOf(i) === -1) {
                  tempList.push(i)
                }
              })
            } else if (tempList.indexOf(d) === -1) {
              tempList.push(d)
            }
          })
        }
        console.log(tempList)
        tempList.sort(function (a, b) {
          return a.length < b.length
        })
        console.log(tempList)
        tempList.forEach(d => {
          if (d && typeof d === 'string') {
            let txt = this.banVal === '' ? val : this.banVal
            let replaceTxt = '<span class="banClass" style="color: #fff; background-color: #FF0000;">' + d + '</span>'
            let key = new RegExp(d, 'g')
            this.banVal = txt.replace(key, replaceTxt)
            this.banShow = true
          }
        })
        if (callback) {
          callback()
        }
      } else {
        this.banVal = this.val
      }
    },
    otherOptionValidator (rule, value, callback) {
      console.log(value)
      if (value && value.value === this.option.otherOption.value) {
        if (value.otherValue) {
          callback()
        } else {
          callback(new Error('请输入其他选项'))
        }
      } else {
        callback()
      }
    },
    banClick (ref) {
      this.banShow = false
      this.$refs[ref].focus()
    },
    banBlur (val) {
      // if (this.banVal !== '') {
      //   this.banShow = true
      //   this.banVal = val
      // }
    },
    setStyle (item) {
      const labels = document.querySelectorAll('.s-draggable-preview .el-form-item .el-form-item__label')
      const helpStyle = document.querySelectorAll('.s-draggable-preview .el-form-item .z-tip-form-item')
      const valueStyle = document.querySelectorAll('.s-draggable-preview .el-form-item .value')
      labels.forEach(label => {
        if (label && item.fontStyle) {
          label.style.color = item.fontStyle.color
        }
        if (label && item.fontStyle) {
          label.style.fontSize = item.fontStyle.fontSize
        }
        if (label && item.fontStyle) {
          label.style.fontWeight = item.fontStyle.fontStyle
        }
      })
      // 幫助信息
      helpStyle.forEach(data => {
        if (data && item.fontHelp) {
          data.style.color = item.fontHelp.color
        }
        if (data && item.fontHelp) {
          data.style.fontSize = item.fontHelp.fontSize
        }
        if (data && item.fontHelp) {
          data.style.fontWeight = item.fontHelp.fontStyle
        }
      })
      // 字段值
      valueStyle.forEach(data => {
        if (data && item.fontKey) {
          data.style.color = item.fontKey.color
        }
        if (data && item.fontKey) {
          data.style.fontSize = item.fontKey.fontSize
        }
        if (data && item.fontKey) {
          data.style.fontWeight = item.fontKey.fontStyle
        }
      })
    }
  }
}
