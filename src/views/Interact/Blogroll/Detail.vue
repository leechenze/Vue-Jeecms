<template>
  <section class="interact-blogroll-detail-container">
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
      v-on:handleMove="handleHeaderMove"
    />
    <p class="link">当前分类：{{link}}</p>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleLink="handleTableLink"
      v-on:handleDelete="handleTableDelete"
      @handleStatus="handleLinkStatus"
      :onDropEnd="handleDragEnd"
    >
    <template #linkName="scope">
      <el-link :underline='false' type='primary' class='jee-color' @click="rowHref(scope.scope.row)"
        :disabled="!_checkPermission('/links', 'PUT')"
      >{{scope.scope.row.linkName}}</el-link>
    </template>
    </base-table>
    <form-dialog
      title="新建链接"
      ref="newLinkDialog"
      :loading="newLinkLoading"
      :form="newLinkForm"
      :rules="newLinkRules"
      :formItems="newLinkItems"
      v-on:handleConfirm="handleNewLink"
    ></form-dialog>
    <form-dialog
      title="编辑链接"
      ref="LinkDialog"
      :loading="LinkLoading"
      :form="LinkForm"
      :rules="LinkRules"
      :formItems="LinkItems"
      :buttons="LinkButtons"
      v-on:handleConfirm="handleLink"
    ></form-dialog>
    <form-dialog
      title="移动到"
      ref="ToLinkDialog"
      class="link-to"
      :loading="ToLinkLoading"
      :form="ToLinkForm"
      :formItems="ToLinkItems"
      :rules="ToLinkRules"
      :buttons="ToLinkButtons"
      v-on:handleConfirm="handleToLink"
    ></form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'

