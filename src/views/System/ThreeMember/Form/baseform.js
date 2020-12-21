import PreviewComponents from '@/components/draggable/Preview/components'
import { mapState } from 'vuex'

export default {
  components: {
    ...PreviewComponents
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    detailForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      formListKey: 'formListBase',
      editAble: false
    }
  },
  provide () {
    return {
      changeColumn: ''
    }
  },
  computed: {
    getFormData () {
      console.log(this.detailForm)
      let data = {
        id: this.detailForm.id,
        groupType: this.formListKey,
        json: {}
      }
      Object.keys(this.detailForm).forEach(d => {
        const item = this.formItems.find(f => f.value.name === d)
        if (item) {
          if (!item.isCustom) {
            data[d] = this.detailForm[d]
          } else {
            data.json[d] = this.detailForm[d]
          }
        }
      })
      if (!data.channelParentId) {
        data.channelParentId = this.detailForm['channelParentId']
      }
      return data
    }
  },
  methods: {
    fetchColumnTree () {
      if ('channelParentId' in this.getFormData || 'channelName' in this.getFormData) {
        this.$emit('reflushColumnTree', this.getFormData.channelParentId, this.getFormData.channelName)
      }
    },
    handleSubmit (e, btn) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.getFormData.channelParentId) {
            this.$request.fetchChannelUpdate(this.getFormData).then(res => {
              if (res.code === 200) {
                this._messageSuccess('save')
                this.fetchColumnTree()
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$request.fetchChannelUpdateTop(this.getFormData).then(res => {
              if (res.code === 200) {
                this._messageSuccess('save')
                this.fetchColumnTree()
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
