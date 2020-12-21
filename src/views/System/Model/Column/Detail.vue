<template>
  <section class="column-model-edit-container model-column-container">
    <el-container v-loading="loading">
      <el-header height="auto">
        <model-header :screenFullElement="screenFullElement" @handleSave="handleSave"
          label="栏目模型名称：" :name="modelName"
        />
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6">
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
                          <!-- 彻底删除 -->
                          <jee-icon v-if="group.name === '3' && item.isCustom" iconClass="jianqu" class="delete"
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
          <el-col :span="11">
            <!-- 拖动放置区域 -->
            <div class="eidtor model-column">
              <el-tabs v-model="currentTab"
                @mouseover.native="handleMouseOverTabs"
              >
                <template v-for="(tab, index) in tabs">
                  <el-tab-pane :label="tab.label" :name="tab.name" :key="index">
                    <el-form :label-width="labelWidth" label-suffix="：" :show-message="false">
                      <draggable
                        v-model="data[`formList${tab.name}`]"
                        v-bind="options2"
                        @add="handleWidgetAdd($event, tab.name)"
                        @end="handleWidgetMoved($event, tab.name)"
                        class="widget-form-list"
                      >
                        <template v-for="(item, index) in data[`formList${tab.name}`]">
                          <div class="widget-view" :key="item.prop" :class="{active: selectIndex === index && selectTab === tab.name}" @click="handleSelectWidget(index, tab.name)">
                            <component :is="item.preview" :index="index"
                              :option="item.value" :form="{[item.value.name]: item.value.defaultValue}" v-model="item.value.defaultValue"
                              :isValidator="false"
                            ></component>
                            <!-- 删除 -->
                            <jee-icon iconClass="guanbi" class="close" v-if="item.canDelete" @click.stop="handleWidgetDelete(index, tab.name)"/>
                          </div>
                        </template>
                      </draggable>
                    </el-form>
                  </el-tab-pane>
                </template>
              </el-tabs>
            </div>
          </el-col>
          <el-col :span="7">
            <!-- 组件设置区域 -->
            <div class="setting">
              <div class="title">配置详情</div>
              <component :is="getSelectFormItem.editor" ref="editorComponent" v-bind="getSelectFormItem" v-if="getSelectFormItem"
              :key="getSelectFormItem.prop || getSelectFormItem.type"></component>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <u-editor ref='editor' class='hidden-editor'></u-editor>
  </section>
</template>

<script>
import UEditor from '@/components/editor/UEditor'
import defaultConfigs from '@/components/draggable/Config/defaultConfigs'
import detailMixin from '../detailMixin'
import ModelHeader from '../Vip/ModelHeader'

export default {
  name: 'modelColumnDetail',
  mixins: [detailMixin],
  components: {
    UEditor,
    ModelHeader
  },
  data () {
    return {
      screenFullElement: '.model-column-container',
      customConfigsFilter: [],
      fastConfigsFilter: [],
      data: {
        // 基本
        formListBase: this.getFormListBase(),
        formListExtend: [],
        formListSeo: []
      }
    }
  },
  provide () {
    return {
      changeColumn: ''
    }
  },
  methods: {
    getFormListBase () {
      return [
        defaultConfigs.find(d => d.type === 'parentColumn'),
        defaultConfigs.find(d => d.type === 'columnName'),
        defaultConfigs.find(d => d.type === 'accessPath')
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
        formListBase: this.getFormListBase(),
        formListExtend: [],
        formListSeo: []
      }
      this.defaultConfigs = this.getInitDefaultConfig()
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
            const { formListBase, formListExtend, formListSeo } = enableJson || {}
            if (formListBase instanceof Array && formListBase.length) {
              this.data.formListBase = formListBase.sort((a, b) => a.index - b.index)
            } else {
              this.data.formListBase = []
            }
            if (formListExtend instanceof Array && formListExtend.length) {
              this.data.formListExtend = formListExtend.sort((a, b) => a.index - b.index)
            } else {
              this.data.formListExtend = []
            }
            if (formListSeo instanceof Array && formListSeo.length) {
              this.data.formListSeo = formListSeo.sort((a, b) => a.index - b.index)
            }
            if (unEnableJson instanceof Array) {
              this.defaultConfigs = unEnableJson.sort((a, b) => a.groupIndex - b.groupIndex)
            }
          }
        } else {
          this.initData()
        }
        this.loading = false
      }).catch((error) => {
        console.log(error)
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
  .model-column{
    .el-tabs__content{
      max-height: calc(100vh - 200px);
      overflow-x: hidden;
      overflow-y: overlay;
      box-sizing: border-box;
    }
  }
  .hidden-editor{
    position: fixed;
    z-index: -1;
    visibility: hidden;
  }
}
.column-model-edit-container.model-column-container{
  .eidtor.model-column{
    .d-address-preview.z-draggable-preview.new-content{
      .el-form-item__addr{
        flex-direction: row;
        .el-form-item__content{
          flex-grow: 1;
        }
        .el-form-item__content .el-cascader{
          max-width: 414px;
        }
      }
    }
    .d-city-preview.new-content .el-form-item{
      .el-form-item__content .city-cascader{
        max-width: 414px;
      }
    }
  }
}
</style>
