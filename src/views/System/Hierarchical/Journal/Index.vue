<template>
  <section class="journal-index-wrap">
    <authority v-if="showHide"></authority>
    <div v-else>
      <base-header v-bind="headers"
      />
      <search-header
        class="search-header"
        v-bind="searchHeader"
        :params="list.params"
        @handleSearch="handleSearchs"
        @handleBtnExport='handleEventAlarmExport'
        @handleBtnDerived="handleDataDerived"
      >
      </search-header>
      <base-table
        v-bind="list"
        @handleSelectionChange="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
        <template #uri="scope">
          <span class="jee-color showUrl" @click="logDetail(scope.scope.row)">[{{scope.scope.row.method}}]{{scope.scope.row.uri}}</span>
        </template>
      </base-table>
      <form-dialog
        title="日志详情"
        ref="logDialog"
        :form="logForm"
        :formItems="logFormItems"
        :buttons="logButtons">
      </form-dialog>

    </div>
  </section>
</template>
<script>
import qs from 'qs'
import searchHeader from '@/components/mixins/searchHeader'
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import authority from '@/views/System/Hierarchical/Authority'
import formDialog from '@/components/mixins/formDialog'
import logs from './log'

const columns = [
  {
    scopeType: 'slot',
    prop: 'uri',
    label: '请求路径',
    width: '180px',
    showOverflowTooltip: true
  },
  {
    prop: 'logType',
    label: '日志类别',
    minWidth: '120px',
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
    minWidth: '120px',
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
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'logLevel',
    label: '日志级别',
    minWidth: '80px',
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
    minWidth: '80px',
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
        },
        {
          label: '登录',
          value: 9
        },
        {
          label: '退出',
          value: 10
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'requestResult',
    label: '操作结果',
    minWidth: '80px',
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
    minWidth: '80px'
  },
  {
    prop: 'clientIp',
    label: '客户端IP',
    minWidth: '120px'
  },
  {
    prop: 'responseTime',
    label: '响应时间',
    minWidth: '80px'
  },
  {
    prop: 'createTime',
    label: '操作时间',
    // scopeType: 'slot',
    maxWidth: '200px',
    minWidth: '160px'
  }
]
export default {
  name: 'journal-index',
  mixins: [searchHeader, baseTable, formDialog, baseHeader, logs],
  components: {
    authority
  },

  watch: {
  },
  data () {
    return {
      columns,
      showFile: false,
      list: {
        showSelection: false,
        columns: [],
        showIndex: true,
        isIndexFixed: true,
        SerialNumber: 1, // 保存数据
        indexLabel: '序号',
        indexWidth: '80',
        api: 'fetchReinsuranceUserPages',
        params: {
          createTime: [],
          username: '',
          clientIp: '',
          subEventType: '',
          logLevel: '',
          operateType: '',
          requestResult: '',
          beginDate: '',
          endDate: ''
        },
        filterParams: ['createTime'],
        fields: [],
        tableProps: {
          maxHeight: 550
        }
      },
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        paddingBottom: '17px',
        content: '操作说明：安全员可以审计非安全员及审计员角色的管理员的操作日志；审计员可以审计非审计员角色的管理员的操作日志；'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'username',
            placeholder: '请输入用户名',
            label: '用户名：',
            style: {
              width: '150px'
            }
          },
          {
            type: 'timePicker',
            value: 'createTime',
            label: '操作时间',
            startText: '开始时间',
            endText: '结束时间'
          },
          {
            type: 'input',
            value: 'clientIp',
            placeholder: '请输入客户端IP',
            label: '客户端IP：',
            style: {
              width: '150px'
            }
          },
          {
            type: 'input',
            value: 'subEventType',
            placeholder: '请输入事件子类型',
            label: '事件子类型：',
            style: {
              width: '150px'
            }
          },
          {
            type: 'select',
            value: 'logLevel',
            label: '日志级别：',
            options: [
              {
                label: '所有',
                value: ''

              },
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
          },
          {
            type: 'select',
            value: 'operateType',
            label: '操作类型：',
            options: [
              {
                label: '所有',
                value: ''

              },
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
              },
              {
                label: '登录',
                value: 9
              },
              {
                label: '退出',
                value: 10
              }
            ]
          },
          {
            type: 'select',
            value: 'requestResult',
            label: '操作结果：',
            options: [
              {
                label: '所有',
                value: ''

              },
              {
                label: '成功',
                value: 1
              },
              {
                label: '失败',
                value: 2
              }
            ]
          },
          {
            icon: 'xiazai15',
            btnType: 'Export',
            type: 'henderBorderBtn',
            text: '搜索'
          },
          {
            icon: '',
            type: 'henderBorderBtn',
            text: '导出',
            btnType: 'Derived'
          }
          // ,
          // {
          //   icon: '',
          //   type: 'henderBorderBtn',
          //   text: '收起',
          //   btnType: 'packUp'
          // }
        ]
      },
      showHide: false
    }
  },
  methods: {
    // logDetail (row) {
    //   console.log(row)
    // },
    handFirstData () {
      this.$request.fetchReinsuranceCheckMenus({ status: 2 }).then(res => {
        console.log(res.data)
        if (res.code === 13187) {
          this.showHide = true
          // this.$router.push({ name: 'authority' })
        } else if (res.code === 200) {
          this.showHide = false
        }
      })
    },
    // 搜索
    handleEventAlarmExport () {
      console.log('搜索')
      this.fetchTableApi()
    },
    // 导出
    handleDataDerived () {
      console.log('导出')
      let params = this.list.params
      let token = localStorage.getItem('JEECMS-Auth-Token')
      window.open(`${this.$path}${this.$prefix}/reinsurance/export?${qs.stringify(params)}&JEECMS-Auth-Token=${token}`)
    },
    // 收起
    handleDataPackUp () {
      console.log('收起')
    },
    handleSearchs (data) {
      console.log(data)
      let params = this.list.params
      if (params.createTime) {
        params.beginDate = params.createTime[0]
        params.endDate = params.createTime[1]
      }
      this.list.params = params
      this.fetchTableApi()
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
  },
  activated () {
  },
  mounted () {
    this.handFirstData()
    this.$nextTick(() => {
      this.list.columns = this.columns
    })
  }
}
</script>
<style lang="scss" scoped>
.journal-index-wrap{
  height: 100%;
  .showUrl{
    cursor: pointer;
  }
}
</style>
