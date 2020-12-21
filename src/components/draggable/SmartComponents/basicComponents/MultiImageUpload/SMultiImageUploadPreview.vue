<template>
  <section class="s-multi-image-upload-preview s-draggable-preview">
    <div v-if="deviceTab === 2">
      <el-form-item
        :rules="getRules"
        :prop="option.name"
        :label="option.label"
        :required="option.isRequired"
      >
      <div class="upload-item">
        <jee-multi-image-resource-upload
          v-bind="option"
          v-model="val"
          :isDescShow="false"
          :uploadOption="option"
          :showLabel="false"
          :isBtn="false"
          :dragIcon="true"
        ></jee-multi-image-resource-upload>
      </div>
      </el-form-item>
    </div>
    <div v-else class="smart-mobile-box">
      <el-form-item
        :rules="getRules"
        :prop="option.name"
        :label="option.label"
        :required="option.isRequired"
      >
      <div class="upload-item">
        <jee-multi-image-resource-upload
          v-bind="option"
          v-model="val"
          :uploadOption="option"
          :showLabel="false"
          :isBtn="false"
          :dragIcon="true"
        ></jee-multi-image-resource-upload>
      </div>
      </el-form-item>
    </div>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'SMultiImageUploadPreview',
  mixins: [previewMixin],
  data () {
    return {
      isBan: [],
      isBanText: [],
      banVal: []
    }
  },
  computed: {
    getRules () {
      const { isRequired } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.requiredArray())
      }
      return formItemRules
    }
  },
  mounted () {
    this.replace(this.value)
    this.replaceImg(this.value)
  },
  methods: {
    replace (val) {
      // 文本类违禁词
      if (this.form.banJson && this.form.banJson[this.option.name] && this.form.banJson[this.option.name].txt) {
        let tempList = []
        this.form.banJson[this.option.name].txt.forEach(d => {
          if (d.indexOf(' ') !== -1) {
            let dList = d.split(' ')
            dList.forEach(i => {
              if (tempList.indexOf(i) === -1) {
                tempList.push(i)
              }
            })
          } else if (tempList.indexOf(d) === -1) {
            tempList.push(d)
          }
        })
        tempList.forEach(d => {
          if (d && typeof d === 'string') {
            val.forEach((item, index) => {
              let txt = item.description
              if (txt.indexOf(d) !== -1) {
                let replaceTxt = '<span style="color: #fff; background-color: #FF0000;">' + d + '</span>'
                let key = new RegExp(d, 'g')
                let obj = {
                  index: index,
                  text: txt.replace(key, replaceTxt)
                }
                this.isBanText.push(index)
                this.banVal.push(obj)
              }
            })
          }
        })
      }
    },
    replaceImg (img) {
      // 图片类违禁词
      if (this.form.banJson && this.form.banJson[this.option.name] && this.form.banJson[this.option.name].img) {
        this.isBan = []
        this.form.banJson[this.option.name].img.forEach(d => {
          img.forEach((c, index) => {
            let url = c
            if (c instanceof Object) {
              url = c.resourcesSpaceData.url
            }
            if (d.indexOf(url) !== -1) {
              this.isBan.push(index)
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="scss">
.s-multi-image-upload-preview.s-draggable-preview{
  .el-form-item{
    height: auto;
    .el-form-item__label,.el-form-item__content{
      line-height: 32px;
    }
  }
  .upload-item{
    display: flex;
    .jee-multi-image-resource-upload-container {
      .upload-image{
        margin-left: 0px !important;
      }
      .desc{
        padding-bottom: 8px;
        padding-top: 0;
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
