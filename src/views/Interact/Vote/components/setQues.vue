<template>
<!-- 问卷设置详情页 -->
  <section class="interact-vote-set-ques">
    <base-header v-bind="headers"
    @handleOperate="handleHeaderOperate"
    />
    <base-form
      ref='form'
      v-bind="form"
      v-on:handleConfirmshareEffectPreview="handleConfirmshareEffectPreview"
      v-on:getUrlCover='getUrlCover'
      v-on:getUrlShare='getUrlShare'
    >
    <template #beginTime="scope">
        <el-date-picker
          type="datetime"
          placeholder="选择开始时间"
          v-model="form.form.beginTime"
          :picker-options="pickerOptionsStart"
           @change="startTimeStatus"
           value-format="yyyy-MM-dd HH:mm:ss"
          >
        </el-date-picker>
    </template>
    <template #endTime="scope">
        <el-date-picker
          type="datetime"
          placeholder="选择结束时间"
          v-model="form.form.endTime"
          :picker-options="pickerOptionsEnd"
          @change="endTimeStatus"
          value-format="yyyy-MM-dd HH:mm:ss"
          >
        </el-date-picker>
    </template>
    <template #userAnswerFrequencyLimit="scope">
        <el-select v-model="form.form.userAnswerFrequencyLimitUnit" class="selectWidth" popper-class="setquesSelect jee-border">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <label class="answerWidth">答题：</label>
        <el-input  v-model="form.form.userAnswerFrequencyLimit" class="inputWidth" maxlength='8'></el-input>
        <span>次</span>
    </template>
    <template #ipAnswerFrequencyLimit="scope">
        <el-select v-model="form.form.ipAnswerFrequencyLimitUnit" class="selectWidth" popper-class="setquesSelect jee-border">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <label class="answerWidth">答题：</label>
        <el-input  v-model="form.form.ipAnswerFrequencyLimit" class="inputWidth" maxlength='8'></el-input>
        <span>次</span>
    </template>
    <template #deviceAnswerFrequencyLimit="scope">
        <el-select v-model="form.form.deviceAnswerFrequencyLimitUnit" class="selectWidth" popper-class="setquesSelect jee-border">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <label class="answerWidth">答题：</label>
        <el-input  v-model="form.form.deviceAnswerFrequencyLimit" class="inputWidth" maxlength='8'></el-input>
        <span>次</span>
    </template>
    <template #wechatAnswerFrequencyLimit="scope">
        <el-select v-model="form.form.wechatAnswerFrequencyLimitUnit" class="selectWidth" popper-class="setquesSelect jee-border">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <label class="answerWidth">答题：</label>
        <el-input  v-model="form.form.wechatAnswerFrequencyLimit" class="inputWidth" maxlength='8'></el-input>
        <span>次</span>
    </template>
    </base-form>
    <div class="share-dialog">
      <share-dialog ref="shareDiaglog" :title='form.form.title' :headImg='form.form.shareLogoUrl' :description='form.form.description'></share-dialog>
    </div>
  </section>
