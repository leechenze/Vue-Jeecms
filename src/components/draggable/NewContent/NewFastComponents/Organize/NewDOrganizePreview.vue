<template>
  <section class="d-organize-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <div class="organize-wrap">
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
      </div>
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
  name: 'NewDOrganizePreview',
  mixins: [previewMixin],
  computed: {
    ...mapGetters(['organizeOptions']),
    val: {
      get () {
        if (this.value instanceof Array) {
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
    value (newVal) {
      console.log(newVal)
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
    if (this.value && this.value instanceof Array) {
      const value = this.value.length ? this.value[this.value.length - 1] : ''
      this.$emit('input', value)
    }
    // this.$nextTick(() => {
    //   this.$refs.cascader.initMenu()
    //   if (this.$refs.cascader.menu) {
    //     document.getElementsByClassName('org-cascader')[0].appendChild(this.$refs.cascader.menu.$el)
    //   }
    // })
  }
}
</script>

<style lang="scss">
.d-organize-preview .el-form-item{
  // padding: 20px;
  // display:flex;
  margin-bottom: 0!important;
  .organize-wrap{
    // display: flex;
    // width: 100%;
    .el-form-item{
      width: 100%;
    }
  }
  .el-cascader{
    max-width: 414px;
    width: 100%;
  }
  // .el-form-item__label{
  //   min-width: 55px;
  // }
  // .el-form-item__content{
  //   margin-left: 0 !important;
  //   flex-grow: 1;
  // }
}
</style>
