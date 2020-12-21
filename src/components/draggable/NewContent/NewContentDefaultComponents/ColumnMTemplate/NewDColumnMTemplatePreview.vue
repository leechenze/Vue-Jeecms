<script>
import compoment from '@/components/draggable/NewContent/NewCustomComponents/Select/NewDSimpleSelectPreview'
export default {
  name: 'NewDColumnMTemplatePreview',
  extends: compoment,
  computed: {
    getOptions () {
      return this.options
    }
  },
  methods: {
    fetchContentTemplateList (modelId) {
      const params = {
        modelId,
        type: 2
      }
      this.$request.fetchContentTemplateList(params).then(res => {
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
        this.fetchContentTemplateList(newData)
      }
    }
  },
  mounted () {
    if (this.form.modelId) {
      this.fetchContentTemplateList(this.form.modelId)
    }
  }
}
</script>
