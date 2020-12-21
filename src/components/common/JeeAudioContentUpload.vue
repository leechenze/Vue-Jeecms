<template>
  <section class="jee-audio-resource-upload-container">
    <div class="desc" v-if="getImageDesc">{{getImageDesc}}</div>
    <!-- 上传区 -->
    <div class="resource-upload-wrap">
      <div  v-if="file.url" class="file-box">
        <div class="file-box__content">
          <div class="icon-box t-overflow t-text-center">
            <jee-icon :iconClass="playAudio?'zanting':'bofang'" class="bofang jee-hover-fill" @click="handlePlay"/>
            <p class="name t-overflow" :title="file.fileName">{{file.fileName}}</p>
            <div class="play-effect">
              <el-tooltip content="停止播放" placement="bottom" effect="light">
                <jee-icon iconClass="tingzhianniu" class="jee-hover-fill" @click="loadAudio" />
              </el-tooltip>
              <div class="play-effect__audio">
                <img class="img" src="../../assets/img/progress .png" />
                <div class="gray-div"></div>
                <div v-if="audio" class="active-div jee-bg-light" :style="{width:audioWidth}"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="img-editor-wrap" @mouseenter="titlePlay" @mouseleave="titleStop">
          <jee-icon iconClass="guanbi" class="guanbi jee-hover-fill" @click="handleRemove"/>
          <div class="icon-box t-overflow t-text-center">
            <jee-icon  :iconClass="playAudio?'zanting':'bofang'" class="bofang jee-hover-fill" @click="handlePlay"/>
            <p class="name t-overflow" :title="file.fileName">{{file.fileName}}</p>
          </div>
          <div class="editor jee-hover-border-important">
            <el-tooltip class="flex-1" content="重新上传" placement="bottom" effect="light">
              <jee-icon iconClass="chongxinshangchuan" class="jee-hover-fill" @click="showResourceDialog"/>
            </el-tooltip>
            <el-tooltip class="flex-1" content="停止播放" placement="bottom" effect="light">
              <jee-icon iconClass="tingzhianniu" class="jee-hover-fill"  @click="loadAudio" />
            </el-tooltip>
            <div class="flex-1"></div>
          </div>
        </div>
      </div>
      <div v-else class="z-video-uploader jee-hover-border"
        @click="showResourceDialog"
      >
        <div class="text-wrap">
          <jee-icon :iconClass="iconClass"></jee-icon>
          <div class="text">点击上传音频</div>
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
      resourceType="music"
      :uploadOption="uploadOption"
      @handleConfirm="handleConfirm"
    ></upload>
    <audio  ref="audioFile" :src="fileUrl" @ended="loadAudio"></audio>
  </section>
</template>
<script>
import Upload from '@/components/editor/Upload'

