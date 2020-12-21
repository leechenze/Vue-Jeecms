<template>
<!-- 链接地址详情列表-->
  <section class="interact-vote-link-ques">
    <base-form
      v-bind="form"
      v-on:handleConfirmCopyCode="handleConfirmCopyCode(form)"
    >
      <!-- 二维码 -->
      <template #qrCode="scope">
        <div class="code">
          <img :src='form.form.qrCodeUrl' alt="">
        </div>
        <el-popover popper-class="interact-vote-link-ques_popover"
          placement="right-end"
          trigger="hover"
          :visible-arrow= 'false'
        >
          <div class="textBox">
            <div class="triangle"></div>
            <div class="triangle1"></div>
            <p class="content jee-hover-color" @click="bigImg">大图（1080PX * 1080PX）</p>
            <p class="content jee-hover-color" @click="middleImg">中图（720PX * 720PX）</p>
            <p class="content jee-hover-color" @click="smallImg">小图（360PX * 360PX）</p>
          </div>
          <el-button type="primary" slot="reference" class="btn jee-bg-light">下载二维码</el-button>
        </el-popover>
      </template>
      <!-- 问卷链接 -->
      <template #questLink="scope">
        <div class="questLink">
          <el-input :value="form.form.url" :readonly='true'></el-input>
          <div class="rightBtn">
            <div class="copyLink jee-bg-light" @click="copyLink(form.form.url)">
              <span>复制链接</span>
            </div>
            <div class="openLink jee-bg-light" @click="openLink">
              <span>打开链接</span>
            </div>
          </div>
        </div>
      </template>
      <!-- 分享 -->
      <template #shareTo="scope">
        <div class="shareTo">
          <el-popover popper-class="weChat_popover"
            placement="bottom-start"
            trigger="hover"
            :visible-arrow= 'false'
            v-model="visible"
          >
            <div class="weChat-box">
              <div class="top">
                <p>分享到微信</p>
                <jee-icon iconClass="tangchuangguanbi" class="close-icon" @click="visible = false"/>
              </div>
              <div class="qrCode-img">
                <img :src='form.form.qrCodeUrl' alt="">
              </div>
              <div class="bottom">
                <p>
                  打开微信，使用“扫一扫”即可将网页 分享至微信好友或朋友圈。
                </p>
              </div>
            </div>
            <div class="weChat" slot="reference" >
              <jee-icon iconClass="weixin2" class="weChat-icon"/>
            </div>
          </el-popover>
          <div class="qq">
            <jee-icon iconClass="QQ2" class="qq-icon" @click="qqShare()"/>
          </div>
          <div class="sina">
            <jee-icon iconClass="weibo2" class="sina-icon" @click="sinaShare()"/>
          </div>
        </div>
      </template>
    </base-form>
  </section>
