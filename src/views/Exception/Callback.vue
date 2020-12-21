<template>
  <div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'callback',
  methods: {
    ...mapActions('app', ['fetchSingleInfo']),
    getInfo () {
      const { authToken } = this.$route.query
      if (authToken) {
        this.fetchSingleInfo({ authToken }).then(res => {
          if (res.code === 200 && res.data.userType === 1) {
            this.$router.replace('/workplace').catch(()=>{})
          }
        })
      }
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
