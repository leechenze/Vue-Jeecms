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
      @handleBrowseing="handleBrowseing"
      @popoverClick="popoverClick"
      @handleEventAll="handleEventAll"
      @handleCommand="handleCommand"
      @handleClickWorkflow="handleClickWorkflow"
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
    <el-dialog
      width="500px"
      height="130px"
      :show-close="false"
      :visible.sync="fabu">
      <p style='width: 100%;text-align: center; padding-bottom: 20px;'>智能审核中，请稍后...</p>
    </el-dialog>
    <el-dialog
      title="访问记录"
      width="822px"
      :visible.sync="browsing"
      :before-close="handleBrowsingClose"
    >
      <browseTable @handStatisData="handleBrowsingClose" :contentId="contentIds"></browseTable>
    </el-dialog>
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
import browseTable from '../Browse/BrowseTable'

export default {
  name: 'contentList',
  mixins: [baseHeader, formDialog, searchHeader, mixins, contentTable, tableDialog],
  components: {
    /* workflow-plugin start */
    myWorkflow,
    /* workflow-plugin end */
    browseTable,
    sortContent
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
        style: { flex: 1, fontSize: '16px', color: '#333', fontWeight: 400, minWidth: '170px' }
      },
      {
        prop: 'cmsContent.createUser',
        style: { minWidth: '115px' },
        label: '创建人：'
      },
      {
        prop: 'cmsContent.createTime',
        style: { minWidth: '215px' },
        label: '创建时间：'
      },
      {
        prop: 'cmsContent.id',
        style: { minWidth: '75px' },
        label: 'ID：'
      },
      {
        prop: 'cmsContent.model.modelName',
        style: { minWidth: '90px' },
        label: '模型：'
      },
      {
        prop: 'viewData.readCount',
        style: { minWidth: '85px' },
        label: '访问量：',
        props: {
          class: 'z-hidden-xd-and-down'
        }
      },
      {
        prop: 'viewData.peopleCount',
        style: { minWidth: '95px' },
        label: '访问人数：',
        props: {
          class: 'z-hidden-xd-and-down'
        }
      },
      {
        prop: 'viewData.commentCount',
        style: { minWidth: '85px' },
        label: '评论数：',
        props: {
          class: 'z-hidden-xd-and-down'
        }
      },
      {
        prop: 'viewData.likeCount',
        style: { minWidth: '' },
        label: '点赞数：',
        props: {
          class: 'z-hidden-xd-and-down'
        }
      }
    ]
    var statusOption = [
      {
        label: '初稿',
        value: 2
      },
      {
        label: '发布',
        value: 5
      },
      // {
      //   label: '已审核',
      //   value: 4
      // },
      /* workflow-plugin start */
      {
        label: '流转中',
        value: 3
      },
      /* workflow-plugin end */
      // {
      //   label: '驳回',
      //   value: 6
      // },
      {
        label: '草稿',
        value: 1
      },
      {
        label: '下线',
        value: 7
      }
      // {
      //   label: '归档',
      //   value: 8
      // }
    ]
    var statusOption2 = [
      {
        label: '初稿',
        value: 2
      },
      {
        label: '发布',
        value: 5
      },
      {
        label: '已审核',
        value: 4
      },
      /* workflow-plugin start */
      {
        label: '流转中',
        value: 3
      },
      /* workflow-plugin end */
      {
        label: '驳回',
        value: 6
      },
      {
        label: '草稿',
        value: 1
      },
      {
        label: '下线',
        value: 7
      }
      // {
      //   label: '归档',
      //   value: 8
      // }
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
    var createOptions = [
      {
        label: '所有',
        value: ''
      },
      {
        label: '直接创建',
        value: 1
      },
      {
        label: '投稿',
        value: 2
      },
      {
        label: '站群推送',
        value: 3
      },
      {
        label: '站群采集',
        value: 4
      },
      {
        label: '复制',
        value: 5
      },
      {
        label: '链接型引用',
        value: 6
      },
      {
        label: '镜像型引用',
        value: 7
      },
      {
        label: '外部采集',
        value: 8
      }
    ]
    var btnsData = [
      {
        icon: 'bianji',
        name: '编辑',
        power: 'UPDATE',
        type: 'Edit'
      },
      {
        icon: 'zhifeiji-aqg',
        name: '发布',
        power: 'PUBLISH',
        type: 'Release'
      },
      {
        icon: 'xiaxian',
        name: '下线',
        power: 'OFFLINE',
        type: 'Offline'
      },
      {
        icon: 'tangchuangguanbi',
        name: '删除',
        power: 'DELETE',
        type: 'Delete'
      },
      {
        icon: 'yulang',
        name: '预览',
        power: 'PREVIEW',
        type: 'Preview'
      },
      {
        icon: 'liulan',
        name: '浏览',
        power: 'VIEW',
        type: 'Browse'
      },
      {
        icon: 'yidong1',
        name: '移动',
        power: 'MOVE',
        type: 'Move'
      }
    ]
    var popverBtns = [
      {
        icon: 'zhiding',
        name: '置顶',
        power: 'STICK',
        type: 'Istop'
      },
      {
        name: '复制',
        type: 'Copy',
        power: 'COPY',
        icon: 'fuzhilaiyuanlangmu'
      },
      {
        name: '排序',
        type: 'Sort',
        power: 'SORT',
        icon: 'paixu1'
      },
      {
        name: '引用',
        type: 'Quote',
        power: 'QUOTE',
        icon: 'yinyong'
      },
      {
        name: '推送到站群',
        type: 'Pushstation',
        power: 'SITE',
        icon: 'tuisongdaozhanqun'
      },
      {
        name: '推送到微信',
        type: 'Pushweixin',
        power: 'WECHAT',
        icon: 'tuisongdaoweixin'
      },
      {
        name: '推送到微博',
        type: 'Pushweibo',
        power: 'SINA',
        icon: 'tuijiandaoweibo'
      },
      {
        name: '归档',
        type: 'File',
        power: 'PIGEONHOLE',
        icon: 'guidang'
      },
      {
        name: '访问记录',
        type: 'Browse',
        power: 'BROWSING',
        icon: 'liulan'
      }
    ]
    // {
    //     name: '已审核',
    //     type: 'Released',
    //     power: 'UPDATE',
    //     icon: 'daifabu'
    //   }
    var footBtns = [
      {
        icon: 'zhiding',
        name: '置顶',
        power: 'STICK',
        type: 'Istop',
        disabled: !this._checkPermission('/contentext/top', 'POST')
      },
      {
        icon: 'zhiding',
        name: '取消置顶',
        power: 'STICK',
        type: 'Notop',
        disabled: !this._checkPermission('/contentext/top', 'POST')
      },
      {
        icon: 'yidong1',
        name: '移动',
        power: 'MOVE',
        type: 'Move',
        disabled: !this._checkPermission('/contentext/move', 'POST')
      },
      {
        name: '排序',
        type: 'Sort',
        power: 'SORT',
        icon: 'paixu1',
        disabled: !this._checkPermission('/contentext/sort', 'POST')
      },
      {
        name: '排序',
        type: 'Sort',
        power: 'SORT',
        icon: 'paixu1',
        disabled: !this._checkPermission('/contentext/sort', 'POST')
      },
      {
        name: '引用',
        type: 'Quote',
        power: 'QUOTE',
        icon: 'yinyong',
        disabled: !this._checkPermission('/contentext/quote', 'POST')
      },
      {
        icon: 'tangchuangguanbi',
        name: '删除',
        power: 'DELETE',
        type: 'Delete',
        disabled: !this._checkPermission('/contentext/rubbish', 'POST')
      },
      {
        name: '归档',
        type: 'File',
        power: 'PIGEONHOLE',
        icon: 'guidang',
        disabled: !this._checkPermission('/contentext/file', 'POST')
      },
      {
        name: '推送到站群',
        type: 'Pushstation',
        power: 'SITE',
        icon: 'tuisongdaozhanqun',
        disabled: !this._checkPermission('/content/push/sites', 'PUT')
      },
      {
        name: '推送到微信',
        type: 'Pushweixin',
        power: 'WECHAT',
        icon: 'tuisongdaoweixin',
        disabled: !this._checkPermission('/contentext/push', 'POST')
      }
    ]
    return {
      contentIds: 0,
      browsing: false,
      loading: false,
      statusOption,
      statusOption2,
      popverBtns,
      keyOption,
      hasWorkflow: false,
      headers: {
        buttons: [],
        maxShowIndex: 8,
        showAlertIcon: false,
        className: 'column-text'
      },
      channelId: '',
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
        popverBtns: Object.assign([], popverBtns),
        params: {
          'senior': false,
          'orderType': 0,
          'status': '',
          'contentType': '',
          'myself': false,
          'update': false,
          'createStartTime': '',
          'createEndTime': '',
          'releaseStartTime': '',
          'releaseEndTime': '',
          'createType': '',
          'modelId': '',
          'keyType': 1,
          'key': '',
          // 'channelId': this.id,
          'channelIds': [],
          'contentSecretId': '',
          'contentSecretIds': [],
          'issueOrg': '',
          'issueYear': '',
          'issueNum': ''
        },
        drops: [
          {
            label: '改变内容状态',
            key: 'status',
            options: statusOption,
            disabled: !this._checkPermission('/contentext/status', 'POST')
          },
          {
            label: '内容操作',
            key: 'handle',
            options: footBtns,
            optionLabel: 'name',
            optionValue: 'type'
          },
          {
            label: '改变内容类型',
            key: 'type',
            options: [],
            optionLabel: 'typeName',
            optionValue: 'id'
          }
        ]
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'orderType',
            label: '排序方式：',
            placeholder: '请选择',
            popperClass: 'content-list-order-type',
            style: {
              width: '126px'
            },
            options: []
          },
          {
            type: 'select',
            value: 'status',
            label: '内容状态：',
            placeholder: '请选择',
            popperClass: 'content-list-status',
            style: {
              width: '100px'
            },
            options: []
          },
          {
            type: 'select',
            value: 'contentType',
            label: '内容类型：',
            placeholder: '请选择',
            optionLabel: 'typeName',
            optionValue: 'id',
            style: {
              width: '100px'
            },
            options: []
          },
          {
            type: 'checked',
            value: 'myself',
            class: 'z-hidden-md-and-down',
            label: '我创建的'
          },
          {
            type: 'checked',
            value: 'update',
            class: 'z-hidden-lg-and-down',
            label: '重新编辑'
          },
          {
            type: 'select',
            value: 'contentSecretId',
            label: '内容密级：',
            hiddenKey: 'senior',
            hiddenValue: true,
            clearable: true,
            class: 'z-hidden-lg-and-down',
            style: {
              width: '130px'
            },
            optionLabel: 'name',
            optionValue: 'id',
            placeholder: '请选择',
            options: []
          },
          {
            type: 'select',
            value: 'issueOrg',
            label: '发文字号：',
            hiddenKey: 'senior',
            hiddenValue: true,
            clearable: true,
            style: {
              width: '100px'
            },
            placeholder: '请选择',
            options: []
          },
          {
            type: 'select',
            value: 'issueYear', // 年号
            placeholder: '请选择',
            hiddenKey: 'senior',
            hiddenValue: true,
            clearable: true,
            style: {
              width: '100px'
            },
            options: []
          },
          {
            type: 'input',
            value: 'issueNum', // 顺序号
            placeholder: '顺序号',
            hiddenKey: 'senior',
            hiddenValue: true,
            style: {
              minWidth: '90px',
              width: '90px'
            }
          },
          {
            type: 'timePicker',
            value: 'times',
            hiddenKey: 'senior',
            hiddenValue: true,
            startText: '起始创建时间',
            endText: '截止创建时间'
          },
          {
            type: 'select',
            value: 'createType',
            label: '创建方式：',
            hiddenKey: 'senior',
            hiddenValue: true,
            style: {
              width: '150px'
            },
            options: createOptions
          },
          {
            type: 'select',
            value: 'modelId',
            label: '内容模型：',
            style: {
              width: '150px'
            },
            hiddenKey: 'senior',
            hiddenValue: true,
            optionValue: 'id',
            optionLabel: 'modelName',
            options: [
              {
                label: '所有',
                value: ''
              }
            ]
          },
          {
            type: 'select',
            value: 'keyType',
            style: {
              width: '100px'
            },
            hiddenKey: 'senior',
            hiddenValue: true,
            options: keyOption
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入标题'
          },
          {
            type: 'senior',
            value: 'senior'
          }
        ]
      },
      type: 1,
      fabu: false
    }
  },
  methods: {
    // 访问记录
    handleBrowseing (row) {
      console.log(row)
      this.browsing = true
    },
    handleBrowsingClose () {
      this.browsing = false
    },
    getSort (status) {
      if (status) {
        this.fetchContentApi()
      }
    },
    handleCheckAll (ids) {
      let status = false
      let isQuote = false
      if (ids.length) {
        ids.forEach(t => {
          let obj = this.list.data.find(v => v.cmsContent.id === t)
          if (obj.cmsContent.status === 3) {
            status = true
          }
          if (obj.quote) {
            isQuote = true
          }
        })
        this.setDisabled(status, isQuote)
      } else {
        this.setDisabled(status)
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
      let statusArr = [{ label: '所有', value: '' }]
      let statusTypes = [1, 5, 7]
      let hasWork = this.hasWorkflow
      this.statusOption.forEach(v => {
        if (statusTypes.indexOf(v.value) === -1) {
          if (v.value === 3) {
            v.showBtn = v.disabled = !hasWork
          } else {
            v.disabled = !this.isChild
          }
        }
      })
      this.searchHeader.searchItems.find(v => v.value === 'status').options = statusArr.concat(this.statusOption2)
    },
    handleSearchs () {
      this.list.pageNo = 1
      var params = this.list.params
      if (params.times) {
        params.createStartTime = params.times[0]
        params.createEndTime = params.times[1]
      } else {
        params.createStartTime = ''
        params.createEndTime = ''
      }
      if (params.contentSecretId) {
        params.contentSecretIds = [parseInt(params.contentSecretId)]
      } else {
        params.contentSecretIds = []
      }
      this.searchHeader.searchItems
        .find(v => v.value === 'key').placeholder = '请输入' + this.keyOption
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
    setHeaderBth (data) {
      if (data.cmsContent.quoteChannel && data.cmsContent.quoteChannel.length > 0 && !data.quote) {
        this.popverBtns.find(d => d.power === 'QUOTE').name = '取消引用'
        this.popverBtns.find(d => d.power === 'QUOTE').type = 'Dereference'
        this.popverBtns.find(d => d.power === 'QUOTE').icon = 'quxiaoyinyong'
      } else {
        this.popverBtns.find(d => d.power === 'QUOTE').name = '引用'
        this.popverBtns.find(d => d.power === 'QUOTE').type = 'Quote'
        this.popverBtns.find(d => d.power === 'QUOTE').icon = 'yinyong'
      }
      if (data.quote) {
        this.popverBtns.find(d => d.power === 'QUOTE').disabled = true
      } else {
        this.popverBtns.find(d => d.power === 'QUOTE').disabled = !this._checkPermission('/contentext/quote', 'POST')
      }
      if (data.cmsContent.top) {
        this.popverBtns.find(d => d.power === 'STICK').name = '取消置顶'
        this.popverBtns.find(d => d.power === 'STICK').type = 'Notop'
        this.popverBtns.find(d => d.power === 'STICK').icon = 'zhiding'
      } else {
        this.popverBtns.find(d => d.power === 'STICK').name = '置顶'
        this.popverBtns.find(d => d.power === 'STICK').type = 'Istop'
        this.popverBtns.find(d => d.power === 'STICK').icon = 'zhiding'
      }
    },
    // 右侧更多按钮点击
    popoverClick (data, item) {
      this.contentIds = data.cmsContent.id
      this.list.popverBtns = Object.assign([], this.popverBtns)
      var btns = this.list.popverBtns
      this.setHeaderBth(data)
      var arr = this.searchHeader.searchItems.find(v => v.value === 'contentType').options.slice(1)
      if (arr instanceof Array && data.cmsContent.contentTypes instanceof Array) {
        var obj = {}
        arr.forEach(v => {
          obj = data.cmsContent.contentTypes.find(d => d.id === v.id)
          if (obj) {
            btns.splice(4, 0, {
              name: '取消' + v.typeName,
              id: v.id,
              type: 'Custom',
              contentTypeStatus: true,
              power: 'CONTENTTYPE',
              logoId: v.logoId,
              disabled: data.cmsContent.status === 3,
              img: v.logoResource ? this.$getPath(v.logoResource.url) : ''
            })
          } else if (!obj) {
            btns.splice(4, 0, {
              name: v.typeName,
              id: v.id,
              power: 'CONTENTTYPE',
              type: 'Custom',
              contentTypeStatus: false,
              logoId: v.logoId,
              disabled: data.cmsContent.status === 3,
              img: v.logoResource ? this.$getPath(v.logoResource.url) : ''
            })
          }
        })
      }
      // popverBtns name,type,icon
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
          console.log(this.list.data)
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
    },
    // 获取浏览记录列表
    handfetchContentRecord () {
      let list = this.$request.fetchContentModelRecord(this.id)
      console.log(list)
    }
  },
  mounted () {
    this.$nextTick(async () => {
      if (this.name === 'list') {
        this.list.api = 'fetchContentextPage'
        this.getSearchData()
        this.GetOwnerTrees()
        this.getStatusData()
        if (this.id) {
          this.getChannlWrokflow(this.id)
        }
        this.fetchContentApi()
        // await this.handfetchContentRecord()
      }
    })
  },
  activated () {
    if (this.$route.query.type === 'list' && this.name === 'list') {
      this.fetchContentApi()
      this.$router.push({ query: { type: '' } })
      this.getStatusData()
    }
  },
  watch: {
    id (newData, oldData) {
      if (newData !== oldData && this.name === 'list') {
        this.channelId = newData
        this.list.pageNo = 1
        this.getChannlWrokflow(newData)
        // this.list.params.channelId = newData
        this.list.params.channelIds = newData ? [newData] : []
        this.fetchContentApi()
        this.getSearchData(this.id)
      }
      if (newData) {
        this.list.showCheckAll = 'head'
        this.list.params.channelIds = newData ? [newData] : []
      } else {
        this.list.showCheckAll = ''
        this.list.params.channelIds = []
      }
    },
    isChild (newData, oldData) {},
    name (newVal, oldVal) {
      if (newVal === 'list') {
        this.fetchContentApi()
      }
      if (this.id !== this.channelId && this.name === 'list') {
        this.channelId = this.id
        this.list.pageNo = 1
        this.list.params.channelIds = this.id ? [this.id] : []
        this.getSearchData(this.id)
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
.el-popover{
  .ct-pover__box{
    .ct-pover__item{
      .el-link--inner{
        .liulan{
          font-size: 14px!important;
        }
      }

    }
  }
}
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
