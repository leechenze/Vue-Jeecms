<script>
import compoment from '@/components/draggable/CustomComponents/Select/DSimpleSelectPreview'
export default {
  name: 'DColumnMTemplatePreview',
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
            d.value = d.label = d.tplSolution
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
