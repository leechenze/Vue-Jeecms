import formDialog from '@/components/mixins/formDialog'
import baseTree from '@/components/mixins/baseTree'
import baseHeader from '@/components/mixins/baseHeader'
import { mapGetters, mapActions } from 'vuex'
import { getTreeIds } from '@/utils'

export default {
  name: 'columnTree',
  mixins: [baseHeader, formDialog, baseTree],
  data () {
    return {
      tabs: [],
      dataType: 2,
      searchValue: '',
      columnId: null,
      columnData: {},
      currentTab: 'base',
      tree: {
        expandOnClickNode: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      },
      addFormLoading: false,
      addForm: {
        modelId: '',
        channelParentId: [],
        channelName: '',
        channelPath: ''
      },
      addFormItems: [{
        prop: 'channelParentId',
        label: '上级栏目',
        type: 'cascader',
        options: 'getColumnOptions'
      },
      {
        prop: 'modelId',
        label: '栏目模型',
        type: 'select',
        options: 'columnModelOptions'
      },
      {
        prop: 'channelName',
        label: '栏目名称',
        maxlength: 15
      },
      {
        prop: 'channelPath',
        label: '访问路径',
        maxlength: 30
      }
      ]
    }
  },
  watch: {
    'addForm.modelId': function (newData, oldData) {
      if (newData && newData !== oldData) {
        const that = this
        const form = { ...this.addForm }
        that.$request.fetchChannelPlus(newData).then(res => {
          if (res.code === 200) {
            if (res.data.enableJson && res.data.enableJson.formListBase instanceof Array) {
              res.data.enableJson.formListBase.forEach(d => {
                if (d.value) {
                  let v = d.value
                  let item = that.addFormItems.find(f => f.prop === v.name)
                  if (item) {
                    item.maxlength = v.max || ''
                    item.placeholder = v.placeholder || ''
                    item.explain = v.tip || ''
                  }
                }
              })
            }

            that.$refs.addDialog.$refs.form.resetFields()
            that.addForm = form
          }
        })
      } else {
        this.addFormItems.forEach(item => {
          item.placeholder = ''
          item.explain = ''
        })
      }
    },
    'addForm.channelName': function (newData, oldData) {
      if (newData && newData !== oldData) {
        this.$request.fetchPinyin({ text: newData }).then(r => {
          if (r.code === 200) {
            this.addForm.channelPath = r.data
          }
        })
      } else {
        this.addForm.channelPath = ''
      }
    }
  },
  computed: {
    ...mapGetters(['columnOptions', 'columnModelOptions']),
    ...mapGetters('column', ['detail', 'detailLoading']),
    columnHeaders () {
      return {}
    },
    getTabs () {
      return this.tabs
    },
    getColumnOptions () {
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          return data.map(d => {
            if (!d.createChildAble) {
              d.disabled = true
            }
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
            return d
          })
        }
      }
      return [{
        label: '无',
        value: ''
      }, ...(loop(this.columnOptions) || [])]
    },
    addRules () {
      return {
        channelParentId: [
          this.$rules.required()
        ],
        modelId: [
          this.$rules.required()
        ],
        channelName: [
          this.$rules.required(),
          this.$rules.cnEnNum(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  name: value
                }
                this.$request.fetchChannelUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('栏目名称不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ],
        channelPath: [
          this.$rules.required(),
          this.$rules.enNum(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  path: value
                }
                this.$request.fetchChannelUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    this.$set(this.addForm, rule.field, value + '1')
                    callback(new Error('栏目路径不能重复'))
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
    ...mapActions('column', ['FetchColumnOptions', 'FetchColumnModelOptions']),
    getTreeIds,
    getColumnDetail () {},
    // 点击站点
    handleClick (data) {
      if (!data.viewAble || !this._checkPermission('/channel', 'GET')) {
        this.$message.error('该站点没有查看权限')
      }
      this.setColumnId('')
      this.setColumnId(Number(data.id))
      this.columnData = { ...data }
      this.addForm.channelParentId = this.getTreeIds(this.columnOptions, data.id)
      this.getColumnDetail(data.id)
    },
    // 搜索
    handleSearch () {
      this.fetchChannelTree()
    },
    // 获取栏目树结构
    fetchChannelTree () {
      this.tree.loading = true
      const params = {
        name: this.searchValue
      }
      const sortPerm = this._checkPermission('/channel/sort', 'PUT')
      return this.$request.fetchChannelTree(params).then(res => {
        if (res.code === 200) {
          const loop = function (data) {
            if (data instanceof Array && data.length) {
              return data.map((d, i, arr) => {
                if (i > 0 && d.editAble && sortPerm) d.prevId = arr[i - 1].id
                if (arr.length > i + 1 && d.editAble && sortPerm) d.nextId = arr[i + 1].id

                if (d.children instanceof Array && d.children.length) {
                  loop(d.children)
                }
                return d
              })
            }
          }
          this.tree.data = loop(res.data)
        }
        this.tree.loading = false
        return res
      }).catch(() => {
        this.tree.loading = false
      })
    },
    // 参数过滤
    handleFilterParams (params) {
      const channelParentId = params.channelParentId.length > 0 ? params.channelParentId[params.channelParentId.length - 1] : ''
      params.channelParentId = channelParentId
      return params
    },
    // 新建保存
    handleConfirmCreate (data) {
      let params = this.handleFilterParams(data)
      this.addFormLoading = true
      if (params.channelParentId) {
        this.$request.fetchChannelCreate(params).then(res => {
          this.$restBack(res, () => {
            this.setColumnId(params.channelParentId)
            this.fetchChannelTree()
            this.FetchColumnOptions(true)
            this.FetchContentColumnOptions(true)
          }, '新增成功')
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      } else {
        this.$request.fetchChannelCreateTop(params).then(res => {
          this.$restBack(res, () => {
            // 判断是否空的栏目
            if (this.columnId == null) {
              this.setColumnId(1)
            }
            this.fetchChannelTree()
            this.FetchColumnOptions(true)
            this.FetchContentColumnOptions(true)
          }, '新增成功')
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      }
    },
    initChannelTree () {
      this.fetchChannelTree().then(res => {
        if (res.code === 200 && res.data instanceof Array && res.data.length) {
          if (!this.columnId) {
            this.columnData = res.data[0]
            this.setColumnId(res.data[0].id)
            this.getColumnDetail(res.data[0].id)
          } else {
            const that = this
            const loop = data => {
              if (data instanceof Array && data.length) {
                data.forEach(d => {
                  if (d.id === this.columnId) {
                    that.columnData = d
                  } else if (d.children) {
                    loop(d.children)
                  }
                })
              }
            }
            loop(res.data)
          }
        }
      })
    },
    setColumnId (id) {
      this.columnId = id
      this.tree.currentNodeKey = id
      this.addForm.channelParentId = [id]
    },
    // 刷新左边栏目树
    reflushColumnTree (pid, name) {
      this.fetchChannelTree().then(res => {
        if (this.columnId) {
          this.setColumnId(this.columnId)
        }
      })
    },
    handleHeaderPreview () {},
    handleHeaderPermission () {},
    handleHeaderRelease () {},
    handleHeaderMerge () {},
    handleHeaderBatchCreate () {},
    handleHeaderDelete () {},
    handleConfirmStatic () {},
    handleConfirmMerge () {},
    handleConfirmBatch () {},
    getTheNodMerge () {},
    handleHeaderBrowse () {}
  },
  mounted () {
    const { id } = this.$route.query
    if (id) {
      this.setColumnId(Number(id))
    }
    this.initChannelTree()
    this.FetchColumnOptions()
    this.FetchColumnModelOptions()
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.columnId) {
      this.setColumnId('')
      this.$nextTick(() => {
        this.setColumnId(Number(id))
      })
    }
  }
}
