import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import selectTable from '@/components/mixins/selectTable'
import baseForm from '@/components/mixins/baseForm'
import msgDialog from '@/components/mixins/msgDialog'
import formDialog from '@/components/mixins/formDialog'
import { loginType } from '@/utils/index'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [baseHeader, baseTable, msgDialog, formDialog, searchHeader, baseForm, selectTable],
  data () {
    var pswRepeat = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.updateForm.psw) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var pswRepeat2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.psw) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var username = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        var params = {
          username: value
        }
        this.$request.fetchSysUsernameUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('用户名已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    var email = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          mail: value
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
          phone: value
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
    var passoword = async (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback()
      } else {
        let a = await loginType(value)
        var params = {
          psw: a,
          username: ''
        }
        await this.$request.fetchSysPwdUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error(res.message))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    var IsEqually = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (this.setting.attrs.passIsEqually === '0') {
          if (this.addForm.psw === this.addForm.username) {
            callback(new Error('密码与用户名不允许相同'))
          }
          callback()
        } else {
          callback()
        }
      }
    }
    var IsEqually2 = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (this.setting.attrs.passIsEqually === '0') {
          if (this.updateForm.psw === this.updateForm.username) {
            callback(new Error('密码与用户名不允许相同'))
          }
          callback()
        } else {
          callback()
        }
      }
    }
    return {
      isDisFenBao: false,
      openSecurity: null,
      updateFormLoading: false,
      updateForm: {
        'username': '',
        'psw': '',
        'psw2': '',
        'id': '',
        'enabled': ''
      },
      updateRules: {
        psw: [
          this.$rules.required(),
          { validator: passoword, trigger: 'blur' },
          { validator: IsEqually2, trigger: 'blur' }
        ],
        psw2: [
          this.$rules.required(),
          { validator: pswRepeat, trigger: 'blur' }
        ]
      },
      updateFormItems: [
        {
          prop: 'username',
          label: '用户名',
          maxlength: 20,
          type: 'text'
        },
        {
          prop: 'psw',
          label: '密码',
          type: 'password',
          maxlength: 50,
          autocomplete: 'off',
          placeholder: '请输入您的密码'
        },
        {
          prop: 'psw2',
          label: '重复密码',
          type: 'password',
          autocomplete: 'off',
          placeholder: '请再次输入您的密码'
        }
      ],
      updateButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ],
      addFormLoading: false,
      addForm: {
        'username': '',
        'psw': '',
        'realname': '',
        'telephone': '',
        'usePhone': '',
        'email': '',
        'enabled': true,
        'roleid': [],
        'orgid': '',
        'orgids': [],
        'userSecretId': '',
        'psw2': ''
      },
      addButtons: [
        {
          text: '保存并分配权限',
          type: 'Role',
          href: '/system/user/permission'
        },
        {
          text: '保存并继续新建',
          type: 'Submit',
          keepAlive: true
        },
        {
          text: '保存',
          type: 'Submit'
        }
      ],
      addRules: {
        username: [
          this.$rules.required(),
          { validator: username, trigger: 'blur' },
          { validator: IsEqually, trigger: 'blur' }
        ],
        psw: [
          this.$rules.required(),
          { validator: passoword, trigger: 'blur' },
          { validator: IsEqually, trigger: 'blur' }
        ],
        psw2: [
          this.$rules.required(),
          { validator: pswRepeat2, trigger: 'blur' }
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
      addFormItems: [
        {
          prop: 'username',
          label: '用户名',
          placeholder: '请输入您的用户名',
          maxlength: 20
        },
        {
          prop: 'psw',
          label: '密码',
          type: 'password',
          maxlength: 50,
          placeholder: '请输入您的密码'
        },
        {
          prop: 'psw2',
          label: '重复密码',
          type: 'password',
          placeholder: '请再次输入您的密码'
        },
        {
          type: 'cascader',
          prop: 'orgids',
          props: {
            label: 'name',
            value: 'id',
            checkStrictly: true
          },
          label: '所属组织',
          placeholder: '请选择',
          width: '300px',
          options: []
        },
        {
          type: 'select',
          prop: 'roleid',
          multiple: true,
          label: '所属角色',
          placeholder: '请选择',
          optionLabel: 'roleName',
          optionValue: 'id',
          width: '300px',
          options: []
        },
        {
          type: 'select',
          prop: 'userSecretId',
          label: '人员密级',
          optionLabel: 'name',
          optionValue: 'id',
          placeholder: '请选择',
          width: '300px',
          options: [
            {
              label: '所有',
              value: ''
            }
          ],
          disabled: false
        },
        {
          prop: 'realname',
          label: '真实姓名',
          maxlength: 50,
          placeholder: '请输入您的真实姓名'
        },
        {
          prop: 'telephone',
          label: '座机',
          maxlength: 20,
          placeholder: '请输入您的座机号'
        },
        {
          prop: 'usePhone',
          label: '手机',
          maxlength: 20,
          placeholder: '请输入您的手机号码'
        },
        {
          prop: 'email',
          label: '电子邮箱',
          maxlength: 30,
          placeholder: '请输入您的电子邮箱'
        },
        {
          prop: 'enabled',
          label: '用户状态',
          type: 'switch',
          disabled: false
        }
      ],
      type: 1

    }
  },
  methods: {
    /* system-hierarchical start */
    ...mapActions('system', ['FetchUserSecurityOptions', 'FetchOrganizeOptions', 'FetchRoleOptions', 'ReinsuranceShow']),
    /* system-hierarchical change
    ...mapActions('system', ['FetchUserSecurityOptions', 'FetchOrganizeOptions', 'FetchRoleOptions']),
    system-hierarchical change */
    /* system-hierarchical end */
    handleSelectKeyChange (data) {
      let isDisabled = false
      let show = false
      var ids = data.map(v => {
        if (!v.deleteAble) {
          isDisabled = true
        }
        console.log(this.isDisFenBao && !v.userSecretName)
        if (this.isDisFenBao && !v.userSecretName) {
          show = true
        }
        return v[this.list.rowKey]
      })
      console.log(show)
      this.headers.buttons.find(t => t.type === 'Enable').disabled = show || !this._checkPermission('/users/on', 'POST') || isDisabled
      this.headers.buttons.find(t => t.type === 'Disable').disabled = show || !this._checkPermission('/users/off', 'POST') || isDisabled
      this.headers.buttons.find(t => t.type === 'Delete').disabled = !this._checkPermission('/users', 'DELETE') || isDisabled
      this.list.selectedKeys = ids
    },
    // 新增并分配权限
    handleConfirmRole (data, btn) {
      this.handleConfirmAdd(data, btn, 'role')
    },
    async handleConfirmUpdate (data, btn) { // 密码重置
      this.updateFormLoading = true
      var params = data
      params.psw = await loginType(data.psw)
      delete params.psw2
      delete params.username
      this.$request.fetchSysUsersPwd(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          if (this.list) {
            this.fetchTableApi()
          } else {
            this.fetchaFormApi()
          }
        }
        this.updateFormLoading = false
      }).catch(() => {
        this.updateFormLoading = false
      })
    },
    async handleConfirmAdd (data, btn, type) { // 新增用户
      this.addFormLoading = true
      var params = Object.assign({}, data)
      params.orgid = data.orgids[data.orgids.length - 1]
      params.psw = await loginType(data.psw)
      delete params.orgids
      delete params.psw2
      await this.$request.fetchSysUsersAdd(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          if (this.list) {
            this.fetchTableApi()
          } else {
            this.fetchaFormApi()
          }
          if (type === 'role') {
            setTimeout(() => {
              this.$routerLink(btn.href, btn.type, { id: res.data.id })
            }, 500)
          }
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 开启双因子- 判断是否开启双因子
    getElementStatusData () {
      /* system-double start */
      this.$request.fetchDoubleElementStatus().then(res => {
        if (res.code === 200) {
          this.statusType = res.data
          if (this.statusType) {
            this.addRules.usePhone.push(this.$rules.required())
          }
        }
      })
      /* system-double end */
    },
    /* system-hierarchical start */
    /* 分级管理 start */
    // 设置分级保护管理
    setDis () {
      console.log(this.reinsuranceShow)
      let show = this.reinsuranceShow.hasShow
      // console.log(this.addFormItems)
      if (show) {
        this.isDisFenBao = true
        if (this.headers.buttons.find(t => t.type === 'Enable')) {
          this.headers.buttons.find(t => t.type === 'Enable').disabled = true
          this.headers.buttons.find(t => t.type === 'Disable').disabled = true
        }
        if (this.form.formItems.find(t => t.prop === 'userSecretId')) {
          this.form.formItems.find(t => t.prop === 'userSecretId').disabled = true
          this.form.formItems.find(t => t.prop === 'enabled').disabled = !this.form.form.userSecretId
        }

        if (this.addFormItems.find(t => t.prop === 'userSecretId')) {
          this.addFormItems.find(t => t.prop === 'userSecretId').disabled = true
          this.addFormItems.find(t => t.prop === 'enabled').disabled = true
        }
      } else {
        this.isDisFenBao = false
        this.headers.buttons.find(t => t.type === 'Enable').disabled = !this._checkPermission('/users/on', 'POST')
        this.headers.buttons.find(t => t.type === 'Disable').disabled = !this._checkPermission('/users/off', 'POST')
      }
    }
    /* 分级管理 end */
    /* system-hierarchical end */
  },
  /* 分级管理 start */
  activated () {
    /* system-hierarchical start */
    this.ReinsuranceShow()
    /* system-hierarchical end */
  },
  /* 分级管理 end */
  mounted () {
    /* system-hierarchical start */
    this.ReinsuranceShow()
    /* system-hierarchical end */
    this.getElementStatusData()
  },
  watch: {
    reinsuranceShow (newVal) {
      this.setDis()
    }
  },
  computed: {
    // 获取系统设置项
    ...mapGetters('system', ['reinsuranceShow']),
    ...mapGetters(['setting', 'system', 'user', 'organizeOptions', 'roleOptions']),
    openContentSecurity () {
      const { openContentSecurity } = this.setting.attrs || {}
      return openContentSecurity
    },
    userSecurityOptions () {
      return this.system.userSecurityOptions
    }
  }
}
