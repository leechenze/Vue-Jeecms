import PreviewComponents from '@/components/draggable/Preview/components'
import { mapState } from 'vuex'
import { deepClone } from '@/utils'

export default {
  components: {
    ...PreviewComponents
  },
  props: ['name', 'value', 'labelWidth', 'editAble'],
  data () {
    return {
      loading: false,
      formListKey: 'formListBase'
    }
  },
  provide () {
    return {
      changeColumn: ''
    }
  },
  computed: {
    ...mapState('column', ['detail', 'detailForm']),
    getFormData () {
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
          let params = deepClone(this.getFormData)
          params.tplMobile = this.$encode(params.tplMobile)
          params.tplPc = this.$encode(params.tplPc)
          if (params.contentTpls && params.contentTpls.length) {
            params.contentTpls = params.contentTpls.map(t => {
              t.tplMobile = this.$encode(t.tplMobile)
              t.tplPc = this.$encode(t.tplPc)
              return t
            })
          }
          if (params.link) {
            params.link.link = this.$encode(params.link.link)
          }
          if (params.json) {
            Object.keys(params.json).forEach(t => {
              if (typeof params.json[t] === 'string' && params.json[t].indexOf('<') > -1) {
                params.json[t] = this.$encode(params.json[t])
              }
            })
          }

          this.loading = true
          if (params.channelParentId) {
            this.$request.fetchChannelUpdate(params).then(res => {
              if (res.code === 200) {
                this._messageSuccess('save')
                this.fetchColumnTree()
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$request.fetchChannelUpdateTop(params).then(res => {
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
