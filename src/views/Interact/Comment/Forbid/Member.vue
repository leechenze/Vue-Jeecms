<template>
  <section class="interact-forbid-member-container">
    <p class="header-text"><label>当前用户:</label><span>{{userName}}</span><label>禁言时间：</label><span>{{$moment(createTime)}}</span><label>操作人：</label><span>{{createUser}}</span></p>
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
    >
      <template #title="scope">
        [<span>{{scope.scope.row.content.channel.name}}</span>]<span class="jee-color">{{scope.scope.row.content.title}}</span>
      </template>
    </base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
const columns = [
  {
    prop: 'commentText',
    label: '评论内容',
    minWidth: '175px'
  },
  {
    scopeType: 'slot',
    prop: 'title',
    label: '文章',
    minWidth: '175px'
  },
  {
    scopeType: 'time',
    fixed: 'right',
    prop: 'createTime',
    label: '时间'
  }
]
export default {
  name: 'interactCommentForbidMember',
  mixins: [baseTable, baseHeader],
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '取消用户禁止',
            icon: 'quxiaojingzhi',
            disabled: !this._checkPermission('/usercomment/cancel/stop', 'PUT')
          },
          {
            type: 'Delete',
            text: '删除评论',
            icon: 'delete',
            disabled: !this._checkPermission('/usercomment', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
      },
      list: {
        columns,
        api: 'fetchInteractUsercommentSpecific',
        params: {
          userId: ''
        },
        handleColumn: []
      },
      userName: '',
      createTime: '',
      createUser: '',
      id: ''
    }
  },
  methods: {
    handleHeaderCreate () {
      let ids = []
      ids.push(this.id)
      this.$confirm('是否确定取消用户禁止？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchSysblacklistDelete(ids)
      })
    },
    handleHeaderDelete () {

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
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    }
  },
  mounted () {
  },
  activated () {
    const { userId, userName, createTime, createUser, id } = this.$route.query
    this.list.params.userId = userId
    this.userName = userName
    this.createTime = createTime
    this.createUser = createUser
    this.id = id
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'interactCommentForbidMember') {
        const { userId } = newRoute.query
        if (userId && userId !== this.list.params.userId) {
          this.list.params.userId = userId
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .interact-forbid-member-container{
    .header-text{
      margin-bottom: 30px;
      label{
        color: #666666;
      }
      span{
        margin-right: 65px;
      }
    }
    .jee-color{
      cursor: pointer;
    }
  }
</style>
