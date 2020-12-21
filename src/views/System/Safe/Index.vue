<template>
  <el-container direction="vertical" v-loading="loading" class="safe-setting-container">
    <base-header v-bind="headers"/>
    <el-form ref="form"
      :model="form.attrs"
      :rules="rules"
      label-width="331px">
      <el-form-item class="sm-height security-open" label="是否开启安全设置：" prop="securityOpen" label-width="auto">
        <el-radio-group v-model="form.attrs.securityOpen">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <transition name="fade">
        <div v-if="form.attrs.securityOpen === '1'">
          <section class="form-block">
            <div class="title">
              <div class="jee-bg-light"></div>
              <h1>密码安全</h1>
            </div>
            <div  class="form-item-wrap">
              <el-form-item label="密码最小位数：" prop="passMin">
                <el-input-number v-model="form.attrs.passMin" :min="1" :max="Number(form.attrs.passMax)"></el-input-number>
                <span class="append-text hidden-md-and-down">输入框中最小值不能小于1</span>
              </el-form-item>
              <el-form-item label="密码最大位数：" prop="passMax">
                <el-input-number v-model="form.attrs.passMax" :min="form.attrs.passMin" :max="30"></el-input-number>
                <span class="append-text hidden-md-and-down">输入框中最大值不能超过30</span>
              </el-form-item>
              <el-form-item label="密码组成规则：" prop="passCompositionRule">
                <el-select
                  popper-class="jee-border"
                  v-model="form.attrs.passCompositionRule" placeholder="请选择">
                  <el-option
                    v-for="item in passCompositionRuleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-popover
                  placement="right"
                  width="300"
                  trigger="hover"
                  content="特殊字符包括：
                  !#%+-=/[]{}">
                  <jee-icon slot="reference" icon-class="wenti" className="tip"/>
                </el-popover>
              </el-form-item>
              <el-form-item class="sm-height" label="是否允许密码与用户名相同：" prop="passIsEqually">
                <el-radio-group v-model="form.attrs.passIsEqually">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="sm-height" label="是否强制要求用户定期修改密码：" prop="passRegularChange">
                <el-radio-group v-model="form.attrs.passRegularChange">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <transition name="fade">
                <div v-if="form.attrs.passRegularChange === '1'">
                  <el-form-item label="强制修改密码周期（天）：" prop="passRegularCycle">
                    <el-input v-model="form.attrs.passRegularCycle" placeholder="请输入天数"></el-input>
                  </el-form-item>
                </div>
              </transition>
              <el-form-item class="sm-height" label="首次登录是否强制要求修改密码：" prop="passFirstNeedUpdate">
                <el-radio-group v-model="form.attrs.passFirstNeedUpdate">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="sm-height" label="重置密码后首次登录是否强制要求修改密码：" prop="passResetNeedUpdate">
                <el-radio-group v-model="form.attrs.passResetNeedUpdate">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </section>
          <section class="form-block">
            <div class="title">
              <div class="jee-bg-light"></div>
              <h1>登录安全</h1>
            </div>
            <div class="form-item-wrap">
              <el-form-item label="登录时密码错误校验周期："
              :rules="checkCycleRules" prop="checkCycle">
                <el-input
                  class="jee-input-append-select"
                  v-model.number="form.attrs.checkCycle" :placeholder="checkCyclePlaceholder">
                  <el-select popper-class="jee-border"
                    slot="append" v-model="form.attrs.checkCycleUnit" placeholder="请选择">
                    <el-option
                      v-for="item in unitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
                <span class="append-text hidden-md-and-down">请输入大于0的整数，留空为不限制</span>
              </el-form-item>

              <el-form-item label="登录时密码最大错误次数（次）：" prop="loginErrorCount">
                <el-input v-model.number="form.attrs.loginErrorCount" placeholder="请输入天数"></el-input>
                <span class="append-text hidden-md-and-down">请输入大于0的整数，留空为不限制</span>
              </el-form-item>
              <el-form-item label="处理方式：" prop="processingMode">
                <el-select
                  popper-class="jee-border"
                  v-model="form.attrs.processingMode" placeholder="请选择">
                  <el-option
                    v-for="item in processingModeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <transition name="fade">
                <div v-if="form.attrs.processingMode === '3'">
                  <el-form-item label="禁止登录时长："
                    :rules="loginLimitRules"
                    prop="loginLimit">
                    <el-input v-model="form.attrs.loginLimit"
                      class="jee-input-append-select"
                      :placeholder="loginLimitPlaceholder">
                      <el-select slot="append"
                       popper-class="jee-border"
                       v-model="form.attrs.loginLimitType" placeholder="请选择">
                        <el-option
                          v-for="item in unitOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                </div>
              </transition>
              <el-form-item class="sm-height" label="登录后长时间未操作自动退出账号：" prop="autoLogout">
                <el-radio-group v-model="form.attrs.autoLogout">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <transition name="fade">
                <div v-if="form.attrs.autoLogout === '1'">
                  <el-form-item label="自动退出周期" prop="autoLogoutMinute">
                    <el-input-number v-model="form.attrs.autoLogoutMinute" :min="1" :max="120"></el-input-number>
                    <span class="append-text hidden-md-and-down">输入框中最大值不能超过120</span>
                  </el-form-item>
                </div>
              </transition>
              <el-form-item class="sm-height" label="是否允许同一账号异地登录：" prop="loginMuti">
                <el-radio-group v-model="form.attrs.loginMuti">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </section>
          <section class="form-block">
            <div class="title">
              <div class="jee-bg-light"></div>
              <h1>账户安全</h1>
            </div>
            <div  class="form-item-wrap">
              <el-form-item class="sm-height" label="长期未登录锁定账号：" prop="accountLockAuto">
                <el-radio-group v-model="form.attrs.accountLockAuto">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <transition name="fade">
                <div v-if="form.attrs.accountLockAuto === '1'">
                  <el-form-item label="锁定周期（天）：" prop="accountLockAutoDay">
                    <el-input v-model.number="form.attrs.accountLockAutoDay" placeholder="请输入天数"></el-input>
                    <span class="append-text hidden-md-and-down">最大可配置天数不超过365天</span>
                  </el-form-item>
                </div>
              </transition>
            </div>
          </section>
        </div>
      </transition>
      <el-form-item>
        <el-button type="primary" @click="onSubmit"
          :disabled="!_checkPermission('/config/global', 'PUT')"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'

