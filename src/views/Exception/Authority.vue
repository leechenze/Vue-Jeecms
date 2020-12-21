<template>
  <section class="authority-container">
    <div class="authority-all">
      <img src="../../assets/img/authority.png" alt="">

    </div>
  </section>
</template>
<script>
export default {
  name: 'authority',
  methods: {
    handleClick () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
.authority-container{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .authority-all{
    width: 487px;
    height: 357px;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
