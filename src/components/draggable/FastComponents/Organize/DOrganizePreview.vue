<template>
  <section class="d-input-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <el-cascader
        v-model="val"
        class="org-cascader"
        :options="organizeOptions"
        popper-class="jee-border"
        :show-all-levels="false"
        :clearable="true"
        :appendToBody="false"
        ref='cascader'
        @change="$refs.cascader.dropDownVisible = false"
      ></el-cascader>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import {
  mapGetters,
  mapActions
} from 'vuex'
import { getTreeIds } from '@/utils'

export default {
  name: 'DOrganizePreview',
  mixins: [previewMixin],
  computed: {
    ...mapGetters(['organizeOptions']),
    val: {
      get () {
        if (this.value instanceof Array) {
          // 第一次打开判断如果是数组，需要转成字段用于保存
          const value = this.value.length ? this.value[this.value.length - 1] : ''
          this.$emit('input', value)
          return this.value
        }
        const value = (this.value || this.value === 0) ? this.getTreeIds(this.organizeOptions, this.value) : []
        return value
      },
      set (val) {
        const value = val.length ? val[val.length - 1] : ''
        this.$emit('input', value)
      }
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal instanceof Array) {
        const value = newVal.length ? newVal[newVal.length - 1] : ''
        this.$emit('input', value)
      }
    }
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptions']),
    getTreeIds
  },
  mounted () {
    this.FetchOrganizeOptions()
    this.$refs.cascader.initMenu()
    this.$nextTick(() => {
      if (this.$refs.cascader.menu) {
        document.getElementsByClassName('org-cascader')[0].appendChild(this.$refs.cascader.menu.$el)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.d-input-preview .el-form-item{
  padding: 20px;
  margin-bottom: 0!important;
  .el-cascader{
    max-width: 414px;
    width: 100%;
  }
}
</style>
