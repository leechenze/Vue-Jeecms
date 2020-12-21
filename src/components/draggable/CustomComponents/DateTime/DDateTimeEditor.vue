<template>
  <base-form
    class="d-datetime-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :popperAppendToBody='false'
  ></base-form>
</template>

<script>
import moment from 'moment'
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'DDateTimeEditor',
  mixins: [editorMixin],
  data () {
    const formatOptions = {
      date: this.$enums.date,
      datetime: this.$enums.datetime
    }
    return {
      formatOptions,
      formItems: [
        {
          prop: 'label',
          label: '字段名称：',
          maxlength: 50
        },
        {
          prop: 'name',
          label: '标签名称：',
          maxlength: 50
        },
        {
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50
        },
        {
          prop: 'type',
          label: '时间类型：',
          type: 'select',
          options: this.$enums.timeType
        },
        {
          prop: 'format',
          label: '显示格式：',
          type: 'select',
          options: formatOptions[this.value.type] || [],
          hidden: function (form) {
            return form.type === 'date' || form.type === 'datetime'
          }
        },
        {
          prop: 'accuracy',
          label: '精确到：',
          type: 'select',
          options: this.$enums.accuracy,
          hidden: function (form) {
            return form.type === 'time' || form.type === 'datetime'
          }
        },
        {
          prop: 'isDefaultNow',
          label: '默认日期时间：',
          type: 'checkbox',
          options: [
            {
              value: true,
              label: '默认显示当前日期时间'
            }
          ]
        },
        {
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
          options: this.$enums.boolYes
        },
        {
          prop: 'isRegister',
          label: '应用到会员注册：',
          type: 'radio',
          options: this.$enums.boolYes
        }
      ],
      rules: {
        label: [
          this.$rules.required()
        ],
        name: [
          this.$rules.enNumLine(),
          this.$rules.required()
        ],
        type: [
          this.$rules.required()
        ],
        format: [
          this.$rules.required()
        ],
        accuracy: [
          this.$rules.required()
        ],
        isRequired: [
          this.$rules.required()
        ],
        isRegister: [
          this.$rules.required()
        ]
      }
    }
  },
  computed: {
    getFormat () {
      switch (this.value.type) {
        case 'date':
          return this.value.format
        case 'time':
          return this.value.accuracy
        case 'datetime':
        default:
          return [this.value.format, this.value.accuracy].join(' ')
      }
    }
  },
  methods: {
    moment
  },
  watch: {
    'value.type': function (newData) {
      if (newData !== 'time') {
        this.formItems.find(d => d.prop === 'format').options = this.formatOptions[newData]
        if (newData === 'datetime') {
          this.value.format = 'yyyy-MM-dd'
        }
      }
    },
    'value.isDefaultNow': function (newData) {
      this.value.defaultValue = newData ? new Date().getTime() : ''
    }
  },
  mounted () {
    if (this.value.isDefaultNow) {
      this.value.defaultValue = new Date().getTime()
    }
  }
}
</script>
