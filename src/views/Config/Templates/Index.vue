<template>
  <section class="config-template-index-container">
    <div class="box-left">
      <el-aside width="220px">
        <directory-tree v-bind="tree" @upTree="upTree" @importsBtn='importsBtn()' @exportedBtn='exportedBtn()'
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
        <!-- 模块名称 -->
        <template #filename="scope">
          <div class='filename' :class="{'jee-color': !scope.scope.row.directory}" @click="rowHref(scope.scope.row)">{{scope.scope.row.filename}}</div>
        </template>
        <!-- 状态 -->
        <template #status="scope">
          <span v-if="!scope.scope.row.quote">— —</span>
          <el-popover
            v-else-if="scope.scope.row.quote === 1"
            placement="bottom-start"
            width="270"
            trigger="hover"
            popper-class="quote-popover-wrap"
          >
            <span class='status-primary' slot="reference">引用中</span>
            <ul class='scrollbar'>
              <li><span>引用位置</span><span>详情</span></li>
              <li v-for="(item, index) in scope.scope.row.channels" :key="index">
                <span>栏目</span><el-link :underline='false' type='primary' class='jee-color' @click="handleClickQuote(item)">{{item.name}}</el-link>
              </li>
            </ul>
          </el-popover>
          <span class='status-primary' v-else>引用中</span>
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
        <form-dialog
          title="导出模板"
          ref="ExportDialog"
          :loading="ExportFormLoading"
          :form="ExportForm"
          :rules="ExportRules"
          :buttons="ExportButtons"
          :formItems="ExportFormItems"
          @handleBtns='handleBtns'
          class="import-from"
        ></form-dialog>
        <form-dialog
          title="导入模板"
          ref="importFormAddDialog"
          :loading="importFormLoading"
          :form="importForm"
          :rules="importRules"
          :buttons="importButtons"
          :formItems="importFormItems"
          v-on:handleConfirm="handleConfirmImport"
          @beforeUpload="beforeImport"
        ></form-dialog>
      <hint-dialog
          v-bind="hintDialog"
          ref="importFormhintDialog"
          v-on:handleConfirm="handleConfirmMsg"
          v-on:handleDelete="handleDelete"
          v-on:handleCancel="hideMsgDialog"
      ></hint-dialog>
      <hint-dialog
          v-bind="hintDialog2"
          ref="uploadFormhintDialog"
          v-on:handleConfirm="handleConfirmMsg2"
          v-on:handleDelete="handleDelete2"
          v-on:handleCancel="hideMsgDialog2"
      ></hint-dialog>
    </section>
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
    scopeType: 'slot'
  },
  {
    prop: 'sizeUnit',
    label: '大小'
  },
  {
    prop: 'status',
    label: '状态',
    scopeType: 'slot'
  },
  {
    scopeType: 'time',
    prop: 'lastModifiedDate',
    label: '最后修改时间'
  }
]

