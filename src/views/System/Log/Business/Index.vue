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
      @handleBtnExport='handleEventBtnExport'
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
    >
    <template #uri="scope">
      <p class="jee-color" @click="logDetail(scope.scope.row)">[<span>{{scope.scope.row.method}}</span>]<span>{{scope.scope.row.uri}}</span></p>
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
    prop: 'uri',
    label: '请求路径',
    minWidth: '200px'
  },
  {
    prop: 'logType',
    label: '日志类别',
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
    prop: 'eventType',
    label: '事件类型',
    minWidth: '150px',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '系统事件',
          value: 1
        },
        {
          label: '业务事件',
          value: 2
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'subEventType',
    label: '事件子类型',
    minWidth: '150px'
  },
  {
    prop: 'logLevel',
    label: '日志级别',
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
    prop: 'operateType',
    label: '操作类型',
    minWidth: '150px',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '查询',
          value: 1
        },
        {
          label: '新增',
          value: 2
        },
        {
          label: '修改',
          value: 3
        },
        {
          label: '删除',
          value: 4
        },
        {
          label: '导出',
          value: 5
        },
        {
          label: '导入',
          value: 6
        },
        {
          label: '上传',
          value: 7
        },
        {
          label: '下载',
          value: 8
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'requestResult',
    label: '操作结果',
    minWidth: '150px',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '成功',
          value: 1
        },
        {
          label: '失败',
          value: 2
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'username',
    label: '用户名',
    minWidth: '150px'
  },
  {
    prop: 'clientIp',
    label: '客户端IP',
    minWidth: '150px'
  },
  {
    prop: 'responseTime',
    label: '响应时间',
    minWidth: '150px'
  },
  {
    scopeType: 'time',
    prop: 'createTime',
    label: '操作时间',
    minWidth: '150px'
  }
]
export default {
  name: 'logBusiness',
  mixins: [baseHeader, baseTable, searchHeader, logs, formDialog],
  data () {
    return {
      list: {
        columns,
        api: 'fetchlogspage',
        params: {
          senior: false,
          logCategory: 2,
          logLevel: '',
          operateType: '',
          requestResult: ''
        },
        handleColumn: [],
        showSelection: false
      },
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      }
    }
  },
  components: {
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
<style lang="scss" scoped>
</style>
