<template>
  <section class="recycle-content-wrap">
    <search-header
      v-bind="searchHeader"
      :params="list.params"
      @handleBtnAll="handleBtnAll"
      @handleSearch="handleSearchs"
    ></search-header>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
    </base-table>
    <form-dialog
      :title="edit.title"
      ref="editDialog"
      :loading="edit.formLoading"
      :form="edit.form"
      :rules="edit.rules"
      :buttons="edit.buttons"
      :formItems="edit.formItems"
      @handleConfirm="handleConfirmEdit"
    ></form-dialog>
  </section>
</template>

<script>
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'

var statusOption = [
  {
    label: '所有',
    value: ''
  },
  {
    label: '初稿',
    value: 2
  },
  {
    label: '已发布',
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
    label: '已下线',
    value: 7
  }
]
var columns = [
  {
    prop: 'id',
    label: '序号'
  },
  {
    prop: 'title',
    label: '文档标题',
    minWidth: '150px'
  },
  {
    prop: 'updateUser',
    label: '删除者',
    minWidth: '120px'
  },
  {
    prop: 'status',
    label: '删除前状态',
    minWidth: '120px',
    formatter: (row, column, cellValue, index) => {
      const options = statusOption
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'updateTime',
    label: '删除时间',
    width: '162px',
    scopeType: 'time'
  }
]
export default {
  name: 'recycleBin',
  mixins: [baseTable, formDialog, searchHeader],
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: {
        columns,
        api: '',
        params: { 'channelId': '', 'startTime': '', 'endTime': '', 'times': [], 'title': '' }
      },
      edit: {
        title: '',
        formLoading: false,
        form: {
          ids: []
        },
        rules: {
          ids: [
            this.$rules.required('请选择栏目')
          ]
        },
        buttons: [],
        formItems: []
      },
      searchHeader: {
        searchBtns: [
          {
            icon: 'delete',
            type: 'DeleteCont',
            name: '删除内容',
            disabled: !this._checkPermission('/contentext', 'DELETE')
          },
          {
            icon: 'huanyuan',
            type: 'ReductionCont',
            name: '还原内容',
            disabled: !this._checkPermission('/contentext', 'PUT')
          },
          {
            icon: 'delete',
            type: 'DeleteChannl',
            name: '删除栏目',
            disabled: !this._checkPermission('/channel/thorough', 'DELETE')
          },
          {
            icon: 'huanyuan',
            type: 'ReductionChannl',
            name: '还原栏目',
            disabled: !this._checkPermission('/channel/reduction', 'PUT')
          },
          {
            icon: 'delete',
            type: 'Empty',
            name: '清空',
            disabled: !this._checkPermission('/contentext', 'DELETE')
          }
        ],
        searchItems: [
          {
            value: 'times',
            type: 'timePicker',
            rangeText: '-',
            startText: '删除时间',
            endText: '删除时间'
          },
          {
            value: 'title',
            type: 'searchInput',
            placeholder: '输入关键字'
          }
        ]
      },
      channelTree: []
    }
  },
  watch: {
    id (newData, oldData) {
      if (newData !== oldData && this.name === 'recycle') {
        this.list.params.channelId = newData
        this.fetchTableApi()
      }
    },
    name (newVal, oldVal) {
      if (newVal === 'recycle') {
        this.list.api = 'fetchContentextRecycle'
        this.fetchTableApi()
      }
    }
  },
  methods: {
    handleConfirmEdit (data, btn) {
      var params = data
      switch (data.type) {
        case 'DeleteChannl':
          this.$request.fetchChannelThorough(params).then(res => {
            this.$restBack(res, () => {
              this.fetchTableApi()
            }, '删除成功')
          })
          break
        case 'ReductionChannl':
          // Channl
          params.isContent = btn.isContent
          this.$request.fetchChannelReduction(params).then(res => {
            this.$restBack(res, () => {
              this.fetchTableApi()
            }, '还原成功')
          })
          break
      }
    },
    handleBtnAll (data) {
      var ids = this.list.selectedKeys
      var params = {}
      // var obj = {}
      switch (data.type) {
        case 'DeleteCont':
          if (ids.length > 0) {
            params = {
              ids: ids
            }
            this.msgChange('删除后不可恢复，确定删除所选内容？', () => {
              this.$request.fetchContentextDelete(params).then(res => {
                this.$restBack(res, () => {
                  this.fetchTableApi()
                })
              })
            })
          } else {
            this.$message('请至少选择一条数据进行操作')
          }
          break
        case 'DeleteChannl':
          this.edit.title = '删除栏目'
          this.edit.buttons = [
            {
              text: '删除',
              type: 'Submit'
            }
          ]
          this.edit.formItems = [
            {
              type: 'warning',
              text: '红色的为被删除的栏目，没被删除的栏目不可选'
            },
            {
              prop: 'ids',
              type: 'checkTree',
              tree: this.channelTree,
              width: '100%',
              props: {
                label: 'name',
                value: 'id'
              }
            }
          ]

          // this.edit = Object.assign(editModel, obj)
          this.edit.form.type = data.type
          this.$refs.editDialog.showDialog()
          break
        case 'ReductionCont':
          if (ids.length > 0) {
            params = {
              ids: ids
            }
            this.msgChange('确定还原所选内容？', () => {
              this.$request.fetchContentextRest(params).then(res => {
                this.$restBack(res, () => {
                  this.fetchTableApi()
                })
              })
            })
          } else {
            this.$message('请至少选择一条数据进行操作')
          }
          break
        case 'ReductionChannl':
          this.edit.title = '还原栏目'
          this.edit.buttons = [
            {
              text: '仅还原栏目',
              type: 'Submit',
              'isContent': false
            },
            {
              text: '还原栏目和内容',
              type: 'Submit',
              'isContent': true
            }
          ]
          this.edit.formItems = [
            {
              type: 'warning',
              text: '红色的为被删除的栏目，没被删除的栏目不可选'
            },
            {
              prop: 'ids',
              type: 'checkTree',
              tree: this.channelTree,
              width: '100%',
              props: {
                label: 'name',
                value: 'id'
              }
            }
          ]

          // console.log(this.channelTree)
          // this.edit = Object.assign(editModel, obj)
          this.edit.form.type = data.type
          this.$refs.editDialog.showDialog()
          break
        case 'Empty':
          // fetchContentextDelete
          if (this.list.data.length > 0) {
            this.msgChange('是否确定清空回收站？', () => {
              // var ids = this.list.data.map(v => { return v.id })
              // var params = {
              //   ids: ids
              // }
              this.$request.fetchContentextClearAll().then(res => {
                if (res.code === 200) {
                  this.fetchTableApi()
                }
              })
            })
          }
          break
      }
    },
    deleteChannlAll () {
      this.$request.fetchChannelRecycleIds().then(res => {
        if (res.code === 200) {
          var query = {
            ids: res.data
          }
          this.$request.fetchChannelThorough(query).then(res => {
            this.$restBack(res, () => {
              this.fetchTableApi()
            })
          })
        }
      })
    },
    msgChange (message, fn) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        fn()
      }).catch(() => {})
    },
    // 搜索
    handleSearchs () {
      this.list.pageNo = 1
      var params = this.list.params
      if (params.times) {
        params.startTime = params.times[0]
        params.endTime = params.times[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      this.list.params = params
      this.fetchTableApi()
    },
    getChannelData () {
      const params = {
        permOut: false
      }
      this.$request.fetchChannelRecycleTree(params).then(res => {
        if (res.code === 200) {
          const loop = function (data) {
            if (data instanceof Array && data.length) {
              return data.map(d => {
                d.disabled = !d.recycle
                d.style = !d.recycle ? {} : { color: '#ff0000' }
                if (d.children instanceof Array && d.children.length) {
                  loop(d.children)
                }
                return d
              })
            }
          }
          this.channelTree = loop(res.data)
        }
      })
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.getChannelData()
        this.list.totalCount = res.data.totalElements
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'recycle') {
        this.list.api = 'fetchContentextRecycle'
        this.fetchTableApi()
      }
    })
  }

}
</script>
<style lang="scss">
.recycle-content-wrap{
  .search-header-container{
    .el-col:nth-of-type(2){
      justify-content: flex-end;
    }
  }
}
</style>
