<template>
  <div class="material-elect-show">
    <span v-if="msgType === 'text'" v-html="$showEmojiName(comment.content)"></span>
    <div  class="we-card__list"  v-else-if="msgType === 'mpnews'">
      <div class="we-card__warpper">
          <template v-for="(item,index) in comment.articles">
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
          <!-- <div class="we-card__footer">
            <span class="fl">
              更新时间 {{$getDateDiff(comment.wechatUpdateTimes*1000)}}
            </span>
            <span class="fr">
              <jee-icon iconClass="delete"
                :style="{fill:'#666'}"
                @click="deleteData(comment)"></jee-icon>
            </span>
          </div> -->
        </div>
    </div>
    <div v-else-if="msgType === 'image'" >
     <div class="material-elect__img">
        <el-image
        class="t-img t-radius"
        :src="$weChatUrl(comment.url)"
        fit="contain">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
      </el-image>
     </div>
      <div class="material-elect__name" style="margin-top:10px;"
          :title="comment.name||''"
          >{{comment.name||''}}</div>
    </div>
    <div v-else-if="msgType === 'voice'||msgType === 'video'" >
      <div class="material-elect__img material-elect__video">
        <jee-icon
          :iconClass="msgType === 'voice'?icon.icon:icon2.icon"
          :style="msgType === 'video'?icon.style:icon2.style"></jee-icon>
      </div>
      <div class="material-elect__name" style="margin-top:10px;"
        :title="comment.name||''"
        >{{comment.name||''}}</div>
    </div>
    <div v-else></div>
  </div>
</template>
<script>
export default {
  name: 'materialShow',
  props: {
    msgType: {
      type: String,
      default: 'text'
    },
    comment: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
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
  }
}
</script>

<style scoped>
.material-elect-show{
  background-color: #fff;
  width: 100%;
}
</style>
