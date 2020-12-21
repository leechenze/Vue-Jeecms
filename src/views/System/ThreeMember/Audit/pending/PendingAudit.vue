<template>
  <section class="member-Pending-audit-wrap tree-member-list">
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
      v-on:handleDelete="handlePassAuditData"
      @handleLink="handPendingAuditData"
    >
      <template #operatingDetails="scope">
        <div class="details-all">
          <span class="text-details">{{scope.scope.row.operatingDetails}}</span>
          <span v-if="scope.scope.row.showLink" class="table-details" @click="bandSiteData(scope.scope.row)" >查看详情</span>
        </div>
      </template>
    </base-table>
    <el-dialog
      :visible.sync="showFile"
      width="30%"
      :before-close="handleClose">
      <span>列表中存在相关的待审核事项，操作后这些待审核事项会被删除，建议检查后再进行此操作！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showFile = false">取 消</el-button>
        <el-button type="primary" @click="handAddData">仍要操作</el-button>
      </span>
    </el-dialog>
    <!-- 详情弹窗 -->
    <detail-dialog ref="detailDialog" @handleApproved="handPendingAuditData" @handleAuditFailed="handlePassAuditData"></detail-dialog>
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
    maxWidth: '180px',
    minWidth: '150px'
  },
  {
    prop: 'createTime',
    label: '申请时间',
    scopeType: 'time',
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'modulePrompt',
    label: '所属模块',
    maxWidth: '130px',
    minWidth: '130px'
  },
  {
    prop: 'operatingPrompt',
    label: '操作类型',
    maxWidth: '130px',
    minWidth: '130px'
  },
  {
    prop: 'operatingDetails',
    label: '操作详情',
    scopeType: 'slot',
    maxWidth: '800px',
    minWidth: '260px'
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
      showFile: false,
      urlApi: 'fetAuditManagePage',
      navName: 'pendingAudit',
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
        indexWidth: '80',
        indexClass: 'indexLabel',
        activeOneNum: '',
        api: 'fetAuditManagePage',
        params: {
          status: 1,
          module: ''
        },
        filterParams: ['region', 'times'],
        fields: [],
        handleColumn: [
          {
            type: 'Link',
            name: '审核通过',
            params: '',
            icon: 'shenghetongguo'
          },
          {
            type: 'Delete',
            name: '审核不通过',
            icon: 'shenghebutongguo'
          }
        ],
        handleColumnProp: {
          label: '操作',
          align: 'right',
          width: '240px',
          // fixed: 'right',
          buttonAlign: 'row'
        },
        tableProps: {
          maxHeight: 550
        }
      },
      width: '821px',
      height: 'auto',
      auditID: '',
      status: ''
    }
  },
  methods: {
    // 站点查看详情
    bandSiteData (item) {
      this.$refs.detailDialog.showTheDialog(item)
    },
    // 弹窗关闭
    handleClose () {
      this.showFile = false
    },
    // 弹窗确认
    handAddData () {
      let check = false
      this.handAuditTypeData(this.auditID, this.status, check)
    },
    // 模块点击
    bandNaveData (item) {
      this.navIndex = item.name
      this.list.params.module = item.id
      this.fetchTableApi()
    },
    // 审核通过
    handPendingAuditData (row, i, item) {
      let auditType = 1
      let check = true
      this.handAuditTypeData(row.id, auditType, check)
    },
    // 审核不通过
    handlePassAuditData (row, index) {
      let auditType = 2
      let check = true
      this.handAuditTypeData(row.id, auditType, check)
    },
    // 审核接口
    handAuditTypeData (auditID, item, check) {
      this.auditID = auditID
      this.status = item
      this.$request.fetAuditOperate({ id: auditID, status: item, check: check }).then(res => {
        // 当res.data 为true时弹出弹窗
        if (res.code === 200) {
          this.$emit('formSubmit', this.navName)
          if (res.data === true) {
            this.showFile = true
          } else {
            this.showFile = false
            this.$restBack(res, () => {
              this.fetchTableApi()
            })
          }
        }
      })
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
  .member-Pending-audit-wrap{
  }
  .tree-member-list{
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
      th:last-of-type{
        padding-left: 30px!important;
      }
      th:first-of-type{
        >.cell{
          padding: 5px !important;
        }
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
        min-width: 60px;
      }
    }
  }
  @media (min-width: 1370px) and (max-width: 1920px) {
    .member-Pending-audit-wrap{
      .details-all{
        padding-right: 30px !important;
        .text-details{
        }
      }
    }
  }
  @media (min-width: 720px) and (max-width: 1370px) {
    .member-Pending-audit-wrap{
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
