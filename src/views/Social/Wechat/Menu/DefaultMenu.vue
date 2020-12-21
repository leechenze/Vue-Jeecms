<template>
  <section>
     <base-header
        v-bind="headers"
        @handleAdd="handleHeaderAdd"
        />
        <search-header
          v-bind="searchHeader"
          :params="list.params"
          @handleSearch="handleSearch"
        ></search-header>
      <base-table
        v-bind="list"
        @handleSelectionChange="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @handleDelete="handleTableDelete"
        @handleStatus="handleTableStatus"
        @handleView="handleTableView"
        @handleEdit="handleTableEdit"
        @handleCreate="handleTableCreate"
      >
        <template #status="scope">
          <div :class="scope.scope.row.status === 1?'jee-color':'t-label'">
            <span v-if="list.params.menuGroupType === 1">{{scope.scope.row.status === 1?'生效并置顶':'未生效'}}</span>
            <span v-else>{{scope.scope.row.status === 1?'推送至微信':'未生效'}}</span>
          </div>
        </template>
      </base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import searchHeader from '@/components/mixins/searchHeader'

export default {
  name: 'defaultMenu',
  mixins: [baseHeader, baseTable, searchHeader],
  data () {
    var columns = [
      {
        prop: 'menuGroupName',
        label: '菜单方案名称',
        minWidth: '265px'
      },
      {
        prop: 'id',
        label: '显示对象',
        minWidth: '455px',
        formatter: (row) => {
          if (this.list.params.menuGroupType === 1) {
            return '全部粉丝'
          } else {
            return `【${row.sexDictCode === '1' ? '男' : (row.sexDictCode === '2'
              ? '女' : '不限性别')}】${row.wTag && row.wTag.tagName
              ? '【' + row.wTag.tagName + '】' : '【不限标签组】'}【${row.clientDictCode === '1'
              ? 'IOS' : (row.clientDictCode === '2' ? 'Android' : '不限客户端')}】${row.countryName
              ? '【' + row.countryName + '】' : ''}${row.languageDictCode
              ? '【' + this.languageFilter(row.languageDictCode) + '】' : '【不限语言】'}${row.area && row.area.areaName
              ? '【' + row.area.areaName + '】' : ''}`
          }
        }
      },
      {
        prop: 'status',
        label: '是否生效（微信只允许同时生效一组默认菜单）',
        minWidth: '325px',
        scopeType: 'slot'
      }
    ]
    var handleColumn2 = [
      {
        type: 'View',
        name: '查看',
        href: '/social/wechat/individualization/add',
        icon: 'bianji',
        params: {
          linkType: 'view',
          appId: this.id
        }
      },
      {
        type: 'Edit',
        name: '编辑',
        href: '/social/wechat/individualization/detail',
        icon: 'bianji',
        params: {
          linkType: 'edit',
          appId: this.id
        }
      },
      {
        type: 'Create',
        name: '复制并新增',
        icon: 'xinjian',
        href: '/social/wechat/individualization/add',
        params: {
          linkType: 'copy',
          appId: this.id
        }
      },
      {
        type: 'Status',
        name: '推送至微信',
        icon: 'zhifeiji-aqg'
      },
      {
        type: 'Delete',
        name: '删除',
        icon: 'tangchuangguanbi'
      }
    ]
    var handleColumn = [
      {
        type: 'Link',
        name: '编辑',
        href: '/social/wechat/default/detail',
        icon: 'bianji',
        params: {
          linkType: 'edit',
          appId: this.id
        }
      },
      {
        type: 'Status',
        name: '生效并置顶',
        icon: 'zhiding'
      },
      {
        type: 'Delete',
        name: '删除',
        icon: 'tangchuangguanbi'
      }

    ]
    return {
      handleColumn,
      handleColumn2,
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新增',
            icon: 'xinjian'
          }
        ],
        showAlertIcon: false
      },
      searchHeader: {
        loading: false,
        searchItems: [
          {
            type: 'searchInput',
            value: 'menuGroupName',
            label: '菜单方案名称:',
            width: 220
          }
        ]
      },
      list: {
        columns,
        api: '',
        showSelection: false,
        params: {
          'appId': '',
          'menuGroupType': 1,
          'menuGroupName': ''
        },
        handleColumn: [],
        handleColumnProp: {
          label: 'global.handle',
          width: '290px'
        }
      }
    }
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    id (newVal, oldVal) {
      if (newVal) {
        this.getListData()
      }
    },
    name (newVal, oldVal) {
      if (newVal !== oldVal && this.id) {
        this.getListData()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getListData()
    })
  },
  activated () {
    const { type } = this.$route.query
    if (type === 'list') {
      this.getListData()
      this.$router.push({ query: { type: '' } })
    }
  },
  methods: {
    getListData () {
      if (this.id) {
        this.list.handleColumn = this.name === 'default' ? this.handleColumn : this.handleColumn2
        this.list.columns.find(v => v.prop === 'status').label = this.name === 'default'
          ? '是否生效（微信只允许同时生效一组默认菜单）' : '是否生效（微信允许同时生效多组个性化菜单）'
        this.list.params.menuGroupType = this.name === 'default' ? 1 : 2
        this.list.api = 'fetchWechatmenugroupPage'
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    },
    // 新增
    handleHeaderAdd (btn) {
      if (this.name === 'default') {
        this.$routerLink('/social/wechat/default/add', 'add', { appId: this.id })
      } else {
        this.$routerLink('/social/wechat/individualization/add', 'add', { appId: this.id })
      }
    },
    languageFilter (val) {
      var arr = ['', '简体中文', '繁体中文TW', '繁体中文HK', '英文', '印尼', '马来', '西班牙', '韩国', '意大利', '日本', '波兰', '葡萄牙', '俄国', '泰文', '越南', '阿拉伯语', '北印度', '希伯来', '土耳其', '德语', '法语']
      return arr[parseInt(val || 0)]
    },
    // 删除
    handleTableDelete (data, btn) {
      this.$confirm('是否确认删除菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchWechatmenugroupDelete({ ids: [data.id] }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      }).catch(() => {})
    },
    // 菜单生效
    handleTableStatus (data, btn) {
      var params = {
        id: data.id,
        status: 1
      }
      this.$request.fetchWechatmenugroupStatus(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    handleTableView (row, index, item) {
      item.params.appId = this.id
      this.$routerLink(item.href, 'Link', { id: row.id, ...item.params })
    },
    handleTableEdit (row, index, item) {
      item.params.appId = this.id
      this.$routerLink(item.href, 'Link', { id: row.id, ...item.params })
    },
    handleTableCreate (row, index, item) {
      item.params.appId = this.id
      this.$routerLink(item.href, 'Link', { id: row.id, ...item.params })
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          if (d.status === 1) { /* 是否生效 */
            d.hiddenStatus = true
            /* 是否默认菜单 */
            if (this.name !== 'default') {
              d.hiddenEdit = true
            } else {
              d.hiddenDelete = true
            }
          }

          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>
