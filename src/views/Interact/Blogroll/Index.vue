<template>
  <section class="interact-blogroll-index-container">
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleLink="handleTableLink"
      v-on:handleDelete="handleTableDelete"
      :onDropEnd="handleDragEnd"
    >
    <template #typeName="scope">
      <el-link :underline='false' type='primary' class='jee-color' @click="rowHref(scope.scope.row)"
        :disabled="!_checkPermission('/linkTypes', 'PUT')"
      >{{scope.scope.row.typeName}}</el-link>
    </template>
    </base-table>
    <form-dialog
      title="新建分类"
      ref="newClassifyDialog"
      :loading="newClassifyLoading"
      :form="newClassifyFrom"
      :rules="newClassifyRules"
      :formItems="newClassifyFormItems"
      v-on:handleConfirm="handleNewClassify"
    ></form-dialog>
    <form-dialog
      title="编辑分类"
      ref="compileDialog"
      :loading="compileLoading"
      :form="compileForm"
      :rules="compileRules"
      :formItems="compileItems"
      :buttons="compileButtons"
      v-on:handleConfirm="handlecompile"
    ></form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
const columns = [
  {
    prop: 'id',
    label: 'ID'
  },
  {
    scopeType: 'slot',
    prop: 'typeName',
    label: '分类名称'
  }
]
export default {
  name: 'interactBlogrollIndex',
  mixins: [baseHeader, baseTable, formDialog],
  data () {
    var typeName = (rule, value, callback) => {
      if (value) {
        var params = {
          typeName: value,
          id: this.compileForm.id
        }
        this.$request.fetchlinkTypesTypeNameUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('分类名称有重复'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      list: {
        columns,
        api: 'fetchLinkTypesPage',
        params: {},
        handleColumn: [
          {
            type: 'Link',
            name: '友情链接',
            icon: 'lianjiexingyinyong',
            disabled: !this._checkPermission('/links/page', 'GET')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/linkTypes', 'DELETE')
          }
        ],
        draggable: true
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建分类',
            icon: 'xinjian',
            disabled: !this._checkPermission('/linkTypes', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/linkTypes', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      newClassifyLoading: false,
      newClassifyFrom: {},
      newClassifyRules: {
        typeName: [this.$rules.required(), { validator: typeName, trigger: 'blur' }, this.$rules.cnEnNum()]
      },
      newClassifyFormItems: [
        {
          prop: 'typeName',
          label: '分类名称',
          maxlength: 50
        }
      ],
      compileLoading: false,
      compileForm: {},
      compileRules: { typeName: [this.$rules.required(), { validator: typeName, trigger: 'blur' }, this.$rules.cnEnNum()] },
      compileItems: [
        {
          type: 'text',
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'typeName',
          label: '分类名称',
          maxlength: 50
        }
      ],
      compileButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ]
    }
  },
  methods: {
    // 拖动排序请求
    handleDragEnd (newIndex, oldIndex) {
      this.list.loading = true
      const params = {
        toId: this.list.data[newIndex].id,
        fromId: this.list.data[oldIndex].id
      }
      this.$request.fetchlinksTypesSort(params).then(res => {
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
    // 打开新建
    handleHeaderCreate () {
      this.$refs.newClassifyDialog.showDialog()
    },
    // 新建确认
    handleNewClassify (data) {
      this.newClassifyLoading = true
      this.$request.fetchLinkTypesAdd(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '新建成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
        this.newClassifyLoading = false
      }).catch(() => { this.newClassifyLoading = false })
    },
    // 表格名字编辑
    rowHref (row) {
      this.$request.fetchLinkTypesDetail(row).then(res => {
        if (res.code === 200) {
          this.compileForm = res.data
          this.$refs.compileDialog.showDialog()
        }
      })
    },
    // 表格跳转
    handleTableLink (data) {
      this.$routerLink('/interact/blogroll/detail?linkTypeId=' + data.id)
    },
    // 编辑确认
    handlecompile (data) {
      this.compileLoading = true
      this.$request.fetchLinkTypesChange(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
        this.compileLoading = false
      }).catch(() => { this.compileLoading = false })
    },
    // 头部删除
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量删除链接分类？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchLinkTypesDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 表格删除
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchLinkTypesDelete([row.id])
      })
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 发送请求
    // 删除
    fetchLinkTypesDelete (ids) {
      this.list.loading = true
      this.$request.fetchLinkTypesDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    }
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '' } })
    }
  }
}
</script>

<style lang="scss">
.interact-blogroll-index-container{
  .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
}
</style>