</template>
<script>
import baseForm from '@/components/mixins/baseForm'
import Clipboard from 'clipboard'
export default {
  name: 'linkAddress',
  mixins: [baseForm],
  data () {
    return {
      id: null,
      visible: false, // 弹出框是否显示
      form: {
        form: {
          insortWeb: '0',
          embedded: 'script',
          iframe: 'iframe'
        },
        formItems: [
          {
            prop: 'qrCode',
            type: 'slot',
            label: '二维码：'
          },
          {
            prop: 'questLink',
            type: 'slot',
            label: '问卷链接：'
          },
          {
            prop: 'shareTo',
            type: 'slot',
            label: '分享到：'
          },
          {
            prop: 'insortWeb',
            type: 'radio',
            label: '嵌入网站：',
            options: [
              {
                value: '0',
                label: 'Script 代码'
              },
              {
                value: '1',
                label: 'iframe 代码'
              }
            ]
          },
          {
            prop: 'embedded',
            type: 'textarea',
            readonly: true,
            hiddenKey: 'insortWeb',
            hiddenValue: '0',
            autosize: { minRows: 18, maxRows: 18 },
            class: 'textStyle'
          },
          {
            prop: 'iframe',
            type: 'textarea',
            readonly: true,
            hiddenKey: 'insortWeb',
            hiddenValue: '1',
            autosize: { minRows: 18, maxRows: 18 },
            class: 'textStyle'
          }
        ],
        submitBtns: [{
          text: '复制代码',
          subType: 'CopyCode',
          class: 'copyCode'
        }]
      }
    }
  },
  methods: {
    // 链接地址
    getLinkDetail () {
      this.id = this.$route.query.id
      this.$request.fetchQuestionnaireLink({
        'id': this.$route.query.id
      }).then(res => {
        if (res.code === 200) {
          this.form.form = Object.assign(this.form.form, res.data)
          console.log(this.form.form)
        }
      })
    },
    // 下载二维码
    getQrcode (size) {
      var formdata = new FormData()
      formdata.append('size', size)
      formdata.append('id', this.id)
      this.$request.fetchQuestionnaireQrcode(formdata).then(res => {
        this.$exportClick(res, size + 'PX*' + size + 'PX.jpeg')
      })
    },
    bigImg () {
      this.getQrcode(1080)
    },
    middleImg () {
      this.getQrcode(720)
    },
    smallImg () {
      this.getQrcode(360)
    },
    // 复制代码
    handleConfirmCopyCode (e) {
      var clipboard = new Clipboard('.copyCode', {
        text: function () {
          if (e.form.insortWeb === '0') {
            return e.form.embedded
          } else if (e.form.insortWeb === '1') {
            return e.form.iframe
          }
        }
      })
      clipboard.on('success', e => {
        clipboard.destroy()
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      })
      clipboard.on('error', e => {
        // 不支持复制
        console.log('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    // 复制链接
    copyLink (e) {
      var clipboard = new Clipboard('.copyLink', {
        text: function () {
          return e
        }
      })
      clipboard.on('success', e => {
        clipboard.destroy()
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      })
      clipboard.on('error', e => {
        // 不支持复制
        console.log('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    // 打开链接
    openLink () {
      window.open(this.form.form.url)
    },
    // QQ分享
    qqShare () {
      var shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${this.form.form.url}&title=${this.form.form.title}`
      window.open(shareUrl)
    },
    // 微博分享
    sinaShare () {
      var shareUrl = `http://service.weibo.com/share/share.php?url=${this.form.form.url}&title=${this.form.form.title}`
      window.open(shareUrl)
    }
  },
  mounted () {
    this.getLinkDetail()
  },
  activated () {
    if (this.id && this.id !== this.$route.query.id) {
      this.getLinkDetail()
    } else {
      this.getLinkDetail()
    }
  }
}
</script>
<style lang="scss">
.interact-vote-link-ques{
  .el-radio__inner{
    border: 1px solid #CCC!important;
  }
  .code{
    padding: 7px;
    width: 152px;
    height: 152px;
    box-sizing: border-box;
    border:1px solid #E8E8E8;
    border-radius:4px;
    margin-top: 10px;
  }
  .btn{
    width:152px;
    height:40px;
    margin-top: 10px;
    border-radius:4px;
  }
  .questLink{
    display: flex;
    .rightBtn{
      display: flex;
      .copyLink{
        width:96px;
        height:40px;
        color:#fff;
        margin-left: 10px;
        text-align: center;
        border-radius:4px;
        font-size: 14px;
        cursor: pointer;
      }
      .copyLink:hover{
        opacity: 0.9;
      }
      .openLink{
        width:96px;
        height:40px;
        color:#fff;
        margin-left: 10px;
        text-align: center;
        border-radius:4px;
        font-size: 14px;
        cursor: pointer;
      }
      .openLink:hover{
        opacity: 0.8;
      }
    }
  }
  .shareTo{
    display: flex;
    .weChat{
      width: 40px;
      height: 40px;
      border-radius:50%;
      background-color: #F3F3F3;
      margin-right: 22px;
      text-align: center;
      font-size: 24px;
      &:hover{
        background-color: #4BB83F;
        .weChat-icon{
          font-size: 24px;
          fill:#FFFFFF;
        }
      }
      .weChat-icon{
        font-size: 24px;
        fill:#4BB83F;
      }
    }
    .qq{
      width: 40px;
      height: 40px;
      border-radius:50%;
      background-color: #F3F3F3;
      margin-right: 22px;
      text-align: center;
      font-size: 24px;
      &:hover{
        background-color: #36B7F6;
        .qq-icon{
          font-size: 20px;
          fill:#FFFFFF;
        }
      }
      .qq-icon{
        font-size: 20px;
        fill:#36B7F6;
      }
    }
    .sina{
      width: 40px;
      height: 40px;
      border-radius:50%;
      background-color: #F3F3F3;
      text-align: center;
      font-size: 24px;
      &:hover{
        background-color: #FC304B;
        .sina-icon{
          font-size: 24px;
          fill:#FFFFFF;
        }
      }
      .sina-icon{
        font-size: 24px;
        fill:#FC304B;
      }
    }
  }
}
.interact-vote-link-ques_popover{
  margin-top: 20px !important;
  left: 550px!important;
  padding: 6px 20px 20px 20px !important;
  border: 0 !important;
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.2)!important;
   .textBox{
    .triangle{
      position: absolute;
      left: -22px;
      top: 80px;
      width: 0;
      height: 0;
      border: 11px solid;
      border-color: transparent #e8e8e8 transparent transparent ;
    }
    .triangle1{
      position: absolute;
      left: -19px;
      top: 80px;
      width: 0;
      height: 0;
      border: 11px solid;
      border-color: transparent #FFF transparent transparent ;
    }
    .content{
      line-height: 1;
      padding-top: 14px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .popper__arrow{
    top: 85.5px!important;
  }
}
.weChat_popover{
  margin-top: 30px !important;
  width: 306px;
  height: 302px;
  box-sizing: border-box;
  padding: 28px 0  32px 0 !important;
  position: absolute;
  .top{
    font-size: 14px;
    color: #333333;
    font-weight:600;
    text-align: center;
    line-height: 1;
    .close-icon{
      font-size: 14px;
      position: absolute;
      right: 30px;
      top: 30px;
      fill: #999999;
    }
  }
  .qrCode-img{
    width: 152px;
    height: 152px;
    padding: 7px;
    box-sizing: border-box;
    border:1px solid #E8E8E8;
    border-radius:4px;
    margin: 17px 77px 27px 77px;
  }
  .bottom{
    padding:0 51px;
    color: #999999;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
  }
}
.textStyle{
  .el-textarea__inner{
    line-height: 21px !important;
    width: 626px;
  }
}
</style>
