<template>
  <section class="my-workflow-container">
    <base-header v-bind="headers"/>

      <search-header
      class="search-header"
      v-bind="searchHeaders"
      @handleSearch="handleSearch"
    />
    <transition name='fade' mode='out-in'>
      <component
        :is="componentId"
        :key="componentId"
        :ref="componentId"
        :params='searchHeaders.params'
      />
    </transition>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import ToDealTable from './Workflow/ToDealTable'
import HandleTable from './Workflow/HandleTable'
import OverDueTable from './Workflow/OverDueTable'

export default {
  name: 'workplaceWorkflow',
  mixins: [baseHeader, searchHeader],
  components: {
    ToDealTable,
    HandleTable,
    OverDueTable
  },
  data () {
    return {
      headers: {
        buttons: [],
        title: '我的工作流',
        showAlertIcon: false
        // content: '操作说明'
      },
      searchHeaders: {
        params: {
          wfType: 1,
          title: ''
        },
        searchItems: [
          {
            type: 'cutButton',
            value: 'wfType',
            options: [
              {
                label: '待办 ',
                value: 1
              },
              {
                label: '已办',
                value: 2
              },
              {
                label: '逾期未办',
                value: 3
              }
            ]
          },
          {
            type: 'searchInput',
            value: 'title',
            placeholder: '搜索标题',
            style: {
              width: '240px'
            }
          }
        ]
      }
    }
  },
  computed: {
    componentId () {
      switch (this.searchHeaders.params.wfType) {
        case 2:
          return 'HandleTable'
        case 3:
          return 'OverDueTable'
        default:
          return 'ToDealTable'
      }
    }
  },
  methods: {
    handleSearch () {
      try {
        this.$refs[this.componentId].fetchTableApi()
      } catch (error) {}
    }
  },
  activated () {
    this.handleSearch()
  }
}
</script>

<style lang="scss">
.my-workflow-container{
  .search-header-container{
    .search-item-wrap{
      .jee-radio-group{
        .el-radio-button__inner{
          width: 100px;
        }
      }
    }
  }
}
</style>
