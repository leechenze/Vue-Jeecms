<template>
  <section class="column-model-edit-container model-vip-container">
    <el-container v-loading="loading">
      <el-header height="auto">
        <model-header
          :screenFullElement="screenFullElement"
          @handleSave="handleSave" label="会员模型"/>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6">
            <!-- 拖动组件区域 -->
            <el-collapse v-model="activePanels" @change="handleChangePanel" accordion>
              <!-- 暂时不支持自定义字段 -->
              <template v-for="(group, index) in [groups[2]]">
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
          <el-col :span="11">
            <!-- 拖动放置区域 -->
            <div class="eidtor model-vip">
              <div class="title">页面显示效果</div>
              <el-form label-width="auto" label-suffix="：" :show-message="false">
                <draggable
                  v-model="data.formListBase"
                  v-bind="options2"
                  @add="handleWidgetAdd($event, 'Base')"
                  @end="handleWidgetMoved($event, 'Base')"
                  class="widget-form-list"
                >
                  <template v-for="(item, index) in data.formListBase">
                    <div class="widget-view" :key="item.prop" :class="{active: selectIndex === index && selectTab === 'Base'}" @click="handleSelectWidget(index, 'Base')">
                      <component :is="item.preview" :index="index" :option="item.value" :form="{[item.value.name]: item.value.defaultValue}" v-model="item.value.defaultValue"
                      :isValidator='false'
                      ></component>
                      <!-- 删除 -->
                      <jee-icon iconClass="guanbi" class="close" v-if="item.canDelete" @click.stop="handleWidgetDelete(index, 'Base')"/>
                    </div>
                  </template>
                </draggable>
              </el-form>
            </div>
          </el-col>
          <el-col :span="7">
            <!-- 组件设置区域 -->
            <div class="setting">
              <div class="title">配置详情</div>
              <component :is="getSelectFormItem.editor"
              ref="editorComponent"
              v-bind="getSelectFormItem"
              :isVipModel="true"
              v-if="getSelectFormItem"></component>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </section>
</template>

<script>
import detailMixin from '../detailMixin'
import defaultConfigs from '@/components/draggable/Config/vipDefaultConfigs'
import ModelHeader from './ModelHeader'

export default {
  name: 'modelVip',
  mixins: [detailMixin],
  components: {
    ModelHeader
  },
  data () {
    return {
      screenFullElement: '.model-vip-container',
      defaultConfigs: [],
      customConfigsFilter: ['fileUpload', 'ueditor', 'audioUpload', 'multiImageUpload', 'videoUpload'],
      fastConfigsFilter: ['organize'],
      data: {
        formListBase: defaultConfigs.slice().sort((a, b) => a.index - b.index).map(d => {
          const key = Date.now() + '_' + Math.ceil(Math.random() * 1000000)
          d.prop = d.type + '_' + key
          return d
        })
      },
      isEnableFetchDetail: true
    }
  },
  methods: {
    // 保存页面
    doSave () {
      const check = this.hasRepeatValue(this.data.formListBase.map(d => d.value.name))
      if (!check) {
        this.$message.error('存在重复的标签名称，请检查并修改')
      } else {
        this.loading = true

        const formListBase = this.data.formListBase.map((d, i) => {
          d.index = i + 1
          d.groupType = 1
          return d
        })

        const postData = {
          modelId: this.modelId,
          enableJson: JSON.stringify({ formListBase }),
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
    // 创建
    fetchModelCreate () {
      if (this.isEnableFetchDetail) {
        this.$request.fetchModelCreateAll({
          modelName: '会员模型',
          isEnable: true,
          tplType: 3
        }).then(res => {
          if (res.code === 200) {
            this.fetchModelDetail()
            this.isEnableFetchDetail = false
          }
        })
      }
    },
    // 获取详情
    fetchModelDetail () {
      this.loading = true
      this.$request.fetchModelMember().then(res => {
        if (res.code === 200) {
          const { id, enableJson, unEnableJson } = res.data || {}
          if (id) {
            this.modelId = id
            if (enableJson instanceof Object) {
              const { formListBase } = enableJson
              if (formListBase instanceof Array && formListBase.length) {
                this.data.formListBase = formListBase.sort((a, b) => a.index - b.index)
              }
            }
            if (unEnableJson instanceof Array) {
              this.defaultConfigs = unEnableJson.sort((a, b) => a.groupIndex - b.groupIndex)
            }
          } else {
            this.fetchModelCreate()
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.fetchModelDetail()
  }
}
</script>
<style lang="scss">
@import '../detail.scss';
.model-vip-container{
   .el-header{
    padding-bottom: 20px !important;
  }
  .model-vip{
    .el-form{
      max-height: calc(100% - 67px);
      overflow-x: hidden;
      overflow-y: overlay;
      box-sizing: border-box;
    }
  }
}
</style>
