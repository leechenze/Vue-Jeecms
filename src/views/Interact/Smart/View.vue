<template>
  <section class="interact-vote-view">
    <div class="vote-wrap">
      <div class="vote-bg"  :style="getStyle(formData.bgConfig,'bgConfig')"></div>
      <div class="smart-box">
        <!-- 页眉 -->
        <div class="smart-header" v-if="formData.headConfig&&(formData.headConfig.bgImageUrl || formData.headConfig.bgImage)">
            <img  class="w-100 p-head-fit" :src="$getPath(formData.headConfig.bgImageUrlSelect || formData.headConfig.bgImageUrl)"/>
        </div>
        <!-- 内容 -->
        <div class="vote-cont">
          <!-- 填写人的信息 -->
          <div class="vote-info">
            <span class="vote-txt"> 序号：{{SerialNumber}}</span>
            <span class="vote-txt"> 填写时间：{{dataList.createTime}}</span>
            <span class="vote-txt"> IP：{{dataList.ip}}</span>
            <span class="vote-txt"> 地域：{{dataList.address}}</span>
            <span class="vote-txt"> 设备：{{dataList.systemInfo}}</span>
          </div>
        </div>
          <!-- 表单 -->
          <div class="vote-ques">
            <div class="vote-ques__item" v-for="(item,index) in dataList.datas" :key="index">
              <div class="ques-title">
                <span class="t-red"  >{{item.required === false?'':'*'}} </span>
                {{item.label + ": "}}
              </div>
              <div class="result-info" >
                <!-- 图片单选 单图上传-->
                <div v-if="['imageRadio','imageUpload'].includes(item.dataType)" class="ques-media">
                  <div class="media-imgSrc" v-if="item.val.url">
                    <div class="imgSrc-data">
                      <div class="item-bgShow" @click="openFile(item)"></div>
                      <img class="t-img" :src="$getPath(item.val.url)" fit="contain" />
                    </div>
                    <div class="ques-label" v-if="item.val.label">{{item.val.label}}</div>
                  </div>
                </div>
                <!-- 图片多选 多图上传-->
                <div v-else-if="['imageCheckbox','multiImageUpload'].includes(item.dataType)"  class="ques-checkboxMedia">
                  <div v-for="(imgCheck,index) in item.val" :key="index" class="imgCheck-item">
                    <div class="item-all">
                      <div class="item-bgShow" @click="openFile(item,imgCheck)"></div>
                      <img v-if="imgCheck.url" class="t-img " fit="contain" :src="$getPath(imgCheck.url)"/>
                    </div>
                    <div class="ques-label" v-if="imgCheck.label">{{imgCheck.label}}</div>
                  </div>
                </div>
                <!-- 视频上传-->
                <div  v-else-if="item.dataType === 'videoUpload'" class="ques-media">
                  <div v-if="item.val.url" class="el-video-item">
                    <jee-icon iconClass="bofang" class="videoBoF" @click="openFile(item)"/>
                    <video  class="t-img"  :src="$getPath(item.val.url)" ></video>
                  </div>
                </div>
                <!-- 音频上传-->
                <div v-else-if="item.dataType === 'audioUpload'" class="ques-media">
                  <div  class="file-box" v-if="item.val.url">
                    <div class="file-box__content">
                      <div class="icon-box t-overflow t-text-center">
                        <jee-icon :iconClass="playAudio === item.field?'zanting':'bofang'" class="filBofang" @click="handlePlay(item,item.val)" />
                        <p class="name t-overflow">{{item.val.resAlias}}</p>
                        <div class="play-effect">
                          <el-tooltip content="停止播放" placement="bottom" effect="light">
                            <jee-icon iconClass="tingzhianniu" class="jee-hover-fill" @click="loadAudio" />
                          </el-tooltip>
                          <div class="play-effect__audio">
                            <img class="img" src="../../../assets/img/progress .png" />
                            <div class="gray-div"></div>
                            <div v-if="playAudio === item.field" class="active-div jee-bg-light" :style="{width:audioWidth}"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 附件上传-->
                <div v-else-if="item.dataType === 'fileUpload'" >
                  <div v-for="(fileData,index) in item.val" :key="index" class="ques-media">
                    <div class="media-fileUpload" v-if="fileData.resAlias" @click="openFile(item,fileData)">{{fileData.resAlias}}</div>
                  </div>
                </div>
                <div v-else-if="item.dataType === 'checkbox'" >
                  <div v-for="(checkboxItem,index) in item.val" :key="index" class="ques-media">

                    <div v-if="index === item.val.length-1"> {{checkboxItem}}</div>
                    <div v-else> {{checkboxItem +'、'}}</div>

                  </div>
                </div>
                <div v-else-if="['imageCheckbox', 'multiImageUpload'].includes(item.dataType)" ></div>
                <div v-else class="ques-text">{{item.val}}</div>
              </div>
            </div>
          </div>
        </div>
      <el-dialog :width="width"  :visible.sync="showFile" :title="dialogTitle" @close="closeDialog">
        <div v-if="fileType === 'video'">
          <video
            class="video"
            preload="auto"
            autoplay
            controls
            width="760"
            height="427"
            webkit-playsinline="true"
            playsinline="true"
            ref="videoEle"
          >
            <source :src="$getPath(fileUrl)" type="video/mp4">
          </video>
        </div>
        <div v-else-if="fileType === 'audio'">
          <audio :src="$getPath(fileUrl)" controls></audio>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible"
        custom-class="transparent"
        class="image-preview-dialog "
        @close="closeImgDialog"
        append-to-body >
        <img class="t-img" :src="$getPath(fileUrl)" alt="">
      </el-dialog>

    </div>
    <audio  ref="audioFile" :src="audioUrl" @ended="loadAudio"></audio>
  </section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'interactSmartView',
  data () {
    return {
      videoSrc: '',
      audioWidth: '0%',
      dialogVisible: false,
      audio: this.$refs.audioFile,
      fileUrl: '',
      cssStyles: {
        contConfig: {
          titleStyle: {},
          descStyle: {},
          optStyle: {}
        }
      },
      formData: {
        contConfig: {
          titleStyle: {},
          descStyle: {},
          optStyle: {}
        }

      },
      dataList: {
        attrMap: {},
        user: {}
      },
      audioUrl: '',
      showFile: false,
      fieldVal: [],
      playAudio: false,
      fileType: '',
      width: '821px',
      height: 'auto',
      dialogTitle: '',
      SerialNumber: '' // 保存序号值
    }
  },
  computed: {
    ...mapGetters(['smartDetailData']),
    detail () {
      return this.smartDetailData
    }
  },
  watch: {
    detail (newVal) {
      let { id, type } = this.$route.query
      // // 判断当前是否是 编辑问卷页签
      if (id && (this.name === 'editQues')) {
        this.setDetailData(id, type)
        let arr = ['bgConfig', 'headConfig', 'contConfig', 'componentConfig', 'subConfig']
        arr.forEach((t, i) => {
          if (newVal[t] instanceof String) {
            newVal[t] = JSON.parse(newVal[t])
          }
          this.cssStyles[t] = newVal[t]
        })
      }
      this.formData = newVal
    }
  },
  methods: {
    ...mapActions('interact', ['getSmartDetailData']),
    getData () {
      let { id } = this.$route.query
      this.SerialNumber = localStorage.SerialNumber
      if (id) {
        this.$request.fetchSmartFormData({ id: id }).then(res => {
          if (res.code === 200) {
            this.dataList = res.data
            if (!res.data.isRead) {
              this.getSmartDetailData({ id: res.data.formId })
            }
          }
        })
      }
    },
    getStyle (data, type) {
      let obj = {}
      if (data && type === 'bgConfig') {
        let parant = document.querySelector('.interact-vote-view .vote-wrap')
        let element = document.querySelector('.interact-vote-view .vote-wrap .vote-bg')
        element.style.height = parant.scrollHeight + 'px'
        obj = {
          backgroundColor: data.bgType === 1 ? '' : data.bgColor,
          backgroundImage: data.bgType === 1 ? 'url(' + this.$getPath(data.bgImageUrl) + ')' : '',
          backgroundPosition: data.alignType,
          backgroundRepeat: data.isRepeat === 1 ? 'repeat' : 'no-repeat',
          opacity: data.opacity / 100
        }
      } else if (data && type === 'contConfig') {
        obj = {
          backgroundColor: data.bgColor,
          borderColor: data.hasBorder === 1 ? data.borderColor : '#e8e8e8',
          borderWidth: data.hasBorder === 1 ? data.borderWidth + 'px' : '1px',
          borderRadius: data.hasBorder === 1 ? data.borderRadius + 'px' : '0px'
        }
      } else if (data && type === 'subConfig') {
        this.submitText = data.text
        obj = {
          color: data.fontStyle.fontColor,
          fontWeight: data.fontStyle.fontWigth,
          fontSize: data.fontStyle.fontSize + 'px',
          backgroundColor: data.bgColor,
          borderColor: data.hasBorder === 1 ? data.borderColor : '',
          borderWidth: data.hasBorder === 1 ? data.borderWidth + 'px' : '0px',
          borderRadius: data.hasBorder === 1 ? data.borderRadius + 'px' : '4px',
          width: data.btnWidth + 'px',
          height: data.btnHeight + 'px'

        }
      } else if (data && (type === 'titleStyle' || type === 'descStyle' || type === 'stemStyle' || type === 'optStyle')) {
        obj = {
          fontSize: data.fontSize + 'px',
          fontWeight: data.fontWigth,
          color: data.fontColor,
          textAlign: data.fontAlign || ''
        }
      }
      return obj
    },
    closeImgDialog () {
      this.dialogVisible = false
    },
    closeDialog () {
      this.videoSrc = this.$refs.videoEle
      this.videoSrc.pause()
      this.showFile = false
    },
    openFile (item, res) {
      this.dialogTitle = item.label
      let imgUrls
      if (item.dataType === ('fileUpload' || '')) {
        imgUrls = res.pdfPath || res.url
      } else {
        imgUrls = item.val.url || res.imgUrl || res.url
      }
      this.fileType = this.typeFilter(imgUrls)
      if (this.fileType === 'compress') {
        window.open(this.$getPath(imgUrls))
      } else if (this.fileType === 'file') {
        // let fileType = imgUrls.split('.')
        window.open(this.$getPath(imgUrls))
      } else {
        this.fileUrl = this.$getPath(imgUrls)
        if (this.fileType === 'img') {
          this.dialogVisible = true
          this.width = item.width + 'px' || '600px'
          this.height = item.height + 'px' || 'auto'
        } else if (this.fileType === 'audio') {
          this.showFile = true
          this.width = '400px'
          this.height = 'auto'
        } else if (this.fileType === 'video') {
          this.showFile = true
          this.width = '821px'
          this.height = '100%'
          if (this.videoSrc) {
            this.videoSrc.src = this.$getPath(imgUrls)
          }
        } else {
          this.showFile = true
          this.width = '821px'
          this.height = '100%'
        }
      }
    },
    typeFilter (url) {
      let suffix = url.slice(url.lastIndexOf('.') + 1)
      let image = this.$enums.imageType.filter(t => t.value === suffix)
      let video = this.$enums.videoType.filter(t => t.value === suffix)
      let audio = this.$enums.audioType.filter(t => t.value === suffix)
      let file = this.$enums.fileType.filter(t => t.value === suffix)
      let compress = this.$enums.compressType.filter(t => t.value)
      if (image.length > 0) {
        return 'img'
      } else if (audio.length > 0) {
        return 'audio'
      } else if (video.length > 0) {
        return 'video'
      } else if (file.length > 0) {
        return 'file'
      } else if (compress.length > 0) {
        return 'compress'
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
    // 弹窗
    handlePlay (item, data) {
      if (!this.audio) {
        this.audio = this.$refs.audioFile
        this.audio.src = this.$getPath(data.url)
        this.audio.play()
        this.playAudio = item.field
        this.getTimeWidth(this.audio, true)
      } else {
        if (this.playAudio) {
          if (this.playAudio === item.field) {
            this.audio.pause()
            this.playAudio = false
          } else {
            this.audio.src = this.$getPath(data.url)
            this.audio.play()
            this.playAudio = item.field
            this.getTimeWidth(this.audio, true)
          }
        } else {
          this.audio.play()
          this.playAudio = item.field
          this.getTimeWidth(this.audio, true)
        }
      }
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
    // 移除
    handleRemove () {
      this.loadAudio()
      this.file = {}
      this.$emit('input', '')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData()
    })
  },
  created () {
  },
  activated () {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
  .interact-vote-view{
    height: 100%;
    .vote-wrap{
      min-height: 100%;
      position: relative;
      padding: 50px 0;
      margin-bottom: 30px;
      box-sizing: border-box;
      .vote-bg{
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: #F0F0F0;
      }
      .smart-box{
        min-width: 1000px;
        max-width: 100px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 4px 4px 0 0;
        overflow: hidden;
        .smart-header{
          width: 100%;
          height: 150px;
          >img{
            width: 100%;
            height: 100%;
            object-fit: cover
          }
        }
      }
      .vote-cont{
        padding: 30px 40px;
        // margin: 0 96px;
        box-sizing: border-box;
        max-width: 100%;
      }
      .vote-info{
        margin-bottom: 14px;
        font-size: 14px;
        line-height: 28px;
        color: #666666;
        .vote-txt{
          width: 33%;
          display: inline-block;
        }
      }
      .vote-title{
        font-size: 24px;
        color: #333333;
        text-align: center;
        margin-bottom: 42px;
      }
      .vote-decs{
        margin-bottom: 40px;
        font-size: 14px;
        color: #333333;
        text-align: left;
      }
      .vote-ques{
        font-size: 14px;
        padding: 0 40px;
        color: #333333;
        &__item{
          margin-bottom: 40px;
          .ques-title{
            font-size: 16px;
          }
          .result-info{
            .ques-checkboxMedia{
              display: flex;
              margin-top: 10px;
              .imgCheck-item{
                .item-all{
                  width: 140px;
                  height: 140px;
                  display: flex;
                  margin-right: 20px;
                  background: #F0F0F0;
                  border-radius: 4px;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                  cursor: pointer;
                  position: relative;
                  .item-bgShow{
                    width: 140px;
                    height: 140px;
                    border-radius: 4px;
                    position: absolute;
                    &:hover{
                      background: rgba(0,0,0,0.5);
                      z-index: 22;
                    }

                  }
                  >img{
                    // width: 100%;
                    object-fit: contain;
                    height: auto !important;
                  }

                }
                .ques-label{
                  max-width: 140px;
                  margin-top: 10px;
                }

              }
            }
            .ques-media{
              position: relative;
              display: flex;
              align-items: center;
              margin-top: 10px;
              .el-video-item{
                position: relative;
                width: 140px;
                height: 140px;
                >video{
                  width: 100%;
                  height: 100%;
                }
                .videoBoF{
                  position: absolute;
                  z-index: 333;
                  left: 50%;
                  top: 50%;
                  margin-left: 0px !important;
                  transform: translate(-50%,-50%);
                  color: #fff;
                  fill: #fff;
                  cursor: pointer;
                }
              }
              .media-imgSrc{
                width: 140px;
                .imgSrc-data{
                  height: 140px;
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  background: #F0F0F0;
                  position: relative;
                  cursor: pointer;
                  overflow: hidden;
                  .item-bgShow{
                    width: 140px;
                    height: 140px;
                    border-radius: 4px;
                    position: absolute;
                    &:hover{
                      background: rgba(0,0,0,0.5);
                      z-index: 22;
                    }
                  }
                  >img{
                    width: 100%;
                    object-fit: contain;
                  }
                }
              }
              .bofang{
                position: absolute;
                z-index: 333;
                margin-left: 55px;
                font-size: 36px;
                color: #fff;
                fill: #fff;
                cursor: pointer;
              }
              .ques-label{
                margin-top: 10px;
              }
              .el-image{
                background: #F0F0F0;
                width: 140px;
                height: 140px;
                border-radius: 4px;
                margin-right: 20px;
                cursor: pointer;
                &:hover{
                  opacity: 0.8;
                }
              }
              .media-fileUpload{
                width: 366px;
                height: 40px;
                line-height: 40px;
                color: #3178EE;
                font-size: 14px;
                border: 1px solid rgba(232,232,232,1);
                padding: 0 23px;
                cursor: pointer;
                border-radius: 4px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .file-box{
                width: 120px;
                padding: 20px 11px;
                border: 1px dashed #E2E2E2;
                border-radius: 4px;
                .file-box__content{
                  .filBofang{
                    color: #777777;
                    font-size: 36px;
                    position: relative;
                    z-index: 11;
                    margin-left: 0;
                    color: #fff;
                    fill: #777777;
                    margin-bottom: 20px;
                    cursor: pointer;
                  }
                  .play-effect{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // width: 140px;
                    // height: 40px;
                    margin-top: 10px;
                    .jee-svg-icon{
                      fill: #777777;
                      font-size: 20px;
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
                      .gray-div{
                        background-color: #BFBFBF;
                        width: 93px;
                      }

                    }
                  }
                }
              }
            }
            .ques-text{
              margin-top: 19px;
            }
          }
          // .ques-answer{
          //   margin-bottom: 39px;
          // }
        }
      }
    }
    .result-item{
      .el-image{
        height: 140px;
        width: 140px;
        background-color: #F0F0F0;
      }
      .result-info{
        min-width: 300px;
        margin-top: 20px;
        min-height: 40px;
        line-height: 1.5;
        color: #3178EE;
        cursor: pointer;
        border: 1px solid #e8e8e8;
        padding: 8px 20px;
        box-sizing: border-box;
        margin-top: 10px;
      }
    }
  }
</style>
