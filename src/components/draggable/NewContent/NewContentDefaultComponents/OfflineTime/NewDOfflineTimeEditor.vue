<script>
import compoment from '@/components/draggable/NewContent/NewCustomComponents/DateTime/NewDDateTimeEditor'
export default {
  name: 'NewDOfflineTimeEditor',
  extends: compoment,
  data () {
    const formatOptions = {
      date: this.$enums.date,
      datetime: this.$enums.datetime
    }
    return {
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
          disabled: true,
          options: this.$enums.timeType
        },
        {
          prop: 'format',
          label: '显示格式：',
          type: 'select',
          options: formatOptions[this.value.type] || [],
          disabled: true,
          hidden: function (form) {
            return form.type === 'date' || form.type === 'datetime'
          }
        },
        {
          prop: 'accuracy',
          label: '精确到：',
          type: 'select',
          options: this.$enums.accuracy,
          disabled: true,
          hidden: function (form) {
            return form.type === 'time' || form.type === 'datetime'
          }
        },
        {
          prop: 'isDefaultNow',
          label: '默认日期时间：',
          class: 'margin-bottom15 width',
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
          class: 'width',
          options: this.$enums.boolYes
        }
      ]
    }
  }
}
</script>
