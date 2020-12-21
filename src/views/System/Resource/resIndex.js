
import baseHeader from '@/components/mixins/baseHeader'
import msgDialog from '@/components/mixins/msgDialog'
import formDialog from '@/components/mixins/formDialog'
import tableDialog from '@/components/mixins/tableDialog'
import searchHeader from '@/components/mixins/searchHeader'
import { mapGetters, mapActions } from 'vuex'

var columns = [
  {
    prop: 'alias',
    label: '文件名',
    scopeType: 'slot',
    width: '480px'
  },
  {
    prop: 'sizeUnit',
    label: '大小'
  },
  {
    prop: 'createTime',
    scopeType: 'time',
    format: 'YYYY.MM.DD HH:mm:ss',
    label: '创建日期'
  }
]
var shareColumns = [
  {
    prop: 'alias',
    label: '文件名',
    scopeType: 'slot',
    width: '480px'
  },
  {
    prop: 'sizeUnit',
    label: '大小'
  },
  {
    prop: 'createUser',
    label: '共享人'
  },
  {
    prop: 'shareTime',
    scopeType: 'time',
    format: 'YYYY.MM.DD HH:mm:ss',
    filter: true,
    label: '共享时间'
  }
]
export default {
  mixins: [baseHeader, msgDialog, searchHeader, formDialog, tableDialog],
  data () {
    return {
      // 列表数据结构
      params: {
        myRes: {
          loading: false,
          columns: columns,
          showIndex: false,
          api: '',
          params: {
            'shareStatus': '',
            'resourceType': '',
            'beginCreateTime': '',
            'endCreateTime': '',
            'alias': '',
            'page_sort': '',
            'page_sort_dir': '',
            'times': null,
            'sortType': 1,
            'id': ''
          },
          filterParams: ['times', 'sortType'],
          handleColumn: [
            {
              type: 'Rename',
              name: '重命名',
              icon: 'chongmingming',
              disabled: !this._checkPermission('/resourceSpaceDatas', 'PUT')
            },
            {
              type: 'Share',
              name: '共享',
              icon: 'gongxiang',
              disabled: !this._checkPermission('/resourceSpaceDatas/share', 'POST')
            },
            {
              type: 'Move',
              name: '移动',
              icon: 'yidong',
              disabled: !this._checkPermission('/resourceSpaceDatas/shift', 'PUT')
            },
            {
              type: 'Download',
              name: '下载',
              icon: 'xiazai',
              disabled: !this._checkPermission('/resourceSpaceDatas/download', 'POST')
            },
            {
              type: 'Delete',
              name: '删除',
              icon: 'tangchuangguanbi',
              disabled: !this._checkPermission('/resourceSpaceDatas', 'DELETE')
            }
          ],
          handleColumnProp: {
            label: '操作',
            width: '380',
            align: 'left'
          }
        },
        shareRes: {
          loading: false,
          columns: shareColumns,
          showIndex: false,
          api: '',
          params: {
            'id': '',
            'username': '',
            'alias': '',
            'resourceType': ''
          },
          handleColumn: [
            {
              type: 'Save',
              name: '保存到我的资源',
              icon: 'baocun',
              disabled: !this._checkPermission('/resourceSpaceDatas/shift', 'PUT')
            },
            {
              type: 'Download',
              name: '下载',
              icon: 'xiazai',
              disabled: !this._checkPermission('/resourceSpaceDatas/download', 'POST')
            }
          ],
          handleColumnProp: {
            label: '操作',
            width: '280',
            align: 'left'
          }
        }
      },
      // 搜索参数
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            label: '排序方式：',
            value: 'sortType',
            style: {
              width: '150px'
            },
            options: [
              { value: 1, label: '上传时间倒序' },
              { value: 2, label: '上传时间升序' },
              { value: 3, label: '文件大小倒序' },
              { value: 4, label: '文件大小升序' }
            ]
          },
          {
            type: 'select',
            label: '文件类型：',
            value: 'resourceType',
            style: {
              width: '120px'
            },
            options: [
              { value: '', label: '所有类型' },
              { value: '1', label: '图片' },
              { value: '2', label: '视频' },
              { value: '3', label: '音频' },
              { value: '4', label: '附件' }
            ]
          },
          {
            type: 'select',
            label: '是否共享：',
            value: 'shareStatus',
            hiddenKey: 'senior',
            hiddenValue: true,
            style: {
              width: '120px'
            },
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: '1',
                label: '未共享'
              },
              {
                value: '2',
                label: '已共享'
              }
            ]
          },
          {
            type: 'timePicker',
            label: '',
            value: 'times',
            rangeText: '-',
            startText: '起始上传时间',
            endText: '截止上传时间',
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'searchInput',
            value: 'alias',
            style: {
              width: '120px'
            },
            placeholder: '输入文件名'
          },
          {
            type: 'senior',
            value: 'senior'
          }
        ]
      },
      shareSearchHeader: {
        searchItems: [
          {
            type: 'select',
            label: '文件类型：',
            value: 'resourceType',
            style: {
              width: '150px'
            },
            options: [
              { value: '', label: '所有类型' },
              { value: '1', label: '图片' },
              { value: '2', label: '视频' },
              { value: '3', label: '音频' },
              { value: '4', label: '附件' }
            ]
          },
          {
            type: 'input',
            value: 'username',
            label: '共享人：',
            hiddenKey: 'id',
            hiddenValue: '',
            placeholder: '请输入用户名'
          },
          {
            type: 'searchInput',
            value: 'alias',
            placeholder: '输入文件名'
          }
        ]
      },
      // 重命名
      renames: {
        myRes: {},
        shareRes: {}
      },
      uploadFormLoading: false,
      uploadForm: {
        'fileName': '',
        'file': '',
        fileList: []
      },
      uploadRules: {
        fileName: [
          this.$rules.required('请选择需要上传的文件')
        ]
      },
      uploadButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      uploadFormItems: [
        {
          prop: 'fileName',
          type: 'upload',
          label: '选择文件',
          readonly: true,
          appendText: '选择文件',
          fileList: []
        }
      ],
      // 移动弹窗
      moveFormLoading: false,
      moveForm: {
        'ids': [],
        'type': 'Move',
        'storeResourcesSpaceId': ''
      },
      moveRules: {
        storeResourcesSpaceId: [
          this.$rules.required('请选择移动的位置')
        ]
      },
      moveButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      moveFormItems: [
        {
          prop: 'storeResourcesSpaceId',
          type: 'selectTree',
          options: []
        }
      ],
      // 新建分类
      addParams: {
        'name': '',
        'parentId': ''
      },
      updateResource: {},
      checkAll: false, // 是否全选
      errorMsg: true, // 资源空间名称
      moveTitle: '移动到', // 移动-保存
      addType: '',
      left: 0, // 菜单位置
      top: 0, //
      showImgMenus: false, // 资源右键菜单
      detailInfo: {}, // 详情信息
      imgDialog: {
        show: false,
        url: ''
      },
      fileUrl: '',
      showFile: false,
      resourceType: 0,
      width: '821px',
      height: 'auto',
      dialogVisible: false // 详情弹窗
    }
  },
  computed: {
    // 获取系统设置项
    ...mapGetters(['organizeOptionsAll', 'roleOptions'])
  },
  inject: ['reflushCurrentPage'],
  filters: {
    typeFilter (val) {
      var arr = ['', '图片', '视频', '音频', '附件']
      return arr[parseInt(val)]
    }
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptionsAll', 'FetchRoleOptions']),
    handleSearchs (item) {
      // sortType
      this.list.pageNo = 1
      var data = this.list.params
      if (data.sortType) {
        switch (data.sortType) {
          case 1:
            data.page_sort = 'createTime'
            data.page_sort_dir = 'desc'
            break
          case 2:
            data.page_sort = 'createTime'
            data.page_sort_dir = 'asc'
            break
          case 3:
            data.page_sort = 'size'
            data.page_sort_dir = 'desc'
            break
          case 4:
            data.page_sort = 'size'
            data.page_sort_dir = 'asc'
            break
          default:
            data.page_sort = ''
            data.page_sort_dir = ''
            break
        }
      }
      if (data.times) {
        data.beginCreateTime = data.times[0]
        data.endCreateTime = data.times[1]
      } else {
        data.beginCreateTime = ''
        data.endCreateTime = ''
      }
      this.list.params = data
      this.restData()
    },
    hasId (id, ids) {
      if (!ids) {
        ids = []
      }
      return ids.indexOf(id) > -1
    },
    // 预览
    preview (row) {
      // 1图片 2视频 3音频 4附件 5文档 6压缩包 fileUrl previewUrl
      this.resourceType = row.resourceType
      if (row.resourceType === 5) {
        // this.list.loading = true
        // this.$previewDoc(row.id, () => {
        //   this.list.loading = false
        // })
      } else if (row.resourceType === 4 || row.resourceType === 6) {
        return false
      } else {
        this.showFile = true
        this.fileUrl = this.$getPath(row.fileUrl)
        if (this.resourceType === 1) {
          //     this.imgDialog.show = true
          // this.imgDialog.url = item.url
          this.width = row.width ? row.width + 'px' : '600px'
          this.height = row.height ? row.height + 'px' : 'auto'
        } else if (this.resourceType === 3) {
          this.width = '400px'
          this.height = 'auto'
        } else {
          this.width = '821px'
          this.height = 'auto'
        }
      }
    },
    // 上传
    beforeUpload (file, type, fileList) {
      if (fileList.length) {
        this.uploadForm.fileName = file.name
        this.uploadForm.file = file
        this.uploadForm.type = type
        this.uploadForm.fileList = fileList
      }
    },
    handleConfirmAdd (data, btn) {
      if (data.fileList.length) {
        data.fileList.forEach((t, i) => {
          this.uploadFiles(t, data.fileList.length - 1 === i)
        })
      }
    },
    uploadFiles (file, status) {
      const param = new FormData() // 创建form对象
      param.append('uploadFile', file.raw, file.name)
      param.append('spaceId', this.list.params.id) // 添加form表单中其他数据
      // param.append('typeStr', data.type) // 添加form表单中其他数据
      param.append('addToRes', true) // 添加form表单中其他数据
      this.$request.fetchUpload(param).then(res => {
        if (res.code === 200) {
          if (status) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.uploadForm.fileList = []
            setTimeout(() => {
              this.restData()
            }, 500)
          }
        }
      })
    },
    moveConfirmAdd (data, btn) {
      // 移动
      if (data.type === 'Move') {
        var params = {
          ids: data.ids,
          storeResourcesSpaceId: data.storeResourcesSpaceId
        }
        this.$request.resourceSpaceDatasMove(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.restData()
          }
        })
      } else {
        var param = {
          ids: data.ids,
          spaceId: data.storeResourcesSpaceId
        }
        this.$request.resourceSpaceDatasSave(param).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.restData()
          }
        })
      }
    },
    // 分享
    shareConfirmAdd (data, btn) {
      var params = {}
      if (data.type === 'Share') {
        if (data.orgIds.length > 0 || data.roleIds.length > 0 || data.userIds.length > 0) {
          params = {
            ids: this.list.selectedKeys,
            ...data
          }
          this.$request.resourceSpaceDatasShare(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '共享成功',
                type: 'success'
              })
              this.$refs.shareForm.handleCancel()
              this.restData()
              this.reflushTree(this.activeName)
            }
          })
        } else {
          this.$message('请在组织，角色，用户中至少选择一项')
        }
      } else if (data.type === 'Config') {
        if (data.orgIds.length > 0 || data.roleIds.length > 0 || data.userIds.length > 0) {
          params = {
            'orgIds': data.orgIds,
            'userIds': data.userIds,
            'roleIds': data.roleIds
          }
          this.$request.resourceSpaceDatasSharePut(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '设置成功',
                type: 'success'
              })
              this.$refs.shareForm.handleCancel()
              this.restData()
            }
          })
        } else {
          this.$message('请在组织，角色，用户中至少选择一项')
        }
      } else if (data.type === 'Datas') {
        if (data.orgIds.length > 0 || data.roleIds.length > 0 || data.userIds.length > 0) {
          params = {
            id: data.id,
            ...data
          }
          this.$request.resourceSpaceShare(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '共享成功',
                type: 'success'
              })
              this.$refs.shareForm.handleCancel()
              this.restData()
              this.reflushTree(this.activeName)
            }
          })
        } else {
          this.$message('请在组织，角色，用户中至少选择一项')
        }
      }
    },
    handleSizeChanges (val) {
      this.list.pageSize = val
      this.list.selectedKeys = []
      this.restData()
    },
    tabContent (type) {
      this.isActiveName = type
    },
    // 全选
    checksAll (check) {
      var ids = this.list.data.map(v => { return v.id })
      this.list.selectedKeys = check ? ids : []
    },
    activeClick (item) {
      var ids = this.list.selectedKeys
      if (ids.indexOf(item.id) > -1) {
        this.list.selectedKeys.splice(ids.indexOf(item.id), 1)
      } else {
        this.list.selectedKeys.push(item.id)
      }
    },
    getListKeys (data) {
      // 获取当前选中id
      this.list.selectedKeys = data
      let checkedCount = data.length
      this.checkAll = checkedCount === (this.list.data && this.list.data.length) || 0
      this.isIndeterminate = checkedCount > 0 && (checkedCount < (this.list.data && this.list.data.length) || 0)
    },
    checkboxOne (item) {
      var ids = this.list.selectedKeys
      if (ids.indexOf(item.id) > -1) {
        this.list.selectedKeys.splice(ids.indexOf(item.id), 1)
      } else {
        this.list.selectedKeys.push(item.id)
      }
    },
    closeMenu () {
      this.showImgMenus = false
    },
    // 弹出框操作按钮
    handleConfirmMsg (type) {
      this.resourceSpaceDatasDelete(this.msgDialog.data)
    },
    // 树形点击

    // 表格操作项
    handleTableRename (data, btn) {
      // 重命名
      this.resourceNameEdit(data, 'edit')
    },
    handleTableShare (data, btn) {
      // 共享
      var item = { type: 'Share' }
      var ids = [data.id]
      this.handleEventShare(item, ids)
    },
    handleTableMove (data, btn) {
      // 移动
      var item = { type: 'Move' }
      var ids = [data.id]
      this.handleEventMove(item, ids)
    },
    handleTableDownload (data, btn) {
      // 下载
      var ids = [data.id]
      this.$request.resourceSpaceDatasDownload({ ids: ids }).then(res => {
        this.$exportClick(res, data.alias + data.suffix)
      })
    },
    handleTableDelete (data, btn) {
      // 删除
      this.msgDialog.type = 'DeleteOne'
      this.msgDialog.content = '是否确定删除？'
      this.msgDialog.data = [data.id]
      this.showMsgDialog()
    },
    handleTableSave (data, btn) {
      // 保存
      var item = { type: 'Save' }
      var ids = [data.id]
      this.handleEventSave(item, ids)
    },
    resourceSpaceDatasDelete (ids) {
      this.$request.resourceSpaceDatasDelete({ ids: ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.restData()
        }
      })
    },
    // 初始化
    restData () {
      this.getListKeys([])
      this.fetchTableApi()
    },
    // 表格头部多个操作
    handleEventLink (type, item) {
      if (this.list.selectedKeys.length > 0 && type !== 'Upload' && type !== 'Config') {
        switch (type) {
          case 'Share':
            return this.handleEventShare(item, this.list.selectedKeys)
          case 'UnShare':
            return this.handleEventUnShare(item, this.list.selectedKeys)
          case 'Move':
            return this.handleEventMove(item, this.list.selectedKeys)
          case 'Download':
            return this.handleEventDownload(item, this.list.selectedKeys)
          case 'Delete':
            return this.handleEventDelete(item, this.list.selectedKeys)
          case 'Save':
            return this.handleEventSave(item, this.list.selectedKeys)
          default:
            return console.log(type + '未检测到当前类型')
        }
      } else if (type === 'Upload') {
        this.$refs.uploadDialog.showDialog()
      } else if (type === 'Config') {
        this.$refs.shareForm.showDialog('config', { type: type }, this.list.selectedKeys)
      } else {
        this.$message('请至少选择一项')
      }
    },
    handleEventShare (data, ids) {
      this.$refs.shareForm.showDialog('add', data, ids)
    },
    handleEventUnShare (data, ids) {
      this.$request.resourceSpaceDatasUnShare({ ids: ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.restData()
          this.reflushTree(this.activeName)
        }
      })
    },
    handleEventMove (data, ids) {
      // 移动
      this.moveTitle = '移动到'
      this.moveForm.ids = ids
      this.moveForm.type = data.type
      this.moveFormItems[0].options = this.tree.data[0].children
      this.$refs.moveDialog.showDialog()
    },
    handleEventDownload (data, ids) {
      var name = '下载集合.zip'
      if (ids.length === 1) {
        name = this.list.data.find(v => v.id === ids[0]).alias + this.list.data.find(v => v.id === ids[0]).suffix
      }
      this.$request.resourceSpaceDatasDownload({ ids: ids }).then(res => {
        this.$exportClick(res, name)
      })
    },
    handleEventDelete (data, ids) {
      this.msgDialog.type = 'Delete'
      this.msgDialog.content = '是否确定删除？'
      this.msgDialog.data = ids
      this.showMsgDialog()
    },
    handleEventSave (data, ids) {
      // 保存
      this.moveTitle = '保存到'
      this.moveForm.ids = ids
      this.moveForm.type = data.type
      this.moveFormItems[0].options = this.tree.data[0].children
      this.$refs.moveDialog.showDialog()
    },
    // 重命名
    resourceNameEdit (row, type) {
      if (row.alias) {
        if (type === 'edit') {
          this.renames[this.activeName][row.id].edit = true
        } else {
          this.renameUnique(row)
        }
      }
    },
    renameUnique (row) {
      var params = {
        'id': row.id,
        'alias': row.alias,
        'spaceId': this.list.params.id
      }
      this.$request.resourceSpaceDatasNameUnique(params).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.renames[this.activeName][row.id].edit = false
            this.$request.resourceSpaceDatasUpdate(params).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.restData()
              }
            })
          } else {
            this.$message({
              message: '资源名重复',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    suffixFilter (val) {
      // resourceType
      switch (parseInt(val)) {
        case 1:
          return this.$lookupIcon('image')
        case 2:
          return this.$lookupIcon('video')
        case 3:
          return this.$lookupIcon('audio')
        case 4:
          return this.$lookupIcon('file')
        default:
          return this.$lookupIcon('unknown')
      }
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        var obj = {}
        if (res.data.content instanceof Array) {
          let arr = res.data.content.map((d, i) => {
            obj[d.id] = d
            obj[d.id].edit = false
            let item = this.$lookupIcon(d.suffix.slice(1))
            if (item) {
              d.icon = item.icon
              d.fill = item.fill
            } else {
              item = this.suffixFilter(d.resourceType)
              d.icon = item.icon
              d.fill = item.fill
            }
            return d
          })
          this.$set(this.params[this.activeName], 'data', arr)
          this.list.data = this.params[this.activeName].data
        }
        this.list.totalCount = res.data.totalElements
        this.renames[this.activeName] = obj
      }
      this.list.loading = false
    },

    showResourceMenus (item, i, e) {
      this.imageMenuId = item.id
      // 右键
      this.showImgMenus = true
      // clientX
      this.left = e.offsetX
      this.top = e.offsetY
      this.updateResource = item
      if (this.activeName === 'myRes' && item.shareStatus === 2) {
        this.menuItemList.myRes[2].text = '取消共享'
        this.menuItemList.myRes[2].disabled = !this._checkPermission('/resourceSpaceDatas/unShare', 'POST')
      } else {
        this.menuItemList.myRes[2].text = '共享'
        this.menuItemList.myRes[2].disabled = !this._checkPermission('/resourceSpaceDatas/share', 'POST')
      }
    },
    resourceClick (data) {
      var item = this.updateResource
      switch (data.key) {
        case '1':
          this.resourceNameEdit(item, 'edit')
          break
        case '2':
          this.handleTableMove(item)
          break
        case '3':
          if (this.updateResource.shareStatus === 2) {
            this.handleEventUnShare(item, [item.id])
          } else {
            this.handleTableShare(item)
          }
          break
        case '4':
          this.$request.resourceSpaceDatasGet(item).then(res => {
            if (res.code === 200) {
              this.detailInfo = res.data
            }
          })
          this.dialogVisible = true
          break
        case '5':
          this.handleTableDelete(item)
          break
        case '6':
          this.handleEventDownload(item, [item.id])
          break
        case '7':
          this.handleTableSave(item)
          break
        default:
          return false
      }
      this.closeMenu()
    },

    handleClose () {
      this.dialogVisible = false
    }
  }
}
