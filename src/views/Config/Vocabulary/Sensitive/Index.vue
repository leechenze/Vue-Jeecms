<template>
  <section class="voca-sensitive-index">
    <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      @handleDelete="handleHeaderDelete"
      @handleImprot="handleHeaderImprot"
      />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      @handleEdit="handleTableEdit"
    >
    </base-table>
    <form-dialog
      :title="editTitle"
      ref="editDialog"
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :buttons="editButtons"
      :formItems="editFormItems"
      v-on:handleConfirm="handleConfirmAdd"
    ></form-dialog>
    <form-dialog
      title="批量导入敏感词"
      ref="importDialog"
      :loading="improtFormLoading"
      :form="improtForm"
      :rules="improtRules"
      :buttons="improtButtons"
      :formItems="improtFormItems"
      @handleBtnDownload="handleBtnDownload"
      @handleBtnUpload="handleBtnUpload"
      v-on:handleConfirm="handleConfirmImprot"
    ></form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import { mapGetters } from 'vuex'

export default {
  name: 'configVocabularySensitive',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          sensitive: value,
          id: this.editForm.id
        }
        this.$request.fetchSensitiveWordsUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('敏感词已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    const columns = [
      {
        prop: 'id',
        label: '序号',
        minWidth: '65px'
      },
      {
        prop: 'sensitive',
        label: '敏感词',
        scopeType: 'handle',
        type: 'Edit',
        disabled: !this._checkPermission('/sensitiveWords', 'PUT')
      },
      {
        prop: 'replaceWord',
        label: '替换词'
      },
      {
        prop: 'createUser',
        label: '创建人'
      },
      {
        prop: 'createTime',
        scopeType: 'time',
        label: '创建时间'
      }
    ]
    return {
      list: {
        columns,
        api: 'fetchSensitiveWordsPage',
        params: { sensitive: '' },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/sensitiveWords', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '75px',
          align: 'left'
        }
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'sensitive',
            placeholder: '请输入敏感词'
          }
        ]
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/sensitiveWords', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/sensitiveWords', 'DELETE')
          },
          {
            type: 'Improt',
            text: '批量导入',
            icon: 'daoru-tianchong',
            disabled: !this._checkPermission('/sensitiveWords/import', 'POST')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      editFormLoading: false,
      editForm: {
        'sensitiveWord': '',
        'replaceWord': '',
        'dealWithType': 1,
        'createTime': '',
        'createUser': '',
        'type': 'add'
      },
      editRules: {
        sensitiveWord: [
          this.$rules.required(),
          { validator: nameUnique, trigger: ['change', 'blur'] }
        ]
      },
      editFormItems: [
        {
          prop: 'sensitiveWord',
          label: '敏感词',
          maxlength: 40,
          placeholder: ''
        },
        {
          prop: 'replaceWord',
          label: '替换为',
          maxlength: 60,
          placeholder: '请输入替换词'
        },
        {
          prop: 'dealWithType',
          label: '敏感词重复处理',
          type: 'radio',
          hiddenKey: 'type',
          hiddenValue: 'add',
          options: [
            {
              label: '覆盖已有敏感词',
              value: 1
            },
            {
              label: '跳过已有敏感词',
              value: 2
            }

          ]
        },
        {
          prop: 'createUser',
          label: '创建人',
          type: 'text',
          hiddenKey: 'type',
          hiddenValue: 'edit'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'time',
          hiddenKey: 'type',
          hiddenValue: 'edit'
        }
      ],
      editButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ],
      editTitle: '新建敏感词',
      improtFormLoading: false,
      improtForm: {
        'file': null,
        'dealWithType': 1
      },
      improtRules: {
        file: [
          this.$rules.required('请选择xls或xlsx格式文件')
        ]
      },
      improtButtons: [
        {
          text: '保存',
          type: 'Submit'
          // keepAlive: true
        }
      ],
      improtFormItems: [
        {
          type: 'careful',
          label: '注意：',
          text: '请检查文件名称，如果文件名称中包含中文，将会导致文件在UNIX，LINX系统中显示异常。支持上传的格式：xls、xlsx ；表格必须有2列：第一列【敏感词】，第二列【替换词】； 表格第一行为列名。'
        },
        {
          prop: 'moban',
          label: '模板下载',
          type: 'btn',
          btnType: 'Download',
          btnText: '敏感词模版'
        },
        {
          prop: 'file',
          label: '文件',
          type: 'btn',
          btnType: 'Upload',
          btnText: '选择文件',
          fileList: [],
          explainStyle: {
            fontSize: '12px'
          },
          explain: '支持xls, xlsx格式'
        },
        {
          prop: 'dealWithType',
          label: '敏感词重复处理',
          type: 'radio',
          options: [
            {
              label: '覆盖已有敏感词',
              value: 1
            },
            {
              label: '跳过已有敏感词',
              value: 2
            }

          ]
        }
      ]
    }
  },
  computed: {
    // 获取系统设置项
    ...mapGetters(['setting']),
    sensitiveWordsReplace () {
      const { sensitiveWordsReplace } = this.setting.attrs || {}
      return sensitiveWordsReplace
    },
    isSensitiveWords () {
      const { isSensitiveWords } = this.setting.attrs || {}
      return isSensitiveWords
    }

  },
  methods: {
    handleBtnDownload (e) {
      this.$request.fetchSensitiveWordsDownload().then(res => {
        this.$exportClick(res, '敏感词模板.xls')
      })
    },
    handleBtnUpload (file, type) {
      this.improtFormItems.find(v => v.prop === 'file').fileList = [file]
      var suffix = file.name.slice(file.name.lastIndexOf('.') + 1)
      if (suffix === 'xls' || suffix === 'xlsx') {
        this.improtForm.name = file.name
        this.improtForm.file = file
        this.improtForm.type = type
      }
    },
    handleHeaderAdd () {
      this.editForm = {
        'sensitiveWord': '',
        'replaceWord': this.isSensitiveWords === '1' ? this.sensitiveWordsReplace : '',
        'dealWithType': 1,
        'createTime': '',
        'createUser': '',
        'type': 'add'
      }
      this.editTitle = '新建敏感词'
      this.editFormItems.find(v => v.prop === 'sensitiveWord').placeholder = '多个敏感词用逗号隔开'
      this.editButtons = [
        {
          text: '保存并继续新建',
          keepAlive: true,
          type: 'Submit'
        },
        {
          text: '保存',
          type: 'Submit'
        }
      ]
      this.$refs.editDialog.showDialog()
    },
    // 表格操作按钮
    handleTableEdit (data, btn) {
      this.editTitle = '编辑敏感词'
      this.editFormItems.find(v => v.prop === 'sensitiveWord').placeholder = ''
      this.editForm = Object.assign(this.editForm, data)
      this.editForm.type = 'edit'
      this.editButtons = [
        {
          text: '保存',
          type: 'Submit'
        }
      ]
      this.$refs.editDialog.showDialog()
    },
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该敏感词？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysSenDelete([row.id]).then(res => {
          this.$restBack(res)
        })
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该敏感词？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysSenDelete(this.list.selectedKeys).then(res => {
            this.$restBack(res)
          })
        }).catch(() => {})
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    handleHeaderImprot () {
      this.improtFormItems.find(v => v.prop === 'file').fileList = []
      this.$refs.importDialog.showDialog()
    },
    // 发送请求事件
    fetchSysSenDelete (ids) {
      this.list.loading = true
      var params = {
        'ids': ids
      }
      this.$request.fetchSensitiveWordsDelete(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    handleConfirmAdd (data, btn, type) {
      this.addFormLoading = true
      var params = {}
      if (data.type === 'edit') {
        params = { 'id': data.id, 'sensitiveWord': data.sensitiveWord, 'replaceWord': data.replaceWord }
        this.$request.fetchSensitiveWordsPut(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.fetchTableApi()
          }
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      } else {
        params = { 'sensitiveWord': data.sensitiveWord, 'replaceWord': data.replaceWord, 'dealWithType': data.dealWithType }
        this.$request.fetchSensitiveWordsAdd(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.fetchTableApi()
          }
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      }
      // var params = Object.assign({}, data)
    },
    handleConfirmImprot (data, btn) {
      const param = new FormData() // 创建form对象
      param.append('file', data.file.raw) // 通过append向form对象添加数据
      param.append('dealWithType', data.dealWithType)
      const that = this
      const onUploadProgress = function (e) {
        if (e.lengthComputable) {
          var rate = e.loaded / e.total
          var percent = 0
          if (rate < 1) {
            percent = Number((rate * 100).toFixed(0))
          // 这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
          // 因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
          } else {
            percent = 100
          }
          that.$refs.importDialog.$refs.uploadBtn[0].onProgress({ percent: percent })
        }
      }
      this.$request.fetchSensitiveWordsImport(param, onUploadProgress).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          this.$refs.importDialog.handleCancel()
          this.fetchTableApi()
        }
      })
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  }

}
</script>
<style lang="scss">
 .voca-sensitive-index{
   .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
 }
</style>
