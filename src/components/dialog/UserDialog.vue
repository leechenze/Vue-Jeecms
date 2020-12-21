<template>
  <section class='user-dialog-container'>
    <table-dialog
      ref="dialog"
      v-bind="tablelist"
      :defaultSelectedKeys="userListIds"
      @handleSelectionChange="handleTableDialogSelectionChange"
      @handleSizeChange="handleTableDialogSizeChange"
      @handleCurrentChange="handleTableDialogCurrentChange"
      @handleConfirm="handleConfirm"
      @handleSearch="handleTableSearch"
    ></table-dialog>
  </section>
</template>
<script>
import tableDialog from '@/components/mixins/tableDialog'

import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'UserDialog',
  mixins: [tableDialog],
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      userList: this.value,
      tablelist: {
        title: '添加用户',
        width: '778px',
        api: 'fetchSysUsersPage',
        columns: [
          {
            prop: 'username',
            label: '用户名',
            width: '165px'
          },
          {
            prop: 'userExt.realname',
            label: '真实姓名'
          },
          {
            prop: 'orgName',
            label: '所属组织'
          },
          {
            prop: 'roleNames',
            label: '所属角色',
            showOverflowTooltip: true
          }
        ],
        filterParams: ['orgids'],
        params: {
          orgids: [''],
          orgid: '',
          roleid: '',
          key: '',
          enabled: 1
        },
        searchHeader: {
          searchItems: [
            {
              type: 'cascader',
              value: 'orgids',
              props: {
                checkStrictly: true
              },
              label: '所属组织：',
              placeholder: '请选择',
              options: [],
              style: {
                width: '130px'
              }
            },
            {
              type: 'select',
              value: 'roleid',
              label: '所属角色：',
              placeholder: '请选择',
              options: [],
              style: {
                width: '130px'
              }
            },
            {
              type: 'searchInput',
              value: 'key',
              placeholder: '请输入关键字',
              style: {
                width: '200px'
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['organizeOptionsAll', 'roleOptions']),
    userListIds () {
      return this.userList.map(d => d.value)
    }
  },
  watch: {
    organizeOptionsAll (newData) {
      this.updateOrgOptions(newData)
    },
    roleOptions (newData) {
      this.updateRoleOptions(newData)
    }
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptionsAll', 'FetchRoleOptions']),
    showDialog () {
      this.$refs.dialog.showDialog()
      this.$nextTick(() => {
        this.setSelectRows(this.tablelist.data)
      })
    },
    setSelectRows (newData) {
      const that = this
      if (newData.length && that.$refs.dialog) {
        const ids = this.value.map(d => d.value)
        newData.forEach(row => {
          if (ids.includes(row.id)) {
            that.$refs.dialog.toggleRowSelection(row, true)
          } else {
            that.$refs.dialog.toggleRowSelection(row, false)
          }
        })
      }
    },
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data.content
        this.tablelist.totalCount = res.data.totalElements
        this.$nextTick(() => {
          this.setSelectRows(res.data.content)
        })
      }
    },
    handleConfirm (data) {
      let selectList = []
      let selectIds = data.map(d => d.id)
      let allIds = this.tablelist.data.map(d => d.id)
      data = data.map(d => {
        d.value = d.id
        d.label = d.username
        return d
      })
      data.concat(this.value).forEach(d => {
        const id = d.value || d.id
        if (allIds.includes(id)) {
          if (selectIds.includes(id)) {
            if (!selectList.find(d => d.id === id)) {
              selectList.push(d)
            }
          }
        } else {
          if (!selectList.find(d => d.id === id)) {
            selectList.push(d)
          }
        }
      })
      this.$emit('input', selectList)
      this.$refs.dialog.handleCancel()
    },
    updateOrgOptions (options) {
      if (options instanceof Array) {
        this.tablelist.searchHeader.searchItems[0].options = [
          {
            label: '所有组织',
            value: ''
          },
          ...options
        ]
      }
    },
    updateRoleOptions (options) {
      if (options instanceof Array) {
        this.tablelist.searchHeader.searchItems[1].options = [
          {
            label: '所有角色',
            value: ''
          },
          ...options
        ]
      }
    }
  },
  mounted () {
    this.FetchOrganizeOptionsAll()
    this.updateOrgOptions(this.organizeOptionsAll)
    this.FetchRoleOptions()
    this.updateRoleOptions(this.roleOptions)
  }
}
</script>
<style lang='scss'>
.user-dialog-container .el-pagination{
  line-height: 1;
}
</style>
