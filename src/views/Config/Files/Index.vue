<template>
  <section class="config-files-index-container">

    <div class="box-left">
      <el-aside width="220px">
        <directory-tree v-bind="tree" @upTree="upTree"
        ></directory-tree>
      </el-aside>
    </div>
    <section class="box-right">
      <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
      v-on:handleUpload="handleHeaderUpload"
      v-on:handleNew="handleHeaderNew"
      />
      <base-table
        v-bind="list"
        @handleSelectionChange="handleSelectionChange"
        v-on:handleDelete="handleTableDelete"
      >
        <template #filename="scope">
          <div :class="{'jee-color': !scope.scope.row.directory}"
            style='text-overflow: ellipsis;overflow: hidden;'
          @click="rowHref(scope.scope.row)">{{scope.scope.row.filename}}</div>
        </template>
      </base-table>
      <form-dialog
        ref="addDialog"
        title="新建目录"
        :buttons='dialogButtons'
        :loading="addFormLoading"
        :form="addForm"
        :rules="addRules"
        :formItems="addFormItems"
        v-on:handleConfirm="handleConfirmAdd"
      ></form-dialog>
      <form-dialog
          title="上传"
          ref="uploadDialog"
          :loading="uploadFormLoading"
          :form="uploadForm"
          :rules="uploadRules"
          :buttons="uploadButtons"
          :formItems="uploadFormItems"
          v-on:handleConfirm="handleConfirmAddUpload"
          @beforeUpload="beforeUpload"
        ></form-dialog>
    </section>
    <hint-dialog
        v-bind="hintDialog"
        ref="importFormhintDialog"
        v-on:handleConfirm="handleConfirmMsg"
        v-on:handleDelete="handleDelete"
        v-on:handleCancel="hideMsgDialog"
    ></hint-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import DirectoryTree from '@/views/Config/Templates/DirectoryTree.js'
import formDialog from '@/components/mixins/formDialog'
import hintDialog from '@/views/Config/Templates/hintDialog.js'

const columns = [
  {
    prop: 'filename',
    label: '模板名',
    scopeType: 'slot',
    showOverflowTooltip: true
  },
  {
    prop: 'sizeUnit',
    label: '大小'
  },
  {
    scopeType: 'time',
    prop: 'lastModifiedDate',
    label: '最后修改时间'
  }
]

