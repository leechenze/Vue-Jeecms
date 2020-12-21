<template>
  <section class="user-detail-container">
    <base-header v-bind="headers"
      v-on:handleBack="handleBack"
      v-on:handleLink="handleHeaderLink"
      v-on:handleReset="handleHeaderReset"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    ></base-form>
    <form-dialog
    title="重置密码"
      ref="updateDialog"
      :loading="updateFormLoading"
      :form="updateForm"
      :rules="updateRules"
      :formItems="updateFormItems"
      :buttons="updateButtons"
      v-on:handleConfirm="handleConfirmUpdate"
    ></form-dialog>
    <msg-dialog
          v-bind="msgDialog"
          v-on:handleConfirm="fetchSysUsersDelete"
          v-on:handleCancel="hideMsgDialog"
        />
  </section>
</template>
<script>
import user from './user'

export default {
  name: 'userCreate',
  mixins: [user],
  data () {
    var email = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          mail: value,
          id: this.form.form.id
        }
        this.$request.fetchSysMailUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('邮箱已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    var phone = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          phone: value,
          id: this.form.form.id
        }
        this.$request.fetchSysPhoneUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('手机号码已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      backUrl: '/system/user/index',
      statusType: false,
      headers: {
        buttons: [
          {
            type: 'Reset',
            text: '重置密码',
            icon: 'zhongzhimima',
            disabled: !this._checkPermission('/users/psw', 'POST')
          },
          {
            type: 'Link',
            text: '权限分配',
            icon: 'kaiqiquanxian',
            href: '/system/user/permission',
            disabled: false,
            params: {
              id: this.$route.query.id
            }
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/users', 'DELETE')
          }
        ],
        showAlertIcon: false
      },
      form: {
        api: 'fetchSysUsersGet',
        params: {
          id: ''
        },
        form: {
          'id': '',
          'psw': '',
          'realname': '',
          'telephone': '',
          'usePhone': '',
          'email': '',
          'enabled': true,
          'roleid': [],
          'orgid': '',
          'userSecretId': ''
        },
        formItems: [
          {
            prop: 'username',
            label: '用户名：',
            maxlength: 20,
            type: 'text'
          },
          {
            type: 'cascader',
            prop: 'orgids',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            label: '所属组织：',
            placeholder: '请选择上级组织',
            options: []
          },
          {
            type: 'select',
            prop: 'roleid',
            label: '所属角色：',
            multiple: true,
            optionLabel: 'roleName',
            optionValue: 'id',
            placeholder: '请选择',
            options: []
          },
          {
            type: 'select',
            prop: 'userSecretId',
            label: '人员密级：',
            optionLabel: 'name',
            optionValue: 'id',
            placeholder: '请选择',
            options: [],
            disabled: false
          },
          {
            prop: 'realname',
            label: '真实姓名：',
            maxlength: 50,
            placeholder: '请输入您的真实姓名'
          },
          {
            prop: 'telephone',
            label: '座机号：',
            maxlength: 20
          },
          {
            prop: 'usePhone',
            label: '手机号：',
            maxlength: 11
          },
          {
            prop: 'email',
            label: '电子邮箱：',
            maxlength: 30
          },
          {
            prop: 'enabled',
            type: 'switch',
            label: '用户状态：',
            disabled: false
          },
          {
            type: 'text',
            prop: 'createUser',
            label: '创建人：'
          },
          {
            type: 'time',
            prop: 'createTime',
            label: '创建时间：'
          }
        ],
        rules: {
          username: [
            this.$rules.required()
          ],
          orgids: [
            this.$rules.required()
          ],
          userSecretId: [
            // this.$rules.required()
          ],
          email: [
            this.$rules.email(),
            { validator: email, trigger: 'blur' }
          ],
          usePhone: [
            this.$rules.mobile(),
            { validator: phone, trigger: 'blur' }
          ],
          telephone: [
            this.$rules.phone()
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/users', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    // 发送请求事件
    fetchSysUsersDelete (ids, type) {
      var params = {
        'ids': this.msgDialog.data,
        'type': this.type
      }
      this.$request.fetchSysUsersDelete(params).then(res => {
        if (res.code === 200) {
          // this.fetchFormApi()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.type = 1
          setTimeout(() => {
            this.$routerLink(this.backUrl, 'list')
          }, 500)
        } else if (res.code === 14023) {
          this.type = 2
        }
        this.hideMsgDialog()
      })
    },
    handleHeaderReset (data, btn) {
      this.updateForm.username = this.form.form.username
      this.updateForm.id = this.form.form.id
      this.$refs.updateDialog.showDialog()
    },
    // 顶部操作按钮
    handleHeaderDelete () {
      this.msgDialog.type = 'Delete'
      this.msgDialog.content = '是否确定删除所选用户？'
      this.msgDialog.data = [this.form.form.id]
      this.showMsgDialog()
    },
    handleConfirm (data) {
      this.form.loading = true
      if (data.orgids.length) {
        data.orgid = data.orgids[data.orgids.length - 1]
      }
      delete data.org
      delete data.orgId
      this.$request.fetchSysUsersUpdate(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$routerLink(this.backUrl, 'list')
          }, 500)
        }
        this.hideFormLoading()
      }).catch(this.hideFormLoading)
    },

    fetchFormCallBack (res) {
      if (res.code === 200) {
        let managerAble = res.data.managerAble
        if (!managerAble) {
          this.headers.buttons.forEach(v => {
            v.disabled = true
          })
          if (this.user.userName === res.data.username) {
            this.form.formItems.find(d => d.prop === 'orgids').disabled = true
            this.form.formItems.find(d => d.prop === 'roleid').disabled = true
            this.form.formItems.find(d => d.prop === 'enabled').disabled = true
          } else {
            this.form.submitBtns.forEach(v => {
              v.disabled = true
            })
          }
        } else {
          this.headers.buttons.forEach(v => {
            v.disabled = false
          })
          this.form.submitBtns.forEach(v => {
            v.disabled = false
          })
        }
        this.form.form = Object.assign({}, this.form.form, res.data)
        this.form.form.roleid = res.data.roleIds
        this.form.form.orgid = res.data.orgId
        this.form.form.realname = (res.data.userExt && res.data.userExt.realname) ? res.data.userExt.realname : ''
        this.form.form.telephone = (res.data.userExt && res.data.userExt.linephone) ? res.data.userExt.linephone : ''
        this.form.form.usePhone = res.data.telephone
        this.form.form.orgids = (res.data.org && res.data.org.nodeIds) ? res.data.org.nodeIds : []
        console.log(!res.data.userSecretId && this.isDisFenBao)
        this.form.formItems.find(d => d.prop === 'enabled').disabled = (!res.data.userSecretId && this.isDisFenBao) || !res.data.deleteAble
        this.form.formItems.find(d => d.prop === 'orgids').disabled = !res.data.notCurrUser
        this.form.formItems.find(d => d.prop === 'roleid').disabled = !res.data.notCurrUser
        this.headers.buttons.find(d => d.type === 'Reset').disabled = !res.data.deleteAble
        this.headers.buttons.find(d => d.type === 'Delete').disabled = !res.data.deleteAble
        this.form.submitBtns.find(d => d.subType === 'submit').disabled = !res.data.managerAble
        this.getTreeData()
      }
    },
    getTreeData () {
      if (!this.form.form.orgids || !this.form.form.orgids.length) {
        var options = [{
          name: '无',
          id: 'parent'
        }]
        this.form.formItems.find(d => d.prop === 'orgids').options = options
        this.form.form.orgids = ['parent']
      } else {
        this.form.formItems.find(d => d.prop === 'orgids').options = this.organizeOptions
      }
      // 角色
      this.form.formItems[2].options = this.roleOptions
      // 人员密级
      if (this.openContentSecurity === '1') {
        this.form.formItems[3].options = this.userSecurityOptions
      } else {
        this.form.formItems[3].hiddenKey = 'hiddenKey'
        this.form.formItems[3].hiddenValue = 'hiddenValue'
      }
    },
    getUserData () {
      const { id } = this.$route.query
      if (id) {
        this.form.params.id = id
        this.fetchFormApi()
      }
      this.FetchUserSecurityOptions()
      this.FetchOrganizeOptions()
      this.FetchRoleOptions()
    },
    // 开启双因子- 判断是否开启双因子
    getElementStatusData () {
      /* system-double start */
      this.$request.fetchDoubleElementStatus().then(res => {
        if (res.code === 200) {
          this.statusType = res.data
          if (this.statusType) {
            this.form.rules.usePhone.push(this.$rules.required())
          }
        }
      })
      /* system-double end */
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getElementStatusData()
      this.getUserData()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      this.headers.buttons.find(v => v.type === 'Link').params.id = newRoute.query.id
      if (newRoute.name === 'userCreate') {
        this.getUserData()
      }
    },
    roleOptions (newVal) {
      this.form.formItems[2].options = newVal
    },
    organizeOptions (newVal, oldVal) {
      if (newVal) {
        this.getTreeData()
      }
    }
  }
}
</script>

<style lang="scss">
.user-index-container{
  .el-dialog__body:hover::-webkit-scrollbar,.scrollbar:hover::-webkit-scrollbar{
    display: none;
  }
  .box-items{
      padding: 0 9px;
    }
}

</style>
