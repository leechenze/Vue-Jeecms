<template>
    <section class="content-wrap ">
      <div v-if="preview" class="content-wrap__mask">
        <div class="content-wrap__preview">
          <div class="weibo-preview scrollbar">
            <el-image
              class="weibo-preview__img"
              :src="previewData.cover"
              fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
            <div class="weibo-preview__cont">
              <p class="weibo-preview__title">{{previewData.title}}</p>
              <div class="weibo-preview__info">
                <el-image
                  class="t-img"
                  :src="previewData.profileImageUrl"
                  fit="contain">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
                <span class="name">{{previewData.screenName}}</span>&nbsp; | &nbsp;
                <span>{{$moment(previewData.pushDate)}}</span>
              </div>
              <p class="weibo-preview__summary">{{previewData.summary}}</p>
              <p v-html="previewData.content"></p>
            </div>
          </div>
        </div>
      </div>
      <header>
        <div class="content-box">
          <span class="content-box__title">{{preview?'推送预览':'编辑'}}</span>
          <div class="content-box__btns">
            <el-button size="small" @click="handleCancel">取消</el-button>
            <el-button v-if="!preview" size="small" @click="previewContent" type="primary">预览</el-button>
            <el-button size="small" type="primary" @click="submitPush">推送</el-button>
          </div>
        </div>
        <el-button type="primary" size="mini" @click="handleClickScreenFull">
          <jee-icon :iconClass="isFullscreen?'huanyuanhuabu':'quanping'"></jee-icon>
          {{$t(isFullscreen? 'global.cancelScreenFull':'global.screenFull')}}
        </el-button>
      </header>
      <el-form
        label-width="auto"
        label-suffix="："
        ref="form"
        :rules="rules"
        v-loading="loading"
        :model="form"
      >
        <div class="content-form-item-wrap ">
          <!-- 标题正文区 -->
          <div class="title-content-wrap">
            <el-form-item
              prop="title"
              class="title-wrap"
              label-width="0">
              <span class="t-red title-label">*</span>
              <el-input class="t-bottom t-18" v-model="form.title" placeholder="请输入标题："></el-input>
              <el-input v-model="form.summary" placeholder="请输入导语："></el-input>
            </el-form-item>
            <el-form-item
              prop="content"
              label-width="0">
              <label><span class="t-red">*</span>正文：</label>
              <u-editor
                v-model="form.content"
              ></u-editor>
            </el-form-item>
            <el-form-item
              label="封面图片"
              prop="cover"
              label-width="100px">
              <jee-image-upload
                v-bind="imgOption"
                :defaultUrl="form.cover"
                v-model="form.cover"
              ></jee-image-upload>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </section>
