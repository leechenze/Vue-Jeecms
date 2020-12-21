<template>
  <section class="login-container">
    <div class='login-wrap'>
      <div class="img-wrap">
        <img :src="$getPath(loginImg)" fit="contain"/>
      </div>
      <div class="form-wrap">
        <el-form
          ref="form"
          :model="form"
          :rules='rules'
        >
        <el-form-item v-if="reinsuranceShow.hasShow&&reinsuranceShow.name">
          <h1 style="font-size:24px;color:#333;line-height:1;">{{reinsuranceShow.name}}级系统</h1>
        </el-form-item>
          <el-form-item prop='identity'>
            <el-input v-model="form.identity" :autofocus="true" @input="handUserNameData" placeholder="请输入您的用户名" @change="onChangeUsernameData" @focus="onFocusUsername" @blur="onBlurUsername" @keyup.enter.native="handleConfirm" :class="{'is-focus': focus === 'username'}">
              <jee-icon iconClass='denglutouxiang' slot="prefix"/>
            </el-input>
          </el-form-item>
          <el-form-item prop='desStr'>
            <el-input v-model="form.desStr" :show-password="showPassword" placeholder="请输入您的密码" @focus="onFocusPassword" @blur="onBlurPassword" @keyup.enter.native="handleConfirm" :class="{'is-focus': focus === 'password'}">
              <jee-icon iconClass='denglumima' slot="prefix"/>
              <!-- <jee-icon :iconClass="showPassword?'htmal5icon08':'htmal5icon09'" slot="suffix" @click="showPassword = !showPassword"/> -->
            </el-input>
          </el-form-item>
          <el-form-item prop='captcha' v-if="nextNeedCaptcha">
            <el-input v-model="form.captcha" placeholder="请输入验证码"  @focus="onFocusCaptcha" @blur="onBlurCaptcha" @keyup.enter.native="handleConfirm" :class="{'is-focus': focus === 'captcha'}">
              <jee-icon iconClass='yanzhengma' slot="prefix"/>
              <img :src="captchaSrc" alt="" slot="suffix" @click="fetchCaptcha">
            </el-input>
          </el-form-item>
          <!-- 开启双因子- 短信验证码输入框 start -->
          <el-form-item prop='captcode' v-if="codeSHowHide">
            <el-input :autofocus="true" placeholder="请输入短信验证码"  v-model="form.codeMessage"  maxlength="8" @change="bandCodeDataValue" @keyup.enter.native="handleConfirm" :class="{'is-focus': focus === 'captcode'}">
              <jee-icon iconClass='shouji' slot="prefix"/>
              <!-- <div :class="codeType?'code-butHide':'code-butShow'" slot="suffix"  @click="bandCodeData">{{codeType?codeNum+'s后重发':'发送验证码'}}</div> -->
            <div class="code-butShow" v-if="!codeType" slot="suffix"  @click="bandCodeData">发送验证码</div>
            <div class="code-butHide" v-else slot="suffix"  >{{codeNum+'s'}}</div>
            </el-input>
          </el-form-item>
          <!-- 开启双因子- 短信验证码输入框 end -->
          <el-form-item>
            <div class='submit' @click="handleConfirm">
              <span class='loading' v-if='loading'>
                <jee-icon iconClass='jiazaizhong'/>
              </span>
              <span v-if='loading' class='logining'>登录中...</span>
              <span v-else>登录</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <password-dialog
      ref="passwordDialog"
      @handleSubmit="handleSubmit"
    ></password-dialog>
  </section>
</template>
<script>
import PasswordDialog from '@/components/dialog/PasswordDialog'
import { loginType, desDecrypt } from '@/utils'

import {
  mapActions, mapGetters
} from 'vuex'

