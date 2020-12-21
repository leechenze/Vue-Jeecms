<template>
  <section class="d-source-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      :required="option.isRequired"
    >
      <div class="source-wrap">
        <el-autocomplete
          value-key='sourceName'
          v-model="form[option.name].sourceName"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
          :maxlength="50"
          :popperAppendToBody='false'
        >
        </el-autocomplete>
        <el-input
          v-model="form[option.name].sourceLink"
          placeholder="http://"
          :maxlength="50"
        ></el-input>
      </div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'DSourcePreview',
  mixins: [previewMixin],
  data () {
    return {
      timeout: null
    }
  },
  computed: {
    getRules () {
      const { isRequired, isInputLimit, inputLimit, rules } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.requiredObject('sourceName'))
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
      return formItemRules
    }
  },
  methods: {
    async querySearchAsync (queryString, cb) {
      var results = queryString ? await this.createStateFilter(queryString) : []
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    async createStateFilter (queryString) {
      const data = await this.$request.fetchContentSourceList({ sourceName: queryString }).then(res => {
        if (res.code === 200) {
          return res.data.map(d => {
            d.value = d.sourceName
            return d
          })
        }
        return []
      })
      return data
    },
    handleSelect (item) {
      const { sourceName, sourceLink } = item
      this.$emit('input', {
        sourceName: sourceName || '',
        sourceLink: sourceLink || ''
      })
    },
    initData () {
      if (!this.value.sourceName && !this.value.sourceLink) {
        this.$request.fetchContentSourceList().then(res => {
          if (res.code === 200) {
            res.data.map(d => {
              d.value = d.sourceName
              return d
            })
            const item = res.data.find(d => d.isDefault)
            if (item) {
              this.$emit('input', {
                sourceName: item.sourceName || '',
                sourceLink: item.sourceLink || ''
              })
            }
          }
        })
      }
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.d-source-preview .el-form-item{
  .source-wrap{
    .el-autocomplete{
      width: 100%;
    }
    .el-autocomplete + .el-input{
      margin-top: 20px;
    }
  }
}
</style>
