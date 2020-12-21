<template>
  <section class="social-WeChat-statistics-container">
    <base-header
      v-bind="headers"
    />
    <el-main>
        <el-tabs v-model="activeTab" class="forbid-tabs">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :label="item.label" :name="item.name" :key="index">
              <component :is="item.component"
                v-if="item.name === activeTab"
              />
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-main>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import increase from './Increase'
import property from './Property'
export default {
  name: 'socialWechatStatisticsIndex',
  mixins: [baseHeader],
  components: {
    increase,
    property
  },
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '统计站点中所有的公众号粉丝数据'
      },
      activeTab: '1',
      fontId: '',
      tabs: [
        {
          name: '1',
          label: '用户增长',
          component: 'increase'
        },
        {
          name: '2',
          label: '用户属性',
          component: 'property'
        }
      ]
    }
  }
}
</script>
