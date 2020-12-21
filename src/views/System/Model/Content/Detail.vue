<template>
  <section class="column-model-edit-container model-content-container">
    <el-container v-loading="loading">
      <el-header height="auto">
        <model-header :screenFullElement="screenFullElement" @handleSave="handleSave"
          label="内容模型名称：" :name="modelName"
        />
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="5">
            <!-- 拖动组件区域 -->
            <el-collapse v-model="activePanels" @change="handleChangePanel" accordion>
              <template v-for="(group, index) in groups">
                <el-collapse-item :title="group.title" :name="group.name"  :key="index">
                  <div class="component">
                    <draggable
                      :list="group.data"
                      v-bind="group.options"
                    >
                      <transition-group :class="group.class">
                        <div v-for="(item, idx) in group.data" :key="item.type+idx" class="drag-comp-item-wrap jee-hover-border-important">
                          <jee-icon :iconClass="item.icon"></jee-icon>
                          <span class="drag-comp-item">{{group.name === '3' && item.isCustom ? item.value.label : item.name}}</span>
                          <jee-icon v-if="group.name === '3' && item.isCustom"
                            iconClass="jianqu" class="delete"
                            @click="()=>handleDeleteDefaultConfig(idx)"
                          ></jee-icon>
                        </div>
                      </transition-group>
                    </draggable>
                  </div>
                </el-collapse-item>
              </template>
            </el-collapse>
          </el-col>
          <el-col :span="14">
            <!-- 拖动放置区域 -->
            <div class="eidtor model-content scrollbar">
              <el-row :gutter="20">
                <!-- 标题正文区 -->
                <el-col :span="15">
                  <div class="title-wrap">
                    <!-- 标题拖拽区 -->
                    <el-form label-width="auto" label-suffix="：" :show-message="false">
                      <template v-for="(item, index) in data.formListTitle">
                        <div class="widget-view" :key="item.prop" :class="{active: selectIndex === index && selectTab === 'Title'}" @click="handleSelectWidget(index, 'Title')">
                          <component :is="item.preview"
                            :index="index" :option="item.value"
                            :form="{[item.value.name]: item.value.defaultValue}"
                            v-model="item.value.defaultValue"
                            :isValidator='false'
                          ></component>
                        </div>
                      </template>
                    </el-form>
                  </div>
                  <div class="content-wrap">
                    <!-- 正文拖拽区 -->
                    <el-form label-width="auto" label-suffix="：" :show-message="false">
                      <el-tabs type="card" v-model="activeContent" editable @edit="handleContentTabsEdit">
                        <template v-for="(item, index) in data.formListContent">
                          <el-tab-pane :label="item.tabLabel" :name="item.tabName" :key="index">
                            <div class="widget-view" :key="item.prop" :class="{active: selectIndex === index && selectTab === 'Content'}" @click="handleSelectWidget(index, 'Content')">
                              <component :is="item.preview" :index="index" :option="item.value" :form="{[item.value.name]: item.value.defaultValue}" v-model="item.value.defaultValue"
                              :isValidator='false'
                              ></component>
                            </div>
                          </el-tab-pane>
                        </template>
                      </el-tabs>
                    </el-form>
                  </div>
                </el-col>
                <!-- 属性拖拽区 -->
                <el-col :span="9">
                  <el-collapse  v-model="currentTab"
                    @mouseover.native="handleMouseOverTabs"
                    accordion
                  >
                    <template v-for="(tab, index) in tabs">
                      <el-collapse-item :title="tab.label" :name="tab.name" :key="index">
                        <el-form class='content-model-prop-form'
                        label-width="auto" label-suffix="：" :inline="true" :show-message="false" label-position='left'>
                          <draggable
                            v-model="data[`formList${tab.name}`]"
                            v-bind="options2"
                            @add="handleWidgetAdd($event, tab.name)"
                            @end="handleWidgetMoved($event, tab.name)"
                            class="widget-form-list"
                          >
                            <template v-for="(item, index) in data[`formList${tab.name}`]">
                              <div class="widget-view" :key="item.prop" :class="{active: selectIndex === index && selectTab === tab.name}" @click="handleSelectWidget(index, tab.name)">
                                <component :is="item.preview" :index="index" :option="item.value" :form="{[item.value.name]: item.value.defaultValue}" v-model="item.value.defaultValue"
                                :isValidator='false'
                                ></component>
                                <!-- 删除 -->
                                <jee-icon iconClass="guanbi" class="close" v-if="item.canDelete" @click.stop="handleWidgetDelete(index, tab.name)"/>
                              </div>
                            </template>
                          </draggable>
                        </el-form>
                      </el-collapse-item>
                    </template>
                  </el-collapse>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="5">
            <!-- 组件设置区域 -->
            <div class="setting">
              <div class="title">配置详情</div>
              <component :is="getSelectFormItem.editor" v-bind="getSelectFormItem" v-if="getSelectFormItem"
              ref="editorComponent"
              :key="getSelectFormItem.prop || getSelectFormItem.type"></component>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </section>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import detailMixin from '../detailMixin'
