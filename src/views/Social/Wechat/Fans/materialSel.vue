<template>
  <div class="material-sel-index">
    <div class="material-show" v-if="showComment">
      <div class="material-elect__content" v-if="contentType!==0">
        <span v-if="contentType === 1">{{comment.content}}</span>
        <div  class="we-card__list"  v-else-if="contentType === 2">
          <div class="we-card__warpper">
              <template v-for="(item,index) in comment.requestArray">
                <div class="we-card__item we-card__item--thumb" v-if="index==0" :key="index">
                  <div  class="we-card__link">
                    <img class="we-card__img" :src="$weChatUrl(item.thumbMediaUrl)" alt="">
                    <span class="we-card__title--thumb" v-if="item.title!=''">
                      {{item.title}}
                    </span>
                  </div>
                  <div class="we-card-mask__preview">
                    <a :href="item.url" target="_blank">预览文章</a>
                  </div>
                </div>
                <div class="we-card__item  we-card__item--sub" v-else :key="index">
                  <div  class="we-card__link">
                    <div class="we-card__sub--inner">
                      <div class="we-card__sub--img">
                        <img :src="$weChatUrl(item.thumbMediaUrl)" alt="">
                      </div>
                      <div class="we-card__sub--title">
                        {{item.title}}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="we-card__footer">
                <span class="fl">
                  更新时间 {{$getDateDiff(comment.wechatUpdateTime*1000)}}
                </span>
                <span class="fr">
                  <jee-icon iconClass="shanchu"
                    :style="{fill:'#666'}"
                    @click="deleteData(comment)"></jee-icon>
                </span>
              </div>
            </div>
        </div>
        <div v-else-if="contentType === 3">
          <div class="material-elect__img material-elect__image">
            <el-image
              class="t-img t-radius"
              :src="comment.url?$weChatUrl(comment.url):$weChatUrl(comment.wechatMaterial.request.url)"
              fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
            <div class="replace-material" @click="replaceMaterial">
              <el-link class="replace-material__link" :underline="false" >
                <jee-icon iconClass="tihuantupian"
                  :style="{fill:'#fff',fontSize:'12px'}"></jee-icon> 替换素材
              </el-link>
            </div>
          </div>
          <div class="material-elect__name"
              :title="comment.name?comment.naem:comment.wechatMaterial.request.name"
          >{{comment.name?comment.name:comment.wechatMaterial.request.name}}
          </div>
        </div>
        <div v-else-if="contentType === 4||contentType === 5" >
          <div class="material-elect__img material-elect__video">
            <jee-icon
              :iconClass="contentType === 4?icon.icon:icon2.icon"
              :style="contentType === 4?icon.style:icon2.style"></jee-icon>
            <div class="replace-material" @click="replaceMaterial">
              <el-link class="replace-material__link" :underline="false" >
                <jee-icon iconClass="tihuantupian"
                  :style="{fill:'#fff',fontSize:'12px'}"></jee-icon> 替换素材
              </el-link>
            </div>
          </div>
          <div class="material-elect__name"
            :title="comment.name||comment.wechatMaterial.request.name"
            >{{comment.name||comment.wechatMaterial.name}}</div>
        </div>
      </div>
    </div>
    <div class="material-box" v-else>
      <div class="material-box__btns" v-show="mesType !== 'text'">
        <div class="material-box__btn jee-hover-color"
          v-for="(btn,index) in btns[mesType]"
          @click="handleComment(btn)"
          :key="index">
          <jee-icon
            :iconClass="btn.icon"
            :style="btn.style"></jee-icon>
          <p>{{btn.name}}</p>
        </div>
      </div>
      <div class="material-box__area" v-show="mesType === 'text'">
        <!-- <el-input
          type="textarea"
          v-model="form.content"
          @change="changeArea"
          :maxlength="150"
          :autosize="{ minRows: 8 }"
          placeholder="在此输入您的文字"></el-input> -->
        <jee-emoji class="cont-input" v-model="form.content" placeholder="在此输入您的文字" height="230px" :maxlength="150" @change="changeArea"/>
      </div>
    </div>
    <material-dialog ref="materialDialog" :appId="appId"
      @handleConfirm="handleConfirm" :data="comment"></material-dialog>
  </div>
</template>

