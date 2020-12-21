<template>
  <section class="table-dialog-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :width="width"
      :visible.sync="dialogVisible"
    >
        <slot name="header"></slot>
        <!-- 搜索条 -->
        <div class="search-bar-wrap" v-if="showSearchHeader">
          <search-header
            class="search-header-dialog"
            v-bind="searchHeader"
            :params="params"
            @handleSearch="handleSearch"
            @handleBtnAll="handleBtnAll"
            @handleBtn="handleBtn"
          ></search-header>
        </div>
        <div class="base-table-wrap">
          <el-table
            ref="theTable"
            v-loading="loading"
            :data="data"
            :row-key="rowKey"
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle"
            @selection-change="handleSelectionChange"
            v-bind="tableProps"
          >
            <!--选择-->
            <el-table-column
              v-if="showSelection"
              type="selection"
              :selectable="(row, index)=>!row.disabled"
              :width="selectionWidth"
            ></el-table-column>
            <!--序号-->
            <el-table-column v-if="showIndex" type="index" :width="indexWidth" :label="showIndexText"></el-table-column>
            <!-- 数据源 -->
            <template v-for="(column, index) in columns">
              <el-table-column
                :key="index"
                v-bind="column"
                v-if="!column.scopeType"
              ></el-table-column>
              <!-- 可修改-图标显示 -->
              <el-table-column
                :key="index"
                v-bind="column"
                v-else-if="column.scopeType === 'edit'"
              >
              <template slot-scope="scope">
                  <div class="edit-box">
                    <span>{{scope.row[column.prop]}}</span>
                    <jee-icon
                      @click="handleEdit(scope.row,column)"
                      class="edit-box__btn"
                      iconClass="chongmingming"
                      :style="{fontSize:'12px'}"></jee-icon>
                  </div>
                </template>
              </el-table-column>
              <!-- 链接 -->
              <el-table-column
                :key="index"
                v-bind="column"
                :label="$t(column.label)"
                v-else-if="column.scopeType==='link'"
              >
                <template slot-scope="scope">
                  <a class="jee-font-second-light"
                    @click="handleRoutePush(column.href, scope.row, $event)"
                  >
                    {{getPropText(scope.row,column.prop)}}
                  </a>
                </template>
              </el-table-column>
              <!-- 时间格式转换 -->
              <el-table-column
                :key="index"
                v-bind="column"
                min-width="175px"
                :label="$t(column.label)"
                v-else-if="column.scopeType==='time'"
              >
                <template slot-scope="scope">
                  {{$moment(scope.row[column.prop],column.format)}}
                </template>
              </el-table-column>
              <!-- 自定义插槽 -->
              <el-table-column
                :key="index"
                v-bind="column"
                :label="$t(column.label)"
                v-else-if="column.scopeType === 'slot'"
              >
                <template slot-scope="scope">
                  <slot :name="column.prop" :scope="scope" :column="column"></slot>
                </template>
              </el-table-column>
            </template>
            <!-- 操作列 -->
            <el-table-column
              v-bind="handleColumnProp"
              :label="$t(handleColumnProp.label)"
              v-if="handleColumn.length"
            >
              <template slot-scope="scope">
                <div class="handle-column-wrap">
                  <template v-for="(item, index) in handleColumn">
                    <el-link
                      :key="index"
                      :underline="false"
                      :disabled="scope.row.disabled"
                      @click="handleEvent(item.type, scope.row, scope.$index, $event,item)"
                    >
                      <jee-icon :iconClass="item.icon"
                        v-if="item.icon"></jee-icon>
                      {{$t(item.name)}}
                    </el-link>
                  </template>
                </div>
              </template>
            </el-table-column>
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
            :next-text="nextText"
            :prev-text="prevText"
            :pager-count="5"
            popper-class="jee-border jee-page"
          >
          </el-pagination>
        </div>
      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" v-if="showCancel" @click="handleCancel" plain>取消</el-button>
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
    isRadio: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '600px'
    },
    title: {
      type: String,
      default: '添加'
    },
    showSearchHeader: {
      type: Boolean,
      default: true
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
    showIndexText: {
      type: String,
      default: '#'
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
    handleColumnProp: {
      type: Object,
      default: () => ({
        label: 'global.handle'
      })
    },
    handleColumn: {
      type: Array,
      default: () => []
    },
    params: {
      type: Object,
      default: () => ({})
    },
    searchHeader: {
      type: Object,
      default: () => ({})
    },
    ids: {
      type: Array,
      default: () => ([])
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => []
    },
    tableProps: {
      type: Object,
      default: () => ({})
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
      },
      selectedKeys: this.defaultSelectedKeys
    }
  },
  watch: {
    ids (newVal) {
      // if (newVal instanceof Array && newVal.length > 0) {
      //   var arr = []
      //   this.data.forEach(v => {
      //     if (newVal.indexOf(v[this.rowKey]) > -1) {
      //       console.log(v)
      //   this.$refs.theTable.toggleRowSelection(this.data[1])
      //     }
      //   })
      // }
      // console.log(newVal)
      // toggleRowSelection
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
      this.$emit('handleConfirm', this.selectedKeys, btn)
    },
    toggleRowSelection (row, flag) {
      if (row && this.$refs.theTable) {
        if (flag === true || flag === false) {
          this.$refs.theTable.toggleRowSelection(row, flag)
        } else {
          this.$refs.theTable.toggleRowSelection(row)
        }
      }
    },
    // 获取多层字段
    getPropText (item, prop, formatProp) {
      var i = prop.indexOf('.')
      if (i > -1) {
        var data = prop.split('.')
        var obj = item
        const loop = function (data) {
          if (data instanceof Array) {
            data.forEach(v => {
              if (obj[v]) {
                obj = obj[v]
              } else {
                obj = ''
              }
            })
          }
        }
        loop(data)
        if (obj instanceof Array) {
          obj = obj.join(',')
        }
        return obj
      } else {
        if (item[prop] instanceof Array) {
          item[prop] = item[prop].join(',')
        }
        return item[prop]
      }
    },
    handleSelectionChange (data) {
      if (this.isRadio && data.length > 1) {
        this.$refs.theTable.toggleAllSelection(false)
        if (data.length > 2) {
          setTimeout(() => {
            this.$refs.theTable.toggleRowSelection(data[0], true)
          }, 10)
        } else {
          setTimeout(() => {
            this.$refs.theTable.toggleRowSelection(data[data.length - 1], true)
          }, 10)
        }
        this.selectedKeys = [data[0]]
        this.$emit('handleSelectionChange', [data[0]])
      } else {
        this.selectedKeys = data
        this.$emit('handleSelectionChange', data)
      }
    },
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    handleBtn (item) {
      this.$emit(`handleBtn${item.btnType}`, item)
    },
    // 头部按钮
    handleBtnAll (item) {
      this.$emit('handleBtnAll', item)
    },
    handleEdit (row, col) {
      this.$emit('handleEdit', row, col)
    },
    // 表格操作按钮
    handleEvent (type, row, index, e, item) {
      e.preventDefault && e.preventDefault()
      if (item && item.href) {
        this.$routerLink(item.href, item.type, { id: row.id })
      }
      this.$emit(`handle${type}`, row, index)
    },
    // 链接
    handleRoutePush (url, row, e) {
      e.preventDefault()
      if (url) {
        var param = {
          id: row[this.rowKey],
          ...row.params
        }
        this.$routerLink(url, 'Link', param)
      } else {
        this.$emit('handleRoutePush', row)
      }
    }
  }
}
</script>

<style lang="scss">
.table-dialog-container{
  .search-bar-wrap{
    margin-left: -20px;
    .search-header-container{
      padding-bottom: 6px;
    }
  }
  .el-pagination.is-background{
    .el-pagination__total,
    .el-pagination__sizes{
      float: left;
    }
  }
  .edit-box{
    cursor: pointer;
    width: 100%;
    min-height: 20px;
    &__btn{
      display: none;
    }
    &:hover{
      .edit-box__btn{
        display: inline-block;
      }
    }
  }
}
</style>
