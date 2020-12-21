<template>
  <div class="system-setting-container">
    <!-- <base-header v-bind="headers"/> -->
    <el-main>
      <el-tabs v-model="activeTabName" @tab-click="handleClick">
        <el-tab-pane label="QQ登录" name="qqForm">
          <base-form class="tabs-froms"
            v-bind="form"
            v-on:handleConfirm="handleConfirm"
          ></base-form>
        </el-tab-pane>
        <el-tab-pane label="微信登录" name="wechatForm">
          <base-form class="tabs-froms"
            v-bind="form"
            v-on:handleConfirm="handleConfirm"
          ></base-form>
        </el-tab-pane>
        <el-tab-pane label="微博登录" name="weiboForm">
          <base-form class="tabs-froms"
            v-bind="form"
            v-on:handleConfirm="handleConfirm"
          ></base-form>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'

export default {
  name: 'thirdParty',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明:   这里是关于该页面的相关操作说明文字。'
      },
      form: {
        api: 'fetchThirdPartyDetail',
        params: {
          code: 'QQ'
        },
        labelWidth: '236px',
        form: {
          isEnable: true,
          id: '',
          appId: '',
          appKey: '',
          reMark: ''
        },
        formItems: [
          {
            prop: 'isEnable',
            label: '是否开启QQ登录：',
            type: 'radio',
            options: [
              {
                value: true,
                label: '是'
              },
              {
                value: false,
                label: '否'
              }
            ],
            hiddenValue: true,
            autosize: false,
            popoverText: '开启后，可使用QQ快捷登录网站前台'
          },
          {
            prop: 'appId',
            label: '应用ID：',
            placeholder: '请输入应用ID',
            hiddenKey: 'isEnable',
            hiddenValue: true,
            maxlength: 40,
            href: 'https://connect.qq.com/',
            hrefText: '点击获取应用'
          },
          {
            prop: 'appKey',
            label: '应用秘钥：',
            placeholder: '请输入应用秘钥',
            hiddenKey: 'isEnable',
            hiddenValue: true,
            maxlength: 120
          },
          {
            prop: 'reMark',
            label: '备注：',
            placeholder: '请输入备注',
            type: 'textarea',
            height: '100px',
            hiddenKey: 'isEnable',
            hiddenValue: true,
            maxlength: 167
          }
        ],
        rules: {
          code: [
            this.$rules.required()
          ],
          isEnable: [
            this.$rules.required()
          ],
          appId: [
            this.$rules.required(),
            this.$rules.max(50)
          ],
          appKey: [
            this.$rules.required(),
            this.$rules.max(150)
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/thirds', 'POST')
        }]
      },
      activeTabName: 'qqForm'
    }
  },
  methods: {
    handleConfirm (data) {
      data.code = this.form.params.code
      this.$request.fetchThirdPartyUpdate(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      }).catch()
    },
    handleClick (tab, event) {
      this.form.params.id += 1
      var arr = ['QQ', 'WECHAT', 'WEIBO']
      this.form.params.code = arr[tab.index]
      if (this.form.params.code === 'QQ') {
        this.form.formItems[0].label = '是否开启QQ登录：'
        this.form.formItems[0].popoverText = '开启后，可使用QQ快捷登录网站前台'
        this.form.formItems[1].href = 'https://connect.qq.com/'
      } else if (this.form.params.code === 'WECHAT') {
        this.form.formItems[0].label = '是否开启微信登录：'
        this.form.formItems[0].popoverText = '开启后，可使用微信快捷登录PC网站前台'
        this.form.formItems[1].href = 'https://open.weixin.qq.com/'
      } else if (this.form.params.code === 'WEIBO') {
        this.form.formItems[0].label = '是否开启微博登录：'
        this.form.formItems[0].popoverText = '开启后，可使用新浪微博快捷登录网站前台'
        this.form.formItems[1].href = 'https://open.weibo.com/index.php'
      }
      this.fetchFormApi()
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
      } else {
        this.form.form = {
          isEnable: true,
          id: '',
          appId: '',
          appKey: '',
          reMark: ''
        }
      }
    }
  },
  created () {
    this.$request.fetchThirdPartyDetail(this.form.params).then(res => {
      if (res.code === 200) {
        this.form.form = res.data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.system-setting-container{
  font-size: 16px;
  .tabs-froms{
    margin-top: 30px;
  }
}
</style>