export default {
  name: 'configFilesIndex',
  mixins: [baseHeader, baseTable, DirectoryTree, formDialog, hintDialog],
  data () {
    var dirname = (rule, value, callback) => {
      if (value) {
        var params = {
          dirName: value,
          root: this.$encode(this.list.params.root, true)
        }
        this.$request.fetchResourceUniqueDir(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('目录名称有重复'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      tree: {
        loading: false,
        data: [
          {
            children: [],
            directory: true,
            filename: '文件根目录'
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        topBtnShow: false
      },
      list: {
        columns,
        api: 'fetchResourceList',
        showSelection: true,
        showPagination: false,
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/resource', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          align: 'left',
          width: '75px'
        },
        rowKey: 'name'
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建文件',
            icon: 'xinjian',
            disabled: !this._checkPermission('/resource', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/resource', 'DELETE')
          },
          {
            type: 'Upload',
            text: '上传',
            icon: 'shangchuan',
            disabled: !this._checkPermission('/resource/upload', 'POST')
          },
          {
            type: 'New',
            text: '新建目录',
            icon: 'weidakaiwenjianjia',
            disabled: !this._checkPermission('/resource/dir', 'POST')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      addFormLoading: false,
      addForm: {
        dirName: '',
        root: ''
      },
      addRules: {
        dirName: [this.$rules.required(), this.$rules.cnEnNum(), { validator: dirname, trigger: 'blur' }]
      },
      addFormItems: [
        {
          prop: 'dirName',
          label: '目录名称',
          placeholder: '请输入目录名称',
          maxlength: 50
        }
      ],
      dialogButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ],
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
      hintDialog: {
        visible: false,
        showCancel: true,
        content: '检测到系统存在相同名称的文件，是否替换？',
        type: 'Delete',
        data: {}
      }
    }
  },
  methods: {
    // 上传
    beforeUpload (file, type, fileList) {
      if (fileList.length) {
        this.uploadForm.fileName = file.name
        this.uploadForm.file = file
        this.uploadForm.fileList = fileList
        let root = ''
        if (this.list.params.root) {
          root = this.$encode(this.list.params.root, true)
        }
        fileList.forEach(t => {
          let params = {
            dirName: t.name,
            root: root
          }
          if (this.uploadForm.namesake) {
            this.$request.fetchResourceUniqueDir(params).then(res => {
              if (res.code === 200) {
                if (res.data) {
                  this.hintDialog.visible = false
                  this.uploadForm.namesake = true
                } else {
                  this.hintDialog.visible = true
                  this.uploadForm.namesake = false
                }
              }
            })
          }
        })
      }
    },
    handleConfirmAddUpload (data, btn) {
      if (data.fileList.length) {
        data.fileList.forEach((t, i) => {
          this.uploadFiles(t, data.fileList.length - 1 === i)
        })
      }
    },
    uploadFiles (file, status) {
      const param = new FormData() // 创建form对象
      param.append('uploadFile', file.raw, file.name)
      if (this.list.params.root) {
        param.append('root', this.$encode(this.list.params.root, true))
      }
      if (this.uploadForm.isCover !== undefined) {
        param.append('isCover', this.uploadForm.isCover)
      }
      this.$request.fetchResourceUpload(param).then(res => {
        if (res.code === 200) {
          if (status) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.list.params.root = this.$encode(this.list.params.root, true)
            this.uploadForm.fileList = []
            setTimeout(() => {
              this.fetchTableApi()
            }, 500)
          }
        }
      })
    },
    // 保留
    handleConfirmMsg () {
      this.uploadForm.isCover = false
      this.hintDialog.visible = false
      this.uploadForm.namesake = true
      this.handleConfirmAddUpload(this.uploadForm)
      this.$refs.uploadDialog.handleCancel()
    },
    // 取消
    hideMsgDialog () {
      this.hintDialog.visible = false
    },
    // 替换
    handleDelete () {
      this.uploadForm.isCover = true
      this.hintDialog.visible = false
      this.uploadForm.namesake = true
      this.handleConfirmAddUpload(this.uploadForm)
      this.$refs.uploadDialog.handleCancel()
    },
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchResourceDelete([row.name])
      })
    },
    // 新建模板
    handleHeaderCreate () {
      this.$routerLink('/config/files/detail?root=' + this.list.params.root + '&news=true')
    },
    // 删除访问
    fetchResourceDelete (data) {
      let names = data.map(t => {
        return this.$encode(t, true)
      })
      this.$request.fetchResourceDelete({ names }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.list.params.root = this.$encode(this.list.params.root, true)
          this.fetchTableApi()
          this.fetchResourceTree()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data
        this.list.params.root = this.$decode(this.list.params.root)
        // this.list.totalCount = res.data.totalElements
      }
    },
    // 批量删除
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定批量删除文件？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchResourceDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    upTree (data) {
      if (data.directory) {
        this.list.params.root = this.$encode(data.name, true)
        this.fetchTableApi()
      } else {
        this.$routerLink('/config/files/detail?root=' + data.name)
      }
    },
    // 上传
    handleHeaderUpload () {
      this.$refs.uploadDialog.showDialog()
    },
    // 新建目录
    handleHeaderNew () {
      this.$refs.addDialog.showDialog()
    },
    // 跳转判断
    rowHref (data) {
      if (data.directory) {
        this.list.params.root = this.$encode(data.name, true)
        this.fetchTableApi()
      } else if (data.filename.endsWith('.css') || data.filename.endsWith('.js')) {
        this.$routerLink('/config/files/detail?root=' + data.name)
      } else {
        this.$message('只能修改.css和.js文件')
      }
    },
    // 创建文件夹
    handleConfirmAdd (data) {
      data.root = this.$encode(this.list.params.root, true)
      this.fetchResourceDir(data)
    },
    // 创建文件夹访问
    fetchResourceDir (data) {
      this.$request.fetchResourceDir(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.list.params.root = this.$encode(this.list.params.root, true)
          this.fetchTableApi()
          this.fetchResourceTree()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 树结构
    fetchResourceTree () {
      this.$request.fetchResourceTree().then(res => {
        if (res.code === 200) {
          this.tree.data[0].children = res.data
        }
      })
    }
  },
  mounted () {
    this.list.params.root = this.$encode(this.list.params.root, true)
    this.$nextTick(() => {
      this.fetchResourceTree()
    })
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.list.params.root = this.$encode(this.list.params.root, true)
      this.fetchTableApi()
      this.fetchResourceTree()
      this.$router.push({ query: { type: '', ...this.$route.query } })
    }
  }
}
</script>

<style lang="scss">
.config-files-index-container{
  height: calc(100vh - 150px);
  background-color: #ffffff;
  display: flex;
  &:hover .vertical {
    ::-webkit-scrollbar {
      height: 0;
    }
  }
  .vertical{
    height: calc(100vh - 150px) !important;
    border-radius: 4px !important;
  }
  .left-btn{
    height: 50px;
  }
  .box-right{
    width: 100%;
    margin-left: 10px;
  }
  .el-button{
    margin-bottom: 0 !important;//删除操作说明修改的样式
  }
}

</style>
