<template>
  <section class='role-dialog-container'>
    <table-dialog
      ref="dialog"
      v-bind="tablelist"
      :defaultSelectedKeys="roleListIds"
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
  name: 'RoleDialog',
  mixins: [tableDialog],
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      roleList: this.value,
      tablelist: {
        title: '添加角色',
        width: '778px',
        api: 'fetchSystemRoleList',
        columns: [
          {
            prop: 'roleName',
            label: '角色名称'
          },
          {
            prop: 'orgName',
            label: '所属组织'
          }
        ],
        filterParams: ['orgids'],
        params: {
          orgids: [''],
          orgid: '',
          roleName: ''
        },
        searchHeader: {
          searchItems: [
            {
              type: 'cascader',
              value: 'orgids',
              props: {
                label: 'name',
                value: 'id',
                checkStrictly: true
              },
              label: '所属组织：',
              placeholder: '请选择',
              options: []
            },
            {
              type: 'searchInput',
              value: 'roleName',
              placeholder: '角色名'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['organizeOptionsAll']),
    roleListIds () {
      return this.roleList.map(d => d.value)
    }
  },
  watch: {
    organizeOptionsAll (newData) {
      if (newData instanceof Array && newData.length) {
        this.tablelist.searchHeader.searchItems[0].options = [
          {
            name: '所有组织',
            id: ''
          },
          ...newData
        ]
      }
    }
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptionsAll']),
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
        d.label = d.roleName
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
    }
  },
  mounted () {
    this.FetchOrganizeOptionsAll()
    if (this.organizeOptionsAll.length) {
      this.tablelist.searchHeader.searchItems[0].options = this.organizeOptionsAll
    }
  }
}
</script>
<style lang="scss">
.role-dialog-container .el-pagination{
  line-height: 1;
}
</style>
