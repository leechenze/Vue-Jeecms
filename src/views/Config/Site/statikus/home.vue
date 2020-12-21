<template>
  <section>
    <el-button
      size="medium"
      type='primary'
      @click="fetchstaticPageIndex()"
      :disabled="!_checkPermission('/content/staticPage/index', 'POST')"
      >生成首页静态页</el-button>
      <el-button
      size="medium"
      type='empty'
      @click="fetchstaticPageIndexDelete()"
      :disabled="!_checkPermission('/content/staticPage/index', 'DELETE')"
      >取消首页静态页</el-button>
  </section>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  methods: {
    fetchstaticPageIndex () {
      var siteId = Number(this.$route.query.id)
      this.$request.fetchstaticPageIndex({ siteId }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '生成静态页成功',
            type: 'success'
          })
        }
      })
    },
    fetchstaticPageIndexDelete () {
      var siteId = Number(this.$route.query.id)
      this.$request.fetchstaticPageIndexDelete({ siteId }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '取消静态页成功',
            type: 'success'
          })
        }
      })
    }
  },
  mounted () {
  }
}
</script>
