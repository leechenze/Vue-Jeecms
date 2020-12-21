import draggable from 'vuedraggable'
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  mixins: [editorMixin],
  components: {
    draggable
  },
  data () {
    return {
      options: {
        group: 'radio-options',
        forceFallback: true,
        ghostClass: 'ghost',
        swapThreshold: 0.5,
        animation: 100,
        handle: '.move'
      },
      maxId: 0
    }
  },
  watch: {
    'value.options': function (newData) {
      if (newData instanceof Array) {
        if (newData.length >= this.maxId) {
          this.maxId = newData.length + 1
        }
      }
    }
  },
  methods: {
    handleAddOption (index) {
      console.log(index)
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
      // console.log('this.value.', this.value)
      // console.log('index', index)
      // 单选
      if (!Array.isArray(this.value.defaultValue.value) && this.value.defaultValue.value === this.value.options[index].value) {
        this.value.options.splice(index, 1)
        this.value.defaultValue.value = ''
      } else {
        // 多选
        this.value.options.splice(index, 1)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.value.options)
      this.maxId = this.value.options.length + 1
    })
  }
}
