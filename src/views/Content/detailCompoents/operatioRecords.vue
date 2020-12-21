<template>
  <div class="operatio-records-wrap">
    <table-dialog
        ref="tableDialog"
        v-bind="tablelist"
        @handleSearch="handleSearchs"
        @handleSelectionChange="handleTableDialogSelectionChange"
        @handleSizeChange="handleTableDialogSizeChange"
        @handleCurrentChange="handleTableDialogCurrentChange"
      >
        <template #opreateRemark="scope">
          <span v-html="scope.scope.row.opreateRemark"></span>
        </template>
      </table-dialog>
  </div>
</template>

<script>
import tableDialog from '@/components/mixins/tableDialog'

var columns = [
  {
    prop: 'operateType',
    label: '操作'
  },
  {
    prop: 'opreateRemark',
    label: '操作明细',
    minWidth: '320px',
    scopeType: 'slot'
  },
  {
    prop: 'userName',
    label: '操作人'
  },
  {
    prop: 'createTime',
    label: '操作时间',
    scopeType: 'time'
  }

]
export default {
  name: 'operatio-records',
  mixins: [tableDialog],
  data () {
    return {
      tablelist: {
        width: '895px',
        title: '操作记录',
        showIndex: true,
        showIndexText: '序号',
        showSelection: false,
        buttons: [],
        api: '',
        params: {
          'contentId': '',
          'startTime': '',
          'endTime': '',
          'times': [],
          'userName': ''
        },
        columns,
        searchHeader: {
          searchItems: [
            {
              type: 'timePicker',
              value: 'times',
              startText: '选择时间',
              rangeText: '-',
              endText: '选择时间'
            },
            {
              type: 'searchInput',
              value: 'userName',
              placeholder: '请输入操作人'
            }
          ]
        }
      }
    }
  },
  methods: {
    handleSearchs () {
      var params = this.tablelist.params
      if (params.times) {
        params.startTime = params.times[0]
        params.endTime = params.times[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      this.tablelist.params = params
      this.fetchTableDialogApi()
    },
    showTheDialog (id) {
      this.tablelist.api = 'fetchContentrecordPage'
      this.tablelist.params.contentId = id
      this.fetchTableDialogApi()
      this.$refs.tableDialog.showDialog()
    },
    // 表格弹窗数据回调
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data.content
        this.tablelist.totalCount = res.data.totalElements
      }
    }
  },
  mounted () {

  }

}
</script>
<style lang="scss" scoped>

</style>
