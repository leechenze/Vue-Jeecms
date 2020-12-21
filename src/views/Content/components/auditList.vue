<template>
  <section class="content-list-container">
    <base-header
      v-show="isChild"
      v-bind="headers"
      @handleAdd="handleEventAdd"
      @handleCommandAdd="handleCommandAdd" />
    <search-header
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
      @handleSenior="handleSenior"
    ></search-header>
    <content-table
      v-bind="list"
      @handleSizeChange="handleContentSizeChange"
      @handleCurrentChange="handleContentCurrentChange"
      @handleCheckAll="handleCheckAll"
      @handleEventAll="handleEventAll"
      @handleCommand="handleCommand"
      @handleClickWorkflow="handleClickWorkflow"
      @handleBatchAll="handleBatchAll"
    >
    </content-table>
    <form-dialog
      :title="edit.title"
      ref="editDialog"
      :loading="edit.formLoading"
      :form="edit.form"
      :rules="edit.rules"
      :buttons="edit.buttons"
      :formItems="edit.formItems"
      @handleConfirm="handleConfirmEdit"
      @handleChangeCascader="handleChangeCascader"
    ></form-dialog>
    <sort-content ref="sortContent" :channelIds="list.params.channelIds"
                  @getSort="getSort" key="contentList"></sort-content>
    <!-- workflow-plugin start -->
    <my-workflow ref='wf'/>
    <!-- workflow-plugin end -->
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import formDialog from '@/components/mixins/formDialog'
import tableDialog from '@/components/mixins/tableDialog'
import searchHeader from '@/components/mixins/searchHeader'
import contentTable from '@/components/mixins/ContentTable'
import mixins from './mixins'
/* workflow-plugin start */
import myWorkflow from './myWorkflow'
/* workflow-plugin end */
import sortContent from './sortContent'

