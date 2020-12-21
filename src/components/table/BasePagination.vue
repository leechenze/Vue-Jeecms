<template>
  <el-pagination
    class="base-pagination-container"
    v-if="showPagination"
    background
    v-on="$listeners"
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
</template>

<script>
export default {
  name: 'BasePagination',
  props: {
    pageNo: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    totalCount: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100, 200]
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
  }
}
</script>
<style lang="scss">
.base-pagination-container.el-pagination.is-background{
  padding: 0;
  height: 28px;
}
</style>
