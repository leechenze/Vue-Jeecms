<template>
  <section class="inMail-index-list-container">
    <el-main>
        <el-tabs v-model="activeTab" class="forbid-tabs">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :label="item.label" :name="item.name" :key="index">
              <component :is="item.component"></component>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-main>
  </section>
</template>

<script>
import inbox from './Inbox'
import outbox from './Outbox'
export default {
  name: 'inMail',
  components: {
    inbox,
    outbox
  },
  data () {
    return {
      activeTab: '1',
      fontId: '',
      tabs: [
        {
          name: '1',
          label: '收件箱',
          component: 'inbox'
        },
        {
          name: '2',
          label: '发件箱',
          component: 'outbox'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .inMail-index-list-container{
    .base-header-container{
      margin-top: 8px;
    }
  }
</style>
