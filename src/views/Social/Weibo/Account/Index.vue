<template>
  <section class="social-accountI-index">
    <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      @handleCancel="handleHeaderCancel"
      />
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleReauthorization="handleTableReauthorization"
      @handleAdmin="handleTableAdmin"
    >
      <template #screenName="scope">
        <div class="resource-wrap">
          <el-image
            class="resource-img t-inline t-radius"
            :src="scope.scope.row.profileImageUrl"
            fit="contain">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
          </el-image>
          <div class="resource-name">
            <span :title="scope.scope.row.screenName">{{scope.scope.row.screenName}}</span>
          </div>
        </div>
      </template>
      <template #residueTime="scope">
        <div :class="scope.scope.row.red?'t-red':(scope.scope.row.residueTime === '已到期'?'t-gray':'')">
          {{scope.scope.row.residueTime}}
        </div>
      </template>
    </base-table>
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      v-on:handleConfirm="handleConfirm"
    >
      <iframe name="right" id="rightMain"
        :src="url" frameborder="no"
        scrolling="auto" width="100%"
        height="400px" allowtransparency="true"></iframe>
    </form-dialog>
    <set-admin ref="setAdmin" @handleConfirm="setAdminList"></set-admin>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import setAdmin from './setAdmin'
var columns = [
  {
    prop: 'id',
    label: '序号'
  },
  {
    prop: 'screenName',
    label: '微博名称',
    minWidth: '235px',
    scopeType: 'slot'
  },
  {
    prop: 'adminNames',
    label: '管理员',
    formatter: (row, column, cellValue, index) => {
      if (row.adminNames) {
        return row.adminNames
      } else {
        return '未设置'
      }
    }
  },
  {
    prop: 'followersCount',
    label: '粉丝数'
  },
  {
    prop: 'friendsCount',
    label: '关注数'
  },
  {
    prop: 'statusesCount',
    label: '微博数'
  },
  {
    prop: 'residueTime',
    label: '授权到期时间',
    minWidth: '110px',
    scopeType: 'slot'
  }
]
export default {
  name: 'socialWeiboAccount',
  components: {
    setAdmin
  },
  mixins: [baseTable, baseHeader, formDialog],
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '添加',
            icon: 'tianjia',
            disabled: !this._checkPermission('/weibo', 'GET', true)
          },
          {
            type: 'Cancel',
            text: '取消授权',
            icon: 'quxiaoshouquan',
            disabled: !this._checkPermission('/weiboinfo', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '显示所有已授权的微博，可授权多个。同一微博在站群中不可重复授权；'
      },
      list: {
        columns,
        api: 'weiboinfoPage',
        params: {},
        handleColumn: [
          {
            type: 'Reauthorization',
            name: '重新授权',
            icon: 'chongxinshouquan',
            disabled: !this._checkPermission('/weibo', 'GET', true)
          },
          {
            type: 'Admin',
            name: '设置管理员',
            icon: 'guanliyuan',
            disabled: !this._checkPermission('/weiboinfo/user', 'POST')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '250px',
          align: 'left'
        }
      },
      edit: {
        labelWidth: '0px',
        width: '700px',
        title: '添加授权账号',
        formLoading: false,
        form: {},
        rules: {},
        buttons: [],
        formItems: []
      },
      url: ''
    }
  },
  methods: {
    authorization () {
      this.$request.weiboAuthorize().then(res => {
        if (res.code === 200) {
          this.url = res.data
          this.$refs.editDialog.showDialog()
        }
      })
    },
    // 添加微博账号
    handleHeaderAdd (btn) {
      this.edit.title = '添加授权账号'
      this.authorization()
    },
    // 重新授权
    handleTableReauthorization (data, btn) {
      this.edit.title = '重新授权'
      this.authorization()
    },
    // 取消授权
    handleHeaderCancel (btn) {
      var ids = this.list.selectedKeys
      if (ids.length > 0) {
        this.$request.weiboinfoCancel({ ids: ids }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      } else {
        this.$message('请至少选择一个账户')
      }
    },
    // 设置管理员
    handleTableAdmin (data, btn) {
      var params = {
        'weiboUserId': data.id
      }
      this.$refs.setAdmin.showTheDialog(data, btn, params, 'weiboinfoAdmins')
    },
    setAdminList (data) {
      var params = {
        ids: data.ids,
        weiboUserId: data.weiboUserId
      }
      this.$request.weiboinfoUser(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    handleConfirm (data) {
      console.log(data)
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
  }
}
</script>

<style lang="scss">
  .social-accountI-index{
    // table 名称
    .resource-wrap{
      padding: 20px 0;
    }
    .resource-img{
      width: 80px !important;
      height: 80px !important;
      box-sizing: border-box;
      margin-right: 20px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      background-color: #FAFAFA;
      display: inline-block;
      vertical-align: middle;
      .el-image__inner{
        max-width: 100%;
        max-height: 100%;
      }
    }
    .resource-name{
      display: inline-block;
      vertical-align: middle;
      min-width: 90px;
      line-height: 80px;
    }
  }
</style>
