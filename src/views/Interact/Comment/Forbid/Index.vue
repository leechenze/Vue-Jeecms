<template>
  <section class="interact-forbid-index-container">
    <el-main>
        <el-tabs v-model="activeTab" class="forbid-tabs">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :name="item.name" :key="index">
              <label slot="label">{{item.label}}<jee-icon iconClass="caozuoshuoming1" :style="{fontSize: '16px'}"
                @click="tabs[index].showAlert = !tabs[index].showAlert"
              /></label>
              <el-collapse-transition>
                <div v-show="tabs[index].showAlert">
                  <el-alert
                    :title="$t(tabs[index].content)"
                    type="warning"
                    show-icon
                    @close="tabs[index].showAlert = false"
                  ></el-alert>
                </div>
              </el-collapse-transition>
              <component :is="item.component"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-main>
  </section>
</template>

<script>
import memberList from './memberList'
import ipList from './ipList'
export default {
  name: 'interactCommentForbidIndex',
  components: {
    memberList,
    ipList
  },
  data () {
    return {
      activeTab: '1',
      fontId: '',
      tabs: [
        {
          name: '1',
          label: '禁言用户',
          component: 'memberList',
          showAlert: true
        },
        {
          name: '2',
          label: '禁言IP',
          component: 'ipList',
          showAlert: true
        }
      ]
    }
  }
}
</script>

<style lang="scss">
  .interact-forbid-index-container{
    .el-tabs{
      .el-tab-pane{
        .el-alert{
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