</template>
<script>
import formDialog from '@/components/mixins/formDialog'
import screenFull from '@/components/mixins/screenFull'
import UEditor from '@/components/editor/UEditor'
import { deepClone } from '@/utils'
export default {
  name: 'sinaWeiboEdit',
  mixins: [formDialog, screenFull],
  components: {
    UEditor
  },
  data () {
    return {
      loading: false,
      form: {
        'content': '',
        'contentId': '',
        'cover': '',
        'weiboId': '',
        'text': '',
        'title': '',
        'summary': ''
      },
      rules: {
        'content': [
          this.$rules.required('请填写正文内容')
        ],
        'title': [
          this.$rules.required('请填写标题')
        ],
        'cover': [
          this.$rules.required('请上传封面图片')
        ]
      },
      preview: false,
      num: 1,
      screenFullElement: '.content-wrap',
      imgOption: {
        size: '20',
        unit: 'MB',
        desc: '支持20MB以内的png、gif、jpg图片',
        type: ['jpg', 'gif', 'png'],
        width: 600,
        height: 300
      },
      previewData: {
        'content': '',
        'contentId': '',
        'cover': '',
        'weiboId': '',
        'profileImageUrl': '',
        'pushDate': '',
        'screenName': '',
        'summary': '',
        'text': '',
        'title': ''
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    handleCancel () {
      // 取消编辑
      if (this.preview) {
        this.preview = false
      } else {
        this.removeTab(this.$route.fullPath)
      // this.$routerLink('/content/detail', 'view')
      }
    },
    previewContent () {
      // 预览
      this.preview = true
    },
    getPreview (data) {
      var params = { 'weiboId': data.id, 'contentId': data.ids }
      this.$request.fetchWeiboarticlepushPreview(params).then(res => {
        if (res.code === 200) {
          this.previewData = res.data
          this.form = Object.assign({}, res.data)
        }
      })
    },
    submitPush () {
      // 提交表单并推送
      this.$refs.form.validate(valid => {
        if (valid) {
          /* hyt-link s */
          let params = deepClone(this.form)
          params.content = this.$encode(params.content)
          /* hyt-link e */
          this.$request.weiboarticlepushUpdatePush(params).then(res => {
            this.$restBack(res, () => {
              this.removeTab(this.$route.fullPath)
              this.$routerLink('/content/index', 'list')
            }, '推送成功')
          })
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getPreview(this.$route.query)
    })
  }
}
</script>

<style lang="scss">
.content-sina-container{
  background-color: #ffffff;
  .el-main{
    overflow-x: hidden;
  }
  .content-box{
      min-width: 900px;
      max-width: 1200px;
      height: 32px;
      display: flex;
      &__title{
        flex: 1;
        line-height: 32px;
      }
      &__btns{
        margin-right: 10px;
      }
      &__info{
        font-size: 14px;
        color: #666666;
        line-height: 32px;
        margin-right: 20px;
      }
    }
  .content-wrap{
    background-color: #ffffff;
    height: 100%;
    position: relative;
    header{
      background: #F1F0F0;
      height: 58px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1999;
      position: relative;
      .header-button{
        color: #666666;
        .jee-svg-icon{
          fill: #777777;
          padding-right: 7px;
        }
      }
      .el-button .jee-svg-icon{
        padding-right: 10px;
      }
      .header-button + .header-button,
      .header-button + .el-button{
        margin-left: 40px;
      }
    }
    &__mask{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1998;
      background-color: rgba($color: #333333, $alpha: 0.8)
    }
    &__preview{
      background-color: #fff;
      width: 990px;
      margin: 180px auto 0;
      box-sizing: border-box;
      padding: 4px;
      height: 700px;
      overflow-y: overlay;
      position: relative;
    }
    .weibo-preview{
      max-width: 100%;
      padding-bottom: 100px;
      &__img{
        width: 100%;
        height:auto;
      }
      &__cont{
        width: 700px;
        margin: 0 auto;
        padding-top: 65px;
      }
      &__title{
        font-size: 30px;
        color: #333333;
        line-height: 40px;
      }
      &__info{
        margin: 10px 0 40px;
        line-height: 30px;
        display: flex;
        color: #666666;
        .t-img{
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
        }
        .name{
          color: #333333;
        }
      }
      &__summary{
        background-color: #F2F2F5;
        color: #666666;
        line-height: 1;
        height: 68px;
        box-sizing: border-box;
        padding: 25px 30px 0;
        font-size: 14px;
        margin-bottom: 25px;
      }
    }
  }
  .content-form-item-wrap{
    overflow: overlay;
      padding-top: 20px;
      display: flex;
      justify-content: center;
      .title-content-wrap{
        min-width: 988px;
        .title-wrap{
          margin-left: 10px;
          border: 1px solid #e8e8e8;
          padding:  0 15px;
         .el-input{
           padding: 8px 0;
           font-size: 14px;
           box-sizing: border-box;
           .el-input__inner{
             border: none;
             padding: 0;
             font-weight: 400;
             border-radius: 0;
           }
         }
         .t-bottom{
           font-size: 18px;
         }
         .title-label{
            position: absolute;
            left: -28px;
            top: 8px;
          }
        }
      }
    }
}
</style>
