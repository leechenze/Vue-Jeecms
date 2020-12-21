<script>
import BaseComp from './BaseComp'
import BaseInfo from './Form/BaseInfo'
import ExtendConfig from './Form/ExtendConfig'
import SeoInfo from './Form/SeoInfo'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'columnIndex',
  extends: BaseComp,
  components: {
    BaseInfo,
    ExtendConfig,
    SeoInfo
  },
  data () {
    return {
      tabs: [
        {
          label: '基本信息',
          name: 'base',
          component: 'BaseInfo'
        },
        {
          label: '扩展配置',
          name: 'extend',
          component: 'ExtendConfig'
        },
        {
          label: 'SEO信息',
          name: 'seo',
          component: 'SeoInfo'
        }
      ]
    }
  },
  methods: {
    ...mapActions('column', ['FetchChannelDetail', 'FetchColumnOptions']),
    ...mapActions('config', ['FetchSiteExtentConfig', 'FetchSitesOwnsite']),
    handleHeaderPermission (val) {
      switch (val) {
        case '0':
          this.$router.push({ name: 'columnPermission', query: { id: this.columnId } })
          break
        default:
          this.$router.push({ name: 'docPermission', query: { id: this.columnId } })
          break
      }
    },
    getColumnDetail (id) {
      this.FetchChannelDetail(id)
    },
    // 浏览
    handleHeaderBrowse () {
      if (this.detail.url) {
        window.open(this.detail.url)
      } else {
        this.$message('没有浏览地址')
      }
    },
    // 预览
    handleHeaderPreview () {
      if (this.detail.previewUrl) {
        window.open(this.detail.previewUrl)
      } else {
        this.$message('没有预览地址')
      }
    },
    handleHeaderRelease () {
      this.$refs.static.showDialog()
    },
    // 删除栏目
    handleHeaderDelete () {
      if (!this.columnId) {
        this.$message('请选择栏目')
        return
      }
      this.$confirm('是否确定删除栏目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = [this.columnId]
        this.$request.fetchChannelDelete({ ids }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.columnId = 0
            this.initChannelTree()
            this.FetchColumnOptions(true)
            this.FetchContentColumnOptions(true)
          }
        })
      })
    },
    // 发布静态页
    handleConfirmStatic (data) {
      if (data.op.length === 0) {
        return false
      }
      var obj = {}
      obj.channelId = this.columnId
      obj.op = ''
      for (var i = 0; i < data.op.length; i++) {
        if (i !== data.op.length - 1) {
          obj.op += data.op[i]
          obj.op += ','
        } else {
          obj.op += data.op[i]
        }
      }
      this.$request.fetchChannelStaticPageChannel(obj).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        }
      })
    },
    // 打开合并栏目
    handleHeaderMerge () {
      this.$request.fetchChannelTree().then(res => {
        if (res.code === 200) {
          const loop = function (data, siteId) {
            if (data instanceof Array && data.length) {
              return data.map(d => {
                if (d.id === siteId || !d.mergeAble) {
                  d.disabled = true
                }
                if (d.children instanceof Array && d.children.length) {
                  loop(d.children, siteId)
                }
                return d
              })
            }
          }
          this.addMergeFormItems.find(d => d.prop === 'ids').tree = loop(res.data, this.columnId)
        }
      })
      this.$refs.mergeColumn.showDialog()
    },
    // 合并栏目弹窗树赋值
    getTheNodMerge (data) {
      this.addMergeForm.ids = data
    },
    // 合并栏目提交
    handleConfirmMerge (data) {
      if (!this.columnId) {
        this.$message('请选择栏目')
        return
      }
      if (data.ids.length === 0) {
        return
      }
      data.id = this.columnId
      this.$request.fetchChannelMerge(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '合并成功',
            type: 'success'
          })
          this.fetchChannelTree()
          this.FetchColumnOptions(true)
          this.FetchContentColumnOptions(true)
        }
      })
    },
    // 打开批量创建栏目
    handleHeaderBatchCreate () {
      this.$refs.BatchColumn.showDialog()
    },
    // 确认批量创建
    handleConfirmBatch (datas) {
      this.$refs.BatchColumn.handleCancel()
      let resData = datas.columns ? datas.columns.split(/[(\r\n)\r\n]+/) : []
      // ['新闻', '  时事', '    政治', '  娱乐', '    王保强绿', '      孙红雷笑了', '视频', '  火山', '图片', '  美女']
      if (resData.length > 100) {
        this.$message('最多创建20条')
        return
      }
      const data = {
        channelNames: resData,
        channelParentId: this.columnId,
        modelId: datas.modelId
      }
      this.$request.fetchChannelBatch(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('create')

          this.fetchChannelTree()
          this.FetchColumnOptions(true)
          this.FetchContentColumnOptions(true)
        }
      })
    }
  },
  computed: {
    ...mapGetters(['currentSiteId', 'siteExtendConfig']),
    getTabs () {
      let include = []
      if (this.detail && this.detail.renderingField) {
        const { formListBase, formListExtend, formListSeo } = this.detail.renderingField
        if (formListBase instanceof Array && formListBase.length) {
          include.push('base')
        }
        if (formListExtend instanceof Array && formListExtend.length) {
          include.push('extend')
        }
        if (formListSeo instanceof Array && formListSeo.length) {
          include.push('seo')
        }
      }
      return this.tabs.filter(t => include.includes(t.name))
    },
    getOpenStatic () {
      try {
        return this.siteExtendConfig.cfg.openStatic
      } catch (error) {
        return ''
      }
    },
    columnHeaders () {
      return {
        // content: '这里是栏目管理',
        showAlertIcon: false,
        buttons: [
          {
            type: 'Preview',
            text: '预览',
            icon: 'yulang',
            prim: true
          },
          {
            type: 'Browse',
            text: '浏览',
            icon: 'liulan'
          },
          {
            type: 'Release',
            text: '发布静态页',
            isHidden: this.getOpenStatic !== '1',
            icon: 'fabu',
            disabled: !this._checkPermission('/content/staticPage/channel', 'PUT') || !this.columnData.staticAble
          },
          {
            type: 'BatchCreate',
            text: '批量创建栏目',
            icon: 'piliangchuangjian',
            disabled: !this._checkPermission('/channel/multiple', 'POST') || !this.columnData.createChildAble
          },
          {
            type: 'Merge',
            text: '合并栏目',
            icon: 'hebingfenping',
            disabled: !this._checkPermission('/channel/merge', 'PUT') || !this.columnData.mergeAble
          },
          {
            type: 'Permission',
            text: '权限分配',
            icon: 'tongyong-xiugaimimatubiao',
            btnType: 'dropdown',
            btnProps: {
              type: 'empty'
            },
            options: [
              {
                value: '0',
                label: '栏目类权限'
              },
              {
                value: '1',
                label: '文档类权限'
              }
            ],
            disabled: !this._checkPermission('/dataPerm/channel/user', 'GET') || !this._checkPermission('/dataPerm/channel/org', 'GET') || !this.columnData.permAssignAble
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/channel', 'DELETE') || !this.columnData.deleteAble
          }
        ]
      }
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    this.$nextTick(() => {
      this.FetchSiteExtentConfig(this.currentSiteId)
    })
  },
  activated () {
    const { id } = this.$route.query
    if (id) {
      this.FetchChannelDetail(id)
    }
  },
  watch: {
    getTabs (newData) {
      if (newData instanceof Array && newData.length && !newData.find(d => d.name === this.currentTab)) {
        this.currentTab = newData[0].name || ''
      }
    }
  }
}
</script>