export default {
  name: 'interactBlogrollDetail',
  mixins: [baseHeader, baseTable, formDialog],
  data () {
    const columns = [
      {
        prop: 'id',
        label: 'ID'
      },
      {
        scopeType: 'slot',
        prop: 'linkName',
        label: '链接名称'
      },
      {
        prop: 'linkUrl',
        label: '链接URL',
        showOverflowTooltip: true,
        width: '450px'
      },
      {
        scopeType: 'img',
        prop: 'resourcesSpaceDataUrl',
        hasPath: true,
        label: '链接图片'
      },
      {
        scopeType: 'switch',
        prop: 'isEnable',
        label: '是否显示',
        type: 'Status',
        align: 'left',
        enableText: '是',
        disableText: '否',
        disabled: !this._checkPermission('/links/enable', 'PUT') || !this._checkPermission('/links/unEnable', 'PUT')
      }
    ]
    return {
      link: '',
      list: {
        columns,
        api: 'fetchlinkTsPage',
        params: {
          linkTypeId: null
        },
        handleColumn: [
          {
            type: 'Link',
            name: '移动',
            icon: 'yidong1',
            disabled: !this._checkPermission('/links/move', 'PUT')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/links', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '145px'
        },
        draggable: true
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建链接',
            icon: 'xinjian',
            disabled: !this._checkPermission('/links', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/links', 'DELETE')
          },
          {
            type: 'Move',
            text: '移动',
            icon: 'yidong1',
            disabled: !this._checkPermission('/links/move', 'PUT')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '操作说明'
      },
      newLinkLoading: false,
      newLinkForm: {
        linkName: '',
        linkUrl: '',
        linkLogo: '',
        resourcesSpaceDataUrl: '',
        isEnable: true
      },
      newLinkRules: {
        linkName: [this.$rules.required()],
        linkUrl: [this.$rules.required()]
      },
      newLinkItems: [
        {
          prop: 'linkName',
          label: '链接名称',
          maxlength: 50
        },
        {
          prop: 'linkUrl',
          label: 'URL地址',
          maxlength: 120
        },
        {
          type: 'imageUpload',
          prop: 'linkLogo',
          label: '链接图片',
          urlProp: 'resourcesSpaceDataUrl'
        },
        {
          type: 'switch',
          prop: 'isEnable',
          enableText: '是',
          disableText: '否',
          label: '是否显示'
        }
      ],
      LinkLoading: false,
      LinkForm: {
        id: '',
        linkTypeName: '',
        linkName: '',
        linkUrl: '',
        linkLogo: '',
        resourcesSpaceDataUrl: '',
        isEnable: true
      },
      LinkRules: {
        linkName: [this.$rules.required()],
        linkUrl: [this.$rules.required()],
        isEnable: [this.$rules.required()]
      },
      LinkItems: [
        {
          type: 'text',
          prop: 'id',
          label: 'ID'
        },
        {
          type: 'text',
          prop: 'linkTypeName',
          label: '所属分类'
        },
        {
          prop: 'linkName',
          label: '链接名称',
          maxlength: 50
        },
        {
          prop: 'linkUrl',
          label: 'URL地址',
          maxlength: 120
        },
        {
          type: 'imageUpload',
          prop: 'linkLogo',
          label: '链接图片',
          urlProp: 'resourcesSpaceDataUrl'
        },
        {
          type: 'switch',
          prop: 'isEnable',
          enableText: '是',
          disableText: '否',
          label: '是否显示'
        }
      ],
      LinkButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ],
      ToLinkLoading: false,
      ToLinkForm: {
        ids: [],
        linkTypeId: ''
      },
      ToLinkItems: [
        {
          type: 'selectTree',
          prop: 'linkTypeId',
          label: '选择分类',
          options: [],
          optionsValue: 'id',
          optionsLabel: 'typeName'
        }
      ],
      ToLinkRules: { linkTypeId: [this.$rules.required()] },
      ToLinkButtons: [
        {
          text: '确认',
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
      this.$request.fetchlinksSort(params).then(res => {
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
    handleHeaderCreate () {
      this.$refs.newLinkDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量删除链接？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchlinksDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    handleHeaderMove () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量移动链接？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ToLinkForm.ids = this.list.selectedKeys
          this.ToLinkForm.linkTypeId = ''
          this.fetchlinkTypesList()
          this.$refs.ToLinkDialog.showDialog()
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 表格选择移动
    handleTableLink (row, index) {
      this.ToLinkForm.ids = []
      this.ToLinkForm.ids.push(row.id)
      this.ToLinkForm.linkTypeId = ''
      this.fetchlinkTypesList()
      this.$refs.ToLinkDialog.showDialog()
    },
    // 确定移动
    handleToLink (data) {
      if (!data.linkTypeId) {
        return false
      }
      this.fetchlinksMove(data)
    },
    // 修改状态
    handleLinkStatus (row, index) {
      this.list.loading = true
      if (row.isEnable) {
        let id = row.id
        this.$request.fetchlinksEnable({ id }).then(res => {
          if (res.code === 200) {
            this.fetchTableApi()
            this.list.loading = false
          }
        }).catch(() => { this.list.loading = false })
      } else {
        let id = row.id
        this.$request.fetchlinksunEnable({ id }).then(res => {
          if (res.code === 200) {
            this.fetchTableApi()
            this.list.loading = false
          }
        }).catch(() => { this.list.loading = false })
      }
    },
    // 表格名字编辑
    rowHref (row) {
      this.$request.fetchlinksDetail(row).then(res => {
        if (res.code === 200) {
          if (res.data.resourcesSpaceData) {
            res.data.resourcesSpaceDataUrl = this.$getPath(res.data.resourcesSpaceData.url)
            res.data.linkLogo = res.data.resourcesSpaceData.id
          } else {
            res.data.resourcesSpaceDataUrl = ''
          }
          this.LinkForm = res.data
          this.$refs.LinkDialog.showDialog()
        }
      })
    },
    // 编辑链接
    handleLink (data) {
      delete data.resourcesSpaceDataUrl
      delete data.resourcesSpaceData
      /* hyt-link s */
      data.linkUrl = this.$encode(data.linkUrl)
      /* hyt-link e */
      data.linkTypeId = this.list.params.linkTypeId
      this.LinkLoading = true
      this.$request.fetchlinksChange(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '链接编辑成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
        this.LinkLoading = false
      }).catch(() => { this.LinkLoading = false })
    },
    // 新建链接
    handleNewLink (data) {
      data.linkTypeId = this.list.params.linkTypeId
      this.newLinkLoading = true
      this.$request.fetchlinksAdd(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '新建链接成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
        this.newLinkLoading = false
      }).catch(() => { this.newLinkLoading = false })
    },
    // 表格删除
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchlinksDelete([row.id])
      })
    },
    // 接口访问
    // 删除
    fetchlinksDelete (ids) {
      this.list.loading = true
      this.$request.fetchlinksDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 分类列表
    fetchlinkTypesList () {
      this.$request.fetchlinkTypesList().then(res => {
        if (res.code === 200) {
          this.ToLinkItems[0].options = res.data
        }
      })
    },
    // 移动
    fetchlinksMove (data) {
      this.$request.fetchlinksMove(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '移动成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      })
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.link = res.data.linkType
        this.list.data = res.data.links.content.map(d => {
          if (d.resourcesSpaceData) d.resourcesSpaceDataUrl = this.$getPath(d.resourcesSpaceData.url)
          return d
        })
        this.list.totalCount = res.data.links.totalElements
      }
    }
  },
  mounted () {
    const { linkTypeId } = this.$route.query
    this.list.params.linkTypeId = linkTypeId
  },
  created () {

  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'interactBlogrollDetail') {
        const { linkTypeId } = newRoute.query
        if (linkTypeId && linkTypeId !== this.list.params.linkTypeId) {
          this.list.params.linkTypeId = linkTypeId
          this.fetchTableApi()
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .interact-blogroll-detail-container{
    .tree-box{
      padding-top: 20px;
    }
    .link{
      font-size: 14px;
      color: #333;
      margin-bottom: 20px;
    }
    .link-to{
      .tree-box{
        .el-tree .el-tree-node > .el-tree-node__content{
          height: 32px;
          color: #333333;
        }
        .el-tree .el-tree-node.is-current > .el-tree-node__content{
          background-color: #f3f3f3!important;
        }
      }
    }
  }
</style>
