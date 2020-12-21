<template>
  <section class="jee-image-resource-upload-container">
    <div class="desc" v-if="ImageDescShow && getImageDesc">{{getImageDesc}}</div>
    <!-- 上传区 -->
    <div class="resource-upload-wrap" :class="{'single-mode': file.imageUrl}">
      <div class="z-image-uploader jee-hover-border" @click="showResourceDialog">
        <div class="text-wrap">
          <jee-icon :iconClass="iconClass"></jee-icon>
          <div class="text" v-if="title">{{title}}</div>
          <div class="text" v-if="getImageSize">{{getImageSize}}</div>
        </div>
      </div>
      <!-- 上传后的样式 -->
      <div class="image-wrap" v-if="file.imageUrl">
        <div class="image" :class="{'isBan': isBan}">
          <img :src="file.imageUrl" :style="{width: width || 'auto', height: height || 'auto'}">
        </div>
        <div class="img-editor-wrap">
          <jee-icon iconClass="guanbi" class="guanbi jee-hover-fill" @click="handleRemove"/>
          <div class="editor jee-hover-border-important">
            <el-tooltip content="重新上传" placement="bottom" effect="light">
              <jee-icon iconClass="chongxinshangchuan" class="jee-hover-fill" @click="showResourceDialog"/>
            </el-tooltip>
            <el-tooltip content="查看大图" placement="bottom" effect="light">
              <jee-icon iconClass="chakandatu" class="jee-hover-fill"
              @click="handlePreview"/>
            </el-tooltip>
            <el-tooltip content="裁剪" placement="bottom" effect="light">
              <jee-icon iconClass="caijian" class="jee-hover-fill"
              @click="handleCropper"/>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <!-- 说明文字 -->
    <div class="z-tip-form-item" v-if="tip&&tipShow">{{tip}}</div>
    <!-- 放大 -->
    <el-dialog :visible.sync="dialogVisible"
    class="image-preview-dialog"
      append-to-body custom-class="transparent">
      <img class="t-img" :src="file.imageUrl" alt="">
    </el-dialog>
    <!-- 裁剪 -->
    <el-dialog title="图片裁剪" :visible.sync="dialogVisible2" append-to-body>
      <div class="cropper-content">
        <div class="cropper-wrap">
          <vueCropper
            ref="cropper"
            :img="file.imageUrl"
            :info="option.info"
            :full="option.full"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :centerBox="option.centerBox"
            :fixedBox="option.fixedBox"
            :fixed="option.fixed"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :high="option.high"
            @realTime="realTime"
          />
        </div>
        <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px'}">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible2 = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
    <!-- 资源上传 -->
    <upload
      ref="resourceUpload"
      resourceType="simpleupload"
      :uploadOption="uploadOption"
      @handleConfirm="handleConfirm"
    ></upload>
  </section>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { getImgToBase64 } from '@/utils'
