<template>
  <section class="jee-video-content-upload-container">
    <div class="desc" v-if="getImageDesc">{{getImageDesc}}</div>
    <!-- 上传区 -->
    <div class="resource-upload-wrap">
      <div  v-if="file.fileName" class="file-box">
        <div class="file-box__content">
          <el-image class="t-img" :src="fileImg" fit="contain">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <!-- <img class="t-img" :src="fileImg" /> -->
        </div>
        <div class="img-editor-wrap" @mouseenter="titlePlay" @mouseleave="titleStop">
          <jee-icon iconClass="guanbi" class="guanbi jee-hover-fill" @click="handleRemove"/>
          <div class="icon-box t-overflow t-text-center">
            <jee-icon iconClass="bofang" class="bofang jee-hover-fill" @click="handlePlay"/>
            <p class="name t-overflow" :title="file.fileName">{{file.fileName}}</p>
          </div>
          <div class="editor jee-hover-border-important">
            <el-tooltip content="重新上传" placement="bottom" effect="light">
              <jee-icon iconClass="chongxinshangchuan" class="jee-hover-fill" @click="showResourceDialog"/>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div v-else class="z-video-uploader jee-hover-border"
        @click="showResourceDialog"
      >
        <div class="text-wrap">
          <jee-icon :iconClass="iconClass"></jee-icon>
          <div class="text">点击上传视频</div>
        </div>
      </div>
      <div slot="tip">
      <!-- 说明文字 -->
      <div class="z-tip-form-item" v-if="tip&&tipShow">{{tip}}</div>
    </div>
    </div>
    <!-- 资源上传 -->
    <upload
      ref="resourceUpload"
      resourceType="insertvideo"
      :uploadOption="uploadOption"
      @handleConfirm="handleConfirm"
    ></upload>
    <el-dialog title="视频" width="821px" :visible.sync="showFile" @close="closeDialog">
        <video
          class="video"
          preload="auto"
          controls
          width="760"
          height="427"
          webkit-playsinline="true"
          playsinline="true"
          ref="videoEle"
          id="android"
        >
        </video>
    </el-dialog>
  </section>
</template>
<script>
import Upload from '@/components/editor/Upload'

