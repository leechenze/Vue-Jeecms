<template>
  <section class="material-elect">
      <div class="material-elect__cont">
        <el-link
          v-for="(item,index) in comments[type-1]"
          :key="index"
          class="material-elect__comment jee-hover-color"
          @click="handleComment(type,item)"
          :underline="false" >
          <jee-icon
            :iconClass="item.icon"
            class="link-icon"></jee-icon>
            <span class="material-elect__text">{{item.name}}</span>
        </el-link>
      </div>
      <div class="t-top material-elect__content" v-if="contentShow&&contentType!==0">
        <span v-if="contentType === 1">{{comment.content}}</span>
        <div  class="we-card__list"  v-else-if="contentType === 2">
          <div class="we-card__warpper">
              <template v-for="(item,index) in getMaterial(comment,'requestArray')">
                <div class="we-card__item we-card__item--thumb" v-if="index==0" :key="index">
                  <div  class="we-card__link">
                    <img class="we-card__img" :src="$weChatUrl(item.thumbMediaUrl)" alt="">
                    <span class="we-card__title--thumb" v-if="item.title!=''">
                      {{item.title}}
                    </span>
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
              <div class="we-card__footer" v-if="comment.wechatUpdateTime">
                <span class="fl">
                  更新时间 {{$getDateDiff(comment.wechatUpdateTime*1000)}}
                </span>
              </div>
            </div>
        </div>
        <div v-else-if="contentType === 3" >
          <div class="material-elect__img" style="margin-bottom:20px">
            <el-image
              class="t-img"
              :src="$weChatUrl(getMaterial(comment,'url'))"
              fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
          </div>
          <div class="material-elect__name"
              :title="getMaterial(comment,'name')"
              >{{getMaterial(comment,'name')}}</div>
        </div>
        <div v-else-if="contentType === 4||contentType === 5" >
          <div class="material-elect__img material-elect__video">
            <jee-icon
              :iconClass="contentType === 4?icon.icon:icon2.icon"
              :style="contentType === 4?icon.style:icon2.style"></jee-icon>
          </div>
          <div class="material-elect__name"
            :title="getMaterial(comment,'name')"
            >{{getMaterial(comment,'name')}}</div>
        </div>
        <div v-else>
          <div v-if="type === 2&&comment.menuKey" class="t-border key-word__item">
            <p class="key-word__span">
              <label class="key-word__label">规则名：</label>
              <span class="key-word__text">{{comment.ruleName}}</span>
            </p>
            <p class="key-word__span">
              <label class="key-word__label">关键词：</label>
              <span class="key-word__text">{{comment.keyWord}}</span>
            </p>
            <p class="key-word__span">
              <label class="key-word__label">回复类型：</label>
              <span class="key-word__text">{{materialFilter(comment.msgType)}}</span>
            </p>
          </div>
        </div>
      </div>
      <material-dialog ref="materialDialog"
        @handleConfirm="handleConfirm" :data="comment" :appId="appId"></material-dialog>
  </section>
</template>
<script>
import materialDialog from '@/components/materialDialog/Index'
export default {
  name: 'materialSelect',
  components: {
    materialDialog
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    contentShow: {
      type: Boolean,
      default: true
    },
    appId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      comments: [
        [
          {
            icon: 'tuwen',
            name: '图文',
            type: 'ImageText'
          },
          {
            icon: 'tupian',
            name: '图片',
            type: 'Image'
          },
          {
            icon: 'yuyin',
            name: '语音',
            type: 'Voice'
          },
          {
            icon: 'shipin1',
            name: '视频',
            type: 'Video'
          }
        ],
        [
          {
            icon: 'guanjianci',
            name: '关键词',
            type: 'KeyWord'
          }
        ],
        [
          {
            icon: 'wenben1',
            name: '文本',
            type: 'Text'
          },
          {
            icon: 'tuwen',
            name: '图文',
            type: 'ImageText'
          },
          {
            icon: 'tupian',
            name: '图片',
            type: 'Image'
          },
          {
            icon: 'yuyin',
            name: '语音',
            type: 'Voice'
          },
          {
            icon: 'shipin1',
            name: '视频',
            type: 'Video'
          }
        ],
        [
          {
            icon: 'wenben1',
            name: '文本',
            type: 'Text'
          },
          {
            icon: 'tupian',
            name: '图片',
            type: 'Image'
          },
          {
            icon: 'yuyin',
            name: '语音',
            type: 'Voice'
          },
          {
            icon: 'shipin1',
            name: '视频',
            type: 'Video'
          }
        ]
      ],
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
      },
      comment: this.data || {},
      contentType: this.data ? (this.typeFilter(this.data.msgType)) : 0
    }
  },
  methods: {
    getMaterial (data, str) {
      if (data.wechatMaterial) {
        if (str === 'requestArray') {
          return data.wechatMaterial.requestArray
        } else {
          return data.wechatMaterial.request[str]
        }
      } else if (data.request) {
        if (str === 'requestArray') {
          return data.requestArray
        } else {
          return data.request[str]
        }
      } else {
        return data[str] || ''
      }
    },
    // 选择素材
    handleComment (type, item) {
      this.confirmData()
      this.$refs.materialDialog.showTheDialog(type, item)
    },
    // 确认选择
    handleConfirm (data, type) {
      if (JSON.stringify(this.comment) !== JSON.stringify(data)) {
        this.comment = Object.assign({}, data)
        this.contentType = type
        this.$emit('handleConfirm', data, type)
      }
    },
    // 类型
    typeFilter (type) {
      if (this.data.menuKey) {
        return 6
      } else {
        var obj = {
          'text': 1,
          'news': 2,
          'image': 3,
          'voice': 4,
          'video': 5
        }
        return obj[type]
      }
    },
    materialFilter (type) {
      let obj = {
        'voice': '语音',
        'news': '图文',
        'image': '图片',
        'video': '视频',
        'music': '音乐',
        'text': '文本'
      }
      return obj[type]
    },
    confirmData () {
      if (this.data && JSON.stringify(this.data) !== JSON.stringify(this.comment)) {
        this.comment = Object.assign({}, this.data)
        let type = this.typeFilter(this.data.msgType)
        this.contentType = type
        if (type === 1) {
          this.$emit('handleConfirm', { content: this.data.content, ...this.data }, type)
        } else {
          let mediaId = ''
          let obj = {}
          // 坑，跳转和关键词丢失问题
          if (this.data.mediaId || this.data.menuKey) {
            obj = this.data
          } else if (this.data.wechatMaterial) {
            mediaId = this.data.wechatMaterial.request.mediaId
            obj = {
              mediaId: mediaId,
              ...this.data
            }
          }
          this.$emit('handleConfirm', obj, type)
        }
      } else if (!this.data) {
        this.contentType = 0
        this.comment = {
          content: '',
          mediaId: ''
        }
        this.$emit('handleConfirm', null, 0)
      }
    }
  },
  watch: {
    data (newVal, oldVal) {
      // 死循环了
      this.confirmData()
    }
  }
}
</script>
<style lang="scss">
  .material-elect{
    .we-card{
      &__list{
        column-count:2 !important;
      }
    }
    &__content{
      .we-card__list{
        box-sizing: border-box;
      }
    }
  }
</style>
