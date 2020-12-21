<template>
  <section class="interact-forbid-index-container">

      <search-header
      class="search-header"
      v-bind="ipSearchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <el-button class='headerBtn' size="small" type="primary" @click="cancelIp()"
      :disabled="!_checkPermission('/usercomment/cancel/stop', 'PUT')"
    ><jee-icon iconClass="quxiaojingzhi" style="margin-right:10px;font-size:14px"></jee-icon>取消IP禁止</el-button>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableIpDelete"
    >
      <template #ip="scope">
        <div class="jee-color" style="cursor: pointer;" @click="rowHref(scope.scope.row)">{{scope.scope.row.ip}}</div>
      </template>
    </base-table>
  </section>
</template>

<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import baseHeader from '@/components/mixins/baseHeader'
export default {
  name: 'interactCommentForbidIndexIpList',
  mixins: [searchHeader, baseTable, baseHeader],
  data () {
    return {
      list: {
        showIndex: false,
        columns: [
          {
            prop: 'ip',
            label: 'IP',
            scopeType: 'slot'
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
          status: false,
          ip: ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '取消IP禁止',
            icon: 'quxiaojingzhi',
            width: '110px',
            disabled: !this._checkPermission('/usercomment/cancel/stop', 'PUT')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '110px'
        }
      },
      ipSearchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'ip',
            placeholder: '请输入IP',
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
      this.$routerLink('/interact/comment/ip?precisionIp=' + row.ip)
    },
    cancelIp () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定批量取消IP禁止？', '提示', {
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
    handleTableIpDelete (data) {
      let ids = []
      ids.push(data.id)
      this.$confirm('是否确定取消IP禁止？', '提示', {
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

<style lang="scss" scoped>
.interact-forbid-index-container{
  .el-button.el-button--small.headerBtn{
    margin:18px 0 30px 0;
    padding: 8px 20px;
    font-size:16px
  }
}
</style>
