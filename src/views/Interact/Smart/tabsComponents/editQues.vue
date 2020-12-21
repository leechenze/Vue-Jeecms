<template>
<!-- 投票调查详情 -->
  <section class="interact-smart-edit-ques" v-loading="loading">
    <base-header v-if="headers.buttons.length" v-bind="headers"
      @handleOperate="handleHeaderOperate"
    />
    <div class="interact-smart-container ">
      <!-- 左侧 -->
      <div class="interact-smart-left component">
        <div class="component-block component" @mouseleave="leaveFun">
          <!-- 拖动组件区域 -->
          <div class="component-block-title">
            <div class="component-block-title-list-box">
              <div class="component-block-title-list jee-hover-color"
              v-for="(group, index) in groups" :key="index"
              :class="{'jee-click': modelTab === group.name }"
              @mousemove="changeComponent(group)">
                <jee-icon :iconClass="group.icon" class="jee-color"></jee-icon>
                {{group.title}}
              </div>
            </div>
            <div class="component-block-title-items" :class="{'leave': componentShow === false, 'active': componentShow === true  }">
              <template v-for="(group, index) in groups">
                <draggable
                  :list="group.data"
                  v-bind="group.options"
                  class="component-block-title-items-box"
                  :style="group.data.length?'':'border-top:none'"
                  v-show="isLeftModelShow(group.name)"
                  @start="handleComponentStart($event, group)"
                  :key="index"
                >
                  <div v-for="(item, idx) in group.data" :key="item.type+idx"
                  @click="addDragItem(item,idx)"
                  class="drag-comp-item-wrap">
                    <div class="hover-box jee-border"></div>
                    <jee-icon :iconClass="item.icon === undefined ? 'jia' : item.icon"></jee-icon>
                    <span class="drag-comp-item t-title">{{item.name}}</span>
                  </div>
                </draggable>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="edit-ques-wrap scrollbar" :style="deviceTab === 1?'background-color: #fff;':''" v-if="showPage" >
        <div class="bg-wrap" :class="deviceTab === 1?'phone-bg-wrap':''" >
          <!-- 背景 -->
          <div class="bg-style" :style="deviceTab === 1?'height: 100%;':getStyle(cssStyles.bgConfig,'bgConfig')" @click="cleanConfig"></div>
          <div :class="deviceTab === 1?'edit-phone-all':''" >
            <div class="phone-item-p">
              <div class="item-p-top"></div>
              <div class="item-p-bottom">
                <div class="p-bottom-left"></div>
                <div class="p-bottom-right"></div>
              </div>
            </div>
            <div class="edit-ques-view" :class="deviceTab === 1?'edit-phone':''" :style="deviceTab === 1? 'width: 330px' : getStyle(cssStyles.contConfig,'body')">
              <!-- 页眉 -->
              <div class="edit-ques-header">
                <el-image class="w-100" :style="{height: deviceTab === 1?'210px':'150px'}"
                  v-if="cssStyles.headConfig&&cssStyles.headConfig.bgImage"
                  :src="$getPath(deviceTab === 1?cssStyles.headConfig.phoneImgUrl:(cssStyles.headConfig.bgImageUrl || cssStyles.headConfig.bgImageUrlSelect))" fit="cover"></el-image>
                <div v-else class="head-text" :style="{lineHeight: deviceTab === 1?'210px':'150px'}">页眉图片</div>
                <div class="edit-ques-tab t-12">
                  <span @click="handleTabs(1)"
                    class="eq-radio-button jee-hover-color"
                    :class="{'jee-color':deviceTab === 1}">
                    <jee-icon iconClass="shouji" :style="{fontSize:'18px'}"></jee-icon>手机</span>
                  <span  @click="handleTabs(2)"
                    class="eq-radio-button jee-hover-color"
                    :class="{'jee-color':deviceTab === 2}">
                    <jee-icon iconClass="diannao1" :style="{fontSize:'18px'}"></jee-icon>电脑</span>
                </div>
              </div>
              <!-- 内容 -->
              <div class="edit-ques-cont" :style="deviceTab === 1? 'width: 330px' :getStyle(cssStyles.contConfig,'contConfig')">
                <div class="cont-box"
                  :style="{paddingTop:displayType>2?'20px':(displayType<2?'30px':'20px')}">
                  <div class="eidtor">
                    <el-form
                      :labelPosition="deviceTab === 1?'top':labelPosition"
                      :label-width="labelWidth"
                      label-suffix="：" @submit.native.prevent>
                      <draggable
                        class="cont-drag"
                        v-model="formList"
                        v-bind="options2"
                        @add="handleWidgetAdd($event)"
                        @end="handleWidgetMoved($event)"
                      >
                      <!-- 组件放置 -->
                        <template></template>
                        <template v-for="(item, index) in formList">
                          <div class="widget-view" :key="item.prop"
                          :class="{'active jee-border': selectIndex === index}">
                            <div @click.stop="handleSelectWidget(index,item)"
                              class="cont-wrap" :class="[deviceTab === 1?'is-mobile':
                              cssStyles.componentConfig.displayType === 1?'compact-type':
                              cssStyles.componentConfig.displayType === 2?'':'loose-type']" >
                              <component :is="item.preview" :index="index"
                                :option="item.value"
                                :config="item"
                                :deviceTab="deviceTab"
                                :form="{[item.value.name]: item.value.defaultValue}"
                                v-model="item.value.defaultValue"
                                :isValidator="false"
                                :cssConfig="getStyle(cssStyles.componentConfig,'componentConfig')"
                                :contWidth="cssStyles.contConfig.bodyWidth"
                              ></component>
                              <!-- 删除 -->
                              <jee-icon iconClass="guanbi" class="close" v-if="item.canDelete" @click.stop="handleWidgetDelete(index)"/>
                            </div>

                            <div class="p-layer-bgShow" v-if="item.editShow"></div>
                            <div v-if="item.editShow" class="p-edit-show active edit-box" :class="{'edit-view':deviceTab === 1}">
                              <select-edit v-model="formList[index]" @close="closeEditConfig" :index="index"></select-edit>
                            </div>
                          </div>
                        </template>
                      </draggable>
                      <div class="cont-box__info" v-if="formList.length<1">
                        <jee-icon iconClass="zhixiangjiantou" :style="{fontSize:'30px',fill:'#333'}"></jee-icon>
                        <span>单击左边题型   或   把题型拖入此区域</span>
                      </div>
                    </el-form>
                  </div>
                  <div class="cont-box__btn"
                  :class=" [displayType === 1?'compact-type-but':
                  displayType === 2?'':'loose-type-but']"
                    :style="getStyle(cssStyles.subConfig,'subConfig')">{{submitText}}</div>
                </div>
              </div>
            </div>
            <div class="phone-item-foot">
              <div class="item-foot-item"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 配置详情 -->
      <div class="smart-block scrollbar" :style="{width:'360px',position:'relative',zIndex:99,overflowY:'auto'}" v-show="isConfig">
        <div class="smart-block-box" style="padding-top:18px" >
          <div class="smart-block-title">配置详情</div>
          <div class="smart-block-form">
            <component :is="getSelectFormItem.editor" v-bind="getSelectFormItem" v-if="getSelectFormItem"
               ref="editorComponent" :isValidator='false' :deviceTab="deviceTab"
               :key="getSelectFormItem.prop || getSelectFormItem.type"  @func="getMsgFormSon"></component>
          </div>
        </div>
      </div>
      <div :style="{width:'350px',overflowY:'auto'}"  v-show="!isConfig">
        <!-- 右侧 -->
        <div class="edit-ques-config">
          <ques-skin :cssStyle="formData" :refresh="refresh" @change="getCssStyle" ref="quesSkinComponent"></ques-skin>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import detailMixin from '../detailMixin'
