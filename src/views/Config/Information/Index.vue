<template>
<!-- heyan -->
  <section class="config-message-index">
    <base-header
      v-bind="headers"
      />
    <el-tabs v-model="activeTab">
        <el-tab-pane :label="tabs[0].label" :name="tabs[0].name">
          <Membership :is="'Membership'" :name="tabs[0].name" :tabName="activeTab" :key="tabs[0].name"></Membership>
        </el-tab-pane>
        <el-tab-pane :label="tabs[1].label" :name="tabs[1].name">
          <UserInfo :is="'UserInfo'" :name="tabs[1].name" :tabName="activeTab" :key="tabs[1].name"></UserInfo>
        </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import Membership from './Membership'
import UserInfo from './UserInfo'
import baseHeader from '@/components/mixins/baseHeader'
export default {
  name: 'configInformationIndex',
  components: {
    Membership,
    UserInfo
  },
  mixins: [baseHeader],
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '同步到子站会将当前站点的消息模版数据同步到所有子站点，并删除子站原有消息模版'
      },
      activeTab: '1',
      tabs: [
        {
          name: '1',
          label: '会员验证',
          component: 'Membership'
        },
        {
          name: '2',
          label: '用户消息',
          component: 'UserInfo'
        }
      ]
    }
  }
}
</script>
