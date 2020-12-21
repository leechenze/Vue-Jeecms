import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import baseForm from '@/components/mixins/baseForm'
import dragTree from '@/components/mixins/dragTree'
import tableDialog from '@/components/mixins/tableDialog'
import msgDialog from '@/components/mixins/msgDialog'
import {
  mapActions
} from 'vuex'
import { deepClone } from '@/utils'

export default {
  mixins: [baseHeader, baseTable, formDialog, baseForm, dragTree, tableDialog, msgDialog],
  data () {
    return {
      tree: {
        loading: false,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentNodeKey: '',
        draggable: false,
        showLevel: false
      },
      addFormLoading: false,
      addForm: {
        alias: [],
        isOpen: 1,
        name: '',
        path: '',
        description: '',
        protocol: 'http://',
        domain: ''
      },
      addButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ],
      addRules: {
        name: [this.$rules.required()],
        path: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  path: this.$encode(value)
                }
                this.$request.fetchSitesPathUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    this.$set(this.addForm, rule.field, value + '1')
                    callback(new Error('站点目录不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ],
        protocol: [this.$rules.required()],
        isOpen: [this.$rules.required()],
        domain: [this.$rules.required()]
      },
      addFormItems: [
        {
          prop: 'parentName',
          label: '上级站点',
          maxlength: 50,
          disabled: true,
          placeholder: '请选择上级站点'
        },
        {
          prop: 'name',
          label: '站点名称',
          maxlength: 20,
          placeholder: '请输入站点名称'
        },
        {
          prop: 'path',
          label: '站点目录',
          maxlength: 50,
          placeholder: '请输入站点目录'
        },
        {
          type: 'slot',
          prop: 'domain',
          label: '域名',
          maxlength: 50,
          placeholder: '请输入站点域名',
          options: [
            {
              value: 'http://',
              label: 'http://'
            },
            {
              value: 'https://',
              label: 'https://'
            }
          ]
        },
        // {
        //   type: 'imageUpload',
        //   prop: 'iconId',
        //   label: '站点标志',
        //   maxlength: 50,
        //   placeholder: '请输入站点标志',
        //   option: {
        //     width: '32',
        //     height: '32'
        //   }
        // },
        {
          type: 'textarea',
          prop: 'description',
          label: '站点描述',
          height: '71px',
          maxlength: 500,
          placeholder: '请输入站点描述'
        },
        {
          type: 'radio',
          prop: 'isOpen',
          label: '站点状态',
          options: [{
            label: '开启',
            value: 1
          },
          {
            label: '关闭',
            value: 0
          }]
        },
        {
          prop: 'seoTitle',
          label: 'SEO标题',
          maxlength: 20,
          placeholder: '请输入SEO标题'
        },
        {
          prop: 'seoKeyword',
          label: 'SEO关键字',
          maxlength: 50,
          placeholder: '请输入SEO关键字'
        },
        {
          prop: 'seoDescription',
          label: 'SEO描述',
          maxlength: 500,
          placeholder: '请输入SEO描述'
        }
      ],
      tablelist: {
        title: '站点回收站',
        api: 'fetchSitesRecycle',
        showSelection: true,
        showIndex: false,
        showPagination: false,
        columns: [
          {
            prop: 'name',
            label: '站点名称'
          },
          {
            prop: 'updateUser',
            label: '删除者'
          },
          {
            scopeType: 'time',
            prop: 'updateTime',
            label: '删除时间'
          }
        ],
        searchHeader: {
          searchItems: [
            {
              type: 'henderBtn',
              btnType: 'Delete',
              icon: 'delete',
              text: '彻底删除',
              disabled: !this._checkPermission('/sites/recycle', 'DELETE')
            },
            {
              type: 'henderBtn',
              btnType: 'Restore',
              icon: 'huanyuan',
              text: '还原',
              disabled: !this._checkPermission('/sites/restore', 'POST')
            }
          ]
        },
        buttons: []
      }
    }
  },
  computed: {
    siteId () {
      return window.localStorage.getItem('siteId')
    }
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    // 设置当前站点
    setSiteId (id) {
      this.tree.currentNodeKey = id ? Number(id) : ''
    },
    // 获取树结构
    fetchSiteseList () {
      console.log('99')
      this.tree.loading = true
      this.$request.fetchSiteseList().then(res => {
        if (res.code === 200) {
          const loop = function (list) {
            if (list instanceof Array && list.length) {
              return list.map((d, i, arr) => {
                if (i > 0) d.prevId = arr[i - 1].id
                if (arr.length > i + 1) d.nextId = arr[i + 1].id
                if (d.children) {
                  d.children = loop(d.children)
                }
                return d
              })
            }
            return []
          }
          this.tree.data = loop(res.data)
        }
      }).then(() => {
        this.tree.loading = false
      }).catch(() => {
        this.tree.loading = false
      })
    },
    // 添加子站点
    addFormHref () {
      var newHerf = { herf: '' }
      this.addForm.alias.push(newHerf)
    },
    // 删除子站点
    addFormDelete (index) {
      this.addForm.alias.splice(index, 1)
    },
    // 新建保存
    handleConfirmAdd (data) {
      data.domainAlias = ''
      if (data.alias.length > 0) {
        for (var i = 0; i < data.alias.length; i++) {
          if (i === data.alias.length - 1) {
            data.domainAlias += data.alias[i].herf
          } else {
            data.domainAlias += data.alias[i].herf += ','
          }
        }
      }
      let params = deepClone(data)
      params.protocol = this.$encode(data.protocol)
      params.url = this.$encode(data.url)
      params.domain = this.$encode(data.domain)
      params.path = this.$encode(data.path)
      params.previewUrl = this.$encode(data.previewUrl)
      params.domainAlias = this.$encode(data.domainAlias)
      this.$request.fetchSitesCreate(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          if (this.id === this.siteId) this.FetchSitesOwnsite(true)
          this.fetchSiteseList()
          this.fetchTableApi()
          this.$router.replace({
            name: 'configSiteDetail',
            query: {
              id: res.data,
              isAdd: true
            }
          })
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    handleHeaderRecycle () {
      this.$refs.recycleBin.showDialog()
      this.fetchSitesRecycle()
    },
    // 选择删除
    recycleBinDelete (item) {
      // console.log(this.tablelist.selectedKeys)
      if (this.tablelist.selectedKeys.length === 0) {
        this.$message('至少选择一项进行操作')
        return false
      }
      this.msgDialog.type = 'DeleteOne'
      this.msgDialog.content = '删除后不可恢复，确认删除选中的文件吗？'
      this.msgDialog.data = this.tablelist.selectedKeys
      this.showMsgDialog()
    },
    // 弹出框删除操作
    handleConfirmMsg (type) {
      var ids = this.tablelist.selectedKeys
      this.$request.fetchSitesRecycleDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$refs.recycleBin.handleCancel()
        }
      })
    },
    // 回收站还原
    recycleBinRestore () {
      if (this.tablelist.selectedKeys.length === 0) {
        this.$message('至少选择一项进行操作')
        return false
      }
      var ids = this.tablelist.selectedKeys
      this.$request.fetchSitesRestore({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '还原成功',
            type: 'success'
          })
          this.$refs.recycleBin.handleCancel()
          this.fetchSiteseList()
          this.fetchTableApi()
          if (this.id === this.siteId) this.FetchSitesOwnsite(true)
        }
      })
    },
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data
      }
    },
    fetchSitesRecycle () {
      this.$request.fetchSitesRecycle().then(res => {
        if (res.code === 200) {
          this.tablelist.data = res.data
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 排序
    handleSort (data, type) {
      this.tree.loading = true
      let params = {
        fromId: data.id
      }
      if (type === 'up') {
        params.nextId = data.prevId
      } else {
        params.toId = data.nextId
      }
      this.$request.fetchsitesSort(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('sort')
          this.fetchSiteseList()
          this.FetchSitesOwnsite(true)
        }
        this.tree.loading = false
      }).catch(() => {
        this.tree.loading = false
      })
    }
  }
}
