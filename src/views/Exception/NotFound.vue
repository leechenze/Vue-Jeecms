<template>
  <section class="not-found-container">
    <img src="../../assets/img/404.png" alt="">
    <div class="btn-wrap">
      <el-button type="primary" size='medium' @click="handleClick">
        <jee-icon iconClass="fanhui"/>返回上一页
      </el-button>
      <el-button type="primary" size='medium' @click="handleLogin">
        <jee-icon iconClass="fanhui"/>重新登录
      </el-button>
    </div>
  </section>
</template>
<script>
export default {
  name: 'notFound',
  methods: {
    handleClick () {
      this.$router.go(-1)
    },
    handleLogin () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
.not-found-container{
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
