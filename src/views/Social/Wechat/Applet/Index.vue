<template>
<!-- heyan -->
  <section class="social-WeChat-applet-container">
    <el-main>
        <el-tabs v-model="activeTab" class="forbid-tabs">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :label="item.label" :name="item.name" :key="index">
              <component :is="item.component" :name="activeTab"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-main>
  </section>
</template>

<script>
import drafts from './Drafts'
import upTemplate from './UpTemplate'
export default {
  name: 'socialWechatApplet',
  components: {
    drafts,
    upTemplate
  },
  data () {
    return {
      activeTab: '1',
      fontId: '',
      tabs: [
        {
          name: '1',
          label: '草稿箱',
          component: 'drafts'
        },
        {
          name: '2',
          label: '模板库',
          component: 'upTemplate'
        }
      ]
    }
  }
}
</script>