<script>
import materialDialog from '@/components/materialDialog/Index'
export default {
  name: 'material-sel',
  components: {
    materialDialog
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    appId: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    type (newVal) {
      this.mesType = this.type
      this.showComment = false
      // console.log(this.typeFilter(this.comment.msgType))
      // console.log(this.contentType)
      // if (this.typeFilter(this.comment.msgType) === this.contentType) {
      //   this.showComment = true
      // } else {
      //   this.showComment = false
      // }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.mesType = this.type
      this.showComment = false
    })
  },
  data () {
    return {
      mesType: '',
      showComment: false,
      btns: {
        'mpnews': [
          {
            'icon': 'tuwen',
            'name': '从素材库选择图文',
            'type': 'ImageText',
            'style': {
              'fill': '#787878',
              'fontSize': '30px'
            }
          },
          {
            'icon': 'jia',
            'name': '新建图文',
            'type': 'addImgText',
            'style': {
              'fill': '#787878',
              'fontSize': '30px'
            }
          }
        ],
        'image': [
          {
            'icon': 'tupian',
            'name': '从素材库选择图片',
            'type': 'Image',
            'style': {
              'fill': '#787878',
              'fontSize': '30px'
            }
          }
        ],
        'voice': [
          {
            'icon': 'yuyin',
            'name': '从素材库选择语音',
            'type': 'Voice',
            'style': {
              'fill': '#787878',
              'fontSize': '30px'
            }
          }
        ],
        'video': [
          {
            'icon': 'shipin1',
            'name': '从素材库选择视频',
            'type': 'Video',
            'style': {
              'fill': '#787878',
              'fontSize': '30px'
            }
          }
        ]
      },
      form: {
        content: '',
        mediaId: ''
      },
      contentType: 0,
      comment: {},
      icon: {
        icon: 'geshi_tongyongyinpin',
        style: {
          fill: '#DB3E1F',
          fontSize: '100px'
        }
      },
      icon2: {
        icon: 'geshi_tongyongshipin',
        style: {
          fill: '#2987EB',
          fontSize: '100px'
        }
      }
    }
  },
  methods: {
    // 删除
    deleteData (data) {
      this.$confirm('是否确认删除素材?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.comment = {}
        this.contentType = 0
        this.form = {
          content: '',
          mediaId: ''
        }
        this.showComment = false
        this.$emit('materialSel', this.form)
      }).catch(() => {})
    },
    // 选择素材
    handleComment (data) {
      if (data.type === 'addImgText') {
        this.$routerLink('/social/wechat/imageText/add', 'material', { backUrl: '/social/wechat/fans/send', type: 'add' })
      } else {
        this.$refs.materialDialog.showTheDialog(data.type, data)
      }
    },
    replaceMaterial () {
      let btn = this.btns[this.mesType][0]
      this.handleComment(btn)
    },
    changeArea (val) {
      this.form.mediaId = ''
      this.form.content = val
      this.showComment = false
      this.$emit('materialSel', this.form)
    },
    // 确认选择
    handleConfirm (data, type) {
      this.comment = data
      this.contentType = type
      this.form.mediaId = data.mediaId
      this.form.content = ''
      this.showComment = true
      this.$emit('materialSel', this.form)
    },
    // 类型
    typeFilter (type) {
      var obj = {
        'text': 1,
        'news': 2,
        'image': 3,
        'voice': 4,
        'video': 5
      }
      return obj[type]
    }
  }
}
</script>
<style lang="scss" scoped>
  .material-sel-index{
    .material-box{
      min-height: 280px;
      &__btns{
        padding-top: 100px;
        text-align: center;
        display: flex;
        max-width: 462px;
        margin: 8px auto;
      }
      &__btn{
        margin: 0 auto;
        display: inline-block;
        min-width: 130px;
        color: #666666;
        cursor: pointer;
      }
      &__area{
        padding: 20px;
        .el-textarea{
          max-width: 100%;
          &__inner{
            width: 100%;
          }
        }
      }
    }
    .material-show{
      padding: 20px;
    }
    .material-elect__img{
      position: relative;
    }
    .material-elect__image{
      margin-bottom: 20px;
    }
    .material-elect__content {
      padding: 0;
      overflow-y: hidden;
      .we-card__list{
        column-width: auto;
        column-count: auto;
      }
    }
    .replace-material{
      background-color: #000000;
      opacity: 0.7;
      width:92px;
      height:26px;
      font-size: 12px;
      padding: 7px 10px;
      box-sizing: border-box;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      &__link{
        color: #fff !important;
        font-size: 12px;
        line-height: 1;
        vertical-align: top;
      }
    }
  }
</style>
