<template>
  <section class="d-content-preview d-ueditor-preview z-draggable-preview new-content">
    <el-form-item
      :prop="option.name"
      :rules="getRules"
      label-width="0px"
    >
      <div class="document-tip">{{option.tip}}</div>
      <u-editor
        ref='editor'
        v-model="banVal"
        :options="editorOptions"
      ></u-editor>
      <!-- <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div> -->
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import UEditor from '@/components/editor/UEditor'

export default {
  name: 'NewDContentPreview',
  mixins: [previewMixin],
  props: {
    editorOptions: {
      type: Object,
      default: () => ({})
    }
  },
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
  mounted () {
    this.banVal = ''
    this.replace(this.val, this.checkContentImg())
  },
  watch: {
    'banVal': function (newVal, oldVal) {
      this.val = newVal
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
    },
    // 检查富文本图片是否有违禁图片
    checkContentImg () {
      // eslint-disable-next-line no-useless-escape
      let srcReg = /(<img(?:(?!id|>).)*)(id[\=\"\'\s]+)?([^\"\'\s]*)([\"\']?)([^>]*>)/gi
      let srcRegList = this.val.match(srcReg)
      let ImgList = []
      let ImgData = []
      if (srcRegList) {
        srcRegList.forEach(item => {
          let itemSplit = item.split('src=')[1].split(' ')[0]
          let obj = {
            url: itemSplit.substring(1, itemSplit.length - 1),
            oldUrl: item
          }
          ImgData.push(obj)
        })
        if (this.form.banJson && this.form.banJson[this.option.name] && this.form.banJson[this.option.name].img) {
          if (this.banVal === '') {
            this.banVal = this.val
          }
          ImgData.forEach(e => {
            this.form.banJson[this.option.name].img.forEach(i => {
              if (i.indexOf(e.url) !== -1) {
                ImgList.push(e.oldUrl)
              }
            })
          })
          ImgList.forEach(d => {
            let imgTxt = '<span class="banClass" style="border: 1px solid #ff0000; display: inline-block; vertical-align: bottom; font-size: 0;">' + d + '</span>'
            this.banVal = this.banVal.replace(d, imgTxt)
          })
        }
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
.d-content-preview.z-draggable-preview.new-content{
  .document-tip{
    line-height: 34px;
    color: #999999;
    padding-left: 15px;
    font-size: 12px;
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>
