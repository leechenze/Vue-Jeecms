<script>
import compoment from '@/components/draggable/CustomComponents/Select/DSimpleSelectPreview'
export default {
  name: 'DColumnPCTemplatePreview',
  extends: compoment,
  computed: {
    getOptions () {
      return this.options
    }
  },
  methods: {
    fetchChannelTemplateList (modelId) {
      const params = {
        modelId,
        type: 1
      }
      this.$request.fetchChannelTemplateList(params).then(res => {
        if (res.code === 200 && res.data instanceof Array) {
          this.options = res.data.map(d => {
            d.value = d.label = d.tplPath
            return d
          })
        }
      })
    }
  },
  watch: {
    'form.modelId' (newData) {
      if (newData) {
        this.fetchChannelTemplateList(newData)
      }
    }
  },
  mounted () {
    if (this.form.modelId) {
      this.fetchChannelTemplateList(this.form.modelId)
    }
  }
}
</script>
