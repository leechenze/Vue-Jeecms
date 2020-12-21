<template>
  <div class="relevant-content-detail">
    <table-dialog
      ref="relevantDialog"
      v-bind="tablelist"
      @handleBtnAll="handleBtnAll"
      @handleSelectionChange="handleTableDialogSelectionChange"
      @handleSizeChange="handleTableDialogSizeChange"
      @handleCurrentChange="handleTableDialogCurrentChange"
      @handleConfirm="fetchTableConfirm"
      @handleDelete="fetchTableDelete"
    >
    </table-dialog>
      <sort-content ref="sortContent" :channelIds="[$route.query.channelId]"
        @getSort="getSort" key="contentDetail"></sort-content>
      <relevantContentsAdd ref="relevantAdd" @confirmClick="confirmClick"></relevantContentsAdd>
  </div>
</template>

<script>
import tableDialog from '@/components/mixins/tableDialog'
import relevantContentsAdd from './RelevantContentsAdd'
import sortContent from '../components/sortContent'
export default {
  name: 'relevantContents',
  components: {
    relevantContentsAdd,
    sortContent
  },
  mixins: [tableDialog],
  data () {
    return {
      channlTree: null,
      tablelist: {
        title: '相关内容',
        width: '720px',
        showIndex: false,
        api: '',
        params: { 'contentId': '' },
        columns: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: '所属栏目',
            prop: 'relationContent.channel.name',
            scopeType: 'link',
            width: '200px'
          },
          {
            label: '内容标题',
            prop: 'relationContent.title'
          }
        ],
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete'
          }
        ],
        handleColumnProp: {
          label: '操作',
          align: 'left'
        },
        searchHeader: {
          searchBtns: [
            {
              icon: 'tianjia',
              type: 'Add',
              name: '添加'
            },
            {
              icon: 'delete',
              type: 'Delete',
              name: '删除'
            },
            {
              icon: 'paixu1',
              type: 'Sort',
              name: '排序'
            }
          ]
        }
      }
    }
  },
  methods: {
    getSort (status) {
      if (status) {
        this.fetchTableDialogApi()
      }
    },
    confirmClick (res) {
      if (res.code === 200) {
        this.fetchTableDialogApi()
      }
    },
    fetchTableConfirm (data) {
      this.$refs.relevantDialog.handleCancel()
      this.$refs.relevantDialog.handleCancel()
    },
    fetchTableDelete (data) {
      this.msgChange('确认删除该内容吗？', () => {
        this.$request.fetchContentrelationDelete({ ids: [data.id] }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableDialogApi()
          })
        })
      })
    },
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data.content
        this.tablelist.totalCount = res.data.totalElements
      }
    },
    showTheDialog (item, id) {
      this.channlTree = item
      this.tablelist.params.contentId = id
      this.tablelist.api = 'fetchContentrelationPage'
      this.fetchTableDialogApi()
      this.$refs.relevantDialog.showDialog()
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
    // 表格弹窗头部按钮
    handleBtnAll (data) {
      var ids = this.tablelist.selectedKeys
      switch (data.type) {
        case 'Add':
          // 新增
          this.$refs['relevantAdd'].showTheDialog(this.channlTree, this.tablelist.params.contentId)
          break
        case 'Delete':
          // 删除
          if (ids.length > 0) {
            this.msgChange('确认删除所选内容吗？', () => {
              this.$request.fetchContentrelationDelete({ ids: ids }).then(res => {
                this.$restBack(res, () => {
                  this.fetchTableDialogApi()
                })
              })
            })
          } else {
            this.$message('请选择内容进行操作')
          }
          break
        case 'Sort':
          // 排序
          if (ids.length === 1) {
            this.$refs.sortContent.showTheDialog(ids, this.tablelist)
          } else {
            this.$message('请选择一项内容进行操作')
          }
          break
      }
    }
  }

}
</script>
