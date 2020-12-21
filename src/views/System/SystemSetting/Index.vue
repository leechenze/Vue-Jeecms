<template>
  <el-container direction="vertical" v-loading="form.loading" class="system-setting-container">
    <!-- <base-header v-bind="headers"/> -->
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
      @getRadioTypeisCredentialDigestSm="handRadioType"
      @getRadioTypeopenContentSecurity="handRadioTypeSecurity"
      :options="{
        ftpOptions,
        ossOptions
      }"
      v-on:getUrlLogin="LoginUrl"
      v-on:getUrlSystem="SystemUrl"
    ></base-form>
  </el-container>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import { desEncrypt } from '@/utils'

import {
  mapGetters,
  mapActions
} from 'vuex'
import { deepClone } from '../../../utils'

export default {
  name: 'systemSetting',
  mixins: [baseHeader, baseForm],
  data () {
    const options = [
      {
        value: '1',
        label: '是'
      },
      {
        value: '0',
        label: '否'
      }
    ]
    return {
      isCredentialDigestSmType: '',
      headers: {
        title: '操作说明'
      },
      form: {
        api: 'fetchSystemSettingDetail',
        params: {},
        labelWidth: '236px',
        form: {
          radioType: false,
          ftpValue: '',
          oosValue: '',
          openAttachmentSecurity: '0',
          openContentSecurity: '0',
          isSensitiveWords: '0',
          memberRegisterExamine: '1',
          isActivationImage: '1',
          IsVisible: '1',
          isMemberRegister: '1',
          isMemberFunction: '1',
          isContentCode: '0',
          serverPort: '',
          isIntranetSet: '0',
          openOfficePort: '',
          isBaiduPush: '0',
          isCredentialDigestSm: '0',
          deploymentPath: '',
          openOfficeCatalog: '',
          baiduPushToken: '',
          initPasswd: '',
          sensitiveWordsReplace: '',
          openContentIssue: '0',
          dataBackupsMemoryType: '1',
          templateFile: '',
          templateFileType: '1',
          systemFlagResourceId: '',
          systemFlagResourceUrl: '',
          loginSysImgId: '',
          loginSysImgUrl: '',
          sysImgId: '',
          sysImgUrl: ''
        },
        formItems: [
          {
            type: 'title',
            label: '会员注册配置'
          },
          {
            prop: 'isMemberFunction',
            label: '是否开启会员功能：',
            type: 'radio',
            options
          },
          {
            prop: 'isMemberRegister',
            label: '是否开启会员注册：',
            type: 'radio',
            options,
            hiddenKey: 'isMemberFunction',
            hiddenValue: '1'
          },
          {
            prop: 'isActivationImage',
            label: '会员注册是否需要图片验证码：',
            type: 'radio',
            options,
            hiddenKey: 'isMemberFunction',
            hiddenValue: '1'
          },
          {
            prop: 'memberRegisterExamine',
            label: '会员注册是否需要审核：',
            type: 'radio',
            options,
            hiddenKey: 'isMemberFunction',
            hiddenValue: '1'
          },
          {
            type: 'title',
            label: '敏感词配置'
          },
          {
            prop: 'isSensitiveWords',
            label: '是否允许输入敏感词：',
            type: 'radio',
            options
          },
          {
            prop: 'sensitiveWordsReplace',
            label: '敏感词默认替换为：',
            placeholder: '请输入内容',
            hiddenKey: 'isSensitiveWords',
            hiddenValue: '1'
          },
          {
            type: 'title',
            label: '内容配置'
          },
          {
            prop: 'openContentIssue',
            label: '是否开启内容发文字号：',
            type: 'radio',
            options,
            popoverText: '开启内容发文字号之后，会提供内容发文字号的录入和检索等功能，开启后需要在内容模型中启用发文字号字段；'
          },
          {
            prop: 'openContentSecurity',
            label: '是否开启内容密级：',
            type: 'radio',
            options,
            popoverText: '开启文档密级后自动开启人员密级；一旦开启文档密级功能，所有静态化设置将自动设为不开启；开启后需要在内容模型中启用内容密级字段。'
          },
          {
            prop: 'openAttachmentSecurity',
            label: '是否开启附件密级：',
            type: 'radio',
            options,
            hiddenKey: 'openContentSecurity',
            hiddenValue: '1',
            popoverText: '开启附件密级的前提为文档密级已开启。'
          },
          {
            type: 'title',
            label: '系统部署配置'
          },
          {
            prop: 'deploymentPath',
            label: '部署路径：',
            placeholder: '请输入内容',
            appendText: '部署在根目录请留空',
            maxlength: 50
          },
          {
            prop: 'serverPort',
            label: '端口号：',
            placeholder: '请输入内容',
            appendText: '默认留空'
          },
          {
            prop: 'openOfficeCatalog',
            label: 'openoffice安装目录：',
            placeholder: '请输入内容',
            maxlength: 50
          },
          {
            prop: 'openOfficePort',
            label: 'openoffice端口：',
            placeholder: '请输入内容'
          },
          {
            prop: 'dataBackupsMemoryType',
            label: '数据备份文件存储服务器：',
            type: 'radio',
            options: [
              {
                value: '1',
                label: '本地服务器'
              },
              {
                value: '2',
                label: 'FTP'
              },
              {
                value: '3',
                label: 'OSS云存储'
              }
            ],
            popoverWidth: '300',
            popoverText: '当使用集群部署时，指定数据备份文件的存储位置。'
          },
          {
            prop: 'ftpValue',
            label: 'FTP：',
            type: 'select',
            placeholder: '请选择',
            hiddenKey: 'dataBackupsMemoryType',
            hiddenValue: '2',
            options: 'ftpOptions'
          },
          {
            prop: 'oosValue',
            label: 'OSS云存储：',
            type: 'select',
            placeholder: '请选择',
            hiddenKey: 'dataBackupsMemoryType',
            hiddenValue: '3',
            options: 'ossOptions'
          },
          {
            prop: 'templateFileType',
            label: '模板文件存储服务器：',
            type: 'radio',
            options: [
              {
                value: '1',
                label: '本地服务器'
              },
              {
                value: '2',
                label: 'FTP'
              }
            ],
            popoverWidth: '300',
            popoverText: '当使用集群部署时，需要指定模板文件存储到FTP。'
          },
          {
            prop: 'templateFile',
            label: 'FTP：',
            type: 'select',
            placeholder: '请选择',
            hiddenKey: 'templateFileType',
            hiddenValue: '2',
            options: 'ftpOptions'
          },
          {
            type: 'title',
            label: '百度推送配置'
          },
          {
            prop: 'isBaiduPush',
            label: '是否开启百度推送：',
            type: 'radio',
            options
          },
          {
            prop: 'baiduPushToken',
            label: '百度推送Token：',
            placeholder: '请输入内容',
            hiddenKey: 'isBaiduPush',
            hiddenValue: '1',
            maxlength: 300
          },
          {
            type: 'title',
            label: '其他配置'
          },
          {
            prop: 'IsVisible',
            label: '组织对所有用户可见：',
            type: 'radio',
            options
          },
          {
            prop: 'isIntranetSet',
            label: '是否开启内网模式：',
            type: 'radio',
            options
          },
          {
            prop: 'isContentCode',
            label: '是否生成内容页二维码：',
            type: 'radio',
            options,
            popoverWidth: '300',
            popoverText: '生成内容页二维码后，可扫描二维码快速浏览手机端内容页；二维码图片可通过系统标签调用。'
          },
          {
            prop: 'systemFlagResourceId',
            label: '系统标志：',
            type: 'imageUpload',
            urlProp: 'systemFlagResourceUrl',
            class: 'systemFlagResourceId',
            option: {
              isSingleImage: true,
              desc: '(请上传ico格式的图片，建议文件命名为favicon.ico)',
              defaultFileName: 'favicon.ico',
              type: ['ico'],
              width: 32,
              height: 32
            }
          },
          {
            prop: 'loginSysImgId',
            label: '登录页logo：',
            type: 'imageUpload',
            imgType: 'Login',
            urlProp: 'loginSysImgUrl',
            option: {
              desc: '(请上传jpg, png, gif, bmp, jpeg格式的图片)',
              autoUpload: true,
              width: 373,
              height: 540
            }
          },
          {
            prop: 'sysImgId',
            label: '系统头部logo：',
            type: 'imageUpload',
            imgType: 'System',
            urlProp: 'sysImgUrl',
            option: {
              desc: '(请上传jpg, png, gif, bmp, jpeg格式的图片)',
              autoUpload: true,
              width: 110,
              height: 22
            }
          },
          /* system-sm-crypto start */
          {
            type: 'title',
            label: '密码加密方式'
          },
          {
            prop: 'isCredentialDigestSm',
            label: '用户密码加密方式：',
            type: 'radio',
            options: [
              {
                value: '0',
                label: 'SHA-1'
              },
              {
                value: '1',
                label: 'SM3'
              }
            ]
          },
          {
            prop: 'initPasswd',
            label: '设置初始密码：',
            placeholder: '请输入初始密码',
            hiddenKey: 'radioType',
            hiddenValue: true,
            // type: 'password',
            maxlength: 20,
            popoverText: '更改加密方式后，现有的前后台用户的密码都将被重置为此密码，初始密码不超过20位'
          }
          /* system-sm-crypto end */
        ],
        rules: {
          isMemberFunction: [
            this.$rules.required()
          ],
          isMemberRegister: [
            this.$rules.required()
          ],
          isActivationImage: [
            this.$rules.required()
          ],
          memberRegisterExamine: [
            this.$rules.required()
          ],
          deploymentPath: [
            this.$rules.cnEnNumPath()
          ],
          serverPort: [
            this.$rules.number(),
            this.$rules.rangeNum(1, 65535)
          ],
          openOfficeCatalog: [
            this.$rules.required()
            // this.$rules.cnEnNum()
          ],
          openOfficePort: [
            this.$rules.required(),
            this.$rules.number(),
            this.$rules.rangeNum(1, 65535)
          ],
          isBaiduPush: [
            this.$rules.required()
          ],
          isCredentialDigestSm: [
            this.$rules.required()
          ],
          baiduPushToken: [
            this.$rules.required()
          ],
          initPasswd: [
            this.$rules.required()
          ],
          IsVisible: [
            this.$rules.required()
          ],
          isIntranetSet: [
            this.$rules.required()
          ],
          isContentCode: [
            this.$rules.required()
          ],
          openContentIssue: [
            this.$rules.required()
          ],
          sensitiveWordsReplace: [
            this.$rules.max()
          ],
          dataBackupsMemoryType: [
            this.$rules.required()
          ],
          ftpValue: [
            this.$rules.required()
          ],
          oosValue: [
            this.$rules.required()
          ],
          loginSysImgId: [
            this.$rules.required()
          ],
          sysImgId: [
            this.$rules.required()
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/config/global', 'PUT')
        }]
      },
      id: ''
    }
  },
  computed: {
    ...mapGetters(['ftpOptions', 'ossOptions']),
    ...mapGetters('system', ['reinsuranceShow'])
  },
  watch: {
    ftpOptions (newData) {
      if (!newData.find(d => d.value === this.form.form.ftpValue)) {
        this.form.form.ftpValue = ''
      }
      if (!newData.find(d => d.value === this.form.form.templateFile)) {
        this.form.form.templateFile = ''
      }
    },
    ossOptions (newData) {
      if (!newData.find(d => d.value === this.form.form.oosValue)) {
        this.form.form.oosValue = ''
      }
    }
  },
  methods: {
    ...mapActions('app', ['fetchSetting']),
    /* system-hierarchical start */
    ...mapActions('system', ['FetchFTPOptions', 'FetchOSSOptions', 'ReinsuranceShow']),
    /* system-hierarchical change
    ...mapActions('system', ['FetchFTPOptions', 'FetchOSSOptions']),
    system-hierarchical change */
    /* system-hierarchical end */
    handRadioType (item, form) {
      this.form.form.radioType = true
      if (form.isCredentialDigestSm === this.isCredentialDigestSmType) {
        this.form.form.radioType = false
      }
    },
    handRadioTypeSecurity (item, form) {
      if (form.openContentSecurity === '0' && this.reinsuranceShow.hasShow) {
        this.$confirm('关闭内容密级将会同步关闭分级保护，是否确定关闭？ ', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' }).then(() => {
          // console.log(111)
          // this.form.form.openContentSecurity = false
        }).catch(action => {
          this.form.form.openContentSecurity = '1'
          this.form.loading = false
        })
      }
    },
    // 保存按钮提交
    handleConfirm (data) {
      var codeStr = ''
      this.form.loading = true
      delete data.ispassWordPush
      delete data.passWordFisrt
      delete data.radioType
      let formData = {
        attrs: deepClone(data),
        id: this.id
      }
      /* hyt-link */
      formData.attrs.deploymentPath = this.$encode(formData.attrs.deploymentPath)
      formData.attrs.openOfficeCatalog = this.$encode(formData.attrs.openOfficeCatalog)
      formData.attrs.loginSysImgUrl = this.$encode(formData.attrs.loginSysImgUrl)
      formData.attrs.systemFlagResourceUrl = this.$encode(formData.attrs.systemFlagResourceUrl)
      formData.attrs.sysImgUrl = this.$encode(formData.attrs.sysImgUrl)
      /* system-sm-crypto start */
      var pubkeyHex = '04AF0FCC45059AA342221352E5268614F2FF7A430497B156C0DEE6E751AB44E4957E9E69299E2CD38E25985B7BD34E0E7BBA683DE4725A6A8CD07E19BFF8BEF44D'
      const sm2 = require('sm-crypto').sm2
      /* system-sm-crypto end */
      // 判断是否是出现秘密吗输入框
      if (this.form.form.radioType === true) {
        // 判断是否是国密加密方式
        if (data.isCredentialDigestSm === '1') {
          /* system-sm-crypto start */
          const cipherMode = 0 // 1 - C1C3C2，0 - C1C2C3，默认为1
          let encryptData = sm2.doEncrypt(data.initPasswd, pubkeyHex, cipherMode) // 加密结果
          codeStr = '04' + encryptData
          /* system-sm-crypto end */
        } else {
          codeStr = desEncrypt(data.initPasswd)
        }
        formData.attrs.initPasswd = codeStr
        /* system-sm-crypto start */

        this.$confirm(' 更改加密方式后，现有的前后台用户的密码都将被重置为初始密码，此操作可能会影响用户使用，是否确认要更换加密方式？ ', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' }).then(() => {
          if (data.dataBackupsMemoryType === '2') {
            formData.attrs.dataBackupsMemory = data.ftpValue
          } else if (data.dataBackupsMemoryType === '3') {
            formData.attrs.dataBackupsMemory = data.ossValue
          }
          this.$request.fetchSystemSettingUpdate(formData).then(res => {
            if (res.code === 200) {
              this.form.form.radioType = false
              this.hideFormLoading()
              this.fetchFormApi()
              this.form.loading = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.fetchSetting()
            }
          }).catch(this.hideFormLoading)
        }).catch(action => {
          this.form.loading = false
        })
        /* system-sm-crypto change
        this.$request.fetchSystemSettingUpdate(formData).then(res => {
            if (res.code === 200) {
              this.form.form.radioType = false
              this.hideFormLoading()
              this.fetchFormApi()
              this.form.loading = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.fetchSetting()
            }
          }).catch(this.hideFormLoading)
        system-sm-crypto change */
        /* system-sm-crypto end */
      } else {
        // 判断是否非国密
        if (data.isCredentialDigestSm === '1') {
          /* system-sm-crypto start */
          const cipherMode = 0 // 1 - C1C3C2，0 - C1C2C3，默认为1
          let encryptData = sm2.doEncrypt(data.initPasswd, pubkeyHex, cipherMode) // 加密结果
          codeStr = '04' + encryptData
          /* system-sm-crypto end */
        } else {
          codeStr = desEncrypt(data.initPasswd)
        }
        formData.attrs.initPasswd = codeStr
        if (data.dataBackupsMemoryType === '2') {
          formData.attrs.dataBackupsMemory = data.ftpValue
        } else if (data.dataBackupsMemoryType === '3') {
          formData.attrs.dataBackupsMemory = data.ossValue
        }
        this.$request.fetchSystemSettingUpdate(formData).then(res => {
          if (res.code === 200) {
            this.form.form.radioType = false
            this.fetchFormApi()
            this.hideFormLoading()
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.fetchSetting()
          }
        }).catch(this.hideFormLoading)
      }
    },
    fetchFormApi () {
      this.form.loading = true
      return this.$request[this.form.api](this.form.params).then(this.fetchFormCallBack)
        .then(this.hideFormLoading)
        .catch(this.hideFormLoading)
    },
    // 加载数据
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.isCredentialDigestSmType = res.data.attrs.isCredentialDigestSm
        this.form.form = Object.assign({}, this.form.form, res.data.attrs)
        this.id = res.data.id
        const { dataBackupsMemoryType, dataBackupsMemory } = res.data.attrs
        if (dataBackupsMemoryType === '2') {
          this.form.form.ftpValue = dataBackupsMemory
        } else if (dataBackupsMemoryType === '3') {
          this.form.form.ossValue = dataBackupsMemory
        }
        this.form.form.initPasswd = ''
      }
    },
    LoginUrl (item) {
      this.form.form.loginSysImgUrl = item.fileUrl
    },
    SystemUrl (item) {
      this.form.form.sysImgUrl = item.fileUrl
    }
  },
  mounted () {
    this.FetchFTPOptions()
    this.FetchOSSOptions()
    this.fetchFormApi()
    /* system-hierarchical start */
    this.ReinsuranceShow()
    /* system-hierarchical end */
  }
}
</script>

<style lang="scss">
.system-setting-container{
  font-size: 16px;
  .systemFlagResourceId{
    margin-top: -13px;
  }
}
</style>