export default {
  name: 'JeeAudioContentUpload',
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
      default: 'yinpin'
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
      fileImg: '',
      fileUrl: '',
      audioWidth: '0%',
      audio: this.$refs.audioFile,
      playAudio: false,
      timer: null,
      originalTitle: ''
    }
  },
  computed: {
    val () {
      return this.value
    },
    getImageDesc () {
      if (this.desc) return this.desc
      const allowType = this.type instanceof Array ? this.type.join(', ') : this.type
      let desc = allowType ? `支持 ${allowType} 音频格式` : ''
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
      return allowTypes.length ? allowTypes.map(t => `audio/${t}`).join(',') : `audio/*`
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
      if (this.playAudio) {
        this.loadAudio()
      }
      this.$refs.resourceUpload.showDialog()
    },
    // 移除
    handleRemove () {
      this.loadAudio()
      this.file = {}
      this.$emit('input', '')
    },
    // 弹窗
    handlePlay () {
      if (!this.audio) {
        this.audio = this.$refs.audioFile
        this.audio.src = this.$getPath(this.file.url)
        this.audio.play()
        this.playAudio = true
        this.getTimeWidth(this.audio, true)
      } else {
        if (this.playAudio) {
          this.audio.pause()
          this.playAudio = false
        } else {
          this.audio.play()
          this.playAudio = true
          this.getTimeWidth(this.audio, true)
        }
      }
    },
    loadAudio (val) {
      if (!this.audio) {
        this.audio = this.$refs.audioFile
      }
      this.audio.load()
      this.playAudio = false
      this.audioWidth = '0%'
      this.getTimeWidth(this.audio, false)
    },
    getTimeWidth (audio, status) {
      if (status) {
        this.timer = setInterval(() => {
          this.audioWidth = ((audio.currentTime || 0) / audio.duration) * 100 + '%'
        }, 3000)
      } else {
        clearInterval(this.timer)
      }
    },
    initData () {
      if (this.value && typeof this.value === 'object' && this.value.id) {
        this.file = {
          fileName: this.value.alias + this.value.suffix,
          url: this.value.url
        }
        this.originalTitle = this.file.fileName
        this.$emit('input', this.value.id || '')
      }
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
      _this.tiemsetInterval = null
      _this.file.fileName = _this.originalTitle
    },
    // 资源上传提交
    handleConfirm (url, data, file) {
      // data: { url, id, fileName }
      // 上传file: {uploadFile, mark, addToRes, spaceId}
      // 资源库file：{uploadFile，typeStr, addToRes, spaceId}
      // console.log(url, data, file)
      this.formData = Object.assign({}, file)
      if (file && file.uploadFile) {
        const theFile = file.uploadFile.get('uploadFile')
        this.$set(this.file, 'fileName', theFile.name)
        this.$set(this.file, 'url', data.url)
        this.originalTitle = theFile.name
      } else {
        if (data.fileName) {
          this.$set(this.file, 'fileName', data.fileName)
          this.$set(this.file, 'url', data.url)
          this.originalTitle = data.fileName
        }
      }
      this.$emit('input', data.id || '')
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
<style lang="scss">
.jee-audio-resource-upload-container{
  .audio-play{
    opacity: 0;
  }
  .desc{
    color: #B3B3B3;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 11px;
    padding-bottom: 17px;
  }
  .resource-upload-wrap{
    width:138px;
    box-sizing: border-box;
    .z-video-uploader{
      cursor: pointer;
      border: 1px dashed #E2E2E2;
      border-radius: 4px;
      overflow: hidden;
      max-width: 414px;
      width: 100%;
      height: 138px;
      background-color:#fff;
      .text-wrap{
        width: 100%;
        height: 100%;
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
      background-color:#fff;
      padding: 0;
      height: 140px;
      box-sizing: border-box;
      &__content{
        width: 140px;
        height: 140px;
        position: relative;
        border: 1px dashed #E2E2E2;
        opacity: 1;
        .play-effect{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 140px;
          height: 40px;
          .jee-svg-icon{
            font-size: 20px;
            fill: #777777;
            cursor: pointer;
          }
          &__audio{
            flex: 1;
            padding: 0 4px;
            position: relative;
            .img{
              position: relative;
              z-index: 5;
            }
            .gray-div,.active-div{
              max-width: 93px;
              height: 100%;
              position: absolute;
              z-index:3;
              top:0;
              left: 4px;
            }
            .active-div{
              z-index: 4;
            }
            .gray-div{
              background-color: #BFBFBF;
              width: 93px;
            }
          }
        }
      }
      &:hover{
        .file-box__content{
          opacity: 0;
        }
      }
      .img-editor-wrap{
        position: absolute;
        top: 0;
        left: 0;
        width: 140px;
        height: 140px;
        background-color: rgba(0,0,0,0.7);
        border-radius: 4px;
        overflow: hidden;
        opacity: 0;
        &:hover{
          opacity: 1;
        }
      }
      .img-editor-wrap,.file-box__content{
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
            &.tingzhianniu{
              fill: #777777;
            }
          }
        }
      }
      .file-box__content{
        border-radius: 4px;
        .guanbi{
          fill: #777777;
        }
        .icon-box{
          .bofang{
            fill: #777777;
          }
          .name{
            color: #333;
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
