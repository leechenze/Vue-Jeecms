<template>
  <section  class="config-message-detail-container">
    <base-header v-bind="headers"/>
    <base-form
      ref="baseForm"
      v-bind="form"
      :submitBtns="[]"
    ></base-form>
    <el-tabs v-model="activeTabName" class="tabs-box" @tab-click="handleTabClick">
      <el-tab-pane label="邮箱" name="email">
          <base-form class="tabs-froms"
            ref="emailForm"
            v-bind="emailForm"
            @handleConfirm="handleConfirm"
          ></base-form>
      </el-tab-pane>
      <el-tab-pane label="手机短信" name="phone">
          <base-form class="tabs-froms"
            ref="phoneForm"
            v-bind="phoneForm"
            @handleSwitchisOpen="handleSwitch"
            @handleConfirm="handleConfirm"
          ></base-form>
      </el-tab-pane>
      <el-tab-pane label="站内信" name="mail" v-if="isMail" >
          <base-form class="tabs-froms"
            ref="mailForm"
            v-bind="mailForm"
            @handleConfirm="handleConfirm"
          ></base-form>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
// import { loopOptions } from '@/utils'

export default {
  name: 'configInformationDetail',
  mixins: [baseForm, baseHeader],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          mesCode: value,
          id: this.form.form.id
        }
        this.$request.fetchMessageTplMesCodeUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('模板标识已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      listPhone: [],
      headers: {
        title: '操作说明',
        content: '操作说明'
      },
      allOption: [
        {
          label: '全部',
          value: ''
        }
      ],
      form: {
        showSubmitButton: false,
        api: 'fetchMessageTplGet',
        params: {
          id: ''
        },
        form: {
          'id': '',
          'mesTitle': '',
          'mesCode': '',
          'remark': ''
        },
        formItems: [
          {
            prop: 'mesTitle',
            label: '模板名称：',
            maxlength: 50,
            placeholder: '请输入模板名称'
          },
          {
            prop: 'mesCode',
            label: '模板标识：',
            maxlength: 50,
            placeholder: '请输入模板标识'
          },
          {
            prop: 'remark',
            label: '模板描述：',
            maxlength: 50,
            type: 'textarea',
            autosize: { minRows: 3 }
          }
        ],
        rules: {
          mesTitle: [
            this.$rules.required()
          ],
          mesCode: [
            this.$rules.required(),
            { validator: nameUnique, trigger: 'blur' }
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/messageTpl', this.linkType === 'add' ? 'POST' : 'PUT')
        }]
      },
      emailForm: {
        form: {
          'extendedField': '',
          'isOpen': true,
          'mesContent': '',
          'mesTitle': '',
          'mesType': 2,
          'explainEdit': false
        },
        formItems: [
          {
            prop: 'isOpen',
            label: '状态：',
            type: 'switch'
          },
          {
            prop: 'mesTitle',
            label: '邮件主题：',
            maxlength: 50,
            hiddenKey: 'isOpen',
            hiddenValue: true,
            placeholder: '请输入邮件主题'
          },
          {
            prop: 'mesContent',
            label: '邮件正文：',
            hiddenKey: 'isOpen',
            hiddenValue: true,
            explain: '',
            maxlength: 150,
            placeholder: '请输入邮件正文',
            type: 'textarea',
            autosize: { minRows: 3 }
          },
          {
            prop: 'extendedField',
            label: '提示信息：',
            maxlength: 300,
            hiddenKeys: ['isOpen', 'explainEdit'],
            hiddenValues: [true, true],
            type: 'textarea',
            autosize: { minRows: 3 },
            placeholder: '新建后，提示信息显示在邮件正文下方'

          }
        ],
        rules: {
          isOpen: [
            this.$rules.required()
          ],
          mesTitle: [
            this.$rules.required()
          ],
          mesContent: [
            this.$rules.required()
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit'
          // disabled: !this._checkPermission('/messageTpl', this.linkType === 'add' ? 'POST' : 'PUT')
        }]
      },
      phoneForm: {
        form: {
          'extendedField': '',
          'isOpen': false,
          'mesType': 3,
          'tplId': '',
          'tplName': '',
          'explainEdit': false
        },
        formItems: [
          {
            prop: 'isOpen',
            label: '状态：',
            type: 'switch'
          },
          {
            prop: 'tplId',
            type: 'select',
            label: '短信模板：',
            maxlength: 50,
            placeholder: '请选择',
            hiddenKey: 'isOpen',
            hiddenValue: true,
            optionLabel: 'name',
            optionValue: 'id',
            options: []
            // placeholder: '请输入模板ID'
          },
          {
            prop: 'extendedField',
            label: '提示信息：',
            maxlength: 300,
            hiddenKeys: ['isOpen', 'explainEdit'],
            hiddenValues: [true, true],
            type: 'textarea',
            autosize: { minRows: 3 },
            placeholder: '新建后，提示信息显示在模板ID下方'
          }
        ],
        rules: {
          tplId: [
            this.$rules.required()
          ],
          // tplId: [
          //   this.$rules.required()
          // ],
          isOpen: [
            this.$rules.required()
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit'
          // disabled: !this._checkPermission('/messageTpl', 'POST')
        }]
      },
      mailForm: {
        form: {
          'extendedField': '',
          'isOpen': true,
          'mesContent': '',
          'mesTitle': '',
          'mesType': 1,
          'explainEdit': false
        },
        formItems: [
          {
            prop: 'isOpen',
            label: '状态：',
            type: 'switch'
          },
          {
            prop: 'mesTitle',
            label: '标题：',
            maxlength: 50,
            hiddenKey: 'isOpen',
            hiddenValue: true,
            placeholder: '请输入标题'
          },
          {
            prop: 'mesContent',
            label: '内容：',
            hiddenKey: 'isOpen',
            hiddenValue: true,
            explain: '',
            maxlength: 150,
            type: 'textarea',
            autosize: { minRows: 3 }
          },
          {
            prop: 'extendedField',
            label: '提示信息：',
            maxlength: 300,
            hiddenKeys: ['isOpen', 'explainEdit'],
            hiddenValues: [true, true],
            type: 'textarea',
            autosize: { minRows: 3 },
            placeholder: '新建后，提示信息显示在站内信内容下方'

          }
        ],
        rules: {
          isOpen: [
            this.$rules.required()
          ],
          mesTitle: [
            this.$rules.required()
          ],
          mesContent: [
            this.$rules.required()
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit'
          // disabled: !this._checkPermission('/messageTpl', this.linkType === 'add' ? 'POST' : 'PUT')
        }]
      },
      activeTabName: 'email',
      linkType: 'add',
      tplType: 0,
      isMail: false
    }
  },
  inject: ['removeTab', 'reflushCurrentPage'],
  methods: {
    handleTabClick (data) {
      if (data.paneName === 'phone') {
        // this.getMessageTplPhoneListPage()
      }
    },
    handleConfirm (data) {
      const p1 = new Promise((resolve, reject) => {
        this.$refs['baseForm'].$refs['form'].validate(valid => {
          if (valid) resolve()
        })
      })
      const p2 = new Promise((resolve, reject) => {
        this.$refs['emailForm'].$refs['form'].validate(valid => {
          if (valid) {
            resolve()
          } else {
            this.activeTabName = 'email'
          }
        })
      })
      const p3 = new Promise((resolve, reject) => {
        this.$refs['phoneForm'].$refs['form'].validate(valid => {
          if (valid) {
            resolve()
          } else {
            this.activeTabName = 'phone'
          }
        })
      })
      const p4 = new Promise((resolve, reject) => {
        if (this.isMail) {
          this.$refs['mailForm'].$refs['form'].validate(valid => {
            if (valid) {
              resolve()
            } else {
              this.activeTabName = 'mail'
            }
          })
        } else {
          resolve()
        }
      })

      Promise.all([p1, p2, p3, p4]).then(() => {
        var params = {
          mesCode: this.form.form.mesCode,
          mesTitle: this.form.form.mesTitle,
          remark: this.form.form.remark,
          tplType: this.tplType,
          details: []
        }
        for (let i in this.listPhone) {
          if (this.listPhone[i].id === this.phoneForm.form.tplId) {
            this.phoneForm.form.tplId = this.listPhone[i].id
            this.phoneForm.form.tplName = this.listPhone[i].name
          }
        }
        params.details.push(this.emailForm.form)
        params.details.push(this.phoneForm.form)
        if (this.isMail) {
          params.details.push(this.mailForm.form)
        }
        if (this.linkType === 'add') {
          this.$request.fetchMessageTplAdd(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$nextTick(() => {
                this.removeTab(this.$route.fullPath)
                this.$routerLink('/config/information/index', 'list', { tplType: JSON.stringify(this.tplType) })
              })
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        } else {
          params.id = this.form.form.id
          params.details = params.details.map(t => {
            return t
          })
          this.$request.fetchMessageTplPut(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              setTimeout(() => {
                this.removeTab(this.$route.fullPath)
                this.$routerLink('/config/information/index', 'list', { tplType: JSON.stringify(this.tplType) })
              }, 500)
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = Object.assign(this.form.form, res.data)
        let arr = ['', 'mailForm', 'emailForm', 'phoneForm']
        let arr2 = ['', 'mesContent', 'tplId', 'mesContent']
        res.data.details.forEach(v => {
          this[arr[v.mesType]].form = v
          this[arr[v.mesType]].form.id = v.id
          console.log(v.tplId)
          this[arr[v.mesType]].form.tplId = Number(v.tplId) || ''
          // this[arr[v.mesType]].form.tplId = Number(v.tplId)
          this.phoneForm.formItems.find(d => d.prop === 'tplId').options = this.listPhone
          if (this.$env === 'dev') {
            this[arr[v.mesType]].form.explainEdit = true
          } else {
            this.form.formItems.find(v => v.prop === 'mesCode').type = 'text'
            let obj = this.emailForm.formItems.find(v => v.prop === arr2[v.mesType])
            if (obj) {
              this.emailForm.formItems.find(v => v.prop === arr2[v.mesType]).explain = this.emailForm.form.extendedField
            }
          }
        })
      }
    },
    getFormData () {
      const { id, status, type } = this.$route.query
      this.linkType = type
      this.emailForm.submitBtns[0].disabled = !this._checkPermission('/messageTpl', this.linkType === 'add' ? 'POST' : 'PUT')
      this.phoneForm.submitBtns[0].disabled = !this._checkPermission('/messageTpl', this.linkType === 'add' ? 'POST' : 'PUT')
      this.mailForm.submitBtns[0].disabled = !this._checkPermission('/messageTpl', this.linkType === 'add' ? 'POST' : 'PUT')
      this.form.params.id = id
      if (type !== 'add') {
        this.fetchFormApi()
      } else {
        if (this.form.form.id) {
          this.reflushCurrentPage(this.$route.fullPath)
        } else {
          try {
            this.$refs['baseForm'].$refs['form'].clearValidate()
            this.$refs['baseForm'].$refs['form'].resetFields()
            this.$refs['emailForm'].$refs['form'].clearValidate()
            this.$refs['emailForm'].$refs['form'].resetFields()
            this.$refs['phoneForm'].$refs['form'].clearValidate()
            this.$refs['phoneForm'].$refs['form'].resetFields()
            this.$refs['mailForm'].$refs['form'].clearValidate()
            this.$refs['mailForm'].$refs['form'].resetFields()
          } catch (error) {}
        }
      }
      this.form.formItems.find(d => d.prop === 'mesCode').disabled = type !== 'add'
      this.tplType = status === 'member' ? 1 : 2
      if (id && id !== this.form.params.id) {
        this.form.params.id = id
        // this.fetchFormApi()
      }
      if (this.$env === 'dev') {
        this.emailForm.form.explainEdit = true
        this.phoneForm.form.explainEdit = true
        this.mailForm.form.explainEdit = true
      }
      if (status === 'user') {
        this.isMail = true
      } else {
        this.isMail = false
      }
    },
    async getMessageTplPhoneListPage () {
      let list = await this.$request.fetchMessageTplPhoneListPage()
      this.listPhone = list.data
      this.phoneForm.formItems.find(d => d.prop === 'tplId').options = list.data
    },
    handleSwitch (prop, item, e) {
      if (e === true) {
        this.$request.fetchMessaggetHaveNumber().then(res => {
          if (res.data === false) {
            this.$confirm('你的网站未购买短信服务或短信服务余量为0, 请购买后再开启短信模板', '提示', {
              confirmButtonText: '去购买',
              cancelButtonText: '稍后购买',
              type: 'warning'
            }).then(() => {
              this.$routerLink('/service/index')
            }).catch(() => {
              this.phoneForm.form.isOpen = false
            })
          }
        })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getFormData()
    })
  },
  created () {
    this.getMessageTplPhoneListPage()
  },
  activated () {
    const { id, status } = this.$route.query
    if (id) {
      this.form.id = id
    }
    if (id || status !== this.form.status) {
      this.getFormData()
    }
  }

}
</script>
<style lang="scss" scoped>
  .tabs-froms{
    margin-top: 10px;
  }
</style>
