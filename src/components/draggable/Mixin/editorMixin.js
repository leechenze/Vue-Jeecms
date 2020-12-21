import baseForm from '@/components/mixins/baseForm'
import draggable from 'vuedraggable'

export default {
  mixins: [baseForm],
  components: {
    draggable
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        defaultValue: '',
        label: '单行文本',
        name: '',
        placeholder: '请输入内容',
        tip: '',
        isLengthLimit: false,
        max: 50,
        isInputLimit: false,
        inputLimit: '',
        isRequired: false
      })
    },
    cssConfig: {
      type: Object,
      default: () => ({})
    },
    hiddenFields: {
      type: Array,
      default: () => []
    },
    disableFields: {
      type: Array,
      default: () => []
    },
    isVipModel: {
      type: Boolean,
      default: false
    },
    deviceTab: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      labelWidth: '',
      options: {
        group: 'radio-options',
        forceFallback: true,
        ghostClass: 'ghost',
        swapThreshold: 0.5,
        animation: 100,
        handle: '.move'
      },
      formItems: [],
      maxId: 0,
      rules: {}
    }
  },
  computed: {
    getFormItems () {
      let hiddenFields = this.hiddenFields
      if (!this.isVipModel) {
        hiddenFields.push('isRegister')
      }
      console.log(this)
      console.log(this.disableFields)
      return this.formItems ? this.formItems.filter(d => !hiddenFields.includes(d.prop)).map(d => {
        if (this.disableFields.includes(d.prop)) {
          d.type = 'text'
        }
        return d
      }) : []
    }
  },
  methods: {
    handleAddOptionss (index) {
      const newOption = {
        value: this.maxId,
        label: `选项${this.maxId}`
      }
      if (typeof (index) === 'number') {
        this.value.options.splice(index + 1, 0, newOption)
      } else {
        this.value.options.push(newOption)
      }
      this.maxId = this.maxId + 1
    },
    handleDelOption (index) {
      if (this.value.defaultValue.value instanceof Array || this.value.defaultValue.value instanceof String) {
        if (this.value.defaultValue.value.indexOf(this.value.options[index].value) > -1) {
          this.value.defaultValue.value = this.value.defaultValue.value instanceof Array ? [] : ''
        }
      }
      if (typeof this.value.defaultValue.value === 'number') {
        if (this.value.defaultValue.value.toString().indexOf(this.value.options[index].value) > -1) {
          this.value.defaultValue.value = this.value.defaultValue.value instanceof Array ? [] : ''
        }
      }
      this.value.options.splice(index, 1)
    }
  }
}
