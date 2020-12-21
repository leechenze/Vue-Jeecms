<template>
  <div class="jee-pagination app-container">
    <el-pagination
        :background="background"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="sizes"
        :page-size="size"
        :pager-count="pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :next-text="$t(nextText)"
        :prev-text="$t(prevText)"
        popper-class="jee-border jee-page"
      >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'JeePagination',
  props: {
    disabled: {
      type: Boolean, // 是否禁用
      default: false
    },
    sizes: {
      type: Array, // 文本框大小
      default: () => {
        return [10, 20, 25, 30, 50]
      }
    },
    size: {
      type: Number,
      default: 10
    },
    pageCount: {
      type: Number,
      default: 5
    },
    background: {
      type: Boolean,
      default: true
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: [Number, String],
      default: 0
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
    return {}
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.$emit('handleCurrentChange', val)
    },
    handleChange (evt) {
      this.$emit('input', evt)
    }
  }
}
</script>

<style lang="scss">
.jee-pagination{
  height: auto !important;
}
</style>
