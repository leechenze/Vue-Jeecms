<template>
  <section class="error-container">
    <img src="../../assets/img/500.png" alt="">
    <div class="btn-wrap">
      <el-button type="primary" size='medium' @click="handleClick">
        <jee-icon iconClass="fanhui"/>返回上一页
      </el-button>
    </div>
  </section>
</template>
<script>
export default {
  name: 'error',
  methods: {
    handleClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.error-container{
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .btn-wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
  }
}
</style>
