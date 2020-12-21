<template>
  <section class="menus-index-container">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
    />
    <base-table
      ref='table'
      v-bind="list"
      v-on:handleDelete="handleTableDelete"
      @handleStatus="handleModelStatus"
      @handleAuth="handleModelAuth"
    ></base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'menusMenusIndex',
  mixins: [baseHeader, baseTable],
  data () {
    const columns = [
      {
        prop: 'menuName',
        label: '菜单名称',
        scopeType: 'link',
        href: '/system/menus/menus/detail',
        width: '180px',
        fixed: 'left'
      },
      {
        prop: 'path',
        label: '路由地址',
        minWidth: '100px'
      },
      {
        prop: 'name',
        label: '权限标识',
        minWidth: '100px'
      },
      {
        prop: 'menuType',
        label: '类型',
        formatter: (row, column, cellValue, index) => {
          const options = [
            {
              label: '菜单',
              value: 1
            },
            {
              label: '权限',
              value: 2
            }
          ]
          const opt = options.find(d => d.value === cellValue)
          return opt ? opt.label : ''
        },
        minWidth: '100px'
      },
      {
        prop: 'sortNum',
        label: '排序值',
        minWidth: '100px',
        align: 'center'
      },
      {
        scopeType: 'switch',
        prop: 'hidden',
        label: '是否显示',
        type: 'Status',
        enableText: '显示',
        disableText: '隐藏',
        disabled: !this._checkPermission('/menus/display', 'PUT') || !this._checkPermission('/menus/hidden', 'PUT'),
        minWidth: '100px'
      },
      {
        scopeType: 'switch',
        prop: 'isAuth',
        label: '是否权限控制',
        type: 'Auth',
        enableText: '开启',
        disableText: '关闭',
        disabled: !this._checkPermission('/menus/closeAuth', 'PUT') || !this._checkPermission('/menus/openAuth', 'PUT'),
        minWidth: '100px'
      }
    ]
    return {
      list: {
        columns,
        api: 'fetchMenusList',
        isTree: true,
        expandAll: false,
        showSelection: false,
        showPagination: false,
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/menus', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '75px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/menus', 'POST')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      }
    }
  },
  computed: {
    ...mapState('system', ['reflushMenus'])
  },
  methods: {
    ...mapActions('system', ['ReflushMenus']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchMenusDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$routerLink('/system/menus/menus/create')
    },
    // 删除菜单
    fetchMenusDelete (ids) {
      this.list.loading = true
      this.$request.fetchMenusDelete(ids).then(res => {
        if (res.code === 200) {
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 修改状态
    handleModelStatus (row, index) {
      const api = row.hidden ? 'fetchMenusShow' : 'fetchMenusHidden'
      this.list.loading = true
      this.$request[api]([ row.id ]).then(res => {
        if (res.code === 200) {
          // this.fetchTableApi()
          this._messageSuccess('handle')
        }
        this.list.loading = false
      }).catch(() => {
        this.list.loading = false
      })
    },
    // 修改权限状态
    handleModelAuth (row, index) {
      const api = row.isAuth ? 'fetchMenusOpenAuth' : 'fetchMenusCloseAuth'
      this.list.loading = true
      this.$request[api]([ row.id ]).then(res => {
        if (res.code === 200) {
          // this.fetchTableApi()
          this._messageSuccess('handle')
        }
        this.list.loading = false
      }).catch(() => {
        this.list.loading = false
      })
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        const loop = function (d) {
          d.hidden = !d.hidden
          if (d.children instanceof Array && d.children.length) {
            d.children = d.children.map(loop).sort((a, b) => a.sortNum - b.sortNum)
          }
          return d
        }
        this.list.data = res.data.map(loop).sort((a, b) => a.sortNum - b.sortNum)
        // this.$nextTick(() => {
        //   this.list.data.forEach(d => {
        //     this.$refs.table.$refs.baseTable.toggleRowExpansion(d, true)
        //   })
        // })
      }
    }
  },
  activated () {
    if (this.reflushMenus) {
      this.fetchTableApi()
      this.ReflushMenus(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
