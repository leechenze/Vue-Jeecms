import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import selectTable from '@/components/mixins/selectTable'
import baseForm from '@/components/mixins/baseForm'
import msgDialog from '@/components/mixins/msgDialog'
import formDialog from '@/components/mixins/formDialog'
import tableDialog from '@/components/mixins/tableDialog'
import dragTree from '@/components/mixins/dragTree'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [baseHeader, baseTable, msgDialog, formDialog, searchHeader, baseForm, selectTable, tableDialog, dragTree],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          'orgname': value
        }
        this.$request.fetchOrganizeNameUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('组织名已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      addFormLoading: false,
      addForm: {
        'orgids': [],
        'parentId': null,
        'code': '',
        'name': '',
        'orgNum': '',
        'orgLeader': '',
        'phone': '',
        'orgFax': '',
        'orgRemark': '',
        'isVirtual': false
      },
      addButtons: [
        {
          text: '保存并分配权限',
          type: 'Role',
          href: '/system/organize/permission'
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
        name: [
          this.$rules.required(),
          { validator: nameUnique, trigger: ['change', 'blur'] }
        ],
        orgids: [
          this.$rules.required()
        ],
        phone: [
          this.$rules.phoneAll()
        ],
        orgFax: [
          this.$rules.phone('请输入正确的传真号码')
        ]
      },
      addFormItems: [
        {
          type: 'cascader',
          prop: 'orgids',
          props: {
            label: 'name',
            value: 'id',
            checkStrictly: true
          },
          label: '上级组织',
          width: '300px',
          placeholder: '请选择',
          options: []
        },
        {
          prop: 'name',
          label: '组织名称',
          maxlength: 50,
          placeholder: '请输入新的组织名称'
        },
        {
          prop: 'orgNum',
          label: '组织编号',
          maxlength: 50,
          placeholder: '请输入组织编号'
        },
        {
          prop: 'orgLeader',
          label: '负责人',
          maxlength: 50,
          placeholder: '请输入负责人姓名'
        },
        {
          prop: 'phone',
          label: '电话',
          maxlength: 20,
          placeholder: '请输入电话号码'
        },
        {
          prop: 'orgFax',
          label: '传真',
          maxlength: 20,
          placeholder: '请输入传真'
        },
        {
          prop: 'orgRemark',
          label: '组织描述',
          maxlength: 50,
          type: 'textarea'
        },
        {
          prop: 'isVirtual',
          label: '虚拟组织',
          type: 'radio',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        }
      ],
      type: 1,
      treeParams: { parentId: '' },
      delFormLoading: false,
      delForm: {
        'id': 1,
        'orgids': []
      },
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
            checkStrictly: true,
            label: 'name',
            value: 'id',
            placeholder: '请选择'
          },
          label: '选择组织',
          explain: '选择用户移除后归属的组织',
          width: '300px',
          options: []
        }
      ],
      tree: {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentNodeKey: this.$route.query.id,
        draggable: false
      },
      asideHeaders: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/orgs', 'POST')
          }
        ],
        showAlertIcon: false
      },
      selectRows: []
    }
  },
  watch: {
    selectRows: function (newData, oldData) {
      // 勾选父级节点联动子级节点功能，见BaseTable handleSelectRow方法
    }
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptions']),
    handleSelectKeyChange (data) {
      var ids = data.map(v => { return v[this.list.rowKey] })
      this.list.selectedKeys = ids
      this.selectRows = data
    },
    setCurrentNodeKey (id) {
      this.tree.currentNodeKey = ''
      this.$nextTick(() => {
        this.tree.currentNodeKey = Number(id)
      })
    },
    fetchTableCallBack (res) { // 表格返回数据
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
      this.hideTableLoading()
    },
    handleConfirmAdd (data, btn, type) { // 新增组织
      this.addFormLoading = true
      var params = data
      if (data.orgids[0] === 'parent') {
        params.parentId = ''
      } else {
        params.parentId = data.orgids[data.orgids.length - 1]
      }
      this.$request.fetchOrganizeCreate(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          if (this.list) {
            this.fetchTableApi()
            this.FetchOrganizeOptions(true)
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
    // 新增并分配权限
    handleConfirmRole (data, btn) {
      this.handleConfirmAdd(data, btn, 'role')
    }
  },
  computed: {
    // 获取系统设置项
    ...mapGetters(['setting', 'organizeOptions', 'user'])
  }
}