export default {
  name: 'JeeVideoContentUpload',
  props: {
    value: {
      validator (value) {
        return true
      }
    },
    uploadOption: {
      type: Object,
      default: () => ({})
    },
    isDescShow: {
      type: Boolean,
      default: true
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
    tipShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '点击上传文件'
    },
    iconClass: {
      type: String,
      default: 'shangchuanicon'
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
    }
  },
  components: {
    Upload
  },
  data () {
    return {
      loading: false,
      file: {},
      formData: {},
      percentage: 0,
      showFile: false,
      fileImg: '',
      fileUrl: '',
      video: null
    }
  },
  computed: {
    val () {
      return this.value
    },
    getImageDesc () {
      if (this.desc) return this.desc
      const allowType = this.type instanceof Array ? this.type.join(', ') : this.type
      let desc = allowType ? `支持 ${allowType} 视频格式` : ''
      if (Number(this.size) && this.unit) desc = desc + ` (文件大小不超过${this.size}${this.unit})`
      return this.isDescShow ? desc : ''
    },
    getFileList () {
      return this.file.fileName ? [{
        name: this.file.fileName
      }] : []
    },
    getAccept () {
      const allowTypes = this.type instanceof Array ? this.type : (this.type ? this.type.split(',') : [])
      return allowTypes.length ? allowTypes.map(t => `video/${t}`).join(',') : `video/*`
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) {
        this.file = {}
      }
      if (typeof newVal === 'object') {
        this.initData()
      }
    }
  },
  methods: {
    showResourceDialog () {
      this.$refs.resourceUpload.showDialog()
    },
    // 移除
    handleRemove () {
      this.file = {}
      this.$emit('input', '')
    },
    // 弹窗
    handlePlay () {
      this.showFile = true
      setTimeout(() => {
        if (this.$refs.videoEle) {
          this.video = this.$refs.videoEle
          this.video.src = this.$getPath(this.file.url)
          this.video.play()
        } else {
          console.log(this.$refs.videoEle)
        }
      }, 100)
    },
    // 关闭弹窗
    closeDialog () {
      this.showFile = false
      this.video.load()
    },
    initData () {
      // if (!this.autoUpload) {
      //   return
      // }
      if (this.value && typeof this.value === 'object' && this.value.id) {
        this.file = {
          fileName: this.value.alias + this.value.suffix,
          url: this.value.url,
          videoCover: this.value.videoCover
        }
        this.$emit('input', this.value.id || '')
      }
      if (this.file.videoCover) {
        this.fileImg = this.$getPath(this.file.videoCover.fileUrl)
      }
    },
    // 资源上传提交
    handleConfirm (url, data, file) {
      // data: { url, id, fileName }
      // 上传file: {uploadFile, mark, addToRes, spaceId}
      // 资源库file：{uploadFile，typeStr, addToRes, spaceId}
      console.log(url, data, file)
      this.formData = Object.assign({}, file)
      if (file && file.uploadFile) {
        const theFile = file.uploadFile.get('uploadFile')
        this.$set(this.file, 'fileName', theFile.name)
        this.$set(this.file, 'url', data.url)
        this.$set(this.file, 'videoCover', data.videoCover)
      } else {
        if (data.fileName) {
          this.$set(this.file, 'fileName', data.fileName)
          this.$set(this.file, 'url', data.url)
          this.$set(this.file, 'videoCover', data.videoCover)
        }
      }
      if (this.file.videoCover) {
        this.fileImg = this.$getPath(this.file.videoCover.fileUrl)
      }
      this.$emit('input', data.id || '')
    },
    titlePlay () {
      var _this = this
      _this.tiemsetInterval = setInterval(function () {
        // substring(0,i)取字符串的前i个字符
        var start = _this.file.fileName.substring(0, 1) // 取第1个字符
        var end = _this.file.fileName.substring(1)// 取1～msg.length-1的字符
        _this.file.fileName = end + start
      }, 200)
    },
    titleStop () { // 清楚定时器
      var _this = this
      clearInterval(_this.tiemsetInterval)
      _this.timerInterval = null
    }
  },
  mounted () {
    console.log(this.uploadOption)
    this.initData()
  }
}
</script>
<style lang="scss">
.jee-video-content-upload-container{
  .desc{
    color: #B3B3B3;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 11px;
    padding-bottom: 17px;
  }
  .resource-upload-wrap{
    width:140px;
    box-sizing: border-box;
    .z-video-uploader{
      cursor: pointer;
      border: 1px dashed #E2E2E2;
      border-radius: 4px;
      max-width: 414px;
      width: 140px;
      height: 140px;
      background-color: #fff;
      .text-wrap{
        width: 140px;
        height: 140px;
        .jee-svg-icon{
            padding-top: 38px;
        }
      }
    }
    .file-box{
      cursor: pointer;
      border-radius: 4px;
      max-width: 414px;
      width: 100%;
      background-color:#F0F0F0;
      // padding:23px 0;
      height: 140px;
      box-sizing: border-box;
      &__content{
        width: 140px;
        height: 140px;
        border-radius: 4px;
        overflow: hidden;
      }
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
        .icon-box{
          padding: 23px 9px 0;
          .bofang{
            font-size: 36px;
            fill: #fff;
          }
          .name{
            color: #fff;
            font-size: 14px;
            line-height: 1.5;
            margin-top: 4px;
          }
        }
        .editor{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
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
    }
  }

  .file-item-wrap{
    padding: 10px 0 0;
    max-width: 414px;
    .file-name{
      padding: 0 10px 0 20px;
      line-height: 38px;
      color: #3178EE;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      >span{
        max-width: 90%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .jee-svg-icon{
        fill: #B3B3B3;
        cursor: pointer;
        &:hover{
          fill: #3178EE;
        }
      }
    }
  }
}
</style>