export default {
  name: 'auditList',
  mixins: [baseHeader, formDialog, searchHeader, mixins, contentTable, tableDialog],
  components: {
    /* workflow-plugin start */
    myWorkflow,
    /* workflow-plugin end */
    sortContent
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    isChild: {
      type: Boolean,
      default: false
    },
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    var columns = [
      {
        prop: 'cmsContent.channelName',
        scopeType: 'model'
      },
      {
        prop: 'cmsContent.title',
        scopeType: 'link',
        href: '/content/detail',
        params: [
          {
            key: 'channelId',
            value: 'cmsContent.channelId'
          },
          {
            key: 'isQuote',
            value: 'quote'
          },
          {
            key: 'isCited',
            value: 'cmsContent.quoteChannel'
          }
        ],
        style: { flex: 1, fontSize: '16px', color: '#333', fontWeight: 400 }
      },
      {
        prop: 'cmsContent.createUser',
        style: { width: '115px' },
        label: '创建人：'
      },
      {
        prop: 'cmsContent.createTime',
        style: { width: '215px' },
        label: '创建时间：'
      },
      {
        prop: 'cmsContent.id',
        style: { width: '75px' },
        label: 'ID：'
      },
      {
        prop: 'cmsContent.model.modelName',
        style: { width: '100px' },
        label: '模型：'
      }

    ]
    var statusOption2 = [
      {
        label: '智能审核中',
        value: 10
      },
      {
        label: '违禁内容',
        value: 11
      },
      {
        label: '审核失败',
        value: 12
      }
    ]
    var keyOption = [
      {
        label: '标题',
        value: 1
      },
      {
        label: '作者',
        value: 2
      },
      {
        label: '来源',
        value: 3
      },
      {
        label: '描述',
        value: 4
      },
      {
        label: '创建人',
        value: 5
      }
    ]
    var btnsData = [
      {
        icon: 'delete',
        name: '删除',
        power: 'DELETE',
        type: 'Delete'
      }
    ]

    return {
      statusOption2,
      keyOption,
      hasWorkflow: false,
      headers: {
        buttons: [],
        maxShowIndex: 8,
        showAlertIcon: false,
        className: 'column-text'
      },
      list: {
        loading: false,
        columns,
        data: [],
        api: '',
        status: 'cmsContent.status',
        rowKey: 'cmsContent.id',
        showCheckAll: '',
        showDropdown: true,
        // identIcons: Object.assign([], icons),
        linkData: Object.assign([], btnsData),
        params: {
          'keyType': 1,
          'status': '',
          'title': ''
        },
        buttons: [
          {
            label: '删除',
            key: 'remove',
            icon: 'delete',
            type: 'primary',
            disabled: !this._checkPermission('/contentext/status', 'POST')
          }
        ]
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'status',
            label: '智能审核状态：',
            placeholder: '请选择',
            popperClass: 'content-list-status',
            style: {
              width: '150px'
            },
            options: []
          },
          {
            type: 'searchInput',
            value: 'title',
            placeholder: '请输入标题'
          }
        ]
      },
      type: 1
    }
  },
  methods: {
    handleBatchAll (ids, btn) {
      if (btn.key === 'remove') {
        this.handleEventDelete(ids)
      }
    },
    getSort (status) {
      if (status) {
        this.fetchContentApi()
      }
    },
    handleCheckAll (ids) {
      // let status = false
      // let isQuote = false
      if (ids.length) {
        ids.forEach(t => {
          let obj = this.list.data.find(v => v.cmsContent.id === t)
          if (obj.cmsContent.status === 3) {
            // status = true
          }
          if (obj.quote) {
            // isQuote = true
          }
        })
        // this.setDisabled(status, isQuote)
      } else {
        // this.setDisabled(status)
      }
      this.list.ids = ids
    },
    setDisabled (status, isQuote) {
      // console.log(isQuote)
      if (isQuote) {
        this.list.drops.find(v => v.key === 'handle').options.forEach(t => {
          t.disabled = true
        })
        this.list.drops.find(v => v.key === 'type').options.forEach(t => {
          t.disabled = true
        })
        // this.list.drops.find(v => v.key === 'status').options.forEach(t => {
        //   t.disabled = true
        // })
      } else {
        this.list.drops.find(v => v.key === 'handle').options.forEach(t => {
          if (t.type !== 'Delete') {
            t.disabled = status
          } else {
            t.disabled = false
          }
        })
        this.list.drops.find(v => v.key === 'type').options.forEach(t => {
          t.disabled = status
        })
      }
    },
    // 显示工作流详情
    handleClickWorkflow (contentId) {
      /* workflow-plugin start */
      this.$refs.wf.showDialog(contentId)
      /* workflow-plugin end */
    },
    getStatusData () {
      let statusArr = [{ label: '全部', value: '' }]
      this.searchHeader.searchItems.find(v => v.value === 'status').options = statusArr.concat(this.statusOption2)
    },
    handleSearchs () {
      this.list.pageNo = 1
      var params = this.list.params
      this.searchHeader.searchItems
        .find(v => v.value === 'title').placeholder = '请输入' + this.keyOption
          .find(d => d.value === params.keyType).label
      this.list.params = params
      this.fetchContentApi()
    },
    // 新增内容
    handleEventAdd (btn) {
      this.$routerLink('/content/create', 'add', { id: btn.id, modelName: btn.text, channelId: this.id || '' })
      this.$request.fetchContentModelRecord({ modelId: btn.id })
    },
    handleCommandAdd (id) {
      const model = this.headers.buttons.find(d => d.btnType === 'dropdown').options.find(v => v.value === id)
      this.$routerLink('/content/create', 'add', { id: id, modelName: model.label || '', channelId: this.id || '' })
    },
    // 回调
    fetchContentCallBack (res) {
      if (res.code === 200) {
        if (res.data.content && res.data.content.length) {
          let content = res.data.content.map((d, i) => {
            var arr = []
            if (d.cmsContent.top) {
              var obj = {}
              if (d.cmsContent.topEndTime) {
                obj = {
                  label: '限时置顶，到期时间' + d.cmsContent.topEndTime,
                  icon: 'xianshizhiding'
                }
              } else {
                obj = {
                  label: '永久置顶',
                  icon: 'zhiding'
                }
              }
              arr.push(obj)
            }
            if (d.cmsContent.copyName) {
              arr.push({
                label: '复制，来源栏目' + d.cmsContent.copyName,
                icon: 'fuzhilaiyuanlangmu'
              })
            }
            if (d.quote) {
              let obj = {}
              if (d.createType === 7) {
                obj = {
                  label: '镜像型引用，来源栏目：' + d.quoteChannelName,
                  icon: 'jingxiangyinyong'
                }
              } else if (d.createType === 6) {
                obj = {
                  label: '链接型引用，来源栏目：' + d.quoteChannelName,
                  icon: 'lianjiexingyinyong'
                }
              }
              arr.push(obj)
            } else if (d.cmsContent.quoteChannel && d.cmsContent.quoteChannel.length > 0) {
              d.cmsContent.quoteChannel.forEach(v => {
                let obj = {}
                if (v.createType === 7) {
                  obj = {
                    label: '镜像型引用到栏目：' + v.name,
                    icon: 'jingxiangyinyong'
                  }
                } else if (v.createType === 6) {
                  obj = {
                    label: '链接型引用到栏目：' + v.name,
                    icon: 'lianjiexingyinyong'
                  }
                }
                arr.push(obj)
              })
            }
            if (d.cmsContent.contentTypes instanceof Array) {
              let types = this.list.drops.find(v => v.key === 'type').options
              d.cmsContent.contentTypes.forEach(v => {
                let obj = types.find(t => t.id === v.id)
                if (obj) {
                  arr.push({
                    label: obj.typeName,
                    img: obj.logoResource ? this.$getPath(obj.logoResource.url) : ''
                  })
                }
              })
            }
            d.identIcons = arr
            return d
          })
          this.list.data = content
        } else {
          this.list.data = []
        }
        this.list.totalCount = res.data.totalElements
      }
    },
    // 是否工作流
    getChannlWrokflow (id) {
      /* workflow-plugin start */
      if (id) {
        let params = {
          id: id
        }
        this.$request.fetchChannelWorkflowBeing(params).then((res) => {
          if (res.code === 200) {
            this.hasWorkflow = res.data
            this.getStatusData()
          }
        })
      }
      /* workflow-plugin end */
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getStatusData()
      if (this.name === 'audit') {
        this.list.api = 'fetchContentextChackPage'
        // this.getSearchData()
        // this.GetOwnerTrees()
        if (this.id) {
          this.getChannlWrokflow(this.id)
        }
      }
    })
  },
  activated () {
    this.getStatusData()
    if ((this.$route.query.type === 'list' || this.$route.query.type === 'audit') && this.name === 'audit') {
      this.fetchContentApi()
      this.$router.push({ query: { type: '' } })
    }
  },
  watch: {
    id (newData, oldData) {
      if (newData !== oldData && this.name === 'audit') {
        this.channelId = newData
        this.list.pageNo = 1
        this.getChannlWrokflow(newData)
        // this.list.params.channelId = newData
        this.list.params.channelId = newData || ''
        this.fetchContentApi()
        // this.getSearchData(this.id)
      }
      if (newData) {
        this.list.showCheckAll = 'head'
        this.list.params.channelId = newData || ''
      } else {
        this.list.showCheckAll = ''
        this.list.params.channelId = ''
      }
    },
    isChild (newData, oldData) {},
    name (newVal, oldVal) {
      if (newVal === 'audit') {
        this.list.api = 'fetchContentextChackPage'
        this.list.params.channelId = this.id
        this.fetchContentApi()
      }
    },
    'list.params.senior': function (newData) {
      const cls1 = newData ? '' : 'z-hidden-md-and-down'
      this.searchHeader.searchItems.find(d => d.value === 'myself').class = cls1
      const cls2 = newData ? '' : 'z-hidden-lg-and-down'
      this.searchHeader.searchItems.find(d => d.value === 'update').class = cls2
      this.searchHeader.searchItems.find(d => d.value === 'contentSecretId').class = cls2
    }
  }
}
</script>
<style lang='scss'>
  .content-list-container{
    .base-header-container{
      header{
        padding-bottom: 10px!important;
      }
      .list-wrap-btn.el-button.el-button--medium.is-plain{
        border-color: #e8e8e8;
        color: #333333;
        font-size: 14px;
        .jee-svg-icon{
          width: 10px;
          fill: #333333;
        }
      }
    }
  }
  .content-list-order-type{
    .el-select-dropdown__wrap{
      max-height: 353px;
    }
  }
  .content-list-status{
    .el-select-dropdown__wrap{
      max-height: 290px;
    }
  }
</style>