export default {
  name: 'configTemplateseIndex',
  mixins: [baseHeader, baseTable, DirectoryTree, formDialog, hintDialog],
  data () {
    var dirname = (rule, value, callback) => {
      if (value) {
        var params = {
          dirName: value,
          root: this.$encode(this.list.params.root, true)
        }
        this.$request.fetchTemplateUniqueDirName(params).then(res => {
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
            filename: '模板根目录',
            directory: true
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        topBtnShow: true
      },
      list: {
        columns,
        api: 'fetchTemplateList',
        showSelection: true,
        showPagination: false,
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/template', 'DELETE')
          }
        ],
        handleColumnProp: {
          width: '75px'
        },
        rowKey: 'name'
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建模板',
            icon: 'xinjian',
            disabled: !this._checkPermission('/template', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/template', 'DELETE')
          },
          {
            type: 'Upload',
            text: '上传',
            icon: 'shangchuan',
            disabled: !this._checkPermission('/template/upload', 'POST')
          },
          {
            type: 'New',
            text: '新建目录',
            icon: 'weidakaiwenjianjia',
            disabled: !this._checkPermission('/template/dir', 'POST')
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
        dirName: [this.$rules.required(), { validator: dirname, trigger: 'blur' }, this.$rules.cnEnNum()]
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
      ExportFormLoading: false,
      ExportForm: {
        solution: 'default'
      },
      ExportRules: {
        solution: [this.$rules.requiredSelect()]
      },
      ExportButtons: [

      ],
      ExportFormItems: [
        {
          type: 'select',
          prop: 'solution',
          label: '选择方案',
          placeholder: '请选择',
          btnsText: '导出',
          options: [

          ]
        }
      ],
      importFormLoading: false,
      importForm: {
        uploadFile: '',
        name: ''
      },
      importRules: {
        uploadFile: [
          this.$rules.required('请选择需要导入的文件')
        ]
      },
      importButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      importFormItems: [
        {
          prop: 'name',
          type: 'upload',
          label: '选择模板方案',
          readonly: true,
          appendText: '选择文件',
          fileList: []
        }
      ],
      hintDialog: {
        visible: false,
        showCancel: true,
        content: '检测到系统存在相同名称的模版方案，是否替换？',
        type: 'Delete',
        data: {}
      },
      hintDialog2: {
        visible: false,
        showCancel: true,
        content: '检测到系统存在相同名称的文件，是否替换？',
        type: 'Delete',
        data: {}
      }
    }
  },
  methods: {
    // 链接栏目
    handleClickQuote (item) {
      this.$router.push({ name: 'columnIndex', query: { id: item.id } })
    },
    // 导出
    exportedBtn () {
      this.$refs.ExportDialog.showDialog()
    },
    // 导出模板
    handleBtns () {
      window.open(`${this.$path}${this.$prefix}/template/export?solution=${this.ExportForm.solution}`)

      // var name = this.ExportForm.solution
      // name += '.zip'
      // this.$request.fetchTemplateExport(this.ExportForm).then(res => {
      //   // if (res.code === 200) {
      //   this.$exportClick(res, name)
      //   // }
      // })
    },
    // 导入
    importsBtn () {
      this.$refs.importFormAddDialog.showDialog()
    },
    beforeImport (file, type) {
      this.importForm.name = file.name
      this.importForm.file = file
      this.fetchTemplateUniqueName(this.importForm.name)
    },
    // 检测模板名是否相同
    fetchTemplateUniqueName (data) {
      var name = data.substring(0, data.length - 4)
      this.$request.fetchTemplateUniqueName({ name: this.$encode(name, true) }).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.hintDialog.visible = false
            this.importForm.namesake = true
          } else {
            this.hintDialog.visible = true
            this.importForm.namesake = false
          }
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 保留
    handleConfirmMsg () {
      this.importForm.isCover = false
      this.hintDialog.visible = false
      this.importForm.namesake = true
      this.handleConfirmImport(this.importForm)
      this.$refs.importFormAddDialog.handleCancel()
    },
    // 取消
    hideMsgDialog () {
      this.hintDialog.visible = false
    },
    // 替换
    handleDelete () {
      this.importForm.isCover = true
      this.hintDialog.visible = false
      this.importForm.namesake = true
      this.handleConfirmImport(this.importForm)
      this.$refs.importFormAddDialog.handleCancel()
    },
    // 导入接入
    handleConfirmImport (data, btn) {
      if (!data.name) {
        this.$message('请选择导入模板')
        return false
      }
      if (this.importForm.namesake) {
        const param = new FormData() // 创建form对象
        param.append('uploadFile', data.file.raw, data.fileName) // 通过append向form对象添加数据
        if (this.importForm.isCover !== undefined) {
          param.append('isCover', this.importForm.isCover) // 添加form表单中其他数据
        }
        this.$request.fetchTemplateImport(param).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '导入成功',
              type: 'success'
            })
            this.list.params.root = this.$encode(this.list.params.root, true)
            this.fetchTableApi()
            this.fetchTemplateTree()
          }
        })
      } else {
        this.$message('请选择是否保留删除')
      }
    },
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
            this.$request.fetchTemplateUniqueDirName(params).then(res => {
              if (res.code === 200) {
                if (res.data) {
                  this.hintDialog2.visible = false
                  this.uploadForm.namesake = true
                } else {
                  this.hintDialog2.visible = true
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
      this.$request.fetchTemplateUpload(param).then(res => {
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
              this.fetchTemplateTree()
            }, 500)
          }
        }
      })
    },
    // 保留
    handleConfirmMsg2 () {
      this.uploadForm.isCover = false
      this.hintDialog2.visible = false
      this.uploadForm.namesake = true
      this.handleConfirmAddUpload(this.uploadForm)
      this.$refs.uploadDialog.handleCancel()
    },
    // 取消
    hideMsgDialog2 () {
      this.hintDialog2.visible = false
    },
    // 替换
    handleDelete2 () {
      this.uploadForm.isCover = true
      this.hintDialog2.visible = false
      this.uploadForm.namesake = true
      this.handleConfirmAddUpload(this.uploadForm)
      this.$refs.uploadDialog.handleCancel()
    },
    // 表格操作按钮
    handleTableDelete (row, index) {
      // 1 栏目引用 2内容引用 3首页引用 空没有引用
      let msg = '是否确定删除？'
      if (row.quote === 1) {
        const channels = row.channels.map(d => `<a class='jee-color' href='#/column/index?id=${d.id}'>${d.name}</a>`).join('，')
        msg = `<p>所选模板已被栏目（${channels}）引用，删除后可能导致无法正常访问，是否确定删除？</p>`
      } else if (row.quote === 2) {
        msg = '所选模板已被内容页引用，删除后可能导致无法正常访问，是否确定删除？'
      } else if (row.quote === 3) {
        msg = '所选模板已被首页引用，删除后可能导致无法正常访问，是否确定删除？'
      }
      this.$confirm(msg, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchTemplateDelete([row.name])
      })
    },
    // 新建模板
    handleHeaderCreate () {
      this.$routerLink('/config/templates/detail?root=' + this.list.params.root + '&news=true')
    },
    // 删除访问
    fetchTemplateDelete (data) {
      let names = data.map(t => {
        return this.$encode(t, true)
      })
      this.$request.fetchTemplateDelete({ names }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.list.params.root = this.$encode(this.list.params.root, true)
          this.fetchTableApi()
          this.fetchTemplateTree()
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
          this.fetchTemplateDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    upTree (data) {
      if (data.directory) {
        this.list.params.root = this.$encode(data.name || '', true)
        this.fetchTableApi()
      } else {
        this.$routerLink('/config/templates/detail?root=' + data.name + '&html=true')
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
      } else if (data.filename.endsWith('.html')) {
        this.$routerLink('/config/templates/detail?root=' + data.name + '&html=true')
      } else {
        this.$message('只能修改.html文件')
      }
    },
    // 创建文件夹
    handleConfirmAdd (data) {
      data.root = this.$encode(this.list.params.root, true)
      this.fetchTemplateDir(data)
    },
    // 创建文件夹访问
    fetchTemplateDir (data) {
      this.$request.fetchTemplateDir(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.list.params.root = this.$encode(this.list.params.root, true)
          this.fetchTableApi()
          this.fetchTemplateTree()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 树结构
    fetchTemplateTree () {
      this.$request.fetchTemplateTree().then(res => {
        if (res.code === 200) {
          this.tree.data[0].children = res.data
          let options = []
          res.data.forEach(d => {
            if (d.directory) {
              options.push({
                value: d.filename,
                label: d.filename
              })
            }
          })
          this.ExportFormItems[0].options = options
          if (!options.find(d => d.value === 'default')) {
            if (options.length) {
              this.ExportForm.solution = options[0].value
            } else {
              this.ExportForm.solution = ''
            }
          }
        }
      })
    }
  },
  mounted () {
    this.list.params.root = this.$encode(this.list.params.root, true)
    this.$nextTick(() => {
      this.fetchTemplateTree()
    })
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.list.params.root = this.$encode(this.list.params.root, true)
      this.fetchTableApi()
      this.fetchTemplateTree()
      this.$router.push({ query: { type: '' } })
    }
  }
}
</script>

<style lang="scss">
.config-template-index-container{
  height: 100%;
  background-color: #ffffff;
  display: flex;
  .left-btn{
    margin-top: 10px;
    padding-left: 10px;
    width: 100%;
    box-sizing: border-box;

  }
  .left-btn{
      height: 50px;
  }

  .box-left{
    .el-aside{
      height: 100%;
      overflow: hidden;
    }
  }
  .box-right{
    margin-left: 30px;
    width: 100%;
    padding-top: 11px;
  }
  .form-dialog-container .el-select{
    width: 240px !important;
  }
  .status-primary{
    color: #6AC043;
    &.el-popover__reference{
      cursor: pointer;
    }
  }
  .filename{
    cursor: pointer;
  }
  .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
}
.import-from .el-dialog__body .el-select--small{
  border-radius: 4px 0 0 4px !important;
}
.import-from .el-dialog__body .el-select--small .el-input__inner{
  border-radius: 4px 0 0 4px !important;
}
.import-from .el-dialog__body .el-button--small{
  border-radius: 0 4px 4px 0 !important;
}
.el-popover.quote-popover-wrap{
  padding: 0;
  ul{
    height: 300px;
    overflow-x: hidden;
    overflow-y: overlay;
  }
  li{
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    color: #666666;
    &:nth-of-type(n+2) {
      border-top: 1px solid #EDEDED;
    }
  }
  li:first-of-type{
    background-color: #F9F9F9;
  }
  .popper__arrow::after{
    border-bottom-color: #EDEDED;
  }
}
</style>
