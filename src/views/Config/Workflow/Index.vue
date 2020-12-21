<template>
  <section class="workflow-index-container">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
    ></base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import {
  mapActions
} from 'vuex'

const columns = [
  {
    prop: 'name',
    label: '工作流名称',
    scopeType: 'link',
    showOverflowTooltip: true,
    href: '/config/workflow/detail'
  },
  {
    prop: 'remark',
    label: '备注',
    showOverflowTooltip: true,
    minWidth: '250px'
  },
  {
    prop: 'flowCate',
    label: '应用场景',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '内容',
          value: 1
        },
        {
          label: '投票调查',
          value: 2
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'updateTime',
    label: '最后修改时间'
  },
  {
    prop: 'updateUser',
    label: '最后修改人'
  }
]

export default {
  name: 'configWorkflowIndex',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      list: {
        columns,
        api: 'fetchFlowList',
        params: {
          flowCate: '',
          name: ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/workflow', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '75px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: 'global.create',
            icon: 'xinjian',
            disabled: !this._checkPermission('/workflow', 'POST')
          },
          {
            type: 'Delete',
            text: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/workflow', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '这里是工作流列表'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'flowCate',
            label: '应用场景：',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '内容',
                value: 1
              },
              {
                label: '投票调查',
                value: 2
              }
            ]
          },
          {
            type: 'searchInput',
            value: 'name',
            placeholder: '请输入工作流名称'
          }
        ]
      }
    }
  },
  methods: {
    /* workflow-plugin start */
    ...mapActions('config', ['FetchWorkFlowOptions']),
    /* workflow-plugin end */
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchFlowDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$router.push('/config/workflow/create')
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this._confirmDelete().then(() => {
          this.fetchFlowDelete(this.list.selectedKeys)
        })
      } else {
        this._messageOne()
      }
    },
    // 发送请求事件
    fetchFlowDelete (ids) {
      this.list.loading = true
      this.$request.fetchFlowDelete({ ids }).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.fetchTableApi()
          /* workflow-plugin start */
          this.FetchWorkFlowOptions(true)
          /* workflow-plugin end */
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 接口返回数据
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
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
.workflow-index-container{
  .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
}

</style>
