
<script>
import Voices from './Voices'
export default {
  extends: Voices,
  name: 'videos',
  data () {
    return {
      icon: {
        icon: 'geshi_tongyongshipin',
        style: {
          fill: '#2987EB',
          fontSize: '48px'
        }
      },
      edit: {
        title: '视频选择'
      }
    }
  },
  methods: {
    getDataList (page, size) {
      console.log('//视频')
      let params = {
        'appId': this.appId,
        'type': 'video',
        'title': '',
        'page': page || 1,
        'size': size || 10
      }
      this.$request.fetchWechatMaterialPage(params).then(res => {
        if (res.code === 200) {
          this.groups = res.data.content.map(v => {
            return {
              id: v.id,
              mediaId: v.mediaId,
              msgType: v.mediaType,
              wechatUpdateTimes: v.wechatUpdateTimes,
              ...v.request
            }
          })
          this.totalCount = res.data.totalElements
        }
      })
    }
  }
}
</script>
