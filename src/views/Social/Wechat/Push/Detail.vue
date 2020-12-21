<template>
  <section class="wechat-push-detail">
    <base-header
      v-bind="headers"
      />
    <p class="t-14" style="margin-bottom:30px;">推送时间: {{$moment(formData.dateString,'YYYY-MM-DD HH:mm:ss',true)}}</p>
    <div class="t-14" style="margin-bottom:30px;">
      <span>推送对象: {{formData.pushName}}</span> &nbsp;&nbsp;&nbsp;
      <!-- <span>性别: {{formData.pushName}}</span> &nbsp;&nbsp;&nbsp;
      <span>地区: {{formData.pushName}}</span> &nbsp;&nbsp;&nbsp; -->
    </div>
    <div class="wechat-imgtxt__box">
      <div class="wechat-imgtxt__left">
        <label class="content-wrap__label">图文列表</label>
        <image-text-list
          :edit="false"
          :list="getData"
          @listChange="listChange"
          ref="imgTextList"
          :index="activeIndex"></image-text-list>
      </div>
      <div class="wechat-imgtxt__right">
        <image-text-info
          ref="imgTextInfo"
          :uploadBtn="false"
          :edit="false"
          :article="getData[activeIndex]"
          :index="activeIndex"></image-text-info>
      </div>
    </div>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import ImageTextList from '../components/ImageTextList'
import ImageTextInfo from '../components/ImageTextInfo'
export default {
  name: 'socialWechatPushDetail',
  mixins: [baseHeader],
  components: {
    ImageTextList,
    ImageTextInfo
  },
  mounted () {
    this.getFromData()
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      activeIndex: 0,
      formData: {},
      getData: [
        {
          'author': '',
          'content': '',
          'picId': '',
          'sourceUrl': '',
          'title': '',
          'cover': ''
        }
      ] // 获取的文章数据
    }
  },
  methods: {
    getFromData () {
      this.$request.fetchWechatsendGet({ id: this.$route.query.id }).then(res => {
        if (res.code === 200) {
          this.getData = res.data.arrays.map(t => {
            return {
              'author': t.author || '',
              'content': t.content,
              'picId': t.thumbMediaId,
              'sourceUrl': t.contentSourceUrl,
              'title': t.title,
              'cover': t.thumbMediaUrl,
              url: t.url
            }
          })
          this.formData = res.data
        }
      })
    },
    listChange (arr, i) {
      this.getData = Object.assign(this.getData, arr)
      this.activeIndex = i
    }
  }

}
</script>

<style lang="scss" scoped>
.wechat-push-detail{
    .content-wrap__label{
      font-size: 16px;
      margin-bottom: 20px;
      color: #333333;
      line-height: 1;
    }
}
</style>
