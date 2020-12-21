<template>
  <section class='site-static-content-container'>
    <el-button
      size="medium"
      type='primary'
      class="topBtn"
      @click="fetchsitesContentBatch()"
      :disabled="!_checkPermission('/content/staticPage/contentBatch', 'POST')"
    >生成内容静态页</el-button>
    <el-button
    size="medium"
    type='empty'
    @click="fetchsitesContent()"
    :disabled="!_checkPermission('/content/staticPage/content', 'DELETE')"
    >取消内容静态页</el-button>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
    >
      <template #hasStaticChannel="scope">
        <div>
          <jee-icon
            :iconClass="scope.scope.row.hasStaticContent?'web__yirenzheng':'tangchuangguanbi'"
            :style="{fill: scope.scope.row.hasStaticContent?'#6AC043':'#FF0000'}"
          />
        </div>
      </template>
    </base-table>
    <el-progress v-if="percent" :percentage="percent" :stroke-width="10"></el-progress>
  </section>
</template>

<script>
import baseTable from '@/components/mixins/baseTable'
export default {
  mixins: [baseTable],
  props: ['id'],
  data () {
    return {
      list: {
        showPagination: false,
        showIndex: false,
        expandAll: true,
        isTree: true,
        api: 'fetchSitesPublicContentChannelTree',
        columns: [{
          prop: 'name',
          label: '栏目名称'
        }, {
          prop: 'hasStaticChannel',
          label: '静态页',
          scopeType: 'slot'
        }],
        data: [],
        params: {
          siteId: ''
        },
        labelWidth: '140px',
        selectedKeys: []
      },
      percent: 0
    }
  },
  watch: {
    id (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.fetchSitesPublicContentChannelTree()
      }
    }
  },
  methods: {
    // 查询内容静态化
    fetchSitesPublicContentChannelTree () {
      this.list.loading = true
      this.list.params.siteId = this.id
      this.$request.fetchSitesPublicContentChannelTree(this.list.params).then(res => {
        if (res.code === 200) {
          const loop = function (d) {
            d.hidden = !d.hidden
            if (d.children instanceof Array && d.children.length) {
              d.children = d.children.map(loop)
            }
            return d
          }
          this.list.data = res.data.map(loop)
          this.list.loading = false
        }
        this.list.loading = false
      })
    },
    fetchsitesContentBatch () {
      let channelIds = this.list.selectedKeys
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定批量生成内容静态页？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.fetchsitesContentBatch({ channelIds }).then(res => {
            if (res.code === 200) {
              this.runTimer()
            }
          })
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    fetchsitesContent () {
      let channelIds = this.list.selectedKeys
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定批量取消内容静态页？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.fetchsitesContent({ channelIds }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '取消内容静态页成功',
                type: 'success'
              })
              this.fetchSitesPublicContentChannelTree()
            }
          })
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    runTimer () {
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.percent < 100) {
            this.fetchStaticContentProgress()
          }
        }, 2000)
      }
    },
    fetchStaticContentProgress () {
      this.$request.fetchStaticContentProgress().then(res => {
        if (res.code === 200) {
          let a = Number(100 * res.data.currPage / res.data.totalPage).toFixed(1)
          this.percent = Number(a)
          if (this.percent >= 100) {
            this.fetchSitesPublicContentChannelTree()
            clearInterval(this.timer)
            this.timer = null
            this.percent = 0
            this.$message.success('生成静态页成功')
          }
        } else {
          clearInterval(this.timer)
          this.timer = null
        }
      })
    }
  },
  mounted () {
    this.fetchSitesPublicContentChannelTree()
  }
}
</script>

<style lang="scss" scoped>
.site-static-content-container{
  .el-progress{
    width: 350px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -175px;
    .el-progress__text{
      margin-left: 17px;
    }
  }
}
</style>
