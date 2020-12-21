<template>
  <section class="log-system-index-container">
    <!-- <base-header
      v-bind="headers"
    /> -->

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
      @handleBtnSearch='handleEventBtnSearch'
      @handleBtnExport='handleEventAlarmExport'
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
    >
      <template #subEventType="scope">
        <p class="jee-color" @click="logDetail(scope.scope.row)">{{scope.scope.row.subEventType}}</p>
      </template>
    </base-table>
    <form-dialog
      title="日志详情"
      ref="logDialog"
      :form="logForm"
      :formItems="logFormItems"
      :buttons="logButtons">
    </form-dialog>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import searchHeader from '@/components/mixins/searchHeader'
import formDialog from '@/components/mixins/formDialog'
import logs from './../log'
const columns = [
  {
    scopeType: 'slot',
    prop: 'subEventType',
    label: '告警模块'
  },
  {
    prop: 'logType',
    label: '告警类型',
    minWidth: '150px',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '信息',
          value: 1
        },
        {
          label: '警告',
          value: 2
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'logLevel',
    label: '告警级别',
    minWidth: '150px',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '高',
          value: 1
        },
        {
          label: '中',
          value: 2
        },
        {
          label: '低',
          value: 3
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    scopeType: 'time',
    prop: 'createTime',
    label: '告警时间',
    minWidth: '150px'
  }
]
export default {
  name: 'logReport',
  mixins: [baseHeader, baseTable, searchHeader, formDialog, logs],
  data () {
    return {
      list: {
        columns,
        api: 'fetchLogsAlarmPage',
        params: {
        },
        handleColumn: [],
        showSelection: false
      },
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'subEventType',
            label: '告警模块：',
            placeholder: '请输入告警模块'
          },
          {
            type: 'timePicker',
            value: 'time',
            label: '告警时间',
            rangeText: '-'
          },
          {
            btnType: 'Search',
            type: 'henderBorderBtn',
            text: '搜索',
            icon: 'xiazai15'
          },
          {
            btnType: 'Export',
            type: 'henderBorderBtn',
            text: '导出',
            icon: 'daochu-tianchong',
            disabled: !this._checkPermission('/logs/export', 'POST')
          }
        ]
      },
      logFormItems: [
        {
          type: 'text',
          prop: 'subEventType',
          label: '告警模块'
        },
        {
          type: 'text',
          prop: 'logType',
          label: '告警类型'
        },
        {
          type: 'text',
          prop: 'logLevel',
          label: '告警级别'
        },
        {
          type: 'text',
          prop: 'remark',
          label: '告警详细内容'
        },
        {
          type: 'text',
          prop: 'createTime',
          label: '告警时间'
        },
        {
          type: 'text',
          prop: 'requestResult',
          label: '告警结果',
          textColor: '#666666'
        }
      ]
    }
  },
  methods: {
    // 搜索
    handleSearchs () {
      var params = this.list.params
      if (params.time) {
        params.beginDate = params.time[0]
        params.endDate = params.time[1]
      } else {
        params.beginDate = ''
        params.endDate = ''
      }
      this.list.params = params
      this.fetchTableApi()
    },
    handleEventAlarmExport () {
      this.$confirm('是否确定导出日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchlogsAlarmExport(this.list.params).then(res => {
          this.$exportClick(res, '告警日志.xlsx')
        })
      })
    },
    handleEventBtnSearch () {
      this.handleSearchs()
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>