import defaultConfigs from '@/components/draggable/Config/contentDefaultConfigs'
import { deepClone } from '@/utils'
import ModelHeader from '../Vip/ModelHeader'

export default {
  name: 'modelContentDetail',
  mixins: [detailMixin],
  components: {
    ModelHeader
  },
  data () {
    return {
      screenFullElement: '.model-content-container',
      tabs: [
        {
          label: '基本属性',
          name: 'Base'
        },
        {
          label: '扩展设置',
          name: 'Extend'
        }
      ],
      customConfigsFilter: ['ueditor'],
      fastConfigsFilter: [],
      defaultConfigFilter: [],
      activeContent: 'content',
      tabIndex: 1,
      data: {
        // 标题
        formListTitle: this.getFormListTitle(),
        formListContent: this.getFormListContent(),
        // 基本
        formListBase: this.getFormListBase(),
        // 扩展
        formListExtend: []
      }
    }
  },
  computed: {
    ...mapGetters(['setting']),
    // 是否开启内容发文字号
    openContentIssue () {
      const { openContentIssue } = this.setting.attrs || {}
      return openContentIssue
    },
    // 是否开启内容密级
    openContentSecurity () {
      const { openContentSecurity } = this.setting.attrs || {}
      return openContentSecurity
    }
  },
  watch: {
    // 是否开启内容发文字号
    openContentIssue (newData, oldData) {
      this.setContentIssue(newData)
    },
    // 是否开启内容密级
    openContentSecurity (newData, oldData) {
      this.setContentSecurity(newData)
    }
  },
  methods: {
    // 开启内容密级时将内容密级字段插入，关闭时删除
    setContentSecurity (newData) {
      if (newData === '0') {
        this.defaultConfigs = this.defaultConfigs.filter(d => d.type !== 'contentSecurity')
        this.data.formListBase = this.data.formListBase.filter(d => d.type !== 'contentSecurity')
        this.data.formListExtend = this.data.formListExtend.filter(d => d.type !== 'contentSecurity')
      } else {
        if (!this.defaultConfigs.find(d => d.type === 'contentSecurity') && !this.data.formListBase.find(d => d.type === 'contentSecurity') && !this.data.formListExtend.find(d => d.type === 'contentSecurity')) {
          let contentSecurity = defaultConfigs.find(d => d.type === 'contentSecurity')
          this.defaultConfigs.push(contentSecurity)
        }
      }
    },
    // 开启内容发文字号时将发文字号字段插入，关闭时删除
    setContentIssue (newData) {
      if (newData === '0') {
        this.defaultConfigs = this.defaultConfigs.filter(d => d.type !== 'postContent')
        this.data.formListBase = this.data.formListBase.filter(d => d.type !== 'postContent')
        this.data.formListExtend = this.data.formListExtend.filter(d => d.type !== 'postContent')
      } else {
        if (!this.defaultConfigs.find(d => d.type === 'postContent') && !this.data.formListBase.find(d => d.type === 'postContent') && !this.data.formListExtend.find(d => d.type === 'postContent')) {
          let postContent = defaultConfigs.find(d => d.type === 'postContent')
          this.defaultConfigs.push(postContent)
        }
      }
    },
    handleContentTabsEdit (targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex
        let content = deepClone(defaultConfigs.find(d => d.type === 'content'))
        content.tabLabel = '正文' + newTabName
        content.tabName = 'content' + newTabName
        content.prop = 'content' + newTabName
        content.value.name = 'content' + newTabName
        this.data.formListContent.push(content)
        this.activeContent = 'content' + newTabName
      } else if (action === 'remove') {
        let tabs = this.data.formListContent
        let activeName = this.activeContent
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.tabName === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.tabName
              }
            }
          })
        }
        this.activeContent = activeName
        this.data.formListContent = tabs.filter(tab => tab.tabName !== targetName)
        // 删除最后一个还原最后一个id
        const last = 'content' + this.tabIndex
        if (last === targetName) {
          this.tabIndex -= 1
        }
        // 删除最后一个重新计数
        if (!this.data.formListContent.length) {
          this.tabIndex = 0
        }
      }
    },
    getInitDefaultConfig () {
      return defaultConfigs.filter(d => !['title', 'subTitle', 'content', 'column', 'releaseTime'].includes(d.type)).slice().sort((a, b) => a.groupIndex - b.groupIndex)
    },
    getFormListContent () {
      let content = deepClone(defaultConfigs.find(d => d.type === 'content'))
      return [
        {
          tabLabel: '正文',
          tabName: 'content',
          ...content
        }
      ]
    },
    getFormListTitle () {
      let title = deepClone(defaultConfigs.find(d => d.type === 'title'))
      let subTitle = deepClone(defaultConfigs.find(d => d.type === 'subTitle'))
      return [
        title,
        subTitle
      ]
    },
    getFormListBase () {
      let column = deepClone(defaultConfigs.find(d => d.type === 'column'))
      let releaseTime = deepClone(defaultConfigs.find(d => d.type === 'releaseTime'))
      return [
        column,
        releaseTime
      ].map(d => {
        const key = Date.now() + '_' + Math.ceil(Math.random() * 1000000)
        d.prop = d.type + '_' + key
        return d
      })
    },
    // 初始化
    initData () {
      this.data = {
        // 基本
        formListExtend: [],
        formListBase: this.getFormListBase(),
        formListTitle: this.getFormListTitle(),
        formListContent: this.getFormListContent()
      }
      this.defaultConfigs = this.getInitDefaultConfig()
      this.activeContent = 'content'
      this.setContentSecurity(this.openContentSecurity)
      this.setContentIssue(this.openContentIssue)
    },
    // 保存页面
    doSave () {
      const { formListTitle, formListContent, formListBase, formListExtend } = this.data
      const checkData = [...formListTitle.map(d => d.value.name), ...formListContent.map(d => d.value.name), ...formListBase.map(d => d.value.name), ...formListExtend.map(d => d.value.name)]
      const check = this.hasRepeatValue(checkData)
      if (!check) {
        this.$message.error('存在重复的标签名称，请检查并修改')
      } else {
        this.loading = true
        const data = {}
        Object.keys(this.data).forEach(item => {
          data[item] = this.data[item].map((d, i) => {
            d.index = i + 1
            d.groupType = 1
            return d
          })
        })
        const postData = {
          modelId: this.modelId,
          enableJson: JSON.stringify(data),
          unEnableJson: JSON.stringify(this.defaultConfigs)
        }
        this.$request.fetchModelItem(postData).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 获取详情
    fetchModelDetail () {
      this.loading = true
      this.$request.fetchModelDetail({ id: this.modelId }).then(res => {
        if (res.code === 200) {
          const { enableJson, unEnableJson, modelName } = res.data
          this.modelName = modelName
          // 新增加的模型一开始是没有数据的
          if (!(enableJson instanceof Object && Object.keys(enableJson).length)) {
            this.initData()
          } else {
            const { formListBase, formListExtend, formListTitle, formListContent } = enableJson || {}
            if (formListBase instanceof Array && formListBase.length) {
              this.data.formListBase = formListBase.sort((a, b) => a.index - b.index)
            }
            if (formListExtend instanceof Array && formListExtend.length) {
              this.data.formListExtend = formListExtend.sort((a, b) => a.index - b.index)
            }
            if (formListTitle instanceof Array && formListTitle.length) {
              this.data.formListTitle = formListTitle.sort((a, b) => a.index - b.index)
            }
            if (formListContent instanceof Array && formListContent.length) {
              this.data.formListContent = formListContent.sort((a, b) => a.index - b.index)
              this.activeContent = formListContent[0].tabName
            }
            if (unEnableJson instanceof Array) {
              this.defaultConfigs = unEnableJson.sort((a, b) => a.groupIndex - b.groupIndex)
            }
            this.setContentSecurity(this.openContentSecurity)
            this.setContentIssue(this.openContentIssue)
          }
        } else {
          this.initData()
        }
        this.loading = false
      }).catch(() => {
        this.initData()
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
@import '../detail.scss';
.column-model-edit-container{
  // 拖动区
  .component {
    .drag-comp-list {
      max-height: 320px;
    }
  }
  .model-content{
    max-height: calc(100vh - 120px);
    overflow-x: hidden;
    box-sizing: border-box;
    overflow-y: overlay;
    .el-tabs{
      .el-tabs__content{
        width: 100%;
      }
      .el-tab-pane{
        border: 1px solid #e8e8e8;
        border-radius: 0 4px 4px 4px;
      }
    }
    .el-collapse-item__wrap{
      overflow: visible;
    }
    .title-wrap{
      padding: 0 22px 0 16px;
      margin-bottom: 20px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      .el-form-item{
        padding: 6px 0;
        .el-input{
          max-width: 100%;
          .el-input__inner{
            border: 0;
          }
        }
      }
      .widget-view:nth-of-type(1) .el-form-item{
        border-bottom: 1px solid #e8e8e8;
      }
    }
  }
}
.model-content-container{
  margin-left: -10px;
  margin-right: -10px;
  .content-model-prop-form{
    .widget-view{
      .el-form-item__label-wrap{
        margin-left: 0!important;
        float: none;
        .el-form-item__label{
          line-height: 1;
          padding-bottom: 15px;
        }
      }
      .d-multi-image-upload-preview,
      .d-video-upload-preview,
      .d-audio-upload-preview,
      .d-file-upload-preview,
      .d-image-upload-preview{
        .el-form-item__label{
          padding-bottom: 0;
          padding-top: 10px;
        }
      }
      .el-form-item__content{
        display: block;
      }
      .jee-image-upload-container,
      .jee-multi-image-upload-container,
      .jee-video-upload-container,
      .jee-file-upload-container{
        .desc{
          line-height: 22px;
          padding: 4px 0 10px 0;
        }
      }
    }
  }
}
</style>
