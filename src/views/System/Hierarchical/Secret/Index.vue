<template>
  <section class="Secret-member-section">

    <authority v-if="showHide"></authority>
    <div v-else>
      <base-header v-bind="headers"/>
      <el-tabs v-model="activeName" type="" @tab-click="handleClick">
        <el-tab-pane name="toSecret">
          <span slot="label"> 待设置</span>
          <toSecret :tabName="activeName"></toSecret>
        </el-tab-pane>
        <el-tab-pane  name="setSecret">
          <span slot="label"> 已设置</span>
          <setSecret :tabName="activeName"></setSecret>

        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import setSecret from './SetSecret'
import toSecret from './ToSecret'
import authority from '@/views/System/Hierarchical/Authority'

export default {
  name: 'journal-analysis',
  mixins: [baseHeader],
  components: {
    authority,
    setSecret,
    toSecret
  },
  data () {
    return {
      showHide: false,
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        paddingBottom: '17px',
        content: '操作说明: 开启分级保护后，管理员创建用户后交由安全员设置用户密级，只有安全员设置好密级后才能启用用户。'
      },
      activeName: 'toSecret'
    }
  },
  methods: {
    handleClick (e) {
    },
    getData () {
    },
    handFirstData () {
      this.$request.fetchReinsuranceCheckMenus({ status: 1 }).then(res => {
        console.log(res.data)
        if (res.code === 13187) {
          this.showHide = true
          // this.$router.push({ name: 'authority' })
        } else if (res.code === 200) {
          this.showHide = false
        }
      })
    }
  },
  mounted () {
    this.handFirstData()
    this.$nextTick(() => {
    })
  }
}
</script>

<style lang="scss" scoped>
.Secret-member-section{
  height: 100%;
  .auditNum{
    margin-left: 10px;
  }
}
</style>
<style lang="scss" >
</style>
