<template>
  <section class="select-dialog-container">
    <el-dialog
      :title="title"
      :width="width"
      :visible.sync="dialogVisible"
    >
      <slot name="header"></slot>
      <div class="selected-wrap">
        <div class="title">已选择列表</div>
        <div class="selected-list-wrap">
          <template v-for="(item, index) in selectedRows">
            <span class="item-wrap jee-color" :key="index">
              <span>{{item.apiName}}</span>
              <span>：</span>
              <span>{{item.apiUrl}}</span>
              <i class="el-icon-close" @click="handleDeleteItem(item)"></i>
            </span>
          </template>
        </div>
        <div class="footer">
          <el-link :underline='false' class='jee-hover-color' @click="handleDeleteChecked">
            <jee-icon iconClass='yichu'></jee-icon>
            <span>全部移除</span>
          </el-link>
        </div>
      </div>
      <div class="search-bar-wrap" v-if="searchHeader">
        <search-header
          class="search-header-dialog"
          v-bind="searchHeader"
          :params="params"
          @handleSearch="handleSearch"
        ></search-header>
      </div>
      <div class="base-table-wrap">
        <el-table
          ref="selectDialogTable"
          v-loading="loading"
          :data="data"
          :row-key="rowKey"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          @selection-change="handleSelectionChange"
        >
          <!--选择-->
          <el-table-column
            v-if="showSelection"
            type="selection"
            :reserve-selection="true"
            :selectable="(row, index)=>!row.disabled"
            :width="selectionWidth"
          ></el-table-column>
          <!--序号-->
          <el-table-column v-if="showIndex" type="index" :width="indexWidth"></el-table-column>
          <!-- 数据源 -->
          <template v-for="(column, index) in columns">
            <el-table-column
              :key="index"
              v-bind="column"
              v-if="!column.scopeType"
            ></el-table-column>
          </template>
        </el-table>
      </div>
      <div class="pagination-wrap">
        <el-pagination
          v-loading="loading"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :layout="pageLayout"
          :total="totalCount"
          :next-text="nextText"
          :prev-text="prevText"
          :pager-count="5"
          :hide-on-single-page="true"
          popper-class="jee-border jee-page"
        >
        </el-pagination>
      </div>
      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="showCancel" @click="handleCancel" size="small" plain>取消</el-button>
        <el-button type="primary" size="small"
          v-for="(item, index) in buttons" :key="index"
          @click="handleConfirm(item)">{{item.text}}
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import SearchHeader from '@/components/header/SearchHeader'
export default {
  name: 'tableDialog',
  components: {
    SearchHeader
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '778px'
    },
    title: {
      type: String,
      default: '添加'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: () => [
        {
          text: '确定',
          type: 'Submit'
        }
      ]
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    selectionWidth: {
      type: String,
      default: '55'
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    indexWidth: {
      type: String,
      default: '60'
    },
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100, 200]
    },
    pageNo: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    totalCount: {
      type: Number,
      default: 0
    },
    pageLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    prevText: {
      type: String,
      default: '上一页'
    },
    nextText: {
      type: String,
      default: '下一页'
    },
    params: {
      type: Object,
      default: () => ({})
    },
    searchHeader: {
      type: Object,
      default: () => ({})
    },
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false,
      headerCellStyle: {
        color: '#333333',
        borderBottomColor: '#e8e8e8',
        backgroundColor: '#F9F9F9',
        height: '43px',
        padding: 0
      },
      cellStyle: {
        color: '#666666',
        borderBottomColor: '#e8e8e8'
      }
    }
  },
  watch: {
    selectedRows (newData) {
      const that = this
      if (that.$refs.selectDialogTable) {
        if (newData.length) {
          const ids = newData.map(d => d[that.rowKey])
          this.data.forEach(row => {
            if (ids.includes(row[that.rowKey])) {
              that.$refs.selectDialogTable.toggleRowSelection(row, true)
            } else {
              that.$refs.selectDialogTable.toggleRowSelection(row, false)
            }
          })
        } else {
          that.$refs.selectDialogTable.clearSelection()
        }
      }
    },
    data (newData) {
      const that = this
      if (that.$refs.selectDialogTable) {
        if (newData.length) {
          const ids = this.selectedRows.map(d => d[that.rowKey])
          newData.forEach(row => {
            if (ids.includes(row[that.rowKey])) {
              that.$refs.selectDialogTable.toggleRowSelection(row, true)
            } else {
              that.$refs.selectDialogTable.toggleRowSelection(row, false)
            }
          })
        }
      }
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleSearch () {
      this.$emit('handleSearch')
    },
    handleConfirm (btn) {
      this.dialogVisible = false
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    handleDeleteChecked () {
      const checkedKeys = this.selectedRows.map(d => d[this.rowKey])
      this.$emit('handleDeleteChecked', checkedKeys)
    },
    handleDeleteItem (item) {
      this.$emit('handleDeleteChecked', [item[this.rowKey]])
    }
  }
}
</script>

<style lang="scss">
.select-dialog-container{
  .el-pagination.is-background{
    .el-pagination__total,
    .el-pagination__sizes{
      float: left;
    }
  }
  .el-dialog__body{
    .selected-wrap{
      display: flex;
      flex-direction: column;
      border: 1px dashed #e8e8e8;
      padding: 10px 0 10px 20px;
      margin-bottom: 20px;
      .title{
        line-height: 14px;
        color:#666666;
      }
      .selected-list-wrap{
        display: flex;
        flex-wrap: wrap;
        .item-wrap{
          margin: 10px 20px 0 0;
          background-color: #F2F9FA;
          line-height: 22px;
          padding-left: 20px;
          i{
            padding-left: 20px;
            padding-right: 10px;
            cursor: pointer;
          }
        }
      }
      .footer{
        padding-top: 30px;
        .jee-svg-icon{
          vertical-align: baseline;
          padding-right: 10px;
          font-size: 12px;
          fill: #666666;
        }
      }
    }
    .search-bar-wrap{
      padding-top: 10px;
    }
  }
}
</style>