import {
  mapActions
} from 'vuex'

export default {
  name: 'safe',
  mixins: [baseHeader],
  data () {
    return {
      headers: {
        title: '操作说明',
        content: '账户安全设置仅适用于后台管理员'
      },
      loading: false,
      unitOptions: [
        {
          label: '天',
          value: '1',
          placeholder: '请输入天数'
        },
        {
          label: '小时',
          value: '2',
          placeholder: '请输入小时'
        },
        {
          label: '分钟',
          value: '3',
          placeholder: '请输入分钟'
        }
      ],
      processingModeOptions: [
        {
          label: '显示验证码',
          value: '1'
        },
        {
          label: '锁定账号(禁用)',
          value: '2'
        },
        {
          label: '一定时间内禁止登录',
          value: '3'
        }
      ],
      passCompositionRuleOptions: [
        {
          label: '无要求',
          value: '1'
        },
        {
          label: '必须包含字母和数字',
          value: '2'
        },
        {
          label: '必须包含大写字母、小写字母、数字',
          value: '3'
        },
        {
          label: '必须包含字母、数字、特殊字符',
          value: '4'
        },
        {
          label: '必须包含大写字母、小写字母、数字、特殊字符',
          value: '5'
        }
      ],
      form: {
        id: '',
        aduitMemberFlowId: '',
        attrs: {
          wechatSmallImgId: '',
          wechatPublicNumberImgId: '',
          sysImgId: '',
          loginSysImgId: '',
          operIdentityImgId: '',
          frontImgId: '1',
          securityOpen: '1',
          passMin: 6,
          passMax: 20,
          passCompositionRule: '1',
          passIsEqually: '0',
          passRegularChange: '1',
          passRegularCycle: '5',
          passFirstNeedUpdate: '1',
          passResetNeedUpdate: '1',
          checkCycle: '',
          checkCycleUnit: '1',
          loginErrorCount: '3',
          autoLogout: '1',
          autoLogoutMinute: 5,
          loginMuti: '1',
          accountLockAuto: '1',
          accountLockAutoDay: '5',
          processingMode: '2',
          loginLimit: '',
          loginLimitType: '1'
        }
      },
      rules: {
        passMin: [
          this.$rules.number(),
          this.$rules.rangeNum(1, 30)
        ],
        passMax: [
          this.$rules.number(),
          this.$rules.rangeNum(1, 30)
        ],
        securityOpen: [
          this.$rules.required()
        ],
        passRegularCycle: [
          this.$rules.required(),
          this.$rules.number(),
          this.$rules.rangeNum(1, 365)
        ],
        loginErrorCount: [
          this.$rules.number(),
          this.$rules.rangeNum(1, 100)
        ],
        autoLogoutMinute: [
          this.$rules.required(),
          this.$rules.number(),
          this.$rules.rangeNum(1, 120)
        ],
        accountLockAutoDay: [
          this.$rules.required(),
          this.$rules.number(),
          this.$rules.rangeNum(1, 365)
        ]
      }
    }
  },
  computed: {
    checkCycleRules () {
      let max
      switch (this.form.attrs.checkCycleUnit) {
        case '1':
          max = 7
          break
        case '2':
          max = 24
          break
        case '3':
          max = 60
          break
      }
      let rules = [
        this.$rules.number()
      ]
      if (max) rules.push(this.$rules.rangeNum(1, max))
      return rules
    },
    checkCyclePlaceholder () {
      const unit = this.unitOptions.find(u => u.value === this.form.attrs.checkCycleUnit)
      return unit && unit.placeholder
    },
    loginLimitRules () {
      let max
      switch (this.form.attrs.loginLimitType) {
        case '1':
          max = 100
          break
        case '2':
          max = 24
          break
        case '3':
          max = 60
          break
      }
      let rules = [
        this.$rules.number()
      ]
      if (max) rules.push(this.$rules.rangeNum(1, max))
      return rules
    },
    loginLimitPlaceholder () {
      const type = this.form.attrs.loginLimitType || '1'
      const unit = this.unitOptions.find(u => u.value === type)
      return unit ? unit.placeholder : ''
    }
  },
  methods: {
    ...mapActions('app', ['fetchSetting']),
    onSubmit () {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true
          let data = that.form
          data.attrs.systemUrl = this.$encode(data.attrs.systemUrl)
          data.attrs.openOfficeCatalog = this.$encode(data.attrs.openOfficeCatalog)
          data.attrs.loginSysImgUrl = this.$encode(data.attrs.loginSysImgUrl)
          data.attrs.systemFlagResourceUrl = this.$encode(data.attrs.systemFlagResourceUrl)
          data.attrs.sysImgUrl = this.$encode(data.attrs.sysImgUrl)
          this.$request.fetchSafeSettingUpdate(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.fetchSetting()
            }
            that.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted () {
    const that = this
    this.loading = true
    this.$request.fetchSafeSettingDetail().then(res => {
      if (res.code === 200) {
        that.form = Object.assign({}, that.form, res.data)
      }
      that.loading = false
    })
  }
}
</script>

<style lang="scss">
.safe-setting-container{
  .el-input,
  .el-select {
    max-width: 414px;
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.safe-setting-container{
  font-size: 16px;
  .el-form{
    padding-top: 10px;
    .security-open{
      margin-bottom: 20px
    }
    .form-block{
      .title{
        display: flex;
        align-items: center;
        padding: 10px 0 28px 0;
        .jee-bg-light{
          width: 2px;
          height: 14px;
        }
        h1{
          padding-left: 6px;
          color: #333333;
        }
      }
      .form-item-wrap{
        .tip{
          margin-left: 19px;
          font-size: 14px;
        }
        .append-text{
          color: #B3B3B3;
          font-size: 12px;
          padding-left: 20px;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
