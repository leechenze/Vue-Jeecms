import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'
import {
  mapActions
} from 'vuex'
export default {
  mixins: [baseHeader, baseTable, formDialog, searchHeader],
  data () {
    const columns = [
      {
        prop: 'modelName',
        label: '模型名称',
        scopeType: 'handle',
        type: 'Edit'
      },
      {
        prop: 'siteId',
        label: '类型',
        formatter: (row, column, cellValue, index) => cellValue ? '本站模型' : '全站模型'
      },
      {
        prop: 'isEnable',
        label: '状态',
        scopeType: 'switch',
        type: 'Status',
        disabled: !this._checkPermission('/model/isEnable', 'PUT')
      }
    ]
    return {
      list: {
        columns,
        showIndex: true,
        api: 'fetchModelList',
        params: {
          tplType: 1,
          isGlobal: '',
          isEnable: '',
          modelName: ''
        },
        handleColumn: [
          {
            type: 'ModelItem',
            name: '模型字段',
            icon: 'ziduanguanli',
            disabled: !this._checkPermission('/model', 'GET')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/model', 'DELETE')
          }
        ],
        draggable: true
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            label: '模型类型：',
            value: 'isGlobal',
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: '1',
                label: '全站模型'
              },
              {
                value: '0',
                label: '本站模型'
              }
            ]
          },
          {
            type: 'select',
            label: '模型状态：',
            value: 'isEnable',
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: true,
                label: '启用'
              },
              {
                value: false,
                label: '禁用'
              }
            ]
          },
          {
            type: 'searchInput',
            value: 'modelName',
            placeholder: '请输入模型名称'
          }
        ]
      },
      headers: {
        buttons: [
          {
            btnType: 'dropdown',
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            options: [
              {
                value: '1',
                label: '全站模型',
                disabled: !this._checkPermission('/model/wholeSite', 'POST')
              },
              {
                value: '0',
                label: '本站模型',
                disabled: !this._checkPermission('/model/thisSite', 'POST')
              }
            ]
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/model', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      addFormLoading: false,
      addForm: {
        modelName: '',
        isEnable: true,
        tplType: 1, // 1：栏目模型，2：内容模型
        isGlobal: '', // 空：所有，1：全站，0：本站
        isGlobalLabel: ''
      },
      addFormItems: [
        {
          prop: 'modelName',
          label: '模型名称',
          placeholder: '请输入模型名称',
          maxlength: 120
        },
        {
          type: 'text',
          prop: 'isGlobalLabel',
          label: '模型类型'
        },
        {
          type: 'switch',
          prop: 'isEnable',
          label: '模型状态'
        }
      ],
      editFormLoading: false,
      editForm: {
        id: '',
        modelName: '',
        isEnable: true,
        tplType: 1, // 1：栏目模型，2：内容模型
        isGlobal: '', // 空：所有，1：全站，0：本站
        isGlobalLabel: ''
      },
      editBtns: [
        {
          text: '保存',
          type: 'Submit',
          disabled: !this._checkPermission('/model', 'PUT')
        }
      ]
    }
  },
  computed: {
    addRules () {
      return {
        modelName: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  modelName: value,
                  tplType: this.list.params.tplType,
                  isGlobal: this.addForm.isGlobal
                }
                this.$request.fetchModelUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('模型名称不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      }
    },
    editRules () {
      return {
        modelName: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  modelName: value,
                  tplType: this.list.params.tplType,
                  id: this.editForm.id,
                  isGlobal: this.editForm.isGlobal
                }
                this.$request.fetchModelUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('模型名称不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('column', ['FetchColumnModelOptions']),
    ...mapActions('content', ['FetchContentModeList']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchModelDelete([row.id])
      })
    },
    // 栏目模型详情
    handleModelItem (row, index) {
      this.$router.push(`/system/model/column/detail?id=${row.id}`)
      // window.open(`/#/model/column/detail?id=${row.id}`)
    },
    // 显示编辑弹框
    handleModelEdit (row, index) {
      row.isGlobalLabel = row.siteId ? '本站模型' : '全站模型'
      this.editForm = Object.assign({}, this.editForm, row)
      this.$refs.editDialog.showDialog()
    },
    // 点击表格状态按钮
    handleModelStatus (row, index) {
      const data = {
        id: row.id,
        isEnable: row.isEnable
      }
      this.list.loading = true
      this.$request.fetchModelEnable(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('handle')
          this.fetchTableApi()
          this.ReflushColumnModel()
        }
        this.list.loading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 提交保存数据
    handleConfirmEdit (data) {
      this.addFormLoading = true
      this.$request.fetchModelUpdate(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
          this.ReflushColumnModel()
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 顶部操作按钮-新建下拉
    handleCommand (val) {
      this.addForm.isGlobal = val
      switch (val) {
        case '1':
          this.addForm.isGlobalLabel = '全站模型'
          break
        case '0':
          this.addForm.isGlobalLabel = '本站模型'
          break
      }
      this.$refs.addDialog.showDialog()
    },
    // 顶部操作按钮-删除
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this._confirmDelete().then(() => {
          this.fetchModelDelete(this.list.selectedKeys)
        })
      } else {
        this._messageOne()
      }
    },
    // 提交新建数据
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      let api = ''
      switch (this.addForm.isGlobal) {
        case '1':
          api = 'fetchModelCreateAll'
          break
        case '0':
          api = 'fetchModelCreateThis'
          break
      }
      this.$request[api](data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('create')
          this.fetchTableApi()
          this.ReflushColumnModel()
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 删除请求
    fetchModelDelete (ids) {
      this.list.loading = true
      this.$request.fetchModelDelete(ids).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.fetchTableApi()
          this.ReflushColumnModel()
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 表格数据处理
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 拖动排序请求
    handleDragEnd (newIndex, oldIndex) {
      this.list.loading = true
      const params = {
        toId: this.list.data[newIndex].id,
        fromId: this.list.data[oldIndex].id
      }
      this.$request.fetchModelSort(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '排序成功'
          })
        } else {
          this.changeDataByDrag(oldIndex, newIndex)
        }
        this.list.loading = false
      }).catch(() => {
        this.list.loading = false
      })
    },
    ReflushColumnModel () {
      const { tplType } = this.list.params
      if (tplType === 1) {
        this.FetchColumnModelOptions(true)
      } else if (tplType === 2) {
        this.FetchContentModeList(true)
      }
    }
  }
}
