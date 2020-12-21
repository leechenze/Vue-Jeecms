<template>
<!-- 投票调查详情 -->
  <section class="interact-vote-index-create">
    <!-- <base-header v-bind="headers"/> -->
    <el-main class="interact-vote-index-wrap">
      <el-tabs v-model="activeTab" @tab-click="handleChange">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :label="item.label" :name="item.name" :key="index">
              <component :is="item.component" :name="activeTab" :data="formData" :workFlow="workFlow"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
    </el-main>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import editQues from './components/editQues'
import setQues from './components/setQues'
import linkAddress from './components/linkAddress'
import statisticalQues from './components/statistical'
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  name: 'interactVoteCreate',
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
      tabs: [
        {
          label: '编辑问卷',
          name: 'editQues',
          component: 'editQues'
        },
        {
          label: '问卷设置',
          name: 'setQues',
          component: 'setQues'
        }
      ],
      newquestTitle: '',
      id: null,
      tabPub: [
        {
          label: '编辑问卷',
          name: 'editQues',
          component: 'editQues'
        },
        {
          label: '问卷设置',
          name: 'setQues',
          component: 'setQues'
        },
        {
          label: '链接地址',
          name: 'linkAddress',
          component: 'linkAddress'
        },
        {
          label: '统计分析',
          name: 'statistical',
          component: 'statisticalQues'
        }
      ],
      formData: this.detailData || {},
      status: 0,
      lastName: '',
      workFlow: false
    }
  },
  computed: {
    ...mapGetters(['detailData'])
  },
  watch: {
    detailData: function (newVal) {
      if (newVal.id) {
        // 0未发布1流转中2已驳回3进行中(已发布)4已结束
        this.formData = newVal
        this.status = newVal.status
      } else {
        this.formData = {}
      }
      if (this.newquestTitle) {
        this.formData.title = this.newquestTitle
      }
    },
    workFlow (newVal) {
      console.log(newVal)
    }
  },
  methods: {
    ...mapActions('interact', ['getDetailData']),
    handleChange (tab, event) {
      console.log(this.status)
      console.log((tab.name === 'editQues' || tab.name === 'setQues') && this.status === 3)
      if ((tab.name === 'editQues' || tab.name === 'setQues') && this.status === 3) {
        this.$confirm('此问卷处于进行中状态，编辑问卷时问卷会暂停发布，将导致正在填写此问卷的用户无法提交而必须重新填写，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.lastName = tab.name
          setTimeout(() => {
            this.getDetailData({ id: this.$route.query.id, type: false })
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
      let { newquestTitle, id, type, link, status, isAdd } = this.$route.query
      if (link) {
        this.activeTab = link
        this.lastName = link
      } else {
        this.activeTab = 'editQues'
      }
      if (status) {
        this.status = status
      }
      if (newquestTitle && type === 'Add') {
        this.newquestTitle = newquestTitle
        this.formData = {}
        // this.getDetailData({ id: id, type: false })
      } else if (id && type === 'Edit' && (this.activeTab === 'editQues' || this.activeTab === 'setQues' || !link)) {
        this.getDetailData({ id: id, type: !!isAdd })
        this.id = id
      } else {
        this.formData = {}
      }
      if (link && (link === 'statistical' || link === 'linkAddress')) {
        this.tabs = this.tabPub
      } else {
        this.tabs = this.tabPub.slice(0, 2)
      }
      this.$request.fetchQuestionnaireWorkflow({}).then(res => {
        if (res.code === 200) {
          this.workFlow = res.data
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getFormData()
    })
  },
  activated () {
    this.getFormData()
  }
}
</script>
<style lang="scss">
.interact-vote-index-create{
  height: 100%;
  .interact-vote-index-wrap{
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