import Upload from '@/components/editor/Upload'
export default {
  name: 'JeeImageResourceUpload',
  props: {
    value: {
      validator (value) {
        return true
      }
    },
    ImageDescShow: {
      type: Boolean,
      default: true
    },
    uploadOption: {
      type: Object,
      default: () => ({})
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    imgType: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    },
    tipShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '点击上传图片'
    },
    iconClass: {
      type: String,
      default: 'shangchuantupian'
    },
    width: {
      type: [Number, String],
      default: 0
    },
    height: {
      type: [Number, String],
      default: 0
    },
    type: {
      type: [Array, String],
      default: () => []
    },
    size: {
      type: [String, Number],
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    defaultFileName: {
      type: String,
      default: ''
    },
    defaultUrl: {
      type: String,
      default: ''
    },
    limit: {
      type: [String, Number],
      default: ''
    },
    isBan: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VueCropper,
    Upload
  },
  data () {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      loading: false,
      file: {},
      formData: {},
      option: {
        autoCropWidth: this.width || 100,
        autoCropHeight: this.height || 100,
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 输出图片格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        full: false, // 是否输出原图比例的截图
        canMove: true, // 能否拖动图片
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        high: true // 是否根据dpr生成适合屏幕的高清图片
      },
      previews: {}
    }
  },
  computed: {
    getImageDesc () {
      if (this.desc) return this.desc
      const allowType = this.type instanceof Array ? this.type.join(', ') : this.type
      let desc = allowType ? `支持 ${allowType} 图片格式` : ''
      if (Number(this.size) && this.unit) desc = desc + ` (文件大小不超过${this.size}${this.unit})`
      return desc
    },
    getImageSize () {
      return this.width && this.height ? `建议${this.width} * ${this.height}PX` : ''
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) {
        this.file = {}
      }
      if (typeof newVal === 'object') {
        if (!newVal || !newVal.id) {
          this.file = {}
          this.$emit('input', '')
          this.$emit('getUrl', newVal, this.imgType)
        } else {
          this.initData()
        }
      }
    },
    defaultUrl (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initData()
      }
    }
  },
  methods: {
    // 点击放大查看
    handlePreview () {
      this.dialogVisible = true
    },
    // 点击裁剪
    handleCropper () {
      this.dialogVisible2 = true
    },
    // 重新上传
    showResourceDialog () {
      this.$refs.resourceUpload.showDialog()
    },
    // 上传到服务器
    handleUpload () {
      const param = new FormData()
      param.append('uploadFile', this.file.file.raw, this.file.fileName)
      const { uploadFile, ...file } = this.formData
      Object.keys(file || []).forEach(k => {
        param.append(k, file[k])
      })
      if (this.modeObj) {
        param.append('modelId', this.modeObj.modelId || '')
        param.append('fieldName', this.modeObj.fieldName)
      }
      const that = this
      const onUploadProgress = function (e) {
        if (e.lengthComputable) {
          var rate = e.loaded / e.total
          if (rate < 1) {
            that.percentage = Number((rate * 100).toFixed(0))
          } else {
            that.percentage = 100
          }
        }
      }
      this.$request.fetchUpload(param, onUploadProgress).then(res => {
        if (res.code === 200) {
          that.$message({
            message: '上传成功',
            type: 'success'
          })
          that.$emit('input', res.data.resourceId)
          that.$emit('getUrl', res.data, that.imgType)
        } else {
          that.handleRemove()
        }
        that.percentage = 0
      })
    },
    // 移除
    handleRemove () {
      this.$emit('input', '')
      this.file = {}
      this.$emit('getUrl', {}, this.imgType)
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    // 获取截图数据
    handleSubmit () {
      this.$refs.cropper.getCropBlob((data) => {
        let files = new File([data], this.file.fileName || 'cropper_image.png', { type: 'image/png', lastModified: Date.now() })
        this.file.file = { raw: files }
        this.file.imageUrl = URL.createObjectURL(data)
        this.dialogVisible2 = false
        // 截图上传失败，需要加上以下参数
        // mark: false
        // addToRes: false
        // spaceId:
        this.formData.mark = this.formData.mark || false
        this.formData.addToRes = this.formData.addToRes || false
        this.formData.spaceId = this.formData.spaceId || ''
        this.handleUpload()
      })
    },
    initData () {
      // if (!this.autoUpload) {
      //   return
      // }
      // console.log(this.value)
      // 传单图路径，转为图片数据
      const that = this
      const getDefaultFile = function (dataUrl) {
        that.$set(that.file, 'imageUrl', dataUrl)
      }
      if (this.defaultUrl) {
        getImgToBase64(this.$getPath(this.defaultUrl), getDefaultFile)
      } else {
        this.file = {}
      }
      // 传单图对象，返回id
      if (this.value && typeof this.value === 'object') {
        getDefaultFile(this.$getPath(this.value.url))
        this.$emit('input', this.value.id || '')
        this.$emit('getUrl', this.value, this.imgType)
      }
    },
    // 资源上传提交
    handleConfirm (url, data, file) {
      // data: { url, id }
      // 上传file: {uploadFile, mark, addToRes, spaceId}
      // 资源库file：{uploadFile，typeStr, addToRes, spaceId}
      this.formData = Object.assign({}, file)
      if (file && file.uploadFile) {
        var theFile = {}
        file.uploadFile.forEach((value, key) => {
          theFile[key] = value
        })
        // const theFile = file.uploadFile.get('uploadFile')
        // this.file.fileName = theFile.name
        this.file.fileName = theFile.fieldName
        this.$set(this.file, 'imageUrl', URL.createObjectURL(theFile.uploadFile))
      } else {
        this.file.fileName = data.fileName || ''
        const that = this
        // const getDefaultFile = function (dataUrl) {
        that.$set(that.file, 'imageUrl', data.url)
        // }
        // getImgToBase64(data.url, getDefaultFile)
      }
      this.$emit('input', data.id || '')
      this.$emit('getUrl', data, this.imgType)
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
<style lang="scss">
.jee-image-resource-upload-container{
  .desc{
    color: #B3B3B3;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 11px;
    padding-bottom: 17px;
  }
  .resource-upload-wrap{
    display: flex;
    flex-wrap: wrap;
    width: 140px;
    .z-image-uploader{
      cursor: pointer;
      border: 1px dashed #E2E2E2;
      border-radius: 4px;
      overflow: hidden;
      background-color: #fff;
    }
    .image-wrap{
      position: relative;
      margin-left: 20px;
      margin-bottom: 20px;
      .img-editor-wrap{
        position: absolute;
        top: 0;
        left: 0;
        width: 140px;
        height: 140px;
        overflow: hidden;
        border-radius: 4px;
        background-color: rgba(0,0,0,0.7);
        opacity: 0;
        &:hover{
          opacity: 1;
        }
        .guanbi{
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 18px;
          fill: #ffffff;
        }
        .editor{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 140px;
          height: 40px;
          position: absolute;
          bottom: 0;
          padding: 0 16px;
          box-sizing: border-box;
          background-color: #ffffff;
          border-radius: 0 0 4px 4px;
          border: 1px dashed #E2E2E2;
          .jee-svg-icon{
            font-size: 22px;
            fill: #B3B3B3;
            cursor: pointer;
          }
        }
      }
      .image {
        width: 140px;
        height: 140px;
        background-color: #f0f0f0;
        display: flex;
        align-items: center;
        border-radius: 4px;
        overflow: hidden;
        img{
          max-width: 100%;
          max-height: 100%;
          display: block;
          margin: 0 auto;
        }
        &.isBan{
          border: 1px solid #ff0000;
        }
      }
    }
    &.single-mode {
      .z-image-uploader{
        visibility: hidden;
        position: absolute;
      }
      .image-wrap{
        margin: 0;
      }
    }
  }
}
.el-dialog{
  .el-dialog__body{
    .cropper-content {
      .cropper-wrap {
        width: 100%;
        height: 300px;
      }
      .show-preview{
        border: 1px solid #e8e8e8;
        margin-top: 20px;
        overflow: hidden;
      }
    }
  }
}
.image-preview-dialog{
  .el-dialog{
    height: 100%;
    .el-dialog__body{
      display: block!important;
      img{
        width: auto;
        // height: auto;
        // margin: 0 auto;
      }
    }
  }
}
</style>
