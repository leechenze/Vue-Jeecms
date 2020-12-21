<template>
  <table-dialog
      ref="tableDialog"
      v-bind="tablelist"
      @handleSelectionChange="handleTableDialogSelectionChange"
      @handleSizeChange="handleTableDialogSizeChange"
      @handleCurrentChange="handleTableDialogCurrentChange"
      @handleConfirm="fetchTableConfirm"
    >
      <!-- <template slot="header">
        <base-header v-bind="tableHeaders"/>
      </template> -->
    </table-dialog>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import tableDialog from '@/components/mixins/tableDialog'
export default {
  name: 'sort-content',
  mixins: [tableDialog, baseHeader],
  props: {
    channelIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      type: 1,
      tablelist: {
        title: '排序',
        loading: false,
        width: '778px',
        showSearchHeader: false,
        showIndex: false,
        api: '',
        params: {
          'orderType': 0,
          'status': '',
          'contentType': '',
          'myself': false,
          'update': false,
          'createStartTime': '',
          'createEndTime': '',
          'releaseStartTime': '',
          'releaseEndTime': '',
          'createType': '',
          'modelId': '',
          'keyType': 1,
          'key': '',
          'channelIds': [],
          'contentSecretIds': [],
          'issueOrg': '',
          'issueYear': '',
          'issueNum': ''
        },
        isRadio: true,
        buttons: [
          {
            text: '在所选内容之前',
            btn: 'startSort',
            type: 'Submit'
          },
          {
            text: '在所选内容之后',
            btn: 'endSort',
            type: 'Submit'
          }
        ],
        columns: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: '标题',
            prop: 'title',
            showOverflowTooltip: true
          },
          {
            label: '类型',
            prop: 'contentTypes',
            formatter: (row) => {
              let arr = row.contentTypes.map(v => {
                return v.typeName
              }) || ['无']
              return arr.join(',')
            }
          },
          {
            label: '状态',
            prop: 'status',
            formatter: (row) => {
              let arr = ['', '草稿', '初稿', '流转中', '已审核', '已发布', '退回', '下线', '归档']
              return arr[row.status]
            }
          },
          {
            label: '发布时间',
            prop: 'releaseTime',
            width: '165px'
          }
        ],
        data: [],
        totalCount: 0,
        queryParams: {}
      },
      sort: 'list'
      // tableHeaders: {
      //   title: '操作说明',
      //   content: '先选定一篇内容，再选择放在其之前或之后。'
      // }
    }
  },
  methods: {
    showTheDialog (data, arr) {
      if (arr) {
        this.tablelist.queryParams = { 'contentRelationId': data[0], 'contentRelationIds': [], 'location': false }
        this.tablelist.api = arr.api
        this.tablelist.params = arr.params
        this.tablelist.columns = arr.columns
        this.fetchTableDialogApi()
        this.sort = 'detail'
        this.$refs.tableDialog.showDialog()
      } else {
        var ids = []
        if (data instanceof Array) {
          ids = data
        } else {
          ids = [data.cmsContent.id]
        }
        this.tablelist.queryParams = { 'ids': ids, 'contentId': '', 'location': false, 'workType': this.type }
        this.tablelist.api = 'fetchContentextPage'
        this.tablelist.params.channelIds = this.channelIds
        this.fetchTableDialogApi()
        this.sort = 'list'
        this.$refs.tableDialog.showDialog()
      }
    },
    // table弹窗-确认
    // 排序-确认
    fetchTableConfirm (data, btn) {
      if (data.length > 0) {
        var params = {}
        params = this.tablelist.queryParams
        if (this.sort === 'list') {
          params.contentId = data[data.length - 1].id
          params.location = btn.btn === 'startSort'
          this.$request.fetchContentextSort(params).then(res => {
            this.$restBack(res, () => {
              this.$emit('getSort', true)
            })
          })
        } else {
          params.contentRelationIds = [data[data.length - 1].id]
          params.location = btn.btn === 'startSort'
          this.$request.fetchContentrelationSort(params).then(res => {
            this.$restBack(res, () => {
              this.$emit('getSort', true)
            })
          })
        }
        this.$refs.tableDialog.handleCancel()
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 表格弹窗数据回调
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data.content.map(v => {
          return v.cmsContent || v
        })
        this.tablelist.totalCount = res.data.totalElements
      }
    }
  }
}
</script>
