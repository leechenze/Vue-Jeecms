<template>
<!-- 智能表单详情 -->
  <section class="interact-smart-index-detail">
    <!-- <base-header v-bind="headers"/> -->
    <el-main class="interact-smart-index-wrap">
      <el-tabs v-model="activeTab" @tab-click="handleChange">
          <template v-for="(item, index) in currentTab">
            <el-tab-pane :label="item.label" :name="item.name" :key="index" v-if="!item.isHidden">
              <component :is="item.component" :saveName="saveName" :name="activeTab"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
    </el-main>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import editQues from './tabsComponents/editQues'
import setQues from './tabsComponents/setQues'
import linkAddress from './tabsComponents/linkAddress'
import statisticalQues from './tabsComponents/statistical'
import { mapActions } from 'vuex'
export default {
  name: 'interactSmartDetail',
  mixins: [baseHeader],
  components: {
    editQues,
    setQues,
    linkAddress,
    statisticalQues
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明:   这里是关于该页面的相关操作说明文字。'
      },
      activeTab: 'editQues',
      currentTab: [],
      tabs: [
        {
          label: '编辑表单',
          name: 'editQues',
          component: 'editQues'
        },
        {
          label: '表单设置',
          name: 'setQues',
          component: 'setQues'
        }
      ],
      newquestTitle: '',
      id: null,
      tabPub: [
        {
          label: '编辑表单',
          name: 'editQues',
          component: 'editQues'
        },
        {
          label: '表单设置',
          name: 'setQues',
          component: 'setQues'
        },
        {
          label: '链接地址',
          name: 'linkAddress',
          component: 'linkAddress',
          isHidden: false
        },
        {
          label: '统计分析',
          name: 'statistical',
          component: 'statisticalQues'
        }
      ],
      lastName: '',
      saveName: ''
    }
  },
  methods: {
    ...mapActions('interact', ['getSmartDetailData', 'getCloseData']),
    handleChange (tab, event) {
      this.saveName = this.lastName
      if ((this.lastName === 'linkAddress' || this.lastName === 'statistical') &&
         (tab.name === 'editQues' || tab.name === 'setQues') && this.state === 1) {
        this.$confirm('此表单处于进行中状态，编辑表单时表单会暂停发布，将导致正在填写此表单的用户无法提交而必须重新填写，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.lastName = tab.name
          setTimeout(() => {
            // this.getSmartDetailData({ id: this.$route.query.id, type: false })
            let params = {
              ids: [this.$route.query.id],
              publish: false
            }
            this.$request.fetchSmartFormPublishPut(params).then(res => {
              if (res.code === 200) {
                this.state = 0
                this.$router.push({ query: { state: 0, link: this.activeTab, id: this.$route.query.id, type: 'link' } })
                this.tabPub.find((t) => t.name === 'linkAddress').isHidden = true
              }
            })
          }, 100)
        }).catch(() => {
          if (this.lastName) {
            this.activeTab = this.lastName
          }
        })
      } else {
        this.lastName = tab.name
      }
    },
    // 详情
    getFormData () {
      let { link, state } = this.$route.query
      if (link) {
        this.activeTab = link
        this.lastName = link
        if (Number(state) !== 0) {
          this.tabPub.find((t) => t.name === 'linkAddress').isHidden = false
        } else {
          this.tabPub.find((t) => t.name === 'linkAddress').isHidden = true
        }
      } else {
        this.activeTab = 'editQues'
        this.lastName = ''
      }
      this.state = Number(state)
    },
    setTab (routeQuery) {
      const { link } = routeQuery
      if (link) {
        this.currentTab = this.tabPub
      } else {
        this.currentTab = this.tabs
      }
      this.getFormData()
    }
  },
  watch: {
    listenParamsObj: {
      handler: function (newVal, oldVal) {
        window.onbeforeunload = (newVal.path === '/interact/smart/detail' && (newVal.activeTab === 'editQues' || newVal.activeTab === 'setQues')) ? e => {
          // 通知浏览器不要执行与事件关联的默认动作
          e.preventDefault()
          // Chrome 需要 returnValue 被设置成空字符串
          e.returnValue = ''
        } : null
      }
    },
    '$route': function (newVal, oldVal) {
      if (newVal.path === '/interact/smart/detail') {
        this.setTab(newVal.query)
      }
    }
  },
  activated () {
    this.setTab(this.$route.query)
  },
  destroyed () {
    window.onbeforeunload = null
  },
  computed: {
    listenParamsObj () {
      const { path } = this.$route
      const activeTab = this.activeTab
      return { path, activeTab }
    }
  },
  mounted () {
    this.getCloseData(true)
    this.setTab(this.$route.query)
    window.onbeforeunload = e => {
      // 通知浏览器不要执行与事件关联的默认动作
      e.preventDefault()
      // Chrome 需要 returnValue 被设置成空字符串
      e.returnValue = ''
    }
  }
  // beforeRouteLeave: (to, from, next) => {
  //   if (confirm('确定离开此页面吗？ 系统可能不会保存您所做的更改')) {
  //     next()
  //   } else {
  //     next(false)
  //   }
  // }
}
</script>
<style lang="scss">
.interact-smart-index-detail{
  height: 100%;
  .interact-smart-index-wrap{
    height: 100%;
  }
  .el-tabs{
    height: 100%;
    &__content{
       height: calc(100% - 48px);
       overflow-y: auto;
    }
    .el-tab-pane{
       height: 100%;
    }
  }
}
</style>