</template>
<script>
import baseForm from '@/components/mixins/baseForm'
import baseHeader from '@/components/mixins/baseHeader'
import shareDialog from '../detailComponents/shareDialog'
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  name: 'setQues',
  mixins: [baseForm, baseHeader],
  props: {
    workFlow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    shareDialog
  },
  data () {
    const options = [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
    return {
      options: [{
        value: 1,
        label: '只能'
      }, {
        value: 2,
        label: '每小时'
      }, {
        value: 3,
        label: '每天'
      }],
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.form.form.endTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime() || time.getTime() < new Date().getTime() - 8.64e7
          } else {
            return time.getTime() < new Date().getTime() - 8.64e7
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.form.form.beginTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7 || time.getTime() < new Date().getTime() - 8.64e7
          } else {
            return time.getTime() < new Date().getTime() - 8.64e7
          }
        }
      },
      headers: {
        buttons: [
          {
            type: 'Operate',
            text: '撤回',
            icon: 'chehui',
            handle: 'back',
            isHidden: '',
            disabled: !this._checkPermission('/task/questionnaire/revoke', 'GET')
          },
          {
            type: 'Operate',
            text: '提交审核',
            icon: 'shenhe1',
            handle: 'submit',
            isHidden: '',
            disabled: !this._checkPermission('/questionnaire', 'POST')
          },
          {
            type: 'Operate',
            text: '保存',
            icon: 'baocundangqian',
            handle: 'save',
            isHidden: '',
            disabled: !this._checkPermission('/questionnaire', 'POST')
          },
          {
            type: 'Operate',
            text: '发布',
            icon: 'fabu',
            handle: 'release',
            isHidden: '',
            disabled: !this._checkPermission('/questionnaire', 'POST')
          },
          {
            type: 'Operate',
            text: '预览',
            icon: 'yulang',
            handle: 'preview',
            isHidden: '',
            disabled: !this._checkPermission('/questionnaire', 'GET')
          }
        ],
        showAlertIcon: false
      },
      form: {
        labelWidth: '210px',
        form: {
          coverPic: null,
          coverPicUrl: '',
          isVerification: false,
          processType: 1,
          prompt: '您的答卷已经提交，感谢您的参与！',
          prompt2: '',
          answerLimit: false,
          beginTime: '',
          endTime: '',
          userAnswerFrequencyLimitUnit: 1,
          userAnswerFrequencyLimit: 1,
          ipAnswerFrequencyLimitUnit: 1,
          ipAnswerFrequencyLimit: 1,
          deviceAnswerFrequencyLimitUnit: 1,
          deviceAnswerFrequencyLimit: 1,
          wechatAnswerFrequencyLimitUnit: 1,
          wechatAnswerFrequencyLimit: 1,
          isOnlyWechat: false,
          shareLogo: null,
          description: '',
          workflowId: null,
          workflowName: '',
          shareLogoUrl: ''
        },
        formItems: [
          {
            type: 'title',
            label: '问卷设置'
          },
          {
            prop: 'coverPic',
            type: 'imageUpload',
            label: '封面图片：',
            imgType: 'Cover',
            isResource: true,
            urlProp: 'coverPicUrl',
            option: {
              autoUpload: false
            }
          },
          {
            prop: 'isVerification',
            type: 'radio',
            label: '使用验证码：',
            options
          },
          {
            prop: 'processType',
            type: 'radio',
            label: '提交成功后：',
            class: 'aaa',
            options: [
              {
                value: 1,
                label: '显示文字信息'
              },
              {
                value: 2,
                label: '跳转到指定页面'
              },
              {
                value: 3,
                label: '显示结果'
              }
            ]
          },
          {
            prop: 'prompt',
            hiddenKey: 'processType',
            hiddenValue: 1,
            maxlength: 50
          },
          {
            prop: 'prompt2',
            hiddenKey: 'processType',
            hiddenValue: 2,
            maxlength: 150
          },
          {
            prop: 'workflowId',
            type: 'select',
            label: '工作流设置：',
            placeholder: '请选择',
            options: [],
            disabled: true
          },
          {
            type: 'title',
            label: '答题限制'
          },
          {
            prop: 'beginTime',
            type: 'slot',
            label: '开始时间：',
            appendText: '默认为当前时间，可修改，留空表示不设置'
          },
          {
            prop: 'endTime',
            type: 'slot',
            label: '结束时间：',
            appendText: '默认留空，留空表示不设置'
          },
          {
            prop: 'answerLimit',
            type: 'radio',
            label: '登录后才能投票：',
            options
          },
          {
            prop: 'userAnswerFrequencyLimit',
            type: 'slot',
            label: '每个用户答题次数限制：',
            hiddenKey: 'answerLimit',
            hiddenValue: true,
            options: [{
              value: 1,
              label: '只能'
            }, {
              value: 2,
              label: '每小时'
            }, {
              value: 3,
              label: '每天'
            }]
          },
          {
            type: 'slot',
            prop: 'ipAnswerFrequencyLimit',
            label: '每个IP答题次数限制：'
          },
          {
            type: 'slot',
            prop: 'deviceAnswerFrequencyLimit',
            label: '每台电脑或手机答题次数限制：'
          },
          {
            type: 'title',
            label: '微信分享设置'
          },
          {
            prop: 'isOnlyWechat',
            type: 'radio',
            label: '只能在微信中投票：',
            options
          },
          {
            prop: 'wechatAnswerFrequencyLimit',
            type: 'slot',
            label: '每个用户答题次数限制：',
            hiddenKey: 'isOnlyWechat',
            hiddenValue: true,
            options: [{
              value: 1,
              label: '只能'
            }, {
              value: 2,
              label: '每小时'
            }, {
              value: 3,
              label: '每天'
            }]
          },
          {
            prop: 'shareLogo',
            type: 'imageUpload',
            imgType: 'Share',
            urlProp: 'shareLogoUrl',
            label: '分享Logo：',
            isResource: true,
            option: {
              autoUpload: false,
              width: 80,
              height: 80
            }
          },
          {
            prop: 'description',
            type: 'textarea',
            label: '说明文字：',
            maxlength: '50',
            placeholder: '50字以内',
            autosize: { minRows: 4 },
            explain: '据微信通知，问卷中包含" 分享到朋友圈"、" 集赞"等相关内容，将被禁用'
          }
        ],
        submitBtns: [{
          text: '分享效果预览',
          subType: 'shareEffectPreview'
        }],
        rules: {
          // workflowId: [
          //   this.$rules.required()
          // ],
          prompt: [
            this.$rules.required()
          ],
          prompt2: [
            this.$rules.required()
          ],
          userAnswerFrequencyLimit: [
            this.$rules.moreThanZeroNumber()
          ],
          ipAnswerFrequencyLimit: [
            this.$rules.moreThanZeroNumber()
          ],
          deviceAnswerFrequencyLimit: [
            this.$rules.moreThanZeroNumber()
          ],
          wechatAnswerFrequencyLimit: [
            this.$rules.moreThanZeroNumber()
          ]
        }
      }
    }
  },
  methods: {
    ...mapActions('interact', ['getDetailData']),
    // 撤回
    handleBack () {
      this.form.loading = true
      this.$request.fetchTaskQuestionnaireRevoke({
        'questionnaireId': this.$route.query.id
      }).then(res => {
        this.$restBack(res, () => {
          this.getDetailData({ id: this.$route.query.id, type: true })
        })
        this.hideFormLoading()
      })
    },
    // 保存提交发布按钮提交
    handleConfirm (data) {
      if (this.$route.query.id) {
        this.form.loading = true
        this.$request.fetchQuestionnaireSetting(data).then(res => {
          // console.log(JSON.stringify(data))
          if (res.code === 200) {
            this.getDetailData({ id: this.$route.query.id, type: true })
            if (data.status === 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            } else if (data.status === 1) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$routerLink('/interact/vote/index')
            } else if (data.status === 3) {
              this.$message({
                message: '发布成功',
                type: 'success'
              })
              this.$routerLink('/interact/vote/index')
            } else {
              if (res.data.previewUrl) {
                window.open(res.data.previewUrl)
              } else {
                this.$message('当前没有预览地址')
              }
            }
          }
          this.hideFormLoading()
        })
      } else {
        this.form.loading = true
        this.$request.fetchQuestionnaireAdd(data).then(res => {
          if (res.code === 200) {
            this.hideFormLoading()
            if (data.status === 0) {
              this.removeTab(this.$route.fullPath)
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$routerLink('/interact/vote/detail', 'Edit', { id: res.data.id, link: 'editQues', isAdd: true })
            } else if (data.status === 1) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$routerLink('/interact/vote/index')
            } else if (data.status === 3) {
              this.removeTab(this.$route.fullPath)
              this.$message({
                message: '发布成功',
                type: 'success'
              })
              this.$routerLink('/interact/vote/index', 'list', {})
            }
          }
        }).catch(this.hideFormLoading)
      }
    },
    // 提交
    handleSubmit (status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const data = Object.assign({}, this.detailData)
          data.status = status
          if (data.processType === 2) {
            data.prompt = data.prompt2
          }
          delete data.prompt2
          this.handleConfirm(data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleHeaderOperate (item) {
      switch (item.handle) {
        case 'submit':
          this.handleSubmit(1)
          break
        case 'save':
          this.handleSubmit(0)
          break
        case 'release':
          this.handleSubmit(3)
          break
        case 'preview':
          this.handleSubmit()
          break
        case 'back':
          this.handleBack()
          break
      }
    },
    // 时间开始选择器
    startTimeStatus: function (value) {
      var currentTime = this.$moment(new Date().getTime(), 'YYYY-MM-DD HH:mm:ss', true)
      if (value < currentTime) {
        this.form.form.beginTime = ''
      } else {
        if (this.form.form.endTime) {
          if (this.form.form.beginTime >= this.form.form.endTime) {
            this.form.form.endTime = ''
          } else {
            this.form.form.beginTime = value
          }
        } else {
          this.form.form.beginTime = value
        }
      }
    },
    // 时间结束选择器
    endTimeStatus: function (value) {
      var currentTime = this.$moment(new Date().getTime(), 'YYYY-MM-DD HH:mm:ss', true)
      if (value < currentTime) {
        this.form.form.endTime = ''
      } else {
        if (this.form.form.beginTime) {
          if (this.form.form.beginTime >= this.form.form.endTime) {
            this.form.form.beginTime = ''
          } else {
            this.form.form.endTime = value
          }
        } else {
          this.form.form.endTime = value
        }
      }
    },
    // 获取封面图片url
    getUrlCover (item, prop) {
      if (item && item.url) {
        this.form.form.coverPic = item.id
        this.form.form.coverPicUrl = item.url
      } else if (item) {
        if (item.resourceId) {
          this.form.form.coverPic = item.resourceId
          this.form.form.coverPicUrl = item.fileUrl
        } else {
          this.form.form.coverPic = null
          this.form.form.coverPicUrl = ''
        }
      }
    },
    // 获取微信分享logo图片url
    getUrlShare (item, prop) {
      if (item && item.url) {
        this.form.form.shareLogo = item.id
        this.form.form.shareLogoUrl = item.url
      } else if (item) {
        if (item.resourceId) {
          this.form.form.shareLogo = item.resourceId
          this.form.form.shareLogoUrl = item.fileUrl
        } else {
          this.form.form.shareLogo = null
          this.form.form.shareLogoUrl = ''
        }
      }
    },
    handleConfirmshareEffectPreview () {
      this.$refs.shareDiaglog.shareDiaglog()
    },
    // 顶部按钮显示隐藏判断
    // 撤回
    back () {
      if (this.$route.query.isHiddenAll) {
        this.headers.buttons.find(v => v.handle === 'back').isHidden = true
      } else {
        if (this.detailData.status === 1) {
          if (this.detailData.revokeSupport) {
            this.headers.buttons.find(v => v.handle === 'back').isHidden = false
          } else {
            this.headers.buttons.find(v => v.handle === 'back').isHidden = true
          }
        } else {
          this.headers.buttons.find(v => v.handle === 'back').isHidden = true
        }
      }
    },
    // 提交审核
    submit () {
      if (this.$route.query.isHiddenAll) {
        this.headers.buttons.find(v => v.handle === 'submit').isHidden = true
      } else {
        if (this.workFlow) {
          if (this.$route.query.id) {
            if (this.detailData.status === 0 || this.detailData.status === 2) {
              this.headers.buttons.find(v => v.handle === 'submit').isHidden = false
            } else {
              this.headers.buttons.find(v => v.handle === 'submit').isHidden = true
            }
          } else {
            this.headers.buttons.find(v => v.handle === 'submit').isHidden = false
          }
        } else {
          this.headers.buttons.find(v => v.handle === 'submit').isHidden = true
        }
      }
    },
    // 保存
    save () {
      if (this.$route.query.isHiddenAll) {
        this.headers.buttons.find(v => v.handle === 'save').isHidden = true
      } else {
        if (this.workFlow) {
          if (this.$route.query.id) {
            if (this.detailData.status === 0 || this.detailData.status === 2) {
              this.headers.buttons.find(v => v.handle === 'save').isHidden = false
            } else {
              this.headers.buttons.find(v => v.handle === 'save').isHidden = true
            }
          } else {
            this.headers.buttons.find(v => v.handle === 'save').isHidden = false
          }
        } else {
          if (this.$route.query.id) {
            if (this.detailData.status === 0 || this.detailData.status === 2) {
              this.headers.buttons.find(v => v.handle === 'save').isHidden = false
            } else {
              this.headers.buttons.find(v => v.handle === 'save').isHidden = true
            }
          } else {
            this.headers.buttons.find(v => v.handle === 'save').isHidden = false
          }
        }
      }
    },
    // 发布
    release () {
      if (this.$route.query.isHiddenAll) {
        this.headers.buttons.find(v => v.handle === 'release').isHidden = true
      } else {
        if (this.workFlow) {
          if (this.$route.query.id) {
            if (this.detailData.status === 0 && this.detailData.checkStatus) {
              this.headers.buttons.find(v => v.handle === 'release').isHidden = false
            } else {
              this.headers.buttons.find(v => v.handle === 'release').isHidden = true
            }
          } else {
            this.headers.buttons.find(v => v.handle === 'release').isHidden = true
          }
        } else {
          if (this.$route.query.id) {
            if (this.detailData.status === 0) {
              this.headers.buttons.find(v => v.handle === 'release').isHidden = false
            } else {
              this.headers.buttons.find(v => v.handle === 'release').isHidden = true
            }
          } else {
            this.headers.buttons.find(v => v.handle === 'release').isHidden = false
          }
        }
      }
    },
    // 预览
    preview () {
      if (this.$route.query.isHiddenAll) {
        this.headers.buttons.find(v => v.handle === 'preview').isHidden = true
      } else {
        if (this.$route.query.id) {
          this.headers.buttons.find(v => v.handle === 'preview').isHidden = false
        } else {
          this.headers.buttons.find(v => v.handle === 'preview').isHidden = true
        }
      }
    },
    // 重置按钮
    resetButton () {
      this.back()
      this.submit()
      this.save()
      this.release()
      this.preview()
    }
  },
  inject: ['removeTab'],
  computed: {
    ...mapGetters(['detailData'])
  },
  mounted () {
    console.log(this.form.form)
    this.$nextTick(function () {
      this.resetButton()
    })
  },
  updated () {
    this.$nextTick(function () {
      this.resetButton()
    })
  },
  activated () {
    this.$nextTick(() => {
      if (this.$route.query.id) {
        this.getDetailData({ id: this.$route.query.id, type: true })
      }
      this.resetButton()
    })
  },
  watch: {
    detailData: function (val, v) {
      this.form.form = val
      var item = {
        value: val.workflowId,
        label: val.workflowName
      }
      // if (val.processType === 2) {
      //   this.form.formItems.find(v => v.prop === 'prompt2').prop = val.prompt
      // }
      this.form.formItems.find(v => v.prop === 'workflowId').options = [item]
      // this.form.form.beginTime = this.form.form.beginTime
      // this.form.form.endTime = this.form.form.endTime
    },
    workFlow: function (newVal) {
      this.resetButton()
    }
  }
}
</script>
<style lang="scss">
.interact-vote-set-ques{
  height: 100%;
  .base-header-container header{
    padding-bottom: 10px!important;
  }
  .selectWidth{
    width: 137px;
    padding-right: 30px;
  }
  .inputWidth{
    width: 137px;
    padding-right: 10px;
  }
  .answerWidth{
     padding-right: 12px;
     color: #666
  }
  .red{
    color:#f00;
  }
  .el-date-editor .el-input__inner{
    width: 414px;
    height: 40px;
  }
  .el-date-editor .el-input__suffix{
    right: -178px!important;
  }
}
.setquesSelect{
  min-width: 137px!important;
}
</style>
