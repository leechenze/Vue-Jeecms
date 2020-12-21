<template>
  <section class="config-site-index-container">
    <base-header v-bind="headers"
      @handleRecycle="handleHeaderRecycle"
    />
    <base-table
      v-bind="list"
      v-on:handleCreate="handleTableCreate"
      v-on:handleDelete="handleTableDelete"
      v-on:handleLink="handleTableLink"
    >
      <template #sort="scope">
        <div class='sort-wrap'>
          <jee-icon iconClass="ziyuanldpi" class="jee-hover-fill" v-if="scope.scope.row.prevId" @click="handleSortUp(scope.scope.row)"/>
          <jee-icon iconClass="ziyuanldpi1" class="jee-hover-fill" v-if="scope.scope.row.nextId" @click="handleSortDown(scope.scope.row)"/>
        </div>
      </template>
    </base-table>
    <form-dialog
        ref="addDialog"
        title="新建站点"
        :loading="addFormLoading"
        :form="addForm"
        :rules="addRules"
        :buttons="addButtons"
        :formItems="addFormItems"
        v-on:handleConfirm="handleConfirmAdd"
      >
      <template #domain="scope">
        <div class="agreement">
          <el-select popper-class="jee-border" size="small"
            v-model="scope.form.protocol" placeholder="请选择">
            <el-option
              v-for="item in scope.item.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-form-item class="size-wrap" style="margin-left:5px" prop="domain">
            <el-input
              class="jee-input-append-select" size="small"
              v-model="scope.form.domain" maxlength="50">
              <el-button slot="append" class="jee-bg-light-important" @click="addFormHref" type="primary">添加</el-button>
            </el-input>
          </el-form-item>
        </div>
        <div class="agreement" v-for="(items, index) in addForm.alias" :key="index" style="margin-top: 20px;">
          <el-select popper-class="jee-border" size='small'
            disabled v-model="scope.form.protocol" placeholder="请选择">
            <el-option
              v-for="item in scope.item.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-form-item class="size-wrap" style="margin-left: 5px" prop="size">
            <el-input
              class="jee-input-append-select" v-model="items.herf" maxlength="100" size='small'>
              <el-button slot="append" class="jee-bg-light-important" @click="addFormDelete(index)" type="primary">删除</el-button>
            </el-input>
          </el-form-item>
        </div>
      </template>
    </form-dialog>
    <table-dialog
      ref="recycleBin"
      v-bind="tablelist"
      @handleSelectionChange="handleTableDialogSelectionChange"
      @handleBtnDelete='recycleBinDelete'
      @handleBtnRestore='recycleBinRestore'
    ></table-dialog>
    <msg-dialog
      v-bind="msgDialog"
      v-on:handleConfirm="handleConfirmMsg"
      v-on:handleCancel="hideMsgDialog"
    />
  </section>
</template>

<script>
import sites from './sites'

const columns = [
  {
    prop: 'name',
    label: 'config.site.name',
    scopeType: 'link',
    href: '/config/site/detail',
    width: '180px',
    fixed: 'left'
  },
  {
    prop: 'domain',
    label: 'config.site.domainName',
    width: '200px'
  },
  {
    prop: 'id',
    label: 'config.site.siteID'
  },
  {
    prop: 'path',
    label: 'config.site.siteCatalogs'
  },
  {
    prop: 'isOpen',
    label: 'config.site.status',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '启用',
          value: true
        },
        {
          label: '禁用',
          value: false
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    scopeType: 'slot',
    prop: 'sort',
    label: '排序'
  }
]

export default {
  name: 'configSiteIndex',
  mixins: [sites],
  data () {
    return {
      list: {
        columns,
        api: 'fetchSiteseList',
        isTree: true,
        expandAll: true,
        showSelection: false,
        handleColumn: [
          {
            type: 'Create',
            name: 'global.create',
            icon: 'xinjian',
            disabled: !this._checkPermission('/sites', 'POST')
          },
          {
            type: 'Link',
            name: '预览',
            icon: 'yulang'
          },
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/sites', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          align: 'left',
          width: '250px'
        },
        showPagination: false
      },
      headers: {
        buttons: [
          {
            type: 'Recycle',
            text: 'config.site.recycle',
            icon: 'huishouzhan',
            disabled: !this._checkPermission('/sites/recycle', 'GET')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      }
    }
  },
  methods: {
    // 排序
    handleSortUp (row) {
      this.list.loading = true
      const data = {
        fromId: row.id,
        nextId: row.prevId
      }
      this.$request.fetchsitesSort(data).then(res => {
        if (res.code) {
          this._messageSuccess('sort')
          this.fetchTableApi()
          this.FetchSitesOwnsite(true)
        }
        this.hideTableLoading()
      }).catch(this.hideTableLoading)
    },
    handleSortDown (row) {
      this.list.loading = true
      const data = {
        fromId: row.id,
        toId: row.nextId
      }
      this.$request.fetchsitesSort(data).then(res => {
        if (res.code) {
          this._messageSuccess('sort')
          this.fetchTableApi()
        }
        this.hideTableLoading()
      }).catch(this.hideTableLoading)
    },
    // 新建
    handleTableCreate (data) {
      // console.log(data)
      this.addForm.parentId = data.id
      this.addForm.parentName = data.name
      this.addForm.protocol = 'https://'
      this.$refs.addDialog.showDialog()
    },
    handleTableLink (row, index) {
      if (row.previewUrl) {
        window.open(row.previewUrl)
      } else {
        this.$message('没有预览地址')
      }
    },
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchSitesDelete([row.id])
      })
    },
    // 删除菜单
    fetchSitesDelete (ids) {
      this.list.loading = true
      this.$request.fetchSitesDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.FetchSitesOwnsite(true)
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        // for (var i = 0; i < res.data.length; i++) {
        //   if (res.data[i].parentId === null) {
        //     res.data[i].disabledDelete = true
        //   }
        // }
        const loop = function (list) {
          if (list instanceof Array && list.length) {
            return list.map((d, i, arr) => {
              d.hidden = !d.hidden
              d.disabledDelete = !d.deleteAble
              d.disabledCreate = !d.newChildAble
              if (i > 0) d.prevId = arr[i - 1].id
              if (arr.length > i + 1) d.nextId = arr[i + 1].id
              if (d.children) {
                d.children = loop(d.children)
              }
              return d
            })
          }
          return []
        }
        this.list.data = loop(res.data)
      }
    }
  },
  watch: {
    'addForm.name': function (newData, oldData) {
      if (newData && newData !== oldData) {
        this.$request.fetchPinyin({ text: newData }).then(r => {
          if (r.code === 200) {
            this.addForm.path = r.data
          }
        })
      } else {
        this.addForm.path = ''
      }
    }
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '', ...this.$route.query } })
    }
  }
}
</script>

<style lang="scss">
.config-site-index-container{
  .sort-wrap {
    line-height: 14px;
    .jee-svg-icon{
      cursor: pointer;
      font-size: 14px;
      fill: #666666;
    }
    .jee-svg-icon + .jee-svg-icon{
      padding-left: 10px;
    }
  }
  .agreement{
    display: flex;
    .el-select{
      width: 110px;
    }
    .el-form-item{
      width: 185px;
      margin-bottom: 0 !important;
    }
  }
  .el-button{
    margin-bottom: 0 !important;
  }
}

</style>
