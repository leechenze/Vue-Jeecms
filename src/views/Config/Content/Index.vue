<template>
  <section class="security-index-container">
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
    >
    <template #name="scope">
      <span class="jee-color" style="cursor: pointer;" @click="rowHref(scope.scope.row)"
      >{{scope.scope.row.name}}</span>
    </template>
    <template #isOpenIndex="scope">
      <div  v-if="!scope.scope.row.children">
        <el-switch v-model="scope.scope.row.isOpenIndex"
        @change="handleModelStatus(scope.scope.row)"></el-switch>
        <span class="switch-text"
          :class="{'jee-font-second-light': scope.scope.row.isOpenIndex && !scope.scope.row.disabled ,'jee-font-hover' : !scope.scope.row.disabled}"
        >{{ scope.scope.row.isOpenIndex ? '开启' : '关闭' }}</span>
      </div>
    </template>
    </base-table>

  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'

export default {
  name: 'configContent',
  mixins: [baseHeader, baseTable],
  data () {
    const columns = [
      {
        scopeType: 'slot',
        prop: 'name',
        label: '栏目名称',
        width: '400px'
      },
      {
        scopeType: 'slot',
        prop: 'isOpenIndex',
        label: '是否开启前台索引',
        enableText: '开启',
        disableText: '关闭',
        type: 'Status',
        disabled: !this._checkPermission('/channel/setOpenIndex', 'PUT')
      }
    ]
    return {
      list: {
        columns,
        api: 'fetchChannelGetAllTree',
        params: {},
        showPagination: false,
        showSelection: false,
        expandAll: true,
        isTree: true
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '生成全站索引',
            icon: 'shengchengquanzhansuoyin',
            disabled: !this._checkPermission('/content/resetIndex', 'PUT')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '关闭栏目索引后，前台将搜索不到该栏目下的内容'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'ftpName',
            placeholder: '请输入ftp名称'
          }
        ]
      }
    }
  },
  methods: {
    handleHeaderCreate () {
      this.$request.fetchContentResetIndex().then(res => {
        if (res.code === 200) {
          this.$message({
            message: '生成成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.list.loading = false
        }
      }).catch(() => {
        this.list.loading = false
      })
    },
    rowHref (row) {
      if (row.urlWhole) {
        window.open(row.urlWhole)
      } else {
        this.$message('没有查看地址')
      }
    },
    handleModelStatus (row, index) {
      this.list.loading = true
      let channelOpens = []
      let obj = {}
      obj.channelId = row.id
      obj.open = row.isOpenIndex
      channelOpens.push(obj)
      this.$request.fetchChannelSetOpenIndex({ channelOpens }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.list.loading = false
        } else {
          this.list.loading = false
        }
      }).catch(() => {
        this.list.loading = false
      })
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        const loop = function (d) {
          d.hidden = !d.hidden
          if (d.children instanceof Array && d.children.length) {
            d.children = d.children.map(loop)
          }
          return d
        }
        this.list.data = res.data.map(loop)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