import selectEdit from '../detailComponents/selectEdit'
import { mapActions } from 'vuex'
export default {
  name: 'editQues',
  mixins: [detailMixin],
  components: {
    selectEdit
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    name: {
      type: String,
      default: ''
    },
    saveName: {
      type: String,
      default: ''
    },
    workFlow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formList: [],
      cssStyles: {},
      componentShow: false, // 是否显示模型组件列表
      deviceTab: 2,
      modelTab: '',
      submitText: '提交',
      itemShowHide: [],
      refresh: true,
      layout: 2
    }
  },
  computed: {
  },
  watch: {
    name: function (newVal) {
      if (this.$route.query.id && newVal === 'editQues') {
        this.getSmartDetailData({ id: this.$route.query.id, type: true })
      } else if (this.saveName === 'editQues' && newVal !== 'editQues') {
        let obj = this.reorganizationData(0)
        this.updateFormData(obj)
      }
    }
  },
  methods: {
    ...mapActions('interact', ['getCloseData']),
    // 重组数据
    reorganizationData (handleType) {
      let data = []
      let arr = this.formList
      let loop = function (data) {
        if (data instanceof Array) {
          return data.map((v, i) => {
            v.sortNum = i + 1
            v.id = v.id || ''
            v.pic = v.pic || ''
            if (v.children && v.children.length) {
              v.children = loop(v.children)
            }
            return v
          })
        } else {
          return []
        }
      }
      data = arr.map((d, i) => {
        // d.groupType = 1
        // d.title = d.value.label
        if (d.option && d.option.options) {
          d.option.options = loop(d.option.options)
        }
        delete d.optionAll
        delete d.disableFields
        delete d.hiddenFields
        return d
      })
      let obj = Object.assign({}, {
        id: this.$route.query.id,
        'fields': data,
        'callScript': this.detail.callScript,
        'url': this.detail.url,
        'previewUrl': this.detail.previewUrl,
        'isOnlyWechat': this.detail.isOnlyWechat,
        'submitLimitLogin': this.detail.submitLimitLogin,
        'prompt': this.detail.prompt,
        'handleType': handleType === undefined || handleType === 'preview' ? 0 : handleType,
        ...this.cssStyles
      })
      return obj
    },
    // 操作
    handleHeaderOperate (item) {
      if (item.handleType === 3) {
        this.getCloseData(false)
      }
      this.validetaEditor()
      this.$nextTick(() => {
        if (!this.isConfig) {
          let obj = this.reorganizationData(item.handleType)
          for (let i in obj.fields) {
            if (obj.fields[i].type === 'imageRadio') {
              for (let j in obj.fields[i].value.options) {
                if (!obj.fields[i].value.options[j].picUrl) {
                  this.$message({
                    message: '图片单选没有全部上传,请检查!',
                    type: 'warning'
                  })
                  return
                }
              }
            } else if (obj.fields[i].type === 'imageCheckbox') {
              for (let j in obj.fields[i].value.options) {
                if (!obj.fields[i].value.options[j].picUrl) {
                  this.$message({
                    message: '图片多选没有全部上传,请检查!',
                    type: 'warning'
                  })
                  return
                }
              }
            }
          }
          switch (item.handleType) {
            case 'preview':
              this.updateFormData(obj, 'preview')
              break
            default:
              this.updateFormData(obj)
          }
        }
      })
    },
    // 表单字段保存
    updateFormData (data, type) {
      this.loading = true
      this.$request.fetchSmartFormUpdateFieldsPut(data).then(res => {
        let arr = ['修改成功', '提交成功', '', '发布成功']
        if (res.code === 200) {
          if (type === 'preview') {
            if (this.detail.previewUrl) {
              window.open(this.detail.previewUrl)
            } else {
              this.$message('当前没有预览地址')
            }
            this.loading = false
          } else {
            if (data.handleType === 0) {
              this.$message({
                message: arr[data.handleType],
                type: 'success'
              })
              this.loading = false
            } else if (data.handleType === 3) {
              this.fetchPublish(this.$route.query.id)
            } else {
              this.getSmartDetailData({ id: this.$route.query.id, type: true })
              this.loading = false
            }
          }
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    fetchPublish (id) {
      let params = {
        publish: true,
        ids: [id]
      }
      let removeUrl = this.$route.fullPath
      this.$request.fetchSmartFormPublishPut(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.$routerLink('/interact/smart/index', 'list', {})
          setTimeout(() => {
            this.removeTab(removeUrl)
          }, 0)
        }
        this.loading = false
      })
    },
    // 接受级联下拉选项传过来的值
    getMsgFormSon (data) {
      for (let i in this.formList) {
        if (data.name === this.formList[i].value.name) {
          this.$set(this.formList[i], 'editShow', true)
        }
      }
    },
    closeEditConfig (item, index, type) {
      this.$set(this.formList[index], 'editShow', false)
      if (item) {
        this.$set(this.formList[index], 'option', item)
      }
      if (type === 'update' && this.name === 'editQues') {
        let obj = this.reorganizationData()
        this.resetSmartDetailData(obj)
      }
    },
    // 获取样式
    getCssStyle (data) {
      this.cssStyles.bgConfig = data.bgConfig.form
      this.cssStyles.headConfig = data.headConfig.form
      this.cssStyles.contConfig = data.contConfig.form
      this.cssStyles.componentConfig = data.componentConfig.form
      this.cssStyles.subConfig = data.subConfig.form
      this.$nextTick(() => {
        if (this.name === 'editQues') {
          let obj = this.reorganizationData()
          this.resetSmartDetailData(obj)
        }
      })
      this.$forceUpdate()
      this.refresh = false
    },
    handleTabs (i) {
      this.deviceTab = i
    }
  },
  inject: ['removeTab']
}
</script>
<style lang="scss">
.interact-smart-edit-ques{
  overflow: hidden;
  height: 100%;
  .s-draggable-preview .el-form-item{
    .el-form-item__error{
      display: none;
    }
    &.is-error .el-input__inner{
      border-color: #e8e8e8;
    }
  }
  .ghost_edit{
    width: 100%;
    height:40px;
    // background-color: rgba(230,246,248,1);
    // border: 1px dashed #1EC6DF;
    border-radius: 4px;
    position: relative;
    line-height: 60px;
    list-style: none;
    font-size: 0;
    opacity: 1;
    .hover-box{
      display: none;
    }
    .jee-svg-icon{
      opacity: 0;
    }
    &:after{
      display: block;
      position: absolute;
      content: '';
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 1px;
    }
    &:before{
      display: block;
      position: absolute;
      // background-color: rgba(255,255,255,1);
      background-color: #D5F4F8;
      content: '放在这里';
      left: 50%;
      top: 50%;
      height: 25px;
      line-height: 25px;
      transform: translate(-50%, -50%);
      padding: 0 30px;
      z-index: 1;
      font-size: 14px;
    }
  }
  .ghost-fallback{
    height: auto !important;
  }
  .sortable-chosen.ghost_edit{
    // opacity: 0;
    .cont-wrap{
      /*opacity: 0;*/
      display: none; //  试修复拖拽bug
    }
  }
  .sortable-chosen.active.ghost_edit{
    border: none !important;
  }
  .interact-smart-container{
    display: flex;
    height: calc(100% - 56px);
    border-top: 1px solid #E8E8E8;
    overflow-x: overlay;
    overflow-y: hidden;
    align-items: stretch;
  }
  .interact-smart-left{
    .el-tabs--card{
      > .el-tabs__header{
        .el-tabs__item{
          .el-icon-close{
            right: -13px;
          }
        }
      }
    }
     .component-block{
      background-color: #fff;
      color: #333;
      height: 100%;
      .component-block-title{
        display: flex;
        height: 100%;
      }
      .component-block-title-list-box{
        border-right: 1px solid #f0f0f0;
        width: 40px;
      }
      .component-block-title-list{
        font-size:16px;
        font-weight: 600;
        width: 20px;
        margin: 20px auto 40px;
        text-align: center;
        cursor: pointer;
        // color: #333;
        .jee-svg-icon{
          margin-bottom: 10px;
        }
      }
      .component-block-title-items{
        width: 0;
        border-right: 1px solid #E8E8E8;
        overflow-x: hidden;
        overflow-y: auto;
        overflow-y: overlay;
        transition:all .3s ease-in .1s;
        .component-block-title-items-box{
          margin: 20px;
          width: 240px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          // border-top: 1px solid #E8E8E8;
          // border-left: 1px solid #E8E8E8;
          .ghost{
            opacity: 0;
            height:40px;
          }
          .drag-comp-item-wrap{
            width: 33.33%;
            height: 80px;
            padding: 0 8px;
            letter-spacing: -0.2px;
            box-sizing: border-box;
            border: 1px solid #E8E8E8;
            margin-left: -1px;
            margin-top: -1px;
            background-color: #fff;
            // border-right: 1px solid #E8E8E8;
            // border-bottom: 1px solid #E8E8E8;
            box-sizing: border-box;
            text-align: center;
            font-size: 12px;
            color: #666;
            position: relative;
            .hover-box{
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              display: none;
              z-index: 1;
            }
            &:hover{
              .hover-box{
                display: block;
              }
            }
            .jee-svg-icon{
              font-size: 24px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              margin: 18px auto 10px;
            }
            svg.jia.jee-svg-icon{
              font-size: 16px;
            }
            svg.delete.jianqu.jee-svg-icon{
              fill: #797979;
              color: #797979;
              font-size: 16px;
              top: -17px;
              right: 1px;
            }
            .delete{
              position: absolute;
              right: 0;
              top: -20px;
              cursor: pointer;
              z-index: 10;
            }
          }
        }
        &.leave{
          width:0;
          border-right: 0 solid #e8e8e8;
        }
        &.active{
          width: 280px;
        }
      }
    }
  }
  .edit-ques-header{
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #E8E8E8;
    border-bottom: none;
    position: relative;
    box-sizing: border-box;
    border-radius: 4px 4px 0 0 ;
    overflow: hidden;
    .edit-ques-tab{
      position: absolute;
      right: 10px;
      top:10px;
      width: 150px;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      background-color: #ffffff;
      box-shadow: 0 0 3px #f0f0f0;
      .eq-radio-button{
        text-align: center;
        display: inline-block;
        width:50%;
        cursor: pointer;
        &:first-of-type{
          border-right: 1px solid #e8e8e8;
          box-sizing: border-box;
        }
        &__inner{
          background-color: #ffffff;
        }
        .jee-svg-icon{
          fill: #666;
          margin-right:10px;
          position: relative;
          top: 2px;
        }
      }
    }
  }
  .head-text{
    font-size: 16px;
    color: #999999;
    text-align: center;
  }
  .w-100{
    width: 100%;
  }
  // 内容
  .edit-ques-cont{
    min-height: 410px;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #E8E8E8;
    position: relative;
    box-sizing: border-box;
    .eidtor{
      border: none;
      min-height: 285px;
      .el-form .el-form-item{
        margin-bottom: 0;
        height: 100%;
        .s-limit-form-item{
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 5px;
        }
      }
      // 上对齐
      .el-form--label-top{
        .cont-drag{
          .s-draggable-preview{
            .el-form-item__label{
              padding-bottom: 10px !important;
            }
          }
          .cont-wrap{
            .s-checkbox-preview,.s-radio-preview {
              .el-form-item__label{
                padding-bottom: 18px !important;
              }
            }

          }
          .is-mobile{
            .s-radio-preview{
              .el-form-item__label{padding-bottom: 0px !important;}
              .el-radio-group{
                .el-radio:last-of-type{margin-bottom: 0 !important;}
              }
            }
          }
          .s-image-radio-preview,.s-image-radio-previews{
            .el-image-radio-group{
              .pic-box{
                margin-right: 118px;
              }
            }
          }
        }
      }
    }
    .cont-drag{
      // height: 100%;
      min-height: 285px;
      position: relative;
    }
    .cont-box{
      position: relative;
      width: 100%;
      padding-bottom: 50px;
      &__info{
        text-align: center;
        align-items: center;
        position: absolute;
        top: 180px;
        left: 0;
        right: 0;
        .jee-svg-icon{
          position: relative;
          top: 5.5px;
          margin-right: 15px;
        }
      }
      &__btn{
        margin: 0 auto;
        color: #ffffff;
        background-color: #1ec6df;
        width: 77px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-style: solid;
        box-sizing: border-box;
        margin-top: 20px !important;
        &.compact-type-but{
          margin-top: 25px !important;
        }
        &.loose-type-but{
           margin-top: 15px !important;

        }
      }
      .widget-view{
        .p-layer-bgShow{
          width: 100%;
          height: 100%;
          position: fixed;
          top: 0;
          left: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1001;
        }
        .p-edit-show{
          width: 892px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          border-radius:4px;
          background: #fff;
          z-index: 1002;
          .p-iconItem{
            padding: 20px 30px 0px 0;
            .jee-svg-icon{
              fill: #999;
              &:hover{
                fill: #1EC6DF;
              }
            }
          }
          .os-addBut{
             padding: 0px 30px 20px 0
          }
          .os-addBut{
            height: 32px;
            line-height: 32px;
            >button{
              padding: 0px 20px;
              line-height: 30px;
            }
          }
        }
        position: relative;
        box-sizing: border-box;
        .handle-btn{
          position: absolute;
          opacity: 0;
          top: 20px;
          right: 20px;
          font-size: 16px;
          z-index: 1102;
          cursor: pointer;
          .jee-svg-icon{
            fill: #666666;
            margin-left: 30px;
          }
        }
        &:hover{
          .handle-btn {
            opacity: 1;
          }
        }
        &:not(.active):hover {
          .cont-wrap{
            background: #F9F9F9;
          }
        }
        &.active {
          border-width: 1px;
          border-style: dashed;
          border-radius: 0;
        }
        .cont-wrap{
          box-sizing: border-box;
          position: relative;
          cursor: move;
          &:after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            display: block;
          }
          // 组件上下间距
          .s-draggable-preview{
            padding: 20px 40px;
              .z-tip-form-item{
                padding-top: 10px ;
              }

            // 文本描述
            .s-text-desc-preview{
              padding: 15px 40px;
            }
          }
          // 紧凑版
          &.compact-type{
             .s-draggable-preview{
              padding: 15px 40px;
              .el-form-item{
                overflow: hidden;
                .el-form-item__label{
                  // height: 35px;
                  line-height: 1;
                }
                .el-form-item__content{
                  // height: 35px;
                  line-height: 35px;
                  overflow: hidden;
                  .el-input{
                    height: 100%;
                  }
                  .el-date-editor{
                    height: 35px;
                    line-height: 35px;
                    .el-input__icon{
                      line-height: 35px;
                    }
                  }
                  .el-range-editor{
                    padding: 0 10px;
                  }
                  .input-code{
                    height: 33px;
                    line-height: 35px;
                  }
                  .address-wrapper{
                    .address-wrap{
                      .address-cascader{
                        height: auto;
                        line-height: 35px;
                      }
                    }
                  }
                  .el-textarea,.el-input,.el-select{
                    .el-textarea__inner{
                      height: 75px;
                    }
                    .el-input__inner{
                      height: auto;
                      line-height: 33px;
                    }
                    .el-select__inner{
                      height: auto;
                      line-height: 35px;
                    }
                  }
                }
              }

             }

          }
          //宽松版
          &.loose-type{
            .s-draggable-preview{
              padding: 25px 40px;
              .el-form-item{
                .el-form-item__label{
                  height: auto;
                  // line-height: 45px ;
                }
                .el-form-item__content{
                  .el-date-editor{
                    height: 45px;
                    line-height: 45px;
                    .el-range-separator{
                      line-height: 45px;
                    }
                    .el-input__icon{
                      line-height: 45px;
                    }
                  }
                  .el-range-editor{
                    padding: 0 10px;
                  }
                  .input-code{
                    height: 43px;
                    line-height: 45px;
                  }
                  .address-wrapper{
                    .address-wrap{
                      .address-cascader{
                        height: auto;
                        line-height: 45px;
                      }
                    }
                  }
                  .el-textarea,.el-input,.el-select{
                    .el-textarea__inner{
                      height: 85px;
                    }
                    .el-input__inner{
                      height: auto;
                      line-height: 43px;
                    }
                    .el-select__inner{
                      height: auto;
                      line-height: 45px;
                    }
                  }
                }
              }

            }
          }
          // 组件上下间距-移动端
          &.is-mobile{
            .s-draggable-preview{
              padding: 15px 20px;
              // 文本描述
              .s-text-desc-preview{
                padding: 10px 40px;
              }
            }
            .s-checkbox-preview,.s-radio-preview{
              .el-form-item__content{
                .el-radio{
                  .el-radio__input{
                    // padding-left: 0px !important;
                    margin-left: 0px!important;
                  }
                  .el-radio__label{
                    padding-right: 0px !important;
                  }
                }
                .el-checkbox{
                  .el-checkbox__input{
                    margin-left: 20px!important;
                  }
                  .el-checkbox__label{
                    padding-right: 0px !important;
                  }
                }
              }
            }
          }

          .close{
            position: absolute;
            opacity: 0;
            top: 0;
            right: 0;
            font-size: 16px;
            z-index: 1102;
            cursor: pointer;
          }
          &:hover{
            .close{
              opacity: 1;
            }
          }
        }
        .cont-view{
          padding: 0 30px;
        }
        .cont-edit{
          &:after{
            position:relative;
          }
        }
      }
    }
  }
.isNoShowComponent {
  .ghost_list {
    opacity: 1;
  }
}

.dragging{
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  border: 1px solid #1dc6dd!important;
}

// 拖动对象（跟随鼠标）的样式
.dragging2 .model-left-box,
.dragging2 .widget-view-box,
.dragging2 .widget-view {
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  background-color: #ffffff!important;
  border-radius: 4px;
}
  .edit-ques-wrap{
    flex: 1;
    max-height: 100%;
    // min-width: 1030px;
    overflow-y: auto;
    background-color: #F0F0F0;
    position: relative;
    // 拖动对象（跟随鼠标）的样式
    .dragging2.widget-view {
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      // border-radius: 4px;
      background-color: #ffffff!important;
      &.active{
        border-style: solid;
      }
      .cont-wrap{
        opacity: 1;
      }
    }
    .edit-ques-view{
      margin: 0 auto;
    }
    // 手机模板样式

    .phone-bg-wrap{
      background: #f0f0f0;
    }
    .edit-phone-all{
      width: 330px;
      margin: 0 auto;
      border-radius: 40px;
      overflow: hidden;
      padding: 70px 15px 80px 15px;
      background: #fff;
      position: relative;
      box-shadow: 0 0 10px #e8e8e8;
      .phone-item-p{
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        width: 100%;
        .item-p-top{
          width: 10px;
          height: 10px;
          background: #F0F0F0;
          border-radius: 50%;
          margin: 10px auto;
        }
        .item-p-bottom{
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 15px;
          .p-bottom-left{
            width: 12px;
            height: 12px;
            background: #F0F0F0;
            border-radius: 50%;
            margin-right: 20px;

          }
          .p-bottom-right{
            width: 80px;
            height: 6px;
            background: #F0F0F0;
            border-radius: 4px;
            margin-right: 20px;

          }
        }
      }
      .phone-item-foot{
        position: absolute;
        width: 100%;
        bottom: 17px;
        left: 0;
        z-index: 3;
        .item-foot-item{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: auto;
          border: 3px solid  #E8E8E8;
        }
      }
      .edit-phone{
        height: 587px;
        overflow-y: scroll;
        .edit-ques-cont{
          min-height: 300px;
        }
      }

    }
    .bg-wrap{
      padding: 43px 43.8px 43.8px;
      box-sizing: border-box;
    }
    .bg-style{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-attachment: fixed;
    }
    .el-radio{
      &__inner{
        border-color: #cccccc;
      }
    }
  }
  .edit-ques-config{
    min-width: 350px;
    max-width: 350px;
    padding-left: 30px;
    box-sizing: border-box;
  }
  .edit-ques-icon{
    position: relative;
    top: 2px;
    margin-right: 8px;
  }
  .smart-block{
    transition:all .3s ease-in .1s;
    position: relative;
    overflow-x: auto;
    overflow-y: overlay;
    // &.active{
    //   width: 360px;
    // }
    .smart-block-box{
      padding: 30px 0px 30px 30px;
      padding-top: 18px;
    }
    .smart-block-title{
      font-size:16px;
      border-bottom: 1px solid #E8E8E8;
      height: 40px;
      line-height: 40px;
      margin-bottom: 30px;
    }
    .smart-block-form{
      width: 100%;
      /deep/.form-item-wrap{
        // width: 345px;
        width: 100%;
        >.el-form-item{
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 25px;
          &:not(.line){
            .el-form-item__label{
              line-height: 1 !important;
              padding: 0 0 9px 0;
            }
          }
          .el-form-item__content{
            width: 100%;
            line-height: initial;
            .jee-input-append-select .el-input-group__append .el-input{
              height: 35px;
            }
            .el-input,.el-select{
              height: auto;
              .el-input__inner{
                width: 100%;
                box-sizing: border-box;
              }
              .el-input__suffix{
                .el-input__icon{
                  line-height: 32px;
                }
              }
            }
            .el-tag.el-tag--info{
              border: none ;
              .el-tag__close{
                background-color: #ccc;
                color: #f0f0f0;
              }
            }
          }
          &.width{
            .el-form-item__label{
              padding: 0;
            }
            .el-form-item__content{
              width: auto;
              line-height: 1;
              .image-size-wrap{
                .el-input{
                  .el-input__inner{
                    line-height: 1;
                    height: auto;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
