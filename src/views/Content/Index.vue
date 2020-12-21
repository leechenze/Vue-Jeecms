<template>
<!-- heyan -->
  <el-container class="content-index-container left-container" :noRoute="true">
    <el-aside width="190px">
        <div class="left-head">
            <el-input v-model="treeParams.channlName"
              maxlength="50"
              @keyup.enter.native="handleTreeSearch"
              size="small" placeholder="请输入栏目名"
            >
              <el-button slot="append"
                size="small" class="jee-bg-light-important"
                @click="handleTreeSearch($event)">
              <jee-icon iconClass="xiazai15" style="fill: #ffffff"></jee-icon>
              </el-button>
            </el-input>
        </div>
        <div class="box-items scrollbar">
          <!-- 树形 -->
          <base-tree
            style="overflow-y: overlay"
            ref="contentTree"
            v-bind="contentTree"
            @handleClick="handleClick">
          </base-tree>
        </div>
    </el-aside>
    <el-main>
      <el-tabs v-model="currentTab" @tab-click="changeTab">
        <template v-for="(tab, index) in tabs">
          <el-tab-pane :name="tab.name" :key="index">
            <label slot="label" style="cursor: pointer;">{{tab.label}}
              <!-- <jee-icon iconClass="caozuoshuoming1" @click="tab.showAlert = !tab.showAlert" :style="{fontSize: '16px'}"/> -->
            </label>
            <el-collapse-transition>
              <div v-show="tab.showAlert" style="margin-bottom:20px">
                <el-alert
                  :title="$t(tab.content)"
                  type="warning"
                  show-icon
                  @close="tab.showAlert = false"
                ></el-alert>
              </div>
            </el-collapse-transition>
            <component
              :is="tab.component" :contentTree="contentTree" @chackAmout="fetchContentextChackAmout"
              :name="currentTab" :isChild="isChild" :id="channelId" :key="index"/>
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>

import contentList from './components/contentList'
import auditList from './components/auditList'
import contentFiled from './components/contentFiled'
import recycleBin from './components/recycleBin'
import baseTree from '@/components/mixins/baseTree'

export default {
  name: 'contentIndex',
  components: {
    auditList,
    contentList,
    contentFiled,
    recycleBin
  },
  mixins: [baseTree],
  provide () {
    return {
      changeCurrentTab: this.changeCurrentTab
    }
  },
  data () {
    return {
      isChild: false, // 是否最底层
      currentTab: 'list',
      channelId: '',
      tabs: [
        {
          label: '内容列表',
          name: 'list',
          showAlert: false,
          // content: '内容列表说明',
          component: 'contentList'
        },
        {
          label: '智能审核',
          name: 'audit',
          showAlert: false,
          // content: '智能审核说明',
          component: 'auditList'
        },
        {
          label: '回收站',
          name: 'recycle',
          showAlert: false,
          // content: '回收站说明',
          component: 'recycleBin'
        },
        {
          label: '已归档',
          name: 'filed',
          showAlert: false,
          // content: '已归档列表说明',
          component: 'contentFiled'
        }
      ],
      contentTree: {
        data: [{
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentNodeKey: '',
        expandOnClickNode: false
      },
      treeParams: {
        channlName: ''
      }
    }
  },
  methods: {
    changeTab (tab, e) {
      this.channelId = this.channelId
    },
    // 点击内容树
    handleClick (data, node, ev) {
      this.channelId = data.id
      this.contentTree.currentNodeKey = data.id
      this.isChild = node.childNodes.length === 0 && data.id !== ''
      this.fetchContentextChackAmout()
    },
    handleTreeSearch () {
      this.fetchContentList()
    },
    fetchContentList () {
      let params = {
        permOut: false,
        operator: '1',
        siteId: '',
        name: this.treeParams.channlName
      }
      this.$request.fetchContentCommonTree(params).then(res => {
        if (res.code === 200) {
          var arr = [
            {
              name: '所有栏目',
              id: '',
              children: res.data
            }
          ]
          this.contentTree.data = arr
        }
      })
    },
    // 获取内容审核数量
    fetchContentextChackAmout (status) {
      this.$request.fetchContentextChackAmout({ channelId: this.channelId }).then(res => {
        if (res.code === 200) {
          this.tabs[1].label = '智能审核 (' + res.data + ')'
          if (status) {
            this.currentTab = 'audit'
          }
        }
      })
    },
    changeCurrentTab () {
      this.currentTab = 'audit'
    }
  },
  activated () {
    const { id, type } = this.$route.query
    if (id) {
      this.channelId = id
      this.contentTree.currentNodeKey = Number(id)
    }
    if (type) {
      this.currentTab = type
    }
    this.fetchContentextChackAmout()
  },
  mounted () {
    const { id, type } = this.$route.query
    if (id) {
      this.channelId = id
      this.contentTree.currentNodeKey = Number(id)
    }
    if (type) {
      this.currentTab = type
    }
    this.fetchContentList()
    this.fetchContentextChackAmout()
  }

}
</script>

<style lang="scss">
  .content-index-container{
    .left-head{
      padding:10px 10px 0;
      height: 46px;
      border: none;
    }
    .el-tabs__content{
      padding-bottom: 30px !important;
    }
  }
</style>
