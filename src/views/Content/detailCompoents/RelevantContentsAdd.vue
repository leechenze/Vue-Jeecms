<template>
  <div class="relevant-content-add">
    <el-dialog
        title="添加"
        width="865px"
        :visible.sync="relevantAddDialog"
        :before-close="handleClose">
          <jee-aside-layout class="relevant-wrap" hiddenHeader>
            <!-- 树形 -->
            <base-tree
              class="relevant-tree"
              slot="asideMain"
              ref="contentTree"
              v-bind="contentTree"
              @node-click="handleClick">
            </base-tree>
            <section slot="main">
              <div class="relevant-search">
                <el-input v-model="list.params.key"
                  maxlength="50"
                  @keyup.enter.native="handleSearchs($event)"
                  size="small" placeholder="请输入关键字"
                  style="width:296px"
                >
                  <el-button slot="append"
                    size="small" class="jee-bg-light-important"
                    @click="handleSearchs($event)">
                  <jee-icon iconClass="xiazai15" style="fill: #ffffff"></jee-icon>
                  </el-button>
                </el-input>
              </div>
              <base-table
                v-bind="list"
                ref="relevantTable"
                @handleSelectionChange="handleSelectionChange"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
                >
              </base-table>
            </section>
          </jee-aside-layout>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="small">取消</el-button>
            <el-button type="primary" size="small" @click="handleConfirm">确定 </el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
import baseTable from '@/components/mixins/baseTable'
import baseTree from '@/components/mixins/baseTree'
export default {
  name: 'relevantContents',
  mixins: [baseTable, baseTree],
  data () {
    return {
      relevantAddDialog: false,
      list: {
        title: '添加',
        width: '865px',
        showIndex: false,
        showSearchHeader: false,
        rowKey: 'id',
        api: 'fetchContentextPage',
        params: {
          'keyType': 1,
          'key': '',
          'status': 5,
          'channelIds': [],
          'contentId': this.$route.query.id
        },
        columns: [
          {
            label: '标题',
            prop: 'title',
            minWidth: '215px',
            scopeType: 'link',
            href: '/content/detail',
            showOverflowTooltip: true
          },
          {
            label: '栏目',
            prop: 'channelName',
            width: '120px'
          },
          {
            label: '状态',
            prop: 'status',
            formatter: (row) => {
              let arr = ['', '草稿', '初稿', '流转中', '已审核', '已发布', '退回', '下线', '已归档']
              return arr[parseInt(row.status)]
            }
          },
          {
            label: '发布时间',
            prop: 'releaseTime',
            width: '165px'
          }
        ]
      },
      contentTree: {
        data: [{
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentNodeKey: ''
      },
      contentId: ''
    }
  },
  methods: {
    handleConfirm () {
      let ids = this.list.selectedKeys
      if (ids.length > 0) {
        let params = {
          'contentIds': ids,
          'contentId': this.contentId
        }
        this.$request.fetchContentrelationRelation(params).then(res => {
          this.$restBack(res, () => {
            this.handleClose()
            this.$emit('confirmClick', res)
          }, '关联成功')
        })
      } else {
        this.$message('请至少选中一条内容')
      }
    },
    showTheDialog (data, id) {
      this.contentTree.data = data.data
      this.relevantAddDialog = true
      this.contentId = id
      this.$refs.relevantTable.$refs.baseTable.clearSelection()
    },
    handleSearchs () {
      this.fetchTableApi()
    },
    handleClick (data) {
      if (data.id) {
        this.list.params.channelIds = [data.id]
      } else {
        this.list.params.channelIds = []
      }
      this.fetchTableApi()
    },
    // 表格数据回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        if (res.data) {
          this.list.data = res.data.content.map(v => {
            return v.cmsContent
          })
        } else {
          this.list.data = []
        }

        this.list.totalCount = res.data.totalElements
      }
    },
    handleClose (done) {
      console.log(done)
      if (done instanceof Function) {
        done()
      } else {
        this.relevantAddDialog = false
      }
    }
  }

}
</script>

<style lang="scss">
  .relevant-content-add{
    .relevant-wrap{
      border: 1px solid #e8e8e8;
      .relevant-search{
        padding: 20px;
        border-bottom: none;
      }
      .el-aside{
        width: 190px;
        min-height: 565px;
        border: none;
        border-right: 1px solid #e8e8e8;
        margin: 0;
        border-radius: 0;
      }
      .el-pagination.is-background{
        padding: 30px 20px;
        box-sizing: border-box;
      }
      .el-table{
        border-left: none;
        border-right: none;
        border-radius: 0;
      }
      .el-main{
        padding: 0 !important;
      }
    }
  }
</style>
