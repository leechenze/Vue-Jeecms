import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import selectTable from '@/components/mixins/selectTable'
import baseForm from '@/components/mixins/baseForm'
import msgDialog from '@/components/mixins/msgDialog'
import formDialog from '@/components/mixins/formDialog'
import tableDialog from '@/components/mixins/tableDialog'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [baseHeader, baseTable, msgDialog, formDialog, searchHeader, baseForm, selectTable, tableDialog],
  data () {
    return {
      addFormLoading: false,
      addForm: {
        'roleName': '',
        'description': '',
        'orgid': '',
        'orgids': []
      },
      addRules: {
        roleName: [
          this.$rules.required()
        ],
        orgids: [
          this.$rules.required()
        ]
      },
      addButtons: [
        {
          text: '保存并分配权限',
          type: 'Role',
          href: '/system/role/permission'
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
      addFormItems: [
        {
          prop: 'roleName',
          label: '角色名称',
          maxlength: 50,
          placeholder: '请输入角色名称'
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
          options: []
        },
        {
          prop: 'description',
          label: '角色描述',
          maxlength: 50,
          type: 'textarea'
        }
      ],
      type: 1, // 是否正常操作
      asideHeaders: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/roles', 'POST')
          }
        ],
        showAlertIcon: false
      },
      roleList: [], // 角色列表
      delFormLoading: false, // 删除弹框
      delForm: { 'id': 1, 'userId': [], 'orgids': [] },
      delRules: {
        id: [
          this.$rules.required()
        ],
        orgids: [
          this.$rules.required()
        ]
      },
      delButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ],
      delFormItems: [
        {
          type: 'cascader',
          prop: 'orgids',
          props: {
            label: 'name',
            value: 'id',
            checkStrictly: true
          },
          label: '选择组织',
          placeholder: '请选择',
          explain: '选择用户移除后归属的组织',
          width: '300px',
          options: []
        }
      ],
      activeName: ''
    }
  },
  methods: {
    ...mapActions('system', ['FetchRoleOptions', 'FetchOrganizeOptions']),
    handleSelectKeyChange (data) {
      var ids = data.map(v => { return v[this.list.rowKey] })
      this.list.selectedKeys = ids
    },
    handleConfirmAdd (data, btn, type) { // 弹窗新增角色
      this.addFormLoading = true
      var params = data
      params.orgid = data.orgids[data.orgids.length - 1]
      delete params.orgids
      this.$request.fetchSystemRoleSave(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          if (this.list) {
            this.fetchTableApi()
            // this.getRoleList()
            this.getTreeList()
            this.FetchRoleOptions(true)
          } else {
            this.fetchFormApi()
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
    // getRoleList () { // 获取角色列表
    //   this.$request.fetchSystemRoleList({ orgid: '', roleName: '' }).then(res => {
    //     if (res.code === 200) {
    //       this.roleList = res.data.content
    //       this.activeName = res.data.content[0].roleName
    //     }
    //   })
    // },
    // 新增并分配权限
    handleConfirmRole (data, btn) {
      this.handleConfirmAdd(data, btn, 'role')
    }
  },
  computed: {
    // 获取系统设置项
    ...mapGetters(['setting', 'organizeOptions', 'user', 'roleOptions'])
  },
  mounted () {
    this.FetchRoleOptions()
  }
}
