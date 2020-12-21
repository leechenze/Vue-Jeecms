
import { mapGetters, mapActions } from 'vuex'

var theForm = {
  loading: false,
  title: '',
  form: {},
  formLoading: false,
  rules: {},
  buttons: [
    {
      text: '确定',
      type: 'Submit'
    }
  ],
  formItems: []
}
var theList = {
  loading: false,
  title: '',
  data: [],
  width: '778px',
  api: '',
  columns: [],
  params: {},
  buttons: []
}
export default {
  data () {
    return {
      contentIds: 0,
      channelId: '',
      edit: Object.assign({}, theForm),
      tablelist: Object.assign({}, theList),
      contentTree: {
        data: [{
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentNodeKey: ''
      },
      sourceObj: {}
    }
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
  // inject: ['changeCurrentTab'],
  computed: {
    // 获取系统设置项
    ...mapGetters(['contentSecurityOptions', 'ownerTree', 'wechatInfoList', 'weiboinfoList', 'setting', 'config', 'currentSiteId', 'siteExtendConfig']),
    // 是否开启内容发文字号
    openContentIssue () {
      const { openContentIssue } = this.setting.attrs || {}
      return openContentIssue
    },
    // 是否开启内容密级
    openContentSecurity () {
      const { openContentSecurity } = this.setting.attrs || {}
      return openContentSecurity
    },
    issueOrgOptions () {
      return this.config.issueOrgOptions
    },
    issueYearOptions () {
      return this.config.issueYearOptions
    },
    // 站点配置
    sitePushOpen () {
      const { sitePushOpen } = this.config.siteExtendConfig.cfg || {}
      return sitePushOpen
    },
    sitePushSecret () {
      const { sitePushSecret } = this.config.siteExtendConfig.cfg || {}
      return sitePushSecret
    }
  },
  methods: {
    ...mapActions('config', ['GetOwnerTrees', 'FetchIssueOrgOptions', 'FetchIssueYearOptions', 'FetchSiteExtentConfig']),
    ...mapActions('content', ['FetchWechatInfoPage', 'FetchWeiboinfoList']),
    ...mapActions('system', ['FetchContentSecurityOptions']),
    // 更多搜索
    handleSenior (params, data) {
      if (this.name === 'list') {
        // 内容密级
        if (this.openContentSecurity === '1') {
          let arr = [{ name: '所有', id: '' }]
          this.searchHeader.searchItems.find(v => v.value === 'contentSecretId').options = arr.concat(this.contentSecurityOptions)
        } else {
          this.searchHeader.searchItems.find(v => v.value === 'contentSecretId').hiddenKey = ['senior', 'hiddenKey']
          this.searchHeader.searchItems.find(v => v.value === 'contentSecretId').hiddenValue = [true, 'hiddenValue']
        }
        // 发文字号
        if (this.openContentIssue === '1') {
          this.searchHeader.searchItems.find(v => v.value === 'issueOrg').options = this.issueOrgOptions
          this.searchHeader.searchItems.find(v => v.value === 'issueYear').options = this.issueYearOptions
        } else {
          this.searchHeader.searchItems.find(v => v.value.indexOf('issue') > -1).hiddenKey = ['senior', 'hiddenKey']
          this.searchHeader.searchItems.find(v => v.value.indexOf('issue') > -1).hiddenValue = [true, 'hiddenValue']
          this.searchHeader.searchItems.find(v => v.value.indexOf('issueYear') > -1).hiddenKey = ['senior', 'hiddenKey']
          this.searchHeader.searchItems.find(v => v.value.indexOf('issueYear') > -1).hiddenValue = [true, 'hiddenValue']
          this.searchHeader.searchItems.find(v => v.value.indexOf('issueNum') > -1).hiddenKey = ['senior', 'hiddenKey']
          this.searchHeader.searchItems.find(v => v.value.indexOf('issueNum') > -1).hiddenValue = [true, 'hiddenValue']
        }
      }
    },
    // 点击右侧按钮 （包括弹出层内按钮）
    handleEventAll (data, btn) {
      if (btn.power === 'BROWSING') {
        console.log()
        this.handleBrowseing()
      } else {
        var callback = 'handleEvent' + (btn.buttonPopUposType || btn.type)
        console.log(callback)
        this[callback](data, btn)
      }
    },
    // 弹窗点击确定
    handleConfirmEdit (data) {
      let type = data.buttonPopUposType || data.type
      switch (type) {
        case 'Istop':
          this.confirmIstop(data)
          break
        case 'Move':
          this.confirmMove(data)
          break
        case 'Copy':
          this.confirmCopy(data)
          break
        case 'Quote':
          this.confirmQuote(data)
          break
        case 'Dereference':
          this.confirmDereference(data)
          break
        case 'Pushstation':
          this.confirmPushstation(data)
          break
        case 'Pushweixin':
          this.confirmPushweixin(data)
          break
        case 'Pushweibo':
          this.confirmPushweibo(data)
          break
        default:
          break
      }
    },
    // 尾部列表按钮
    handleCommand (ident) {
      console.log(ident)
      var ids = this.list.ids
      if (ids.length > 0) {
        var i = ident.indexOf('-')
        var j = ident.indexOf('&')
        var key = ident.substring(0, i)
        var value = ident.substring(i + 1, j)
        var type = ident.substring(j + 1)
        console.log(type)
        switch (key) {
          case 'status':
          // 状态
            this.changeStatus(ids, value)
            break
          case 'handle':
          // 操作
            this.handleEventAll(ids, { type: value })
            break
          case 'type':
          // 类型
            this.handleEventCustom(ids, { id: value, contentTypeStatus: type !== 'o' })
            break
          default:
            break
        }
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 批量点击
    handleBatchAll (ids, btn) {
      if (ids.length > 0) {
        switch (btn.btn) {
          case 'Fileout':
            // 批量出档
            // this.changeStatus(ids, 1)
            this.$request.fetchContentextFile({ ids: ids }).then(res => {
              this.restBack(res, '出档成功')
            })
            break
          default:
            break
        }
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    fetchContentList (permOut = false) {
      let params = {
        permOut: permOut,
        operator: '2',
        siteId: '',
        name: ''
      }
      this.$request.fetchContentCommonTree(params).then(res => {
        if (res.code === 200) {
          var arr = [
            {
              name: '所有栏目',
              id: '',
              children: res.data
            }
          ]
          this.contentTree.data = arr
          if (this.name === 'filed') {
            let allOptions = [{ name: '所有', id: 0 }]
            this.searchHeader.searchItems.find(v => v.value === 'channelIds').options = allOptions.concat(this.contentTree.data[0].children)
          }
        }
      })
    },
    getContentTypes () {
      this.$request.fetchContentListData().then(res => {
        if (res.code === 200) {
          var arr = res.data
          if (this.name === 'list') {
            let arr2 = []
            arr.forEach(v => {
              v.type = 'o'
              arr2.push(v)
              arr2.push({
                typeName: '取消' + v.typeName,
                id: v.id,
                type: 'cancel'
              })
            })
            this.list.drops.find(v => v.key === 'type').options = arr2
          }
          let arr3 = [{ typeName: '所有', id: '' }]
          this.searchHeader.searchItems.find(v => v.value === 'contentType').options = arr3.concat(arr)
        }
      })
    },
    // 获取搜索框数据
    getSearchData (id) {
      // this.content.contentSortList
      this.fetchContentList()
      if (this.name !== 'recycle') {
        // 内容类型
        this.getContentTypes()

        if (this.name === 'list') {
          this.FetchContentSecurityOptions()
          this.FetchWechatInfoPage()
          this.FetchWeiboinfoList()
          this.FetchIssueOrgOptions()
          this.FetchIssueYearOptions()
          // 排序
          this.$request.fetchContentextOrder().then(res => {
            if (res.code === 200) {
              var arr = []
              var jsonArray = res.data
              jsonArray.forEach(v => {
                arr.push({
                  label: v.value,
                  value: Number(v.key)
                })
              })
              // for (var item in res.data) {
              //   arr.push({
              //     label: res.data[item],
              //     value: Number(item)
              //   })
              // }
              if (this.searchHeader.searchItems.find(v => v.value === 'orderType')) {
                this.searchHeader.searchItems.find(v => v.value === 'orderType').options = arr
              }
            }
          })
          // 内容模型
          this.$request.fetchContentModelList({ 'channelId': id }).then(res => {
            console.log(res.data)
            if (res.code === 200) {
              var arr = res.data
              var arr2 = []
              var arr3 = []
              if (arr instanceof Array) {
                arr.forEach((v, i) => {
                  arr2.push({
                    type: 'Add',
                    id: v.id,
                    text: v.modelName,
                    icon: 'jia',
                    plain: true,
                    iconStyle: { fontSize: '11px' },
                    disabled: !this._checkPermission('/content', 'POST')
                  })
                  if (this.headers && i + 1 > this.headers.maxShowIndex) {
                    arr3.push({
                      label: v.modelName,
                      value: v.id,
                      icon: 'jia'
                    })
                  }
                })
                if (this.headers && arr.length > this.headers.maxShowIndex) {
                  arr2.push({
                    type: 'Add',
                    text: '更多新建',
                    btnType: 'dropdown',
                    options: arr3,
                    disabled: !this._checkPermission('/content', 'POST')
                  })
                }
              }
              if (this.headers) {
                this.headers.buttons = arr2
              }
              let options = [{ modelName: '所有', id: '' }]
              if (this.searchHeader.searchItems.find(v => v.value === 'modelId')) {
                this.searchHeader.searchItems.find(v => v.value === 'modelId').options = options.concat(arr)
              }
            }
          })
        }
      }
    },
    // 到详情页面
    handleEventEdit (data, btn) {
      this.$routerLink('/content/detail', 'Link', {
        id: data.cmsContent.id,
        channelId: this.channelId,
        isQuote: data.quote
      })
    },
    /**
     * 状态值改变
     * 1:草稿; 2-初稿 3:流转中; 4:已审核; 5:已发布; 6:退回; 7:下线 8-归档
     * */
    // 发布
    handleEventRelease (data, btn) {
      this.changeStatus(data, 5, '发布成功', true)
    },
    // 下线
    handleEventOffline (data, btn) {
      this.changeStatus(data, 7)
    },
    // 归档
    handleEventFile (data, btn) {
      this.changeStatus(data, 99)
    },
    // 出档
    handleEventFileout (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent ? data.cmsContent.id : data.id]
      }
      this.$request.fetchContentextFile({ ids: ids }).then(res => {
        this.restBack(res, '出档成功')
      })
    },
    // 待发布
    handleEventReleased (data, btn) {
      this.changeStatus(data, 4)
    },
    // 改变状态
    changeStatus (data, status, message = '操作成功', isCheck) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      var params = {
        ids: ids,
        status: parseInt(status),
        type: this.type
      }
      this.$request.fetchContentextStatus(params).then(res => {
        if (res.data === 10) {
          this.fabu = true
          let _this = this
          setTimeout(function () {
            _this.fabu = false
            if (isCheck) {
              _this.$emit('chackAmout', true)
            }
          }, 2000)
        } else {
          this.restBack(res, message)
        }
      })
    },
    // 预览
    handleEventPreview (data, btn) {
      if (data.cmsContent) {
        if (data.cmsContent.previewUrl) {
          window.open(data.cmsContent.previewUrl)
        } else {
          this.$message('没有预览地址')
        }
      }
    },
    // 浏览
    handleEventBrowse (data, btn) {
      if (data.cmsContent) {
        if (data.cmsContent.urlWhole) {
          window.open(data.cmsContent.urlWhole)
        } else {
          this.$message('没有浏览地址')
        }
      }
    },
    /**
     * 操作-可批量
     * */
    // 内容类型-动态
    handleEventCustom (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      var params = {
        'ids': ids,
        'contentTypeId': btn.contentTypeId || btn.id,
        'add': !btn.contentTypeStatus,
        'workType': this.type
      }
      this.$request.fetchContentextOperation(params).then(res => {
        this.restBack(res)
      })
    },
    // 排序
    handleEventSort (data, btn) {
      this.$refs.sortContent.showTheDialog(data, false)
    },

    // 引用
    handleEventQuote (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      const that = this
      const loop = function (list) {
        if (list instanceof Array && list.length) {
          return list.map(v => {
            if (v.id === that.id || v.id === that.channelId || !v.isBottom) {
              v.disabled = true
            }
            if ((v.children instanceof Array && v.children.length)) {
              v.disabled = true
              v.children = loop(v.children)
            }
            return v
          })
        }
        return []
      }
      let arr = loop(this.contentTree.data[0].children)
      var obj = {
        title: '引用',
        form: {
          ids: ids,
          workType: this.type,
          channelIds: [],
          createType: 1
        },
        formItems: [
          {
            prop: 'createType',
            type: 'radio',
            label: '选择方式',
            options: [
              {
                label: '链接型引用',
                value: 1,
                popoverText: '将内容的链接共享到所选栏目，所选栏目中生成一篇虚拟的内容，内容的模板依然用原来的模板，链接依然是原来的链接；数据库只存在1条记录；'
              },
              {
                label: '镜像型引用',
                value: 2,
                popoverText: '所选栏目中生成一篇虚拟的内容，内容的模板套用所选栏目的模板，生成新的链接地址；数据库只存在1条记录；'
              }
            ]
          },
          {
            prop: 'channelIds',
            type: 'checkTree',
            label: '选择栏目',
            labelWidth: '166px',
            onlySelectLeaf: true,
            tree: arr,
            props: {
              label: 'name',
              value: 'id'
            }
          }
        ],
        rules: {
          channelIds: [
            this.$rules.required()
          ]
        }
      }
      this.edit = Object.assign(theForm, obj)
      this.edit.form.type = btn.buttonPopUposType || btn.type
      this.$refs.editDialog.showDialog()
    },
    confirmQuote (data) {
      var params = data
      delete params.type
      this.$request.fetchContentextQuote(params).then(res => {
        this.restBack(res)
      })
    },
    // 取消引用
    handleEventDereference (data, btn) {
      let ids = []
      let channelIds = []
      if (data instanceof Array) {
        ids = data
        channelIds = []
      } else {
        ids = [data.cmsContent ? data.cmsContent.id : data.id]
        channelIds = data.cmsContent ? data.cmsContent.quoteChannelIds : []
      }
      let form = {
        ids: ids,
        channelIds: channelIds
      }
      console.log(form)
      let arr = this.contentTree.data[0].children.map(v => {
        if (!v.isBottom || v.id === this.id) {
          v.disabled = true
        }
        return v
      })
      var obj = {
        title: '取消引用',
        form: form,
        formItems: [
          {
            prop: 'createType',
            type: 'radio',
            label: '选择方式',
            options: [
              {
                label: '链接型引用',
                value: 1,
                showPopover: true
              },
              {
                label: '镜像型引用',
                value: 2,
                showPopover: true
              }
            ]
          },
          {
            prop: 'channelIds',
            type: 'checkTree',
            label: '选择栏目',
            labelWidth: '166px',
            tree: arr,
            props: {
              label: 'name',
              value: 'id'
            }
          }
        ],
        rules: {
          channelIds: [
            this.$rules.required()
          ]
        }
      }
      this.edit = Object.assign(theForm, obj)
      this.edit.form.type = btn.buttonPopUposType || btn.type
      this.$refs.editDialog.showDialog()
    },
    confirmDereference (data) {
      var params = data
      delete params.type
      this.$request.fetchContentextNoquote(params).then(res => {
        this.restBack(res)
      })
    },
    // 推送到站群
    handleEventPushstation (data, btn) {
      // sitePushOpen
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      var obj = {
        title: '推送到站群',
        form: {
          'contentIds': ids,
          'siteIds': [],
          'siteId': '',
          'pushSecret': '',
          'channelId': ''
        },
        formItems: [
          {
            prop: 'siteIds',
            type: 'cascader',
            label: '推送到站点',
            options: this.ownerTree,
            props: {
              label: 'name',
              value: 'id'
            }
          },
          {
            prop: 'channelId',
            type: 'selectTree',
            labelWidth: '166px',
            label: '选择栏目',
            onlySelectLeaf: true,
            options: [],
            hidden: (form) => {
              return form.siteIds.length > 0
            },
            props: {
              label: 'name',
              value: 'id'
            }
          },
          {
            prop: 'pushSecret',
            label: '密钥',
            maxlength: 50
          }
        ],
        rules: {
          siteIds: [
            this.$rules.required()
          ],
          pushSecret: this.sitePushOpen && this.sitePushSecret ? [this.$rules.required()] : [],
          channelId: [
            this.$rules.required()
          ]
        }
      }
      this.edit = Object.assign(theForm, obj)
      this.edit.form.type = btn.buttonPopUposType || btn.type
      this.$refs.editDialog.showDialog()
    },
    handleChangeCascader (item, ids) {
      let obj = {
        'Pushstation': 2,
        'Pushweixin': 15,
        'Pushweibo': 14
      }
      if (obj[this.edit.form.type] && ids.length) {
        let params = {
          'operator': obj[this.edit.form.type],
          'siteId': ids[ids.length - 1]
        }
        this.$request.fetchContentCommonTree(params).then(res => {
          if (res.code === 200) {
            this.edit.formItems.find(v => v.prop === 'channelId').options = res.data.map(t => {
              if (t.children instanceof Array && t.children.length) {
                t.disabled = true
              }
              return t
            })
          }
        })
      }
    },
    confirmPushstation (data) {
      var params = {
        'contentIds': data.contentIds,
        'siteId': data.siteIds[data.siteIds.length - 1],
        'pushSecret': data.pushSecret,
        'channelId': data.channelId
      }
      this.$request.fetchContentPushSites(params).then(res => {
        this.restBack(res)
      })
    },
    // 推送到微信
    handleEventPushweixin (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      var obj = {
        loading: false,
        width: '628px',
        title: '推送到微信公众号',
        form: {
          ids: ids,
          appid: ''
        },
        formLoading: false,
        rules: {
          appid: [
            this.$rules.required()
          ]
        },
        buttons: [
          {
            text: '推送',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            prop: 'appid',
            type: 'radioGroup',
            labelWidth: '0',
            rowKey: 'appId',
            groups: this.wechatInfoList,
            props: {
              label: 'wechatName',
              url: 'headImg'
            }
          }
        ]
      }
      this.edit = Object.assign(theForm, obj)
      this.edit.form.type = btn.buttonPopUposType || btn.type
      this.$refs.editDialog.showDialog()
    },
    confirmPushweixin (data) {
      if (data.ids.length <= 8) {
        let params = data
        params.ids = data.ids.join(',')
        this.$routerLink('/content/public/edit', 'edit', params)
      } else {
        this.$message('最多只能选择八篇内容')
      }
    },
    // 推送到微博
    handleEventPushweibo (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      var obj = {
        loading: false,
        width: '628px',
        title: '推送到新浪微博',
        form: { contentIds: ids, weiboIds: [] },
        formLoading: false,
        rules: {
          weiboIds: [
            this.$rules.required()
          ]
        },
        buttons: [
          {
            text: '推送',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            prop: 'weiboIds',
            type: 'checkList',
            labelWidth: '0',
            groups: this.weiboinfoList,
            props: {
              label: 'screenName', // 'wechatName',
              url: 'profileImageUrl' // 'headImg'
            }
          }
        ]
      }
      this.edit = Object.assign(theForm, obj)
      this.edit.form.type = btn.buttonPopUposType || btn.type
      this.$refs.editDialog.showDialog()
    },
    confirmPushweibo (data) {
      if (data.contentIds.length <= 5) {
        var params = { 'contentIds': data.contentIds, 'weiboIds': data.weiboIds }
        this.$request.weiboarticlepush(params).then(res => {
          this.restBack(res, '推送成功')
        })
      } else {
        this.$message('最多只能选择五篇内容')
      }

      // this.$routerLink('/content/sina/edit', 'edit', data)
    },
    // 复制
    handleEventCopy (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      let arr = this.contentTree.data[0].children.map(v => {
        if (!v.isBottom) {
          v.disabled = true
        }
        return v
      })
      var obj = {
        title: '复制',
        form: {
          ids: ids,
          channelId: ''
        },
        formItems: [
          {
            type: 'warning',
            text: ' 复制内容会在所选栏目中创建一篇一样的内容；数据库会存在多条记录'
          },
          {
            prop: 'channelId',
            type: 'selectTree',
            label: '选择栏目',
            onlySelectLeaf: true,
            options: arr,
            props: {
              label: 'channelName',
              value: 'id'
            }
          }
        ],
        rules: {
          channelId: [
            this.$rules.required()
          ]
        }
      }
      this.edit = Object.assign(theForm, obj)
      this.edit.form.type = btn.buttonPopUposType || btn.type
      this.$refs.editDialog.showDialog()
    },
    confirmCopy (data) {
      console.log(data)
      var params = { 'ids': data.ids, 'channelId': data.channelId }
      this.$request.fetchContentextDuplication(params).then(res => {
        this.restBack(res)
      })
    },
    // 移动
    handleEventMove (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      console.log(this.contentTree.data)
      let arr = this.contentTree.data[0].children.map(v => {
        if (!v.isBottom) {
          v.disabled = true
        }
        return v
      })
      var obj = {
        title: '移动到',
        form: {
          'ids': ids,
          'workType': this.type,
          'channelId': ''
        },
        formItems: [
          {
            prop: 'channelId',
            type: 'selectTree',
            label: '选择栏目',
            options: arr,
            onlySelectLeaf: true,
            props: {
              label: 'name',
              value: 'id'
            }
          }
        ],
        rules: {
          channelId: [
            this.$rules.required()
          ]
        }
      }
      this.edit = Object.assign(theForm, obj)
      this.edit.form.type = btn.buttonPopUposType || btn.type
      this.$refs.editDialog.showDialog()
    },
    confirmMove (data) {
      if (data.channelId) {
        var params = { 'ids': data.ids, 'workType': data.workType, 'channelId': data.channelId }
        this.$request.fetchContentextMove(params).then(res => {
          this.restBack(res)
        })
      }
    },
    // 置顶
    handleEventIstop (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      var obj = {
        title: '置顶',
        form: {
          'ids': ids,
          'workType': this.type,
          'times': [],
          'startTime': '',
          'endTime': ''
        },
        formItems: [
          {
            prop: 'times',
            type: 'timePicker',
            timeType: 'daterange',
            format: 'yyyy-MM-dd',
            explain: '不填表示永久置顶',
            startText: '置顶起始时间',
            endText: '置顶截止时间',
            label: '选择置顶时间',
            options: []
          }
        ]
      }
      this.edit = Object.assign(theForm, obj)
      this.edit.form.type = btn.buttonPopUposType || btn.type
      this.$refs.editDialog.showDialog()
    },
    confirmIstop (data) {
      console.log(data)
      var params = {
        startTime: data.times[0] || '',
        endTime: data.times[1] || '',
        ids: data.ids,
        workType: data.workType
      }
      this.$request.fetchContentextTop(params).then(res => {
        this.restBack(res)
      })
    },
    // 取消置顶
    handleEventNotop (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      this.msgChange('是否确定取消当前置顶？', () => {
        let params = {
          'ids': ids,
          'workType': this.type
        }
        this.$request.fetchContentextNotop(params).then(res => {
          this.restBack(res)
        })
      })
    },
    // 删除
    handleEventDelete (data, btn) {
      var ids = []
      if (data instanceof Array) {
        ids = data
      } else {
        ids = [data.cmsContent.id]
      }
      if (ids.length === 0) {
        this.$message('请选择需要删除的内容')
      } else {
        this.msgChange('是否确定删除选中内容？', this.fetchContentextRubbish, ids)
      }
    },
    // 加入回收站
    fetchContentextRubbish (ids) {
      this.loading = true
      var params = {
        workType: this.type,
        ids: ids
      }
      this.$request.fetchContentextRubbish(params).then(res => {
        let removeUrl = this.$route.fullPath
        this.$emit('chackAmout')
        if (this.list) {
          this.restBack(res)
        } else {
          this.$restBack(res, () => {
            this.removeTab(removeUrl)
            this.$routerLink('/content/index', 'list')
          })
        }
        this.loading = false
      })
    },
    // 回调-code=200
    restBack (res, message = '操作成功') {
      if (res.code === 200) {
        this.$message({
          message: message || res.message,
          type: 'success'
        })
        if (this.detail && this.detail.id) {
          this.getFormDatas(true)
        } else {
          this.fetchContentApi()
        }
      }
    },
    // 弹窗信息
    msgChange (message, fn, params) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        fn(params)
      }).catch(() => {})
    },
    // 获取来源列表
    getSourceList () {
      this.$request.fetchContentSourceList().then(res => {
        if (res.code === 200) {
          let obj = res.data.find(t => t.isDefault)
          if (obj) {
            this.sourceObj = obj
          }
        }
      })
    }

  }
}
