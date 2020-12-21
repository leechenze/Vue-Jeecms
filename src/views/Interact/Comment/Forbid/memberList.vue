<template>
  <section class="interact-forbid-memberList-container">

      <search-header
      class="search-header"
      v-bind="memberSearchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <el-button class="headerBtn" size="small" type="primary" @click="canceluser()"
      :disabled="!_checkPermission('/usercomment/cancel/stop', 'PUT')"
    ><jee-icon iconClass="quxiaojingzhi" style="margin-right:10px;font-size:14px"></jee-icon>取消用户禁止</el-button>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableMemberDelete"
    >
      <template #userName="scope">
        <div style="cursor: pointer;" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.userName}}</div>
      </template>
    </base-table>
  </section>
</template>

<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
export default {
  name: 'interactCommentForbidIndexMemberList',
  mixins: [searchHeader, baseTable],
  data () {
    return {
      list: {
        showIndex: false,
        columns: [
          {
            prop: 'userName',
            label: '用户名',
            scopeType: 'slot'
          },
          {
            prop: 'user.userGroup.groupName',
            label: '所属会员组'
          },
          {
            prop: 'user.userLevel.levelName',
            label: '会员等级'
          },
          {
            prop: 'user.integral',
            label: '积分'
          },
          {
            prop: 'userSiteName',
            label: '注册站点'
          },
          {
            scopeType: 'time',
            prop: 'createTime',
            label: '禁言时间'
          },
          {
            prop: 'createUser',
            label: '操作人'
          }
        ],
        api: 'fetchSysblacklistPage',
        params: {
          userName: '',
          status: true
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '取消用户禁止',
            icon: 'quxiaojingzhi',
            disabled: !this._checkPermission('/usercomment/cancel/stop', 'PUT')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '125px'
        }
      },
      memberSearchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'userName',
            placeholder: '请输入用户名',
            style: {
              width: '300px'
            }
          }
        ]
      }
    }
  },
  methods: {
    rowHref (row) {
      this.$routerLink('/interact/comment/member?userId=' + row.userId)
    },
    canceluser () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定批量取消用户禁止？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysblacklistDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    handleTableMemberDelete (data) {
      let ids = []
      ids.push(data.id)
      this.$confirm('是否确定取消用户禁止？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchSysblacklistDelete(ids)
      })
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 删除黑名单
    fetchSysblacklistDelete (ids) {
      this.$request.fetchSysblacklistDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    }

  },
  created () {

  }
}
</script>

<style lang="scss">
.interact-forbid-memberList-container{
  .el-button.el-button--small.headerBtn{
    margin:18px 0 30px 0;
    padding: 8px 20px;
    font-size:16px
  }
}
</style>
