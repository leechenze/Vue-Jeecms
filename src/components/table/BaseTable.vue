<template>
  <section class="base-table-container">
    <div class="base-table-wrap">
      <el-table
        ref='baseTable'
        :default-sort="defaultSort"
        v-loading="loading"
        class="scrollbar"
        :class="{draggable: draggable, 'table-tree': isTree, 'table-show-selection': showSelection, 'table-show-index': 'showIndex'}"
        :data="data"
        :row-key="rowKey"
        :lazy="lazy"
        :load="load"
        :tree-props="treeProps"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        :default-expand-all="expandAll"
        tooltip-effect="light"
        @cell-click="cellClick"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        @select="handleSelectRow"
        @select-all="handdleSelectAll"
        v-bind="tableProps"
      >
        <!--选择-->
        <el-table-column
          v-if="showSelection"
          type="selection"
          :selectable="(row, index)=>!row.disabled"
          :width="selectionWidth"
        ></el-table-column>
        <!--标记-->
        <el-table-column v-if="showTag.flag" :label="$t(showTag.label) || ''" :fixed="isIndexFixed" :width="showTag.tagWidth" >
          <template slot-scope="scope">
            <template v-if="showTag.type === 'icon'">
              <jee-icon :iconClass="scope.row[showTag.flagKey] ? showTag.iconClassArr[0] : showTag.iconClassArr[1]"></jee-icon>
            </template>
            <template v-if="showTag.type === 'txt'">
              <span>{{scope.row.flagKey}}</span>
            </template>
          </template>
        </el-table-column>
        <!--序号-->
        <el-table-column v-if="showIndex" type="index" :label="$t(indexLabel)" :fixed="isIndexFixed" :width="indexWidth"></el-table-column>
        <!-- 数据源 -->
        <template v-for="(column, index) in columns">
          <!-- 链接 -->
          <el-table-column
            :key="index"
            v-bind="column"
            :label="$t(column.label)"
            v-if="column.scopeType==='link'"
          >
            <template slot-scope="scope">
              <div
                :style="{maxWidth:column.textWidth||'100%'}" :class="column.textWidth?'t-overflow jee-color':''">
                <a v-if="column.target"
                  class="jee-font-second-light"
                  :target="column.target"
                  :href="column.href || getPropText(scope.row,column.prop)">{{getPropText(scope.row,column.prop)}}</a>
                <a v-else
                  class="jee-font-second-light"
                  @click="handleRoutePush(column, scope.row, $event)"
                >
                  {{getPropText(scope.row,column.prop)}}
                </a>
              </div>
            </template>
          </el-table-column>
          <!-- 点击事件 -->
          <el-table-column
            :key="index"
            v-bind="column"
            :label="$t(column.label)"
            v-else-if="column.scopeType==='handle'"
          >
            <template slot-scope="scope">
              <a class="jee-font-second-light"
                 @click="handleEvent(column.type, scope.row, scope.$index, $event)"
              >
                {{scope.row[column.prop]}}
              </a>
            </template>
          </el-table-column>
          <!-- 状态开关 -->
          <el-table-column
            :min-width="column.minWidth || '100px'"
            :key="index"
            v-bind="column"
            :label="$t(column.label)"
            v-else-if="column.scopeType==='switch'"
            :render-header="column.renderHeader"
          >
            <template slot-scope="scope">
              <el-switch v-model="scope.row[column.prop]"
                         :disabled="disabledHandle(scope.row,column)"
                         @change="handleEvent(column.type, scope.row, scope.$index, $event)"
              ></el-switch>
              <span class="switch-text"
                    :class="{'jee-font-second-light': scope.row[column.prop] && !scope.row.disabled ,'jee-font-hover' : !scope.row.disabled}"
              >{{ scope.row[column.prop] ? (column.enableText || '启用') : (column.disableText || '禁用') }}</span>
            </template>
          </el-table-column>
          <!-- 输入框 -->
          <el-table-column
            :key="index"
            v-bind="column"
            :label="$t(column.label)"
            v-else-if="column.scopeType==='input'"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                @blur="sortInput(scope.row,column,$event)"
                v-model="scope.row[column.prop]"
                :disabled="scope.row.disabled || column.disabled"
              ></el-input>
            </template>
          </el-table-column>
          <!-- 默认只显示文字 -->
          <el-table-column
            :key="index"
            v-bind="column"
            :label="$t(column.label)"
            v-else-if="!column.scopeType"
          >
          <template slot-scope="scope">
              <span :class="{'is-disabled':scope.row.disabled}">{{column.formatter?column.formatter(scope.row,column,getPropText(scope.row,column.prop)):getPropText(scope.row,column.prop)}}</span>
            </template>
          </el-table-column>
          <!-- 图片 -->
          <el-table-column
            :key="index"
            v-bind="column"
            :label="$t(column.label)"
            v-else-if="column.scopeType === 'img'"
          >
            <template slot-scope="scope"
                      v-if="getPropText(scope.row,column.prop)">
              <el-image
                class="t-radius"
                :style="column.style||{width:column.width||'40px'}"
                :src="column.hasPath?getPropText(scope.row,column.prop):$getPath(getPropText(scope.row,column.prop))"
                fit="contain"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <!-- boolean值 -->
          <el-table-column
            :key="index"
            v-bind="column"
            :label="$t(column.label)"
            v-else-if="column.scopeType === 'boolean'">
            <template slot-scope="scope">
              <span>{{scope.row[column.prop]==='0'||!scope.row[column.prop]?(column.noText||'否'):(column.yesText||'是')}}</span>
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
              <!-- {{$moment(scope.row[column.prop],column.format)}} -->
              {{$moment(scope.row[column.prop],column.format)}}
            </template>
          </el-table-column>
          <!-- 自定义，通过插槽传入 -->
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
          align="left"
          v-bind="handleColumnProp"
          :label="$t(handleColumnProp.label)"
          v-if="handleColumn.length"
        >
          <template slot-scope="scope">
            <div class="handle-column-wrap">
              <template v-for="(item, index) in handleColumn">
                <template v-if="item.component === 'popover'">
                  <el-popover
                    :key="index"
                    class="base-table--links"
                    :popper-class="item.popperClass?'jee-popover--links'+ ' '+item.popperClass:'jee-popover--links'"
                    placement="bottom"
                    trigger="hover"
                    v-bind="item.props"
                  >
                    <template v-for="(btn, idx) in item.buttons">
                      <el-link
                        :key="idx"
                        :underline='false'
                        :disabled="disabledHandle(scope.row, btn)"
                        style='display: block;'
                        @click="handleEvents(btn.type, scope.row, scope.$index, $event,btn)"
                        class="jee-hover-color"
                        v-bind="btn.props"
                      >
                        <jee-icon
                          :iconClass="btn.icon"
                          style='fill: #666666;margin-right:5px;'
                          v-if="btn.icon"></jee-icon>
                        {{btn.name}}
                      </el-link>
                    </template>
                    <el-link slot="reference" :underline="false">
                      <jee-icon :iconClass="item.icon" style="item.iconStyle" v-if="item.icon"></jee-icon>
                      {{$t(item.name)}}
                      <i class="el-icon-caret-bottom more-bottom" style="font-size:14px"></i>
                      <i class="el-icon-caret-top more-top" style="font-size:14px"></i>
                    </el-link>
                  </el-popover>
                </template>
                <template v-else>
                  <el-link
                    :key="index"
                    :underline="false"
                    :disabled="disabledHandle(scope.row,item)"
                    @click="handleEvent(item.type, scope.row, scope.$index, $event,item)"
                    v-if="!scope.row[`hidden${item.type}`]"
                  >
                    <jee-icon :iconClass="item.icon" :style="item.iconStyle"
                              v-if="item.icon"></jee-icon>
                    {{$t(item.name)}}
                  </el-link>
                </template>

              </template>
            </div>
          </template>
        </el-table-column>
        <!-- 插槽 -->
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
      <el-pagination
        v-if="showPaginationSimple"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :pager-count="5"
        :next-text="$t(nextText)"
        :prev-text="$t(prevText)"
        popper-class="jee-border jee-page"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  name: 'baseTable',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    showPaginationSimple: {
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
      default: '60px'
    },
    expandAll: {
      type: Boolean, // 是否全部展开
      default: false
    },
    lazy: {
      type: Boolean, // 是否懒加载
      default: false
    },
    indexLabel: {
      type: String,
      default: 'global.index'
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
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        hasChildren: 'hasChildren'
      })
    },
    defaultSort: {
      type: Object,
      default: () => ({
      })
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
    },
    draggable: {
      type: Boolean,
      default: false
    },
    isTree: {
      type: Boolean,
      default: false
    },
    dragIndex: {
      type: Number,
      default: 0
    },
    onDropEnd: {
      type: Function,
      default: () => {
      }
    },
    tableProps: {
      type: Object,
      default: () => ({})
    },
    showTag: {
      type: Object,
      default: () => ({
        flag: false
      })
    },
    isIndexFixed: Boolean
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
        borderBottomColor: '#e8e8e8',
        height: '45px',
        padding: 0
      }
    }
  },
  watch: {
    defaultSort (newVaule) {
      console.log(newVaule)
    }
  },

  methods: {
    cellClick (row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event)
    },
    sortChange ({ column, prop, order }) {
      this.$emit('sortChange', column, prop, order)
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    handdleSelectAll (val) {
      let selected = false
      if (val.length && this.data.length) {
        if (val.find(d => d[this.rowKey] === this.data[0][this.rowKey])) {
          selected = true
        }
      }
      const children = this.treeProps.children || 'children'
      const that = this
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(r => {
            that.$refs.baseTable.toggleRowSelection(r, selected)
            if (r[children]) loop(r[children])
          })
        }
      }
      loop(this.data)
    },
    // 勾选父节点，联动子节点
    handleSelectRow (selection, row) {
      const that = this
      const selected = selection.map(d => d[this.rowKey]).includes(row[this.rowKey])
      const children = this.treeProps.children || 'children'
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(r => {
            that.$refs.baseTable.toggleRowSelection(r, selected)
            if (r[children]) loop(r[children])
          })
        }
      }
      if (row[children]) {
        loop(row[children])
      }
    },
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    handleEvent (type, row, index, e, item) {
      e.preventDefault && e.preventDefault()
      if (item && item.href && (item.type === 'link' || type === 'Link')) {
        if (item.params) {
          this.$routerLink(item.href, item.type, { id: row[this.rowKey], ...item.params })
        } else {
          this.$routerLink(item.href, item.type, { id: row[this.rowKey] })
        }
      }
      this.$emit(`handle${type}`, row, index, item)
    },
    // 更多操作按钮点击事件
    handleEvents (type, row, index, e, item) {
      this.$emit(`handle${type}`, row, index, item)
    },
    sortInput (row, btn, e) {
      this.$emit('sortInput', row, btn, e)
    },
    handleRoutePush (col, row, e) {
      e.preventDefault()
      var param = {
        id: row[this.rowKey],
        ...col.params
      }
      this.$routerLink(col.href, 'Link', param)
    },
    load (tree, treeNode, resolve) {
      this.$emit('load', tree, treeNode, resolve)
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
    rowDrop () {
      const tbody = document.querySelectorAll('.base-table-wrap .el-table__body-wrapper tbody')[this.dragIndex]
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          _this.onDropEnd(newIndex, oldIndex)
        }
      })
    },
    disabledHandle (row, item) {
      if (item.notDisabled) {
        if (item.power) {
          return !row[item.power] && !item.disabled
        } else {
          return false
        }
      } else {
        return row.disabled || item.disabled || row[`disabled${item.type}`]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.draggable) this.rowDrop()
    })
  }
}
</script>

