<template>
  <section class="user-manage-wrap">

        <search-header
      class="search-header"
        v-bind="searchHeader"
        :params="list.params"
        @handleBtn="handleBtnAll"
        @handleSearch="handleSearchs"
      ></search-header>
      <base-table
        v-bind="list"
        @handleSelectionChange="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        v-on:handleDelete="handleTableDelete"
        @sortChange="sortChange"
      >
        <template #isEffective="scope">
          <div>
            <jee-icon :style="{fill:scope.scope.row.isEffective?'#FF9300':'#CCCCCC'}"
              :iconClass="scope.scope.row.isEffective?'youxiao':'wuxiao'"></jee-icon>
          </div>
        </template>
        <template #province="scope">
          <span>{{scope.scope.row.province}}{{scope.scope.row.city}}</span>
        </template>
      </base-table>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
const columns = [
  {
    prop: 'replayName',
    label: '参与人'
  },
  {
    prop: 'createTime',
    label: '参与时间',
    scopeType: 'time',
    sortable: 'custom'
  },
  {
    prop: 'device',
    label: '网络设备',
    minWidth: '120px'
  },
  {
    prop: 'ip',
    label: '参与人IP地址',
    minWidth: '120px'
  },
  {
    prop: 'province',
    label: '地域',
    scopeType: 'slot'
  },
  {
    scopeType: 'slot',
    prop: 'isEffective',
    label: '是否有效'
  }
]
export default {
  name: 'user-manage',
  mixins: [searchHeader, baseTable],
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: {
        columns,
        showIndex: true,
        indexLabel: '序号',
        indexWidth: '120',
        api: 'fetchQuestionnaireAnswerPage',
        params: {
          'isEffective': '',
          'province': '',
          'city': '',
          'deviceType': '',
          'replayName': '',
          'ip': '',
          'beginTime': '',
          'endTime': '',
          region: [''],
          times: [],
          replayType: 1,
          replayText: '',
          orderBy: 1,
          'questionnaireId': Number(this.$route.query.id)
        },
        filterParams: ['region', 'times'],
        handleColumn: [
          {
            type: 'Link',
            name: '查看',
            icon: 'chakan',
            href: '/interact/vote/view'
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete'
          }
        ],
        handleColumnProp: {
          label: '操作',
          align: 'left',
          width: '145px'
        }
      },
      searchHeader: {
        searchItems: [
          {
            icon: 'youxiao',
            type: 'henderBtn',
            title: '标记为有效',
            btnType: 'isEffective',
            class: 'hender-btn active'
          },
          {
            icon: 'wuxiao',
            type: 'henderBtn',
            title: '标记为无效',
            btnType: 'disEffective',
            class: 'hender-btn'
          },
          {
            icon: 'daochuliebiao',
            type: 'henderBtn',
            title: '导出列表',
            btnType: 'exportList',
            class: 'hender-btn'
          },
          {
            icon: 'daochuquanbu',
            type: 'henderBtn',
            title: '导出全部',
            btnType: 'exportAll',
            class: 'hender-btn'
          },
          {
            icon: 'delete',
            type: 'henderBtn',
            title: '删除',
            btnType: 'delete',
            class: 'hender-btn'
          },
          {
            type: 'select',
            value: 'isEffective',
            label: '是否有效：',
            style: {
              width: '98px'
            },
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '是',
                value: 1
              },
              {
                label: '否',
                value: 0
              }
            ]
          },
          {
            value: 'region',
            label: '地域：',
            type: 'cascader',
            props: {
              label: 'areaName',
              value: 'id',
              checkStrictly: true
            },
            style: {
              width: '114px'
            },
            options: []
          },
          {
            type: 'select',
            value: 'deviceType',
            label: '网络设备：',
            style: {
              width: '99px'
            },
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '计算机',
                value: 1
              },
              {
                label: '移动设备',
                value: 2
              }
            ]
          },
          {
            type: 'timePicker',
            value: 'times',
            style: {
              width: '318px'
            }
          },
          {
            type: 'searchInput',
            value: 'replayText',
            isSelect: true,
            selectProp: 'replayType',
            style: {
              width: '300px'
            },
            options: [
              { label: '用户名', value: 1 },
              { label: 'IP', value: 2 }
            ]
          }
        ]
      }
    }
  },
  methods: {
    sortChange (column, prop, order) {
      this.list.params.orderBy = order === 'descending' ? 1 : 2
      this.handleSearchs()
    },
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchQuestionnaireAnswerDelete([row.id])
      }).catch(() => {})
    },
    fetchQuestionnaireAnswerDelete (ids) {
      this.$request.fetchQuestionnaireAnswerDelete({ ids: ids }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    fetchQuestionnaireAnswerValid (ids) {
      this.$request.fetchQuestionnaireAnswerValid({ ids: ids }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    fetchQuestionnaireAnswerInvalid (ids) {
      this.$request.fetchQuestionnaireAnswerInvalid({ ids: ids }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    fetchQuestionnaireAnswerExport (data, suffix) {
      this.$request.fetchQuestionnaireAnswerExport(data).then(res => {
        this.$exportClick(res, this.tabName + suffix)
        // file
      })
    },
    handleSearchs () {
      this.list.pageNo = 1
      var params = this.list.params
      if (params.times && params.times.length) {
        params.beginTime = params.times[0]
        params.endTime = params.times[1]
      } else {
        params.beginTime = ''
        params.endTime = ''
      }
      if (params.region && params.region.length) {
        // province city
        params.province = params.region[0]
        params.city = params.region[1] || ''
      }
      if (params.replayType) {
        params.replayName = params.replayType === 1 ? params.replayText : ''
        params.ip = params.replayType === 2 ? params.replayText : ''
      }
      this.list.params = params
      this.fetchTableApi()
    },
    handleBtnAll (data) {
      var ids = this.list.selectedKeys
      var params = this.list.params
      delete params.region
      delete params.times
      var formData = new FormData()
      Object.keys(params).forEach(k => {
        formData.append(k, params[k])
      })
      let suffix = '.xlsx'
      this.list.data.map(v => {
        if (v && v.isFile) {
          suffix = '.zip'
        }
      })
      console.log(suffix)
      switch (data.btnType) {
        case 'isEffective':
          // 有效
          if (ids.length) {
            this.fetchQuestionnaireAnswerValid(ids)
          } else {
            this.$message('请至少选择一条数据进行操作')
          }
          break
        case 'disEffective':
          // 无效
          if (ids.length) {
            this.fetchQuestionnaireAnswerInvalid(ids)
          } else {
            this.$message('请至少选择一条数据进行操作')
          }
          break
        case 'exportList':
          // 导出列表
          formData.append('size', this.list.pageSize)
          formData.append('page', this.list.pageNo)
          this.fetchQuestionnaireAnswerExport(formData, suffix)
          break
        case 'exportAll':
          // 导出全部
          formData.delete('size')
          formData.delete('page')
          this.fetchQuestionnaireAnswerExport(formData, suffix)
          break
        case 'delete':
          // 删除
          if (ids.length) {
            this.$confirm('是否确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.fetchQuestionnaireAnswerDelete(ids)
            }).catch(() => {})
          } else {
            this.$message('请至少选择一条数据进行操作')
          }
          break
      }
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    // 初始化下拉选项
    getDataList () {
      this.$request.fetchSystemAreaList({ parentId: '' }).then(res => {
        if (res.code === 200) {
          const nodes = res.data.map(d => {
            d.hasChildren = !d.isChild
            return d
          })
          let arr = [{ areaName: '全部', id: '' }]
          this.searchHeader.searchItems.find(t => t.value === 'region').options = arr.concat(nodes)
        }
      })
    }
  },
  activated () {
    this.list.params.questionnaireId = this.$route.query.id
    this.handleSearchs()
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataList()
    })
  }
}
</script>

<style lang="scss">
  .user-manage-wrap{
    border: 1px solid #e8e8e8;
    padding: 20px 20px 30px;
    border-radius:0px 4px 4px 4px;
    .hender-btn{
      margin-left: 0 !important;
      &.active{
        .jee-svg-icon{
          fill:#FF9300;
          &:hover{
             fill:#FF9300;
          }
        }
      }
      &.el-link{
        margin-left: 20px !important;
      }
      .jee-svg-icon{
        margin: 0 !important;
      }
    }
    .el-cascader.jee-border .el-cascader-menu{
      min-width: 112px;
    }
  }
</style>
