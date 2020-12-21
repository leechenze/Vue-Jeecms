<template>
  <div >
    <div class="we-card__list image-text-box" :class="{'we-card__single':getData.length < 2}">
      <template v-for="(content) in getData">
        <div class="we-card-wrap" :key="content.id">
          <div class="we-card__warpper">
            <div v-for="(item,index) in content.material.objects" :key="index">
              <div class="we-card__item we-card__item--thumb" v-if="index==0" :key="index">
                <a :href="item.url" target="_blank" class="we-card__link">
                  <el-image
                      class="we-card__img"
                      :src="$weChatUrl(item.thumbMediaUrl)"
                      fit="contain">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                  <span class="we-card__title--thumb" v-if="item.title!=''">
                    {{item.title}}
                  </span>
                </a>
                <div class="we-card-mask__preview">
                  <a :href="item.url" target="_blank">预览文章</a>
                </div>
              </div>
              <div class="we-card__item  we-card__item--sub" v-else :key="index">
                <a :href="item.url" target="_blank" class="we-card__link">
                  <div class="we-card__sub--inner">
                    <div class="we-card__sub--img">
                      <!-- $weChatUrl -->
                      <el-image
                        class="we-card__img"
                        :src="$weChatUrl(item.thumbMediaUrl)"
                        fit="contain">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                      </el-image>
                    </div>
                    <div class="we-card__sub--title">
                      {{item.title}}
                    </div>
                  </div>
                </a>
                <div class="we-card-mask__preview">
                  <a :href="item.url" target="_blank">预览文章</a>
                </div>
              </div>
            </div>
            <div style="padding:0 15px"><span>{{content.createUser}}</span></div>
            <div class="we-card__footer">
              <span class="fl">
                更新时间 {{$moment(content.sendDate,'YYYY-MM-DD',true)}}&nbsp;{{content.sendHour+':'+content.sendMinute}}
                <jee-icon v-if="content.status === 1" iconClass="tishixinxi" :style="{fill:'#666666'}"></jee-icon>
                <jee-icon v-else-if="content.status === 2" iconClass="qiyong" :style="{fill:'#02C33D'}"></jee-icon>
                <jee-icon v-else iconClass="cuowu" :style="{fill:'#FF0000'}"></jee-icon>
              </span>
              <span class="fr jee-color" @click="toDetail(content)"><a>查看详情</a></span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="t-label nothing" v-show="data.length === 0">暂无数据</div>
  </div>
</template>
<script>
export default {
  name: 'image-text-box',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    getData () {
      return this.data.filter(d => d.status === 2 && d.material.mediaType === 'news')
    }
  },
  methods: {
    toDetail (data) {
      this.$routerLink('/social/wechat/push/detail', 'view', { id: data.id, appId: data.appId })
    }
  }
}
</script>
