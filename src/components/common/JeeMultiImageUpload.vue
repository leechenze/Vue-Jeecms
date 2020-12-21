<template>
  <section class="jee-multi-image-upload-container">
    <div class="desc" v-if="getImageDesc">{{getImageDesc}}</div>
    <!-- 上传区 -->
    <div class="upload-wrap">
      <div class="upload-desc-wrap">
        <el-upload
          ref="upload"
          class="z-image-uploader jee-hover-border"
          action=""
          multiple
          :accept="getAccept"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
          :on-change="handleChange"
          :auto-upload="false"
        >
          <!-- <div class="text-wrap" @click="handleClickUploadArea">
            <jee-icon :iconClass="iconClass"></jee-icon>
            <div class="text" v-if="title">{{title}}</div>
            <div class="text" v-if="getImageSize">{{getImageSize}}</div>

          </div> -->
          <el-button type="primary" size="small" @click="handleClickUploadArea">上传图片</el-button>
        </el-upload>
        <!-- <el-input
          v-model="addDescription"
          class="image-desc"
          v-if="isImageDesc"
          type="textarea"
          placeholder="请输入照片描述"
          :maxlength="isLengthLimit ? max : 120"
          :minlength="min"
          :show-word-limit="isLengthLimit"
        ></el-input> -->
      </div>
      <draggable
        :list="fileList"
        v-bind="dragOptions"
        v-if="fileList.length"
         :class="!fileList.length?'drag-wrap none-drag-wrap':'drag-wrap'"
      >
        <template v-for="(item, index) in fileList" >
          <div class="image-desc-wrap" :key="index">
            <div class="image-wrap">
              <div class="image">
                <img :src="item.imageUrl" :style="{width: width, height: height}">
              </div>
              <div class="img-editor-wrap">
                <jee-icon iconClass="guanbi" class="guanbi jee-hover-fill" @click="handleRemove(index)"/>
                <div class="editor jee-hover-border-important">
                  <el-tooltip content="重新上传" placement="bottom" effect="light">
                    <jee-icon iconClass="chongxinshangchuan" class="jee-hover-fill" @click="reUpload(index)"/>
                  </el-tooltip>
                  <el-tooltip content="查看大图" placement="bottom" effect="light">
                    <jee-icon iconClass="chakandatu" class="jee-hover-fill"
                    @click="handlePreview(index)"/>
                  </el-tooltip>
                  <el-tooltip content="裁剪" placement="bottom" effect="light">
                    <jee-icon iconClass="caijian" class="jee-hover-fill"
                    @click="handleCropper(index)"/>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <el-input
              v-model="item.description"
              class="image-desc"
              v-if="isImageDesc"
              type="textarea"
              placeholder="请输入照片描述"
              :maxlength="isLengthLimit ? max : 120"
              :minlength="min"
              :show-word-limit="isLengthLimit"
            ></el-input>
            <div class="drag-icon" v-if="dragIcon">
              <jee-icon iconClass="tuozhuai" class="jee-hover-fill move"></jee-icon>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <!-- 进度条 -->
    <el-progress :stroke-width='2' :percentage="percentage" v-if="percentage>0 && percentage <=100" style="maxWidth: 414px"></el-progress>
    <!-- 说明文字 -->
    <div class="z-tip-form-item" v-if="tip">{{tip}}</div>
    <!-- 放大 -->
    <el-dialog :visible.sync="dialogVisible"
    class="image-preview-dialog " append-to-body
    custom-class="transparent">
      <img  class="t-img" :src="getImageUrl" alt="">
    </el-dialog>
    <!-- 裁剪 -->
    <el-dialog title="图片裁剪" :visible.sync="dialogVisible2" append-to-body>
      <div class="cropper-content">
        <div class="cropper-wrap">
          <vueCropper
            ref="cropper"
            :img="getImageUrl"
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
  </section>
