<template>
  <section class="applet-member-index">
    <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      />
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleUntying="handleUntying"
    >
    </base-table>
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      v-on:handleConfirm="handleConfirm"
    >
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
var columns = [
  {
    prop: 'wechatId',
    label: '成员'
  },
  {
    prop: 'createTime',
    label: '加入时间'
  }
]
export default {
  name: 'appletMember',
  mixins: [baseHeader, baseTable, formDialog],
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '添加体验者',
            icon: 'tianjia',
            disabled: !this._checkPermission('/miniprogrammember', 'POST')
          }
        ],
        showAlertIcon: false
      },
      list: {
        columns,
        api: 'miniprogrammemberList',
        params: {
          'appId': this.$route.query.appId
        },
        showSelection: false,
        handleColumn: [
          {
            type: 'Untying',
            name: '解绑',
            icon: 'jiebang',
            disabled: !this._checkPermission('/miniprogrammember', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '160px',
          align: 'left'
        }
      },
      edit: {
        labelWidth: '120px',
        width: '525px',
        title: '添加体验者',
        formLoading: false,
        form: {
          appId: this.$route.query.appId,
          wechatId: ''
        },
        rules: {
          wechatId: [
            this.$rules.required()
          ]
        },
        buttons: [
          {
            text: '确认',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            label: '微信号',
            prop: 'wechatId'
          }
        ]
      }
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    name (newVal, oldVal) {
      if (this.name === 'member') {
        this.fetchTableApi()
      }
    }
  },
  methods: {
    handleConfirm (data) {
      this.$request.miniprogrammemberAdd(data).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    // 新增
    handleHeaderAdd (btn) {
      this.$refs.editDialog.showDialog()
    },
    // 解绑
    handleUntying (data, btn) {
      this.$confirm('确定解绑此账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          'appId': data.appId,
          'id': data.id,
          'wechatId': data.wechatId
        }
        this.$request.miniprogrammemberDelete(params).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      }).catch(() => {})
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>
