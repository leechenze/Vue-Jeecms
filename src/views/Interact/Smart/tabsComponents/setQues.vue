<template>
<!--表单设置详情页 -->
  <section class="interact-smart-set-ques" v-loading="loading">
    <base-header v-bind="headers"
    @handleOperate="handleHeaderOperate"
    />
    <div class="smart-set-cont">
      <base-form
      ref='form'
      v-bind="form"
      v-on:handleConfirmshareEffectPreview="handleConfirmshareEffectPreview"
      @getUrlCover='getUrlCover'
      @getUrlShare='getUrlShare'
    >
      <template #beginTime="scope">
          <el-date-picker
            type="datetime"
            class="w-100"
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
            class="w-100"
            placeholder="选择结束时间"
            v-model="form.form.endTime"
            :picker-options="pickerOptionsEnd"
            @change="endTimeStatus"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
          </el-date-picker>
      </template>
      <template #userSubLimit="scope">
          <el-select v-model="scope.form.userSubLimitUnit" class="selectWidth" popper-class="setquesSelect jee-border">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <label class="answerWidth">填写：</label>
          <el-input  v-model="form.form.userSubLimit" class="inputWidth" maxlength='8'></el-input>
          <span>次</span>
      </template>
      <template #ipSubLimit="scope">
          <el-select v-model="scope.form.ipSubLimitUnit" class="selectWidth" popper-class="setquesSelect jee-border">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <label class="answerWidth">填写：</label>
          <el-input  v-model="form.form.ipSubLimit" class="inputWidth" maxlength='8'></el-input>
          <span>次</span>
      </template>
      <template #deviceSubLimit="scope">
          <el-select v-model="form.form.deviceSubLimitUnit" class="selectWidth" popper-class="setquesSelect jee-border">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <label class="answerWidth">填写：</label>
          <el-input  v-model="form.form.deviceSubLimit" class="inputWidth" maxlength='8'></el-input>
          <span>次</span>
      </template>
      <template #wechatSubLimit="scope">
          <el-select v-model="scope.form.wechatSubLimitUnit" class="selectWidth" popper-class="setquesSelect jee-border">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <label class="answerWidth">填写：</label>
          <el-input  v-model="scope.form.wechatSubLimit" class="inputWidth" maxlength='8'></el-input>
          <span>次</span>
      </template>
    </base-form>
    </div>
    <div class="share-dialog">
      <share-dialog ref="shareDiaglog" :title='form.form.title' :headImg='form.form.shareLogoUrl'
      :shareDesc='form.form.shareDesc'></share-dialog>
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
    name: {
      type: String,
      default: ''
    },
    saveName: {
      type: String,
      default: ''
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
      loading: false,
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
            text: '保存',
            icon: 'baocundangqian',
            handleType: 'save',
            isHidden: false,
            disabled: !this._checkPermission('/smartForm/updateFields', 'POST')
          },
          {
            type: 'Operate',
            text: '发布',
            icon: 'fabu',
            handleType: 'release',
            isHidden: false,
            disabled: !this._checkPermission('/smartForm/publish', 'PUT')
          },
          {
            type: 'Operate',
            text: '预览',
            icon: 'yulang',
            handleType: 'preview',
            isHidden: false,
            disabled: !this._checkPermission('/smartForm', 'GET')
          }
        ],
        showAlertIcon: false
      },
      form: {
        labelWidth: '210px',
        form: {
          coverPicId: null,
          coverPicUrl: '',
          processType: 1,
          prompt: '',
          prompt2: '',
          submitLimitLogin: false,
          beginTime: '',
          endTime: '',
          userSubLimitUnit: 1,
          userSubLimit: 1,
          ipSubLimitUnit: 1,
          ipSubLimit: 1,
          deviceSubLimitUnit: 1,
          deviceSubLimit: 1,
          wechatSubLimitUnit: 1,
          wechatSubLimit: 1,
          isOnlyWechat: false,
          shareLogoId: null,
          shareDesc: '',
          workflowName: '',
          shareLogoUrl: ''
        },
        formItems: [
          {
            type: 'title',
            label: '表单设置'
          },
          {
            prop: 'coverPicId',
            type: 'imageUpload',
            class: 'label-line',
            label: '封面图片：',
            imgType: 'Cover',
            isResource: true,
            urlProp: 'coverPicUrl',
            option: {
              autoUpload: false
            }
          },
          {
            prop: 'processType',
            type: 'radio',
            label: '提交成功后：',
            class: 'aaa margin-bottom10',
            options: [
              {
                value: 1,
                label: '显示文字信息'
              },
              {
                value: 2,
                label: '跳转到指定页面'
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
            type: 'title',
            label: '填写限制'
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
            prop: 'submitLimitLogin',
            type: 'radio',
            label: '登录后才能填写：',
            options
          },
          {
            prop: 'userSubLimit',
            type: 'slot',
            label: '每个用户填写次数限制：',
            hiddenKey: 'submitLimitLogin',
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
            prop: 'ipSubLimit',
            label: '每个IP填写次数限制：'
          },
          {
            type: 'slot',
            prop: 'deviceSubLimit',
            label: '每台电脑或手机填写次数限制：'
          },
          {
            type: 'title',
            label: '微信分享设置'
          },
          {
            prop: 'isOnlyWechat',
            type: 'radio',
            label: '只能在微信中填写：',
            options
          },
          {
            prop: 'wechatSubLimit',
            type: 'slot',
            label: '每个用户填写次数限制：',
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
            prop: 'shareLogoId',
            type: 'imageUpload',
            imgType: 'Share',
            class: 'label-line',
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
            prop: 'shareDesc',
            type: 'textarea',
            label: '说明文字：',
            maxlength: '50',
            placeholder: '50字以内',
            autosize: { minRows: 4 },
            explainProp: {
              class: 't-66'
            },
            explain: '据微信通知表单中包含" 分享到朋友圈"、" 集赞"等相关内容，将被禁用'
          }
        ],
        submitBtns: [{
          text: '分享效果预览',
          subType: 'shareEffectPreview'
        }],
        rules: {
          prompt: [
            this.$rules.required()
          ],
          prompt2: [
            this.$rules.required()
          ],
          userSubLimit: [
            this.$rules.moreThanZeroNumber()
          ],
          ipSubLimit: [
            this.$rules.moreThanZeroNumber()
          ],
          deviceSubLimit: [
            this.$rules.moreThanZeroNumber()
          ],
          wechatSubLimit: [
            this.$rules.moreThanZeroNumber()
          ]
        }
      }
    }
  },
  methods: {
    ...mapActions('interact', ['getSmartDetailData', 'getCloseData']),
    // 保存提交发布按钮提交
    handleConfirm (data, status) {
      if (this.$route.query.id) {
        this.form.loading = true
        this.loading = true
        this.$request.fetchSmartFormPut(data).then(res => {
          // console.log(JSON.stringify(data))
          if (res.code === 200) {
            this.getSmartDetailData({ id: this.$route.query.id, type: true })
            if (status === 0) {
              this.loading = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            } else if (status === 3) {
              this.fetchPublish(this.$route.query.id)
            } else {
              this.loading = false
              if (this.smartDetailData.previewUrl) {
                window.open(this.smartDetailData.previewUrl)
              } else {
                this.$message('当前没有预览地址')
              }
            }
          } else {
            this.loading = false
          }
          this.hideFormLoading()
        }).catch(() => {
          this.hideFormLoading()
          this.loading = false
        })
      }
    },
    // 提交
    handleSubmit (status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const data = Object.assign({}, this.smartDetailData, this.form.form)
          if (data.processType === 2) {
            data.prompt = data.prompt2
          }
          // delete data.prompt2
          this.handleConfirm(data, status)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleHeaderOperate (item) {
      console.log(item)
      if (item.handleType === 'release') {
        this.getCloseData(false)
      }
      switch (item.handleType) {
        case 'save':
          this.handleSubmit(0)
          break
        case 'release':
          if (this.form.form.beginTime) {
            this.$confirm('发布后开始时间将变成当前发布时间，是否确定？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleSubmit(3)
            }).catch(() => {})
          } else {
            this.handleSubmit(3)
          }
          break
        case 'preview':
          this.handleSubmit()
          break
      }
    },
    fetchPublish (id) {
      let params = {
        publish: true,
        ids: [id]
      }
      let removeUrl = this.$route.fullPath
      this.$request.fetchSmartFormPublishPut(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.$routerLink('/interact/smart/index', 'list', {})
          setTimeout(() => {
            this.removeTab(removeUrl)
          }, 0)
        }
        this.loading = false
      })
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
        this.form.form.coverPicId = item.id
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
        this.form.form.shareLogoId = item.id
        this.form.form.shareLogoUrl = item.url
      } else if (item) {
        if (item.resourceId) {
          this.form.form.shareLogoId = item.resourceId
          this.form.form.shareLogoUrl = item.fileUrl
        } else {
          this.form.form.shareLogoId = null
          this.form.form.shareLogoUrl = ''
        }
      }
    },
    handleConfirmshareEffectPreview () {
      this.$refs.shareDiaglog.shareDiaglog()
    },
    // 顶部按钮显示隐藏判断
    setBtns () {
      // 0未发布1流转中2已驳回3进行中4已结束
      if (this.getBtn) {
        this.getBtn = false
        if (this.$route.query.isHiddenAll) {
          this.headers.buttons = this.headers.buttons.map(t => {
            t.isHidden = true
            return t
          })
        } else {
          this.headers.buttons.find(t => t.handleType === 0).isHidden = false
          this.headers.buttons.find(t => t.handleType === 3).isHidden = false
          if (this.data.status === 1) {
            this.headers.buttons.find(t => t.handleType === 3).isHidden = true
            this.headers.buttons.find(v => v.handle === 'save').isHidden = true
          } else {
            this.headers.buttons.find(t => t.handleType === 0).isHidden = false
          }
          this.headers.buttons.find(t => t.handleType === 'preview').isHidden = false
          this.getBtn = true
        }
      }
    },
    getDataInfo () {
      let obj = Object.assign({}, this.form.form, this.smartDetailData)
      obj.shareLogoUrl = obj.shareLogo ? this.$getPath(obj.shareLogo.url) : ''
      obj.coverPicUrl = obj.coverPic ? this.$getPath(obj.coverPic.url) : ''
      obj.processType = obj.processType || 1
      obj.ipSubLimit = obj.ipSubLimit || 1
      obj.ipSubLimitUnit = obj.ipSubLimitUnit || 1
      obj.userSubLimit = obj.userSubLimit || 1
      obj.userSubLimitUnit = obj.userSubLimitUnit || 1
      obj.deviceSubLimit = obj.deviceSubLimit || 1
      obj.deviceSubLimitUnit = obj.deviceSubLimitUnit || 1
      obj.wechatSubLimit = obj.wechatSubLimit || 1
      obj.wechatSubLimitUnit = obj.wechatSubLimitUnit || 1

      obj.prompt = obj.processType === 2 ? '提交成功，感谢您的参与！' : (obj.prompt || '提交成功，感谢您的参与！')
      obj.prompt2 = obj.processType === 2 ? this.smartDetailData.prompt : ''
      this.form.form = obj
    }
  },
  inject: ['removeTab'],
  computed: {
    ...mapGetters(['smartDetailData'])
  },
  updated () {
    this.$nextTick(v => {
      if (this.$route.query.id && this.name === 'editQues') {
        this.setBtns()
      }
    })
  },
  activated () {
    this.$nextTick(v => {
      if (this.$route.query.id && this.name === 'setQues') {
        this.getDataInfo()
        this.getSmartDetailData({ id: this.$route.query.id })
      }
    })
  },
  mounted () {
    this.$nextTick(v => {
      if (this.$route.query.id && this.name === 'setQues') {
        this.getDataInfo()
        this.getSmartDetailData({ id: this.$route.query.id })
      } else if (this.name === 'setQues') {
        this.setBtns()
      }
    })
  },
  watch: {
    name (newVal, oldVal) {
      if (newVal === 'setQues') {
        this.getDataInfo()
        this.getSmartDetailData({ id: this.$route.query.id })
      } else if (this.saveName === 'setQues' && newVal !== 'setQues') {
        this.handleSubmit(0)
      }
    },
    smartDetailData (newVal) {
      this.getDataInfo()
    }
  }
}
</script>
<style lang="scss">
.interact-smart-set-ques{
  height: 100%;
  .base-header-container header{
    padding-bottom: 10px!important;
  }
  .smart-set-cont{
    height: calc(100% - 56px);
    overflow: hidden auto;
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
  .w-100{
    width: 100% !important;
  }
  .el-textarea .el-textarea__inner{
    line-height: 1.5 !important;
  }
}
.setquesSelect{
  min-width: 137px!important;
}
.label-line{
    .el-form-item__label{
      line-height: 1;
    }
  }
</style>
