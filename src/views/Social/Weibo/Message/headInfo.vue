<template>
  <el-popover
      placement="bottom-start"
      width="400"
      trigger="hover">
      <div class="weibo-info">
        <div class="weibo-info__img">
          <el-image
            class="t-img t-radius "
            :src="infoData.profileImageUrl"
            fit="contain">
              <div slot="error">
                <i class="el-icon-picture-outline"></i>
              </div>
          </el-image>
        </div>
        <p class="weibo-info__name">{{infoData.screenName}} &nbsp;
          <jee-icon :iconClass="infoData.gender==='m'?'nanren':'nvren'"
            :style="{fill:infoData.gender==='m'?'#1488F5':'#EA7F51'}"></jee-icon>
        </p>
        <p class="t-12 t-label">{{infoData.location}}</p>
        <p class=" t-label weibo-info__info">
          <span>关注 &nbsp;&nbsp;&nbsp;{{infoData.friendsCount}}</span> &nbsp;&nbsp;&nbsp;|
          <span>粉丝 &nbsp;&nbsp;&nbsp;{{infoData.followersCount}}</span> &nbsp;&nbsp;&nbsp;|
          <span>微博 &nbsp;&nbsp;&nbsp;{{infoData.statusesCount}}</span>
        </p>
      </div>
      <el-image
        slot="reference"
        class="t-img"
        :src="infoData.profileImageUrl"
        fit="contain">
          <div slot="error">
            <i class="el-icon-picture-outline"></i>
          </div>
      </el-image>
    </el-popover>
</template>
<script>
export default {
  name: 'head-info',
  props: {
    infoData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style lang="scss">
  .weibo-info{
    width: 400px;
    text-align: center;
    &__img{
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin: 20px auto;
    }
    &__name{
      font-size: 16px;
      color: #333333;
      margin-bottom: 10px;
    }
    &__info{
      font-size: 15px;
      margin: 16px 0;
    }
  }
</style>
