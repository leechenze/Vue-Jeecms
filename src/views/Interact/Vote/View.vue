<template>
  <section class="interact-vote-view">
    <div class="vote-wrap">
      <div class="vote-bg" :style="getStyle(cssStyles.bgConfig,'bgConfig')"></div>
      <div class="vote-box">
        <!-- 页眉 -->
        <div class="vote-header" v-if="cssStyles.headConfig&&cssStyles.headConfig.bgImage">
          <el-image class="w-100"
            fit="scale-down"
            :src="$getPath(cssStyles.headConfig.bgImageUrl)"></el-image>
        </div>
        <!-- 内容 -->
        <div class="vote-cont" :style="getStyle(cssStyles.contConfig,'contConfig')">
          <!-- 答卷人信息 -->
          <div class="vote-info">
            <span class="vote-txt"> 参与人：{{formData.replayName}}</span>
            <span class="vote-txt"> 填写时间：{{formData.participateTime}}</span>
            <span class="vote-txt"> 是否有效：<jee-icon :iconClass="formData.effective?'youxiao':'wuxiao'"
              :style="{fill:formData.effective?'#FF9300':'#999999'}"></jee-icon></span>
            <span class="vote-txt"> IP：{{formData.ip}}</span>
            <span class="vote-txt"> 地域：{{formData.address}}</span>
            <span class="vote-txt"> 设备：{{formData.device}}</span>
          </div>
          <!-- 问卷标题 -->
          <div class="vote-title" :style="getStyle(cssStyles.contConfig.titleStyle,'titleStyle')">{{formData.title}}</div>
          <div class="vote-decs" :style="getStyle(cssStyles.contConfig.descStyle,'descStyle')">{{formData.describe}}</div>
          <!-- 问卷题目 -->
          <div class="vote-ques">
            <div class="vote-ques__item" v-for="(item,index) in formData.answer" :key="index">
              <div class="ques-title" :style="getStyle(cssStyles.contConfig.stemStyle, 'stemStyle')">
                <span class="t-red">*</span>{{item.title}}</div>
              <div v-if="(item.result instanceof Array)" class="ques-answer"
                :style="getStyle(cssStyles.contConfig.optStyle,'optStyle')">
                  <div class="result-item" v-for="(info,idx) in item.result" :key="idx"
                   @click="openFile(info)">
                    <el-image class="t-img" v-if="typeFilter(info.name) === 'img'" :src="$getPath(info.url)" fit="contain">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                    <div v-else class="result-info" @click="openFile(info)">{{info.name}}</div>
                  </div>
                </div>
                <div v-else class="ques-answer" >
                  <div class="result-info">{{item.result}}</div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog :width="width"  :visible.sync="showFile" @close="closeDialog">
        <div v-if="fileType === 'video'">
          <video
            class="video"
            preload="auto"
            autoplay
            controls
            width="760"
            height="550"
            webkit-playsinline="true"
            playsinline="true"
            ref="videoEle"
            id="android"
          >
            <source :src="$getPath(fileUrl)" type="video/mp4">
          </video>
        </div>
        <div v-else-if="fileType === 'audio'">
          <audio :src="$getPath(fileUrl)" controls></audio>
        </div>
        <div v-else-if="fileType === 'img'">
          <el-image class="t-img" :src="$getPath(fileUrl)" fit="contain">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </el-dialog>
    </div>
  </section>
</template>
<script>
export default {
  name: 'interactVoteView',
  data () {
    return {
      cssStyles: {
        contConfig: {
          titleStyle: {},
          descStyle: {},
          optStyle: {}
        }
      },
      formData: {},
      fileUrl: '',
      showFile: false,
      fileType: '',
      width: '821px',
      height: 'auto'
    }
  },
  methods: {
    getData () {
      let { id } = this.$route.query
      if (id) {
        this.$request.fetchQuestionnaireAnswerView({ id: id }).then(res => {
          if (res.code === 200) {
            this.formData = res.data
            this.cssStyles = res.data.voteStyle
          }
        })
      }
    },
    closeDialog () {
      this.showFile = false
    },
    openFile (item) {
      this.fileType = this.typeFilter(item.name)
      if (this.fileType === 'compress') {
        window.open(this.$getPath(item.url))
      } else if (this.fileType === 'file') {
        window.open(this.$getPath(item.pdfUrl || item.url))
      } else {
        this.showFile = true
        this.fileUrl = this.$getPath(item.url)
        if (this.fileType === 'img') {
          this.width = item.width + 'px' || '600px'
          this.height = item.height + 'px' || 'auto'
        } else if (this.fileType === 'audio') {
          this.width = '400px'
          this.height = 'auto'
        } else {
          this.width = '821px'
          this.height = 'auto'
        }
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
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData()
    })
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
      padding: 90px 0;
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
      .vote-box{
        min-width: 1000px;
        max-width: 100px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 4px 4px 0 0;
      overflow: hidden;
      }
      .vote-cont{
        padding: 30px 0 100px;
        margin: 0 96px;
        box-sizing: border-box;
        max-width: 100%;
      }
      .vote-info{
        margin-bottom: 42px;
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
        color: #333333;
        &__item{
          .ques-title{
            margin-bottom: 19px;
          }
          .ques-answer{
            margin-bottom: 39px;
          }
        }
      }
    }
    .result-item{
      .el-image{
        height: 140px;
        width: 140px;
        background-color: #f7f7f7;
      }
      .result-info{
        min-width: 300px;
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