export default {
  name: 'login',
  components: {
    PasswordDialog
  },
  data () {
    return {
      codeNum: 60, // 开启双因子-保存倒计时
      codeType: false, // 开启双因子- 判断验证码和倒计时
      codeSHowHide: false, // 开启双因子- 判断是否绑定手机
      loginImg: '',
      loading: false,
      showPassword: true,
      nextNeedCaptcha: false,
      captchaSrc: '',
      focus: '',
      form: {
        identity: '',
        desStr: '',
        captcha: '',
        sessionId: '',
        codeMessage: ''
      },
      rules: {
        identity: [
          this.$rules.required()
        ],
        desStr: [
          this.$rules.required()
        ],
        captcha: [
          this.$rules.required()
        ]
      }
    }
  },
  computed: {
    ...mapGetters('system', ['reinsuranceShow'])
  },
  methods: {
    loginType,
    desDecrypt,
    ...mapActions('app', ['fetchLogin']),
    /* system-hierarchical start */
    ...mapActions('system', ['ReinsuranceShow']),
    /* system-hierarchical end */

    onFocusUsername () {
      this.focus = 'username'
    },
    onBlurUsername () {
      this.focus = ''
    },
    onFocusPassword () {
      this.focus = 'password'
    },
    onBlurPassword () {
      this.focus = ''
    },
    onFocusCaptcha () {
      this.focus = 'captcha'
    },
    onBlurCaptcha () {
      this.focus = ''
    },
    fetchCaptcha () {
      this.$request.fetchCode().then(res => {
        if (res.code === 200) {
          this.captchaSrc = 'data:image/jpeg;base64,' + res.data.img
          this.form.sessionId = res.data.sessionId
        }
      })
    },
    handleConfirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = Object.assign({}, this.form)
          this.handleFetchLogin(data)
        }
      })
    },
    // 判断单点登录
    handleSsoLogin () {
      this.$request.fetchSingleLogin().then(res => {
        if (res.code === 200 && res.data.open) {
          const { loginUrl, appId, appSecret } = res.data
          if (loginUrl) {
            window.location.href = `${loginUrl}?id=${escape(appId)}&sec=${escape(appSecret)}&type=1&&origin=${escape(window.location.origin + window.location.pathname + '#/callback')}`
          }
        }
      })
    },
    // 本地登录
    handleFetchLogin (data) {
      this.loading = true
      console.log(data)
      if (this.codeSHowHide === true) {
        if (!data.codeMessage) {
          this.$message.error('验证码不能为空')
          this.loading = false
          return
        }
      }
      this.fetchLogin(data).then(res => {
        this.loading = false
        if (res.data.nextNeedCaptcha) {
          this.nextNeedCaptcha = true
          this.fetchCaptcha()
        }
        // if (res.data.needChangePassword) {
        //   this.$refs.passwordDialog.showDialog()
        // }
        if (res.code === 200) {
          this.onNavgate()
        } else if (res.code === 504) {
          // 验证码错误
          this.fetchCaptcha()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmit () {
      this.onNavgate()
    },
    onNavgate () {
      let { redirect } = this.$route.query
      if (redirect && localStorage.getItem('pageList')) {
        // console.log('重定向到：', redirect)
        this.$router.replace(unescape(redirect))
      } else {
        // console.log('重定向到工作台')
        this.$router.replace('/workplace').catch(()=>{});//把error 抛出来
      }
    },
    // 获取登录封面图片
    LoginImgFun () {
      this.$request.fetchRegisterGetImage().then(res => {
        if (res.code === 200) {
          this.loginImg = res.data
        }
      })
    },
    /* system-double start */
    /**
     * 双因子start *******************************************
     */
    handUserNameData (data) {
      if (!data) {
        this.form.codeMessage = ''
        this.codeSHowHide = false
      }
    },
    // 开启双因子-判断是否有用户名
    onChangeUsernameData (data) {
      let username = data
      this.form.codeMessage = ''
      if (username) {
        this.fetchDoubleElementHasBind(username)
      }
    },
    // 开启双因子- 获取短信验证码的值
    bandCodeDataValue (data) {
      this.form.codeMessage = data
    },
    // 开启双因子- 获取是否绑定手机
    fetchDoubleElementHasBind (name) {
      this.$request.fetchDoubleElementStatus({ username: name }).then(res => {
        if (res.data === true) {
          this.codeSHowHide = true
        } else {
          this.codeSHowHide = false
        }
      })
    },
    // 开启双因子- 获取短信验证码
    bandCodeData () {
      this.$request.fetchLoginSendLogin({ username: this.form.identity }).then(res => {
        if (res.code === 200) {
          this.codeType = true
          let timeNum = setInterval(() => {
            this.codeNum--
            if (this.codeNum === 0) {
              clearInterval(timeNum)
              this.codeType = false
              this.codeNum = 60
            }
          }, 1000)
        }
      })
    }
    /**
     * 双因子 end *******************************************
     */
    /* system-double end */
  },
  mounted () {
    /* system-hierarchical start */
    this.ReinsuranceShow()
    /* system-hierarchical end */
    this.LoginImgFun()
    this.handleSsoLogin()
  }
}
</script>
<style lang="scss">
.login-container{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:#F2F6F7;
  .login-wrap{
    width: 973px;
    background-color: #ffffff;
    box-shadow:0px 5px 50px 0px rgba(51,51,51,0.1);
    border-radius:8px;
    display: flex;
    .img-wrap{
      width: 373px;
      height: 540px;
      margin: 15px 0 15px 15px;
      border-radius: 8px 0 0 8px;
      box-shadow:0px 5px 50px 0px rgba(51,51,51,0.1);
      img{
        width: 373px;
        height: 540px;
        display: block;
      }
    }
    .form-wrap{
      padding: 0 80px;
      flex: 1;
      .el-form{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .el-form-item{
          width: 100%;
          margin-bottom: 50px;
          &:last-of-type{
            margin-top: 25px;
            margin-bottom: 0;
          }
          .el-input{
            .el-input__inner{
              border-width: 0 0 1px 0!important;
              border-radius: 0!important;
              padding: 0 25px!important;
              font-size: 16px;
              &:focus{
                border-color: #4E646E!important;
              }
            }
            .el-input__prefix{
              left: 0;
            }
            .el-input__suffix{
              right: 0;
              cursor: pointer;
              .el-input__clear{
                display: none;
              }
            }
            .jee-svg-icon{
              fill: #AFAFAF;
            }
            &.is-focus,
            .el-input__suffix:hover{
              .jee-svg-icon{
                fill: #4E646E;
              }
            }
          }
          .el-form-item__error{
            left: 25px;
          }
          .submit{
            text-align: center;
            height: 45px;
            line-height: 45px;
            font-size: 18px;
            background-color: #4E646E;
            box-shadow:0px 3px 7px 0px rgba(85,110,121,0.25);
            border-radius:4px;
            cursor: pointer;
            color: #ffffff;
            &:hover{
              background-color: #59737E;
            }
            .logining{
              padding-left: 10px;
            }
            @keyframes rotate {
              from {
                transform: rotate(0);
              }
              to {
                transform: rotate(360deg);
              }
            }
            .loading{
              display: inline-block;
              animation: rotate 1s linear infinite;
              .jee-svg-icon{
                font-size: 20px;
                fill: #ffffff;
              }
            }
          }
          &.is-error .el-input__inner {
            border-color: #e8e8e8;
          }
        }

        .code-butShow{
          color: #4E646E;
        }
        .code-butHide{
          color: #999999;
        }
      }
    }
  }
}
</style>
