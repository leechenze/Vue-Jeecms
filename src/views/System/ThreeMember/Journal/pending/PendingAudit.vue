<template>
  <section class="journal-Pending-audit-wrap tree-member-list">
    <div class="navData">
      <div class="navData-titlte">所属模块:</div>
      <ul >
        <li class="navData-item jee-border" :class="[navIndex===item.name?'jee-bg-light':'']" @click="bandNaveData(item)" v-for="(item,index) in navData" :key="index">{{item.name}}</li>
      </ul>
    </div>
      <base-table
        v-bind="list"
        @handleSelectionChange="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
        <template #operatingDetails="scope">
        <div class="details-all">
          <span class="text-details">{{scope.scope.row.operatingDetails}}</span>
          <span v-if="scope.scope.row.showLink" class="table-details" @click="bandSiteData(scope.scope.row)" >查看详情</span>
        </div>
        </template>
        <template #status="scope">
          <span class="table-details-type" >{{scope.scope.row.status === 1?'待审核':scope.scope.row.status === 2?'已审核':'审核不通过'}}</span>
        </template>
      </base-table>
      <el-dialog
        :visible.sync="showFile"
        width="30%"
        :before-close="handleClose">
        <span>列表中存在相关的待审核事项，操作后这些待审核事项会被删除，建议检查后再进行此操作！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showFile = false">取 消</el-button>
          <el-button type="primary" @click="showFile = false">仍要操作</el-button>
        </span>
      </el-dialog>
      <!-- 详情弹窗 -->
      <detail-dialog ref="detailDialog"></detail-dialog>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import detailDialog from '../../detailDialog'
const columns = [
  {
    prop: 'requestUserName',
    label: '申请人',
    maxWidth: '230px',
    minWidth: '160px'
  },
  {
    prop: 'createTime',
    label: '申请时间',
    scopeType: 'time',
    maxWidth: '230px',
    minWidth: '80px'
  },
  {
    prop: 'modulePrompt',
    label: '所属模块',
    maxWidth: '160px',
    minWidth: '120px'
  },
  {
    prop: 'operatingPrompt',
    label: '操作类型',
    maxWidth: '160px',
    minWidth: '120px'
  },
  {
    prop: 'operatingDetails',
    label: '操作详情',
    scopeType: 'slot',
    maxWidth: '800px',
    minWidth: '360px'
  }
]
export default {
  name: 'user-manage',
  mixins: [searchHeader, baseTable, baseHeader],
  components: {
    detailDialog
  },
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  watch: {
    'tabName': function (item) {
      if (item === this.navName) {
        this.list.api = this.urlApi
        this.fetchTableApi()
      }
    }
  },
  data () {
    return {
      columns,
      urlApi: 'fetcHauditManageLogPage',
      navName: 'pendingAudit',
      showFile: false,
      statusData: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '已审核',
          id: ''
        },
        {
          name: '待审核',
          id: ''
        },
        {
          name: '审核不通过',
          id: ''
        }
      ],
      navData: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '组织管理',
          id: 1
        },
        {
          name: '角色管理',
          id: 2
        },
        {
          name: '用户管理',
          id: 3
        },
        {
          name: '三员管理设置',
          id: 4
        },
        {
          name: '站点管理',
          id: 5
        },
        {
          name: '栏目管理',
          id: 6
        },
        {
          name: '工作流',
          id: 7
        }
      ],
      navIndex: '全部',
      list: {
        showSelection: false,
        columns: [],
        showIndex: true,
        // isIndexFixed: true,
        SerialNumber: 1, // 保存数据
        indexLabel: '序号',
        indexWidth: '140',
        api: 'fetcHauditManageLogPage',
        params: {
          status: 1,
          module: ''
        },
        filterParams: ['region', 'times'],
        fields: [],
        tableProps: {
          maxHeight: 550
        }
      }
    }
  },
  methods: {
    // 站点查看详情
    bandSiteData (item) {
      this.$refs.detailDialog.showTheDialog(item, 'detail')
    },
    // 弹窗关闭
    handleClose () {
      this.$confirm('确认关闭？')
        .then(_ => {
          // done()
        })
        .catch(_ => {})
    },
    // 模块点击
    bandNaveData (item) {
      this.navIndex = item.name
      this.list.params.module = item.id
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
    this.$nextTick(() => {
      this.list.columns = this.columns
    })
  }
}
</script>
<style lang="scss">
  .journal-Pending-audit-wrap{
    .el-table__body {
      .el-table__row{
        td{
          padding: 12px 0 !important;
        }
        td:last-of-type{
          padding-left: 30px !important;
        }
        td:first-of-type{
          >.cell{
            padding-left: 15px !important;
          }
        }
      }
    }
    .el-table__header{
      th:first-of-type{
        >.cell{
          padding: 5px !important;
        }
      }
      th:last-of-type{
        padding-left: 30px !important;
      }
    }
    .navData{
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666666;
      padding: 0px 0 20px;
      .navData-titlte{
      }
      ul{
        margin-left: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        text-align: center;
        cursor: pointer;
        .jee-bg-light{
          color: #ffffff;
        }
        .navData-item{
          padding: 0 20px;
          height: 30px;
          line-height: 30px;
          border-left: none
        }
        .navData-item:first-child{
          border-left: 1px solid #1DC4DE;
          border-radius:4px 0px 0px 4px;
        }
        .navData-item:last-of-type{
          border-radius:0px 4px 4px 0px;
        }
      }
    }
    .details-all{
      // display: flex;
      // align-items: center;
      .text-details{
      }
      .table-details{
        color: #1EC6DF;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  @media (min-width: 1370px) and (max-width: 1980px) {
    .journal-Pending-audit-wrap{
      .details-all{
        padding-right: 30px !important;
        .text-details{
        }
      }
    }
  }
  @media (min-width: 720px) and (max-width: 1370px) {
    .journal-Pending-audit-wrap{
      .details-all{
        padding-right: 0px !important;
        .text-details{
        }
      }
      .el-table__body {
        .el-table__row{
          td{
            >.cell{
              padding: 0 15px !important;
            }
          }
          td:last-of-type{
            padding-left: 10px !important;
          }
        }
      }
      .el-table__header{
        th{
          padding-left: 5px !important;
        }

      }
    }
  }
</style>
