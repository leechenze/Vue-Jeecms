<template>
  <section class="select-table-container">
    <div class="select-table-wrap">
      <el-table
        v-loading="loading"
        :class="{'table-tree': isTree}"
        :data="data"
        :row-key="rowKey"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        default-expand-all
        v-on="$listeners"
        :tree-props="defaultProps"
        style="width: 100%"
        :indent="20"
        :row-style="rowStyle"
      >
        <!-- 数据源 -->
        <template v-for="(column, index) in columns">
          <!-- 首列 -->
          <el-table-column
            :key="index"
            v-bind="column"
            v-if="column.scopeType==='checkAllRow'"
          >
            <template slot="header" slot-scope="scope">
              <span
                v-if="column.hiddenHeader"
              >{{column.label}}</span>
              <el-checkbox
                v-else
                :value="checkAll"
                :disabled="disabled"
                @change="handleCheckAllChange(scope, $event)"
              >{{column.label}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <span
                v-if="column.hidden && column.hidden(scope.row, column)"
              >{{column.formatter?column.formatter(scope.row, column, scope.row[column.prop],index):''}}</span>
              <el-checkbox
                v-else
                :value="scope.row.checkAllRow"
                :disabled="disabled"
                :indeterminate="scope.row.isRowIndeterminate"
                @change="handleCheckRowAllChange(scope.row)"
              >{{column.formatter ? column.formatter(scope.row, [column.prop], scope.row[column.prop], index) : scope.row[column.prop]}}</el-checkbox>
              <jee-popover
                style='marginLeft: 30px;'
                v-if="scope.row.popoverText"
                :popoverText='scope.row.popoverText'
              />
            </template>
          </el-table-column>
          <!-- 选择列 -->
          <el-table-column
            :key="index"
            v-bind="column"
            v-else-if="column.scopeType==='checkbox'"
          >
            <template slot="header">
              <el-checkbox
                :value="checkColAll[column.prop] && checkColAll[column.prop].checkAll"
                :disabled="disabled"
                :indeterminate="checkColAll[column.prop] && checkColAll[column.prop].isIndeterminate"
                @change="(value)=>handleCheckColAllChange(column.prop, value)"
              >{{column.label}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <span
                v-if="column.hidden && column.hidden(scope.row, column)"
              >{{column.formatter?column.formatter(scope.row, column, scope.row[column.prop],index):''}}</span>
              <el-checkbox
                v-else
                v-model="scope.row[column.prop]"
                :disabled="disabled || scope.row[column.prop + 'Disabled']"
                @change="handleChange(scope.row, column.prop)"
              >{{column.formatter?column.formatter(scope.row, column, scope.row[column.prop],index):''}}</el-checkbox>
            </template>
          </el-table-column>
          <!-- 默认显示文字 -->
          <el-table-column
            :key="index"
            v-bind="column"
            v-else
          ></el-table-column>
        </template>
        <slot></slot>
      </el-table>
    </div>
    <div class="pagination-wrap">
      <el-pagination
        v-if="showPagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="pageLayout"
        :total="totalCount"
        :next-text="$t(nextText)"
        :prev-text="$t(prevText)"
        :pager-count="5"
        :hide-on-single-page="false"
        popper-class="jee-border jee-page"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  name: 'selectTable',
  props: {
    loading: {
      type: Boolean,
      default: false
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
    checkColAll: {
      type: Object,
      default: () => {}
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        hasChildren: 'hasChildren'
      })
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isTree: {
      type: Boolean,
      default: false
    },
    rowStyle: {
      type: [Function, Object],
      default: () => ({})
    },
    // 分页
    showPagination: {
      type: Boolean,
      default: false
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
      default: 'global.prevPage'
    },
    nextText: {
      type: String,
      default: 'global.nextPage'
    }
  },
  data () {
    return {
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
  computed: {
    checkAll () {
      const list = this.getDataArray()
      return list.length > 0 && list.filter(d => d.checkAllRow === false).length <= 0
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    getDataArray () {
      const data = deepClone(this.data)
      let list = []
      const loop = function (data) {
        if (data instanceof Array) {
          data.forEach(d => {
            list.push(d)
            if (d.children && d.children instanceof Array) {
              loop(d.children)
            }
          })
        }
      }
      loop(data)
      return list
    },
    handleCheckAllChange (scope, value) {
      this.$emit('handleCheckAllChange', value)
    },
    handleCheckColAllChange (col, value) {
      this.$emit('handleCheckColAllChange', col, value)
    },
    handleCheckRowAllChange (row) {
      this.$emit('handleCheckRowAllChange', row)
    },
    handleChange (row, col) {
      this.$emit('handleChange', row, col)
    }
  }
}
</script>

<style lang="scss">
.select-table-container{
  .el-checkbox{
    .el-checkbox__inner{
      border-radius: 50%;
    }
  }
  .jee-popover{
    .tip{
      margin-left: -10px;
    }
  }
}
</style>
