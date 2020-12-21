<template>
  <section class="interact-smart-share-Dialog-wrap">
    <el-dialog :visible.sync="isShowDialog" title="微信分享预览" custom-class="dialog" width="1065px">
      <div class="content">
        <div class="share-friend-circle">
          <p class="title">分享至朋友圈</p>
          <img src="@/assets/img/share-friend-circle.png" alt="">
          <div class="friend-circle-item">
            <div class="headImg">
              <img src="@/assets/img/userImg.png" alt="">
            </div>
            <div class="text">
              <p class="userName">上善若水</p>
              <div class="middle">
                <div class="newsImg" v-if="headImg">
                  <img :src="$getPath(headImg)" alt="" class="headImg">
                </div>
                <div class="news">{{title}}</div>
              </div>
              <div class="bottom">
                <span class="time">2分钟前</span>
                <span class="delet">删除</span>
              </div>
            </div>
          </div>
        </div>
        <div class="share-friend">
          <p class="title">分享至好友</p>
          <img src="@/assets/img/share-friend.png" alt="">
          <p class="userNameRight">上善若水</p>
          <div class="triangle"></div>
          <div class="share-friend-item">
            <div class="textRight">
              <p class="newsTitle">{{title}}</p>
              <div class="newsRight">
                <p class="newsContent">
                  {{shareDesc}}
                </p>
                <div class="newImgRight" v-if="headImg" >
                  <img :src="$getPath(headImg)" alt="" class="headImgRight">
                </div>
              </div>
            </div>
            <div class="friendImg">
              <img src="@/assets/img/userImg.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'share-Dialog',
  props: {
    headImg: {
      type: String,
      default: ''
    },
    shareDesc: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShowDialog: false
    }
  },
  methods: {
    shareDiaglog () {
      this.isShowDialog = !this.isShowDialog
    }
  }
}
</script>

<style lang="scss">
.interact-smart-share-Dialog-wrap{
  .dialog{
    max-height: 100%!important;
    height: 860px;
    .content{
      display: flex;
      justify-content: center;
      margin-bottom:0;
    }
    .share-friend-circle{
      position: relative;
      text-align: center;
      margin-right: 38px;
      .friend-circle-item{
        width: 298px;
        display: flex;
        position: absolute;
        left: 36px;
        top: 172px;
        .headImg{
          width: 34px;
          min-width: 34px;
          height: 34px;
          // background-color: #F00;
        }
        .text{
          margin-left: 10px;
          .userName{
            color: #586C94;
            font-size: 14px;
            line-height: 1;
            padding: 2px 0 6px 2px;
            text-align: left;
          }
          .middle{
            width: 255px;
            height: 42px;
            background-color: #F3F3F5;
            box-sizing: border-box;
            padding: 4px;
            display: flex;
            .newsImg{
              width: 34px;
              min-width: 34px;
              height: 34px;
              // background-color: #263238;
              .headImg{
                width: 34px;
                height: 34px;
              }
            }
            .news{
              font-weight: 600;
              color: #333333;
              height: 30px;
              text-align: left;
              font-size: 12px;
              line-height:14px;
              box-sizing: border-box;
              padding: 4px 12px 4px 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
          .bottom{
            text-align: left;
            font-size: 12px;
            margin-top: 5px;
            .time{
              color: #666666;
              line-height: 1;
            }
            .delet{
              color:#586C94;
              line-height: 1;
              margin-left: 7px;
            }
          }
        }
      }
    }
    .share-friend{
      text-align: center;
      position: relative;
      .userNameRight{
        font-weight: 600;
        color: #333333;
        position: absolute;
        left: 160px;
        top: 135px;
      }
      .triangle{
        position: absolute;
        left: 290px;
        top: 183px;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent transparent #FFF;
      }
      .share-friend-item{
        display: flex;
        position: absolute;
        left: 91px;
        top: 172px;
        .friendImg{
          width: 34px;
          height: 34px;
          // background-color: #F00;
          margin-left: 10px;
        }
        .textRight{
          width: 200px;
          height: 94px;
          padding: 9px 10px 10px 10px;
          box-sizing: border-box;
          background-color: #FFFFFF;
          .newsTitle{
            width: 173px;
            height: 30px;
            color: #333333;
            font-weight: 600;
            letter-spacing: -1px;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 14px;
            line-height: 16px;
            margin-bottom: 5px;
            text-align: left;
          }
          .newsRight{
            display: flex;
            .newsContent{
                width: 120px;
                height: 40px;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                color: #888888;
                font-size: 10px;
                line-height: 14px;
                text-align: left;
              }
            .newImgRight{
                width: 38px;
                height: 38px;
                margin-left: 20px;
                // background-color: #263238;
                .headImgRight{
                  width: 38px;
                  height: 38px;
                }
              }
          }
        }
      }
    }
    .title{
      color:#333333;
      font-size: 14px;
      margin-bottom: 8px;
      font-weight:600;
    }
    .el-dialog__body{
      margin-bottom: 20px !important;
    }
  }
}

</style>
