<template>
  <section class="integral-index-container">
    <el-main>
        <el-tabs v-model="activeTabName" @tab-click="handleClick">
          <template v-for="(tab, index) in getTabs">
            <el-tab-pane :key='index' :name="tab.name">
              <label slot="label" style="cursor: pointer;">{{tab.label}}<jee-icon iconClass="caozuoshuoming1" v-if="tab.isShow"
                @click="tabs[index].showAlert = !tab.showAlert" :style="{fontSize: '16px'}"/></label>
              <el-collapse-transition>
                <div v-show="tab.showAlert" style="margin-bottom:20px">
                  <el-alert
                    :title="$t(tab.content)"
                    type="warning"
                    show-icon
                    @close="tabs[index].showAlert = false"
                  ></el-alert>
                </div>
              </el-collapse-transition>
              <base-form class="tabs-froms"
                v-bind="tab.data"
                @handleConfirm="handleConfirm"
              ></base-form>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-main>
  </section>
</template>

<script>
import baseForm from '@/components/mixins/baseForm'

export default {
  name: 'vipIntegral',
  mixins: [baseForm],
  data () {
    return {
      contributeform: {
        params: {
          code: 'QQ'
        },
        labelWidth: '236px',
        form: {
        },
        rules: {
          submitOnedayMaxScore: [this.$rules.required(), this.$rules.number()],
          submitScoreLimit: [this.$rules.required()],
          submitSuccessScore: [this.$rules.required(), this.$rules.number()],
          submitSuccessNumber: [this.$rules.required(), this.$rules.number()],
          submitStatus: [this.$rules.required()]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/members/score', 'POST')
        }]
      },
      commentform: {
        params: {

        },
        labelWidth: '236px',
        form: {
        },
        rules: {
          commentOnedayMaxScore: [this.$rules.required(), this.$rules.number()],
          commentScoreLimit: [this.$rules.required()],
          commentSuccessScore: [this.$rules.required(), this.$rules.number()],
          commentSuccessNumber: [this.$rules.required(), this.$rules.number()],
          commentStatus: [this.$rules.required()]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/members/score', 'POST')
        }]
      },
      registerform: {
        params: {
        },
        labelWidth: '236px',
        form: {
        },
        formItems: [
          {
            type: 'switch',
            prop: 'registerStatus',
            label: '状态：',
            activeValue: '1',
            inactiveValue: '0'
          },
          {
            type: 'number',
            prop: 'registerSuccessScore',
            label: '注册成功获取积分：',
            appendText: '需输入大于0的整数',
            min: 1,
            max: 99999999,
            maxlength: 11
          }
        ],
        rules: {
          registerStatus: [this.$rules.required()],
          registerSuccessScore: [this.$rules.required(), this.$rules.number()]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/members/score', 'POST')
        }]
      },
      messageform: {
        params: {
        },
        labelWidth: '236px',
        form: {
        },
        formItems: [
          {
            type: 'switch',
            prop: 'perfectMessageStatus',
            label: '状态：',
            activeValue: '1',
            inactiveValue: '0'
          },
          {
            type: 'number',
            prop: 'perfectMessageSuccessScore',
            label: '完善个人信息获得积分：',
            appendText: '需输入大于0的整数',
            min: 1,
            max: 99999999,
            maxlength: 11
          }
        ],
        rules: {
          perfectMessageStatus: [this.$rules.required()],
          perfectMessageSuccessScore: [this.$rules.required(), this.$rules.number()]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/members/score', 'POST')
        }]
      },
      tabs: [
        {
          label: '投稿',
          name: 'contributeform',
          showAlert: false,
          // content: '投稿说明',
          isShow: false,
          data: {}
        },
        {
          label: '评论',
          name: 'commentform',
          showAlert: false,
          // content: '评论说明',
          isShow: false,
          data: {}
        },
        {
          label: '注册',
          name: 'registerform',
          showAlert: false,
          isShow: false,
          // content: '注册说明',
          data: this.registerform
        },
        {
          label: '完善信息',
          name: 'messageform',
          isShow: true,
          showAlert: true,
          content: '完善全部的会员信息后可获得积分，每个会员只能获得一次该项积分',
          data: this.messageform
        }
      ],
      activeTabName: 'contributeform'
    }
  },
  computed: {
    getTabs () {
      return this.tabs.map(d => {
        switch (d.name) {
          case 'contributeform':
            d.data = {
              ...this.contributeform,
              formItems: this.contributeFormItems
            }
            break
          case 'commentform':
            d.data = {
              ...this.commentform,
              formItems: this.commentFormItems
            }
            break
          case 'registerform':
            d.data = this.registerform
            break
          case 'messageform':
            d.data = this.messageform
            break
          default:
            break
        }
        return d
      })
    },
    contributeFormItems () {
      const { submitSuccessScore, submitOnedayMaxScore, submitScoreLimit } = this.contributeform.form
      const maxObj = {}
      if (submitScoreLimit === '1') {
        maxObj.max = submitOnedayMaxScore
      }
      return [
        {
          type: 'switch',
          prop: 'submitStatus',
          label: '状态：',
          activeValue: '1',
          inactiveValue: '0',
          disableText: '关闭'
        },
        {
          type: 'number',
          prop: 'submitSuccessNumber',
          label: '每成功投稿：',
          appendText: '需输入大于0的整数',
          unit: '篇',
          min: 1,
          max: 99999999,
          maxlength: 11
        },
        {
          type: 'number',
          prop: 'submitSuccessScore',
          label: '获得积分：',
          appendText: '需输入大于0的整数',
          min: 1,
          max: 99999999,
          maxlength: 11,
          ...maxObj
        },
        {
          type: 'radio',
          prop: 'submitScoreLimit',
          label: '积分获取限制：',
          options: [
            {
              value: '1',
              label: '开启'
            },
            {
              value: '0',
              label: '不开启'
            }
          ]
        },
        {
          type: 'number',
          prop: 'submitOnedayMaxScore',
          label: '每日投稿最多可获取积分：',
          appendText: '需输入大于0的整数',
          hiddenKey: 'submitScoreLimit',
          hiddenValue: '1',
          min: submitSuccessScore || 1,
          max: 99999999,
          maxlength: 11
        }
      ]
    },
    commentFormItems () {
      const { commentScoreLimit, commentSuccessScore, commentOnedayMaxScore } = this.commentform.form
      const maxObj = {}
      if (commentScoreLimit === '1') {
        maxObj.max = commentOnedayMaxScore
      }
      return [
        {
          type: 'switch',
          prop: 'commentStatus',
          label: '状态：',
          activeValue: '1',
          inactiveValue: '0'
        },
        {
          type: 'number',
          prop: 'commentSuccessNumber',
          label: '每成功评论：',
          appendText: '需输入大于0的整数',
          unit: '次',
          min: 1,
          max: 99999999,
          maxlength: 11
        },
        {
          type: 'number',
          prop: 'commentSuccessScore',
          label: '获得积分：',
          appendText: '需输入大于0的整数',
          min: 1,
          max: 99999999,
          maxlength: 11,
          ...maxObj
        },
        {
          type: 'radio',
          prop: 'commentScoreLimit',
          label: '积分获取限制：',
          options: [
            {
              value: '1',
              label: '开启'
            },
            {
              value: '0',
              label: '不开启'
            }
          ]
        },
        {
          type: 'number',
          prop: 'commentOnedayMaxScore',
          label: '每日评论最多可获取积分：',
          appendText: '需输入大于0的整数',
          hiddenKey: 'commentScoreLimit',
          hiddenValue: '1',
          min: commentSuccessScore || 1,
          max: 99999999,
          maxlength: 11
        }
      ]
    }
  },
  methods: {
    handleConfirm (data) {
      this.$request.fetchMembersScoreAlter(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      }).catch()
    },
    handleClick (tab, event) {
      this.fetchMembersScoreDetail()
    },
    fetchMembersScoreDetail () {
      this.$request.fetchMembersScoreDetail().then(res => {
        if (res.code === 200) {
          if (this.activeTabName === 'contributeform') {
            this.contributeform.form = res.data.cmsSiteCfg
          } else if (this.activeTabName === 'commentform') {
            this.commentform.form = res.data.cmsSiteCfg
          } else if (this.activeTabName === 'registerform') {
            this.registerform.form = res.data.cmsSiteCfg
          } else if (this.activeTabName === 'messageform') {
            this.messageform.form = res.data.cmsSiteCfg
          }
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    }
  },
  mounted () {
    this.fetchMembersScoreDetail()
  },
  created () {

  }
}
</script>

<style lang="scss" scoped>

</style>