</template>
<script>
import draggable from 'vuedraggable'
import { VueCropper } from 'vue-cropper'
import { getImgToBase64 } from '@/utils'
export default {
  name: 'JeeMultiImageUpload',
  props: {
    value: {
      type: [Array, String],
      default: () => []
      // { id, url}
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    desc: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
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
      default: 100
    },
    height: {
      type: [Number, String],
      default: 100
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
    isLengthLimit: {
      type: Boolean,
      default: false
    },
    isImageDesc: {
      type: Boolean,
      default: true
    },
    dragIcon: {
      type: Boolean,
      default: true
    },
    max: {
      type: [String, Number],
      default: ''
    },
    min: {
      type: [String, Number],
      default: ''
    },
    limit: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    draggable,
    VueCropper
  },
  data () {
    return {
      addDescription: '',
      dialogVisible: false,
      dialogVisible2: false,
      loading: false,
      val: [],
      fileList: [],
      fileIndex: null,
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
      previews: {},
      percentage: 0,
      dragOptions: {
        group: 'image',
        sort: true,
        forceFallback: true,
        ghostClass: 'ghost',
        handle: '.drag-icon',
        chosenClass: 'chosen',
        dragClass: 'dragging',
        swapThreshold: 0.5,
        animation: 100
      }
    }
  },
  computed: {
    getImageUrl () {
      if (this.fileList.length && typeof this.fileIndex === 'number') {
        return this.fileList[this.fileIndex].imageUrl
      }
      return ''
    },
    getImageDesc () {
      if (this.desc) return this.desc
      const allowType = this.type instanceof Array ? this.type.join(', ') : this.type
      let desc = allowType ? `支持 ${allowType} 图片格式` : ''
      if (Number(this.size) && this.unit) desc = desc + ` (文件大小不超过${this.size}${this.unit})`
      return desc
    },
    getImageSize () {
      return this.width && this.height ? `建议${this.width} * ${this.height}PX` : ''
    },
    getValue () {
      return this.fileList.map(d => {
        let value = this.autoUpload ? {
          resId: d.id,
          description: d.description
        } : d
        if (d.uploadFile) {
          value.uploadFile = d.uploadFile
        }
        return value
      })
    },
    getAccept () {
      const allowTypes = this.type instanceof Array ? this.type : (this.type ? this.type.split(',') : [])
      return allowTypes.length ? allowTypes.map(t => `image/${t}`).join(',') : 'image/*'
    }
  },
  watch: {
    value (newVal) {
      if (newVal && newVal.length && newVal !== this.getValue) {
        this.initData()
      } else if (!newVal || !newVal.length) {
        this.fileList = []
      }
    }
  },
  methods: {
    // 点击放大查看
    handlePreview (index) {
      this.fileIndex = index
      this.dialogVisible = true
    },
    // 点击裁剪
    handleCropper (index) {
      this.fileIndex = index
      this.dialogVisible2 = true
    },
    // 重新上传
    reUpload (index) {
      this.$refs.upload.$refs['upload-inner'].$refs.input.click()
      // document.querySelector('.jee-image-upload-container .el-upload input').click()
      this.fileIndex = index
      this.isReUpload = true
    },
    // 点击新上传区域
    handleClickUploadArea () {
      this.fileIndex = null
      this.isReUpload = false
    },
    // 上传-文件类型
    uploadType (file) {
      var type = file.raw.type
      var i = type.indexOf('/')
      var suffix = type.slice(0, i).toLowerCase()
      var fileType = ''
      // File文件 Flash Flash Image图片 Media视频 Audio音频 为空则默认Image
      switch (suffix) {
        case 'image':
          fileType = ''
          break
        case 'text':
          fileType = 'File'
          break
        case 'application':
          fileType = 'File'
          break
        case 'video':
          fileType = 'Media'
          break
        case 'audio':
          fileType = 'Audio'
          break
        default:
          fileType = ''
          break
      }
      return fileType
    },
    // 上传-选择文件
    handleChange (file, fileList) {
      if (!this.beforeImageUpload(file)) return
      let fileObj = {
        file: file,
        fileName: file.name,
        fileType: this.uploadType(file),
        imageUrl: URL.createObjectURL(file.raw)
      }
      if (this.isReUpload) {
        if (this.fileList.length > this.fileIndex) {
          const newFileObj = Object.assign({}, this.fileList[this.fileIndex], fileObj)
          this.fileList.splice(this.fileIndex, 1, newFileObj)
        }
      } else {
        fileObj.description = this.addDescription
        this.fileList.push(fileObj)
        this.fileIndex = this.fileList.length - 1
        this.isReUpload = false
      }
      this.handleUpload(fileObj)
    },
    // 上传到服务器
    handleUpload (fileObj) {
      const param = new FormData() // 创建form对象
      param.append('uploadFile', fileObj.file.raw, fileObj.fileName) // 通过append向form对象添加数据
      const that = this
      if (this.autoUpload) {
        // param.append('spaceId', this.id)
        param.append('typeStr', fileObj.fileType)
        param.append('addToRes', true)
        if (this.modeObj) {
          param.append('modelId', this.modeObj.modelId || '')
          param.append('fieldName', this.modeObj.fieldName)
        }
        const onUploadProgress = function (e) {
          // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          // 如果lengthComputable为false，就获取不到e.total和e.loaded
          if (e.lengthComputable) {
            var rate = e.loaded / e.total // 已上传的比例
            if (rate < 1) {
              that.percentage = Number((rate * 100).toFixed(0))
            // 这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
            // 因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
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
            let file = that.fileList[that.fileIndex]
            file.id = res.data.resourceId
            that.fileList.splice(that.fileIndex, 1, file)
            that.$emit('input', that.getValue)
          } else {
            that.handleRemove(that.fileIndex)
          }
          that.percentage = 0
        })
      } else {
        let file = that.fileList[that.fileIndex]
        file.uploadFile = param
        that.fileList.splice(that.fileIndex, 1, file)
        that.$emit('input', that.getValue)
      }
    },
    // 移除
    handleRemove (index) {
      this.fileList.splice(index, 1)
      this.fileIndex = null
      this.$emit('input', this.getValue)
    },
    // 上传到页面前进行检查
    beforeImageUpload (file) {
      // 判断文件类型 windows下accept无效
      let isJPG = true
      var i = file.name.lastIndexOf('.')
      var suffix = file.name.substring(i + 1).toLowerCase()

      const allowTypes = this.type instanceof Array ? this.type : (this.type ? this.type.split(',') : [])

      if (allowTypes.length) {
        isJPG = allowTypes.includes(suffix)
      }
      // 判断文件大小
      let isLt2M = true
      if (Number(this.size)) {
        const allowSize = this.unit === 'MB' ? (1024 * 1024) : 1024
        isLt2M = file.size / allowSize < Number(this.size)
      }
      // 判断上传数量
      if (this.limit && this.fileList.length >= this.limit) {
        this.$message.error(`上传图片数量不能超过 ${this.limit} 张!`)
        return
      }
      // 提示错误信息
      if (!isJPG) {
        this.$message.error(`上传图片只能是 ${allowTypes.join(',')} 格式!`)
      }
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过 ${this.size}${this.unit || 'KB'}!`)
      }
      return isJPG && isLt2M
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    // 获取截图数据
    handleSubmit () {
      this.$refs.cropper.getCropBlob((data) => {
        let files = new File([data], this.fileList[this.fileIndex].fileName, { type: 'image/png', lastModified: Date.now() })
        this.fileList[this.fileIndex].file = { raw: files }
        this.fileList[this.fileIndex].imageUrl = URL.createObjectURL(data)
        this.dialogVisible2 = false
        this.handleUpload(this.fileList[this.fileIndex])
      })
    },
    // 初始化处理
    initData () {
      if (!this.autoUpload) {
        return
      }
      // 需要上传的数据
      // 图片路径转为图片数据
      this.fileList = (this.value || []).map(d => {
        if (d.resourcesSpaceData) {
          d.id = d.resourcesSpaceData.id
          d.fileName = d.resourcesSpaceData.alias + d.resourcesSpaceData.suffix
        }
        return d
      })
      const that = this
      const getDefaultFile = function (dataUrl, index) {
        that.$set(that.fileList[index], 'imageUrl', dataUrl)
      }
      if (this.fileList.length) {
        // 传多图路径，转为图片数据列表
        this.fileList.forEach((d, index) => {
          if (d.resourcesSpaceData && d.resourcesSpaceData.url) getImgToBase64(this.$getPath(d.resourcesSpaceData.url), (dataUrl) => getDefaultFile(dataUrl, index))
        })
      }
      this.$emit('input', this.getValue)
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
<style lang="scss">
.jee-multi-image-upload-container{
  .desc{
    color: #B3B3B3;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 11px;
    padding-bottom: 17px;
  }
  .upload-wrap{
    .drag-wrap{
      display: flex;
      flex-wrap: wrap;
      .image-desc-wrap{
        width: 320px;
        padding-right: 20px;
        display: flex;
        margin-top: 30px;
        .el-textarea__inner{
          width: 100%;
          line-height: 1.5;
          min-height: 140px !important;
        }
        .el-textarea{
          margin-left: 10px;
        }
      }
    }
    .drag-wrap-upload{
      width: 705px;
      margin-left: -220px;
    }
    .upload-desc-wrap,
    .image-desc-wrap{
      width: 140px;
      padding-right: 20px;
    }
    .upload-desc-wrap{
      .el-upload{
        border: none;
        text-align: left;
      }
    }
    .image-desc-wrap{
      position: relative;
      .image-wrap{
        position: relative;
        .img-editor-wrap{
          position: absolute;
          top: 0;
          left: 0;
          width: 140px;
          height: 140px;
          overflow: hidden;
          background-color: rgba(0,0,0,0.7);
          border-radius: 4px;
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
        }
      }
      .drag-icon{
        position: absolute;
        right: 0px;
        top: -30px;
        .jee-svg-icon{
          fill: #666666;
          font-size: 14px;
        }
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
</style>
