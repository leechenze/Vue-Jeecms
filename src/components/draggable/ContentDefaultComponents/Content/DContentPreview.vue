<template>
  <section class="d-content-preview d-ueditor-preview z-draggable-preview">
    <el-form-item
      :prop="option.name"
      :rules="getRules"
      label-width="0px"
    >
      <u-editor
        ref='editor'
        v-model="val"
      ></u-editor>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import UEditor from '@/components/editor/UEditor'

export default {
  name: 'DContentPreview',
  mixins: [previewMixin],
  components: {
    UEditor
  },
  computed: {
    getRules () {
      const { isRequired } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push({
          validator: this.validatorRequired,
          trigger: ['blur']
        })
      }
      return formItemRules
    }
  },
  methods: {
    validatorRequired (rule, value, callback) {
      if (value) {
        callback()
      } else {
        this.$message.error('正文内容必填')
        callback(new Error('此项必填'))
      }
    }
  }
}
</script>

<style lang="scss">
.d-content-preview {
  .el-form-item{
    padding: 0;
  }
}
</style>