<style lang="scss">
  .base-table-container {
    .switch-text {
      margin-left: 10px;
      font-size: 12px;
    }

    .el-table .handle-column-wrap {
      // display: flex;
      font-size: 12px;
      // .el-link:nth-of-type(n+2){
      //   margin-left: 24px;
      // }

      .el-link {
        margin-right: 24px;

        &:last-child {
          margin-right: 0px;
        }

        .el-link--inner {
          font-size: 12px;
          line-height: 1;
        }
      }
    }

    .jee-svg-icon-hover {
      font-size: 12px;
      fill: #666666;
    }

    .base-table-wrap {
      .draggable {
        tr {
          cursor: move;
        }
      }

      .el-table:not(.table-show-selection).table-show-index {
        .el-table__header-wrapper {
          th:first-of-type {
            .cell {
              padding: 10px;
            }
          }
        }
      }
    }

    .base-table--links + .el-button,
    .el-button + .base-table--links {
      margin-left: 20px;
    }
    .base-table--links .el-link--default i.more-top{
      display: none;
    }
    .base-table--links .el-link--default:hover i.more-top{
      display: inline-block;
    }
    .base-table--links .el-link--default:hover i.more-bottom{
      display: none;
    }
  }
  .el-popover.el-popper.jee-popover--links.user-table-popover a{
    padding: 0 20px;
  }
  .el-popover.el-popper.jee-popover--links.user-table-popover a:hover{
    background-color: #f3f3f3;
  }
  .el-popover.el-popper.jee-popover--links.user-table-popover{
    padding: 5px 0;
  }
</style>
