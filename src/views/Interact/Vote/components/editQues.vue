<template>
<!-- 投票调查详情 -->
  <section class="interact-vote-edit-ques">
    <base-header v-if="headers.buttons.length" v-bind="headers"
      @handleOperate="handleHeaderOperate"
      @handleWithdraw="handleHeaderWithdraw"
    />
    <div class="edit-ques scrollbar">
      <div class="edit-ques-box component">
        <label class="edit-ques-title">题型</label>
          <draggable
            :list="group.data"
            v-bind="group.options"
          >
            <transition-group :class="group.class">
              <div class="edit-ques-drag drag-comp-item-wrap jee-hover-border-important"
                @click="addDragItem(item,idx)"
                v-for="(item, idx) in group.data" :key="item.type+idx">
                <jee-icon class="edit-ques-icon" :iconClass="item.icon" :style="{fontSize:'20px'}"></jee-icon>
                <span class="drag-comp-item">{{group.name === '3' && item.isCustom ? item.value.label : item.name}}</span>
              </div>
            </transition-group>
          </draggable>
      </div>
      <div class="edit-ques-wrap" v-if="showPage">
        <div class="bg-wrap" >
          <div class="bg-style" :style="getStyle(cssStyles.bgConfig,'bgConfig')"></div>
          <div class="edit-ques-view" :style="{maxWidth:deviceTab === 1?'752px':'100%'}">
            <div class="edit-ques-header">
              <el-image class="w-100" :style="{height:'150px'}"
                v-if="cssStyles.headConfig&&cssStyles.headConfig.bgImage"
                :src="$getPath(cssStyles.headConfig.bgImageUrl)" fit="cover"></el-image>
              <div v-else class="head-text">页眉图片</div>
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
            <div class="edit-ques-cont" :style="getStyle(cssStyles.contConfig,'contConfig')">
              <div class="cont-box">
                <div class="eidtor">
                  <el-form :label-width="labelWidth" label-suffix="：" @submit.native.prevent>
                    <template v-for="(item, index) in headList">
                        <div class="widget-view" :key="item.prop"
                          @click="handleSelectWidget(index-2)"
                          :class="{active: selectIndex === index-2}">
                          <div class="cont-wrap cont-edit" :class="{'cont-view':deviceTab === 1}">
                            <component :is="item.preview" :index="index"
                              :option="item.value"
                              :form="{[item.value.name]: item.value.defaultValue}"
                              v-model="item.value.defaultValue"
                              :cssConfig="getStyle(cssStyles.fontConfig,index===0?'titleStyle':'descStyle')"
                              :isValidator="false"
                            ></component>
                          </div>
                        </div>
                      </template>
                    <draggable
                      class="cont-drag"
                      v-model="formList"
                      v-bind="options2"

                      @add.self="handleWidgetAdd($event)"
                      @end.self="handleWidgetMoved($event)"
                    >
                    <!-- filter=".edit-box" -->
                      <template v-for="(item, index) in formList">
                        <div class="widget-view" :key="item.prop" >
                          <div @click="handleSelectWidget(index)"
                            class="cont-wrap" :class="{'cont-view':deviceTab === 1}">
                            <component :is="item.preview" :index="index"
                              :option="item.value"
                              :config="item"
                              :form="{[item.value.name]: item.value.defaultValue}"
                              v-model="item.value.defaultValue"
                              :isValidator="false"
                              :cssConfig="getStyle(cssStyles.fontConfig,'stemStyle')"
                            ></component>
                          </div>
                          <div class="handle-btn ">
                            <el-tooltip content="编辑" placement="bottom" effect="light">
                              <jee-icon iconClass="bianji" title="编辑" class="edit jee-hover-fill"
                                v-if="item.canDelete" @click.stop="handleWidgetEdit(index)"/>
                            </el-tooltip>
                            <el-tooltip content="复制" placement="bottom" effect="light">
                              <jee-icon iconClass="fuzhi" title="复制" class="copy jee-hover-fill"
                              v-if="item.canDelete" @click.stop="handleWidgetCopy(item,index)"/>
                            </el-tooltip>
                              <!-- 删除 -->
                            <el-tooltip content="删除" placement="bottom" effect="light">
                              <jee-icon iconClass="delete" title="删除" class="close jee-hover-fill"
                                v-if="item.canDelete" @click.stop="handleWidgetDelete(index)"/>
                            </el-tooltip>
                          </div>
                          <div v-if="item.editShow" class="active edit-box" :class="{'edit-view':deviceTab === 1}">
                            <ques-configs v-model="formList[index]" @close="closeEditConfig" :index="index"></ques-configs>
                          </div>
                        </div>
                      </template>
                      <div class="cont-box__info" v-if="formList.length<1">
                        <jee-icon iconClass="zhixiangjiantou" :style="{fontSize:'30px',fill:'#333'}"></jee-icon>
                        <span>单击左边题型   或   把题型拖入此区域</span>
                      </div>
                    </draggable>
                  </el-form>

                </div>
                <div class="cont-box__btn"
                  :style="getStyle(cssStyles.subConfig,'subConfig')">{{submitText}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit-ques-config">
        <ques-skin :cssStyle="data" @change="getCssStyle" ref="quesSkinComponent"></ques-skin>
      </div>
    </div>
  </section>
</template>
<script>

import detailMixin from '../detailMixin'
export default {
  name: 'editQues',
  mixins: [detailMixin],
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
    workFlow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      headList: [
        {
          preview: 'VTitlePreview',
          dragable: false,
          editor: 'VTitleEditor',
          name: '标题',
          type: 'title',
          groupIndex: 7,
          isCustom: true,
          prop: 'title',
          index: 1,
          value: {
            defaultValue: '这里显示标题最多50个字',
            placeholder: '这里显示标题最多50个字',
            label: '',
            name: 'title'
          },
          option: {}
        },
        {
          preview: 'VDescPreview',
          dragable: false,
          editor: 'VDescEditor',
          name: '副标题',
          type: 'desc',
          groupIndex: 8,
          isCustom: true,
          prop: 'details',
          index: 2,
          value: {
            defaultValue: '这里显示描述最多150个字',
            placeholder: '这里显示描述最多150个字',
            name: 'details'
          },
          option: {}
        }
      ],
      formList: [],
      cssStyles: {},
      deviceTab: 2,
      submitText: '提交'
    }
  },
  watch: {
    name: function (newVal) {
      if (newVal === 'editQues' || newVal === 'setQues') {
        let obj = this.reorganizationData()
        this.resetDetailData(obj)
      }
    }
  },
  methods: {
    // 重组数据
    reorganizationData (handleType) {
      let data = []
      var arr2 = ['', '单选题', '多选题', '问答题', '下拉题', '级联题', '附件题']
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
        d.index = i + 1
        d.groupType = 1
        d.type = d.groupIndex
        d.title = d.value.label || (i + 1) + '.' + arr2[d.type]
        if (d.option.options) {
          d.option.options = loop(d.option.options)
        }
        delete d.optionAll
        delete d.disableFields
        delete d.hiddenFields
        return d
      })
      // console.log(this.detail)
      let obj = Object.assign(this.detail, {
        'title': this.headList.find(t => t.prop === 'title').value.defaultValue || '这里显示标题最多50个字',
        'details': this.headList.find(t => t.prop === 'details').value.defaultValue,
        'subjects': data,
        'status': handleType === undefined || handleType === 'preview' ? this.detail.status : handleType,
        ...this.cssStyles
      })
      return obj
    },
    // 撤回
    handleHeaderWithdraw (item) {
      this.$request.fetchTaskQuestionnaireRevoke({ questionnaireId: this.$route.query.id }).then(res => {
        this.$restBack(res, () => {
          this.getDetailData({ id: this.$route.query.id, type: true })
        })
      })
    },
    // 操作
    handleHeaderOperate (item) {
      let obj = this.reorganizationData(item.handleType)
      switch (item.handleType) {
        case 'preview':
          obj.id = this.formData.id
          this.updateFormData(obj, 'preview')
          break
        default:
          if (this.$route.query.type === 'Add') {
            this.saveFormData(obj)
          } else {
            obj.id = this.formData.id
            this.updateFormData(obj)
          }
      }
    },
    saveFormData (data) {
      // console.log(JSON.stringify(data))
      this.$request.fetchQuestionnaireAdd(data).then(res => {
        let arr = ['保存成功', '提交成功', '', '发布成功']
        this.$restBack(res, () => {
          let removeUrl = this.$route.fullPath
          if (data.status === 1 || data.status === 3) {
            this.$routerLink('/interact/vote/index', 'list', {})
          } else {
            this.$routerLink('/interact/vote/detail', 'Edit', { id: res.data.id, link: 'editQues', isAdd: true })
          }
          setTimeout(() => {
            this.removeTab(removeUrl)
          }, 0)
        }, arr[data.status])
      })
    },
    updateFormData (data, type) {
      // console.log(JSON.stringify(data))
      this.$request.fetchQuestionnaireSetting(data).then(res => {
        let arr = ['修改成功', '提交成功', '', '发布成功']
        if (res.code === 200) {
          if (type === 'preview') {
            if (res.data.previewUrl) {
              window.open(res.data.previewUrl)
            } else {
              this.$message('当前没有预览地址')
            }
          } else {
            if (data.status === 1 || data.status === 3) {
              this.$routerLink('/interact/vote/index', 'list', {})
            } else {
              this.getDetailData({ id: this.$route.query.id, type: true })
            }
            this.$message({
              message: arr[data.status],
              type: 'success'
            })
          }
        }
      })
    },
    closeEditConfig (status, i) {
      this.closeEdit(i, true)
    },
    getCssStyle (data, type) {
      this.cssStyles.bgConfig = data.bgConfig.form
      this.cssStyles.headConfig = data.headConfig.form
      this.cssStyles.contConfig = data.contConfig.form
      this.cssStyles.fontConfig = data.fontConfig.form
      this.cssStyles.subConfig = data.subConfig.form
      if (type === 'add') {
        this.cssStyles.bgConfig.bgImage = ''
        this.cssStyles.bgConfig.bgImageUrl = ''
        this.cssStyles.headConfig.bgImage = ''
        this.cssStyles.headConfig.bgImageUrl = ''
      }
      this.$forceUpdate()
      // console.log(this.cssStyles)
    },
    handleTabs (i) {
      this.deviceTab = i
    }
  },
  activated () {
    if (this.$route.query.type === 'Add') {
      this.formList = []
      this.headList.find(t => t.prop === 'title').value.defaultValue = '这里显示标题最多50个字'
      this.headList.find(t => t.prop === 'details').value.defaultValue = '这里显示描述最多150个字'
    }
  },
  mounted () {
    if (this.$route.query.type === 'Add') {
      // console.log('00')
    }
  }
}
</script>
<style lang="scss">
.interact-vote-edit-ques{
  height: 100%;
  .edit-ques{
    display: flex;
    height: calc(100% - 45px);
    border-top: 1px solid #E8E8E8;
    overflow-x: overlay;
    overflow-y: hidden;
  }
  .edit-ques-box{
    width: 162px;
    min-height: 672px;
    padding-right: 30px;
    box-sizing: border-box;
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
    line-height: 150px;
    font-size: 16px;
    color: #999999;
    text-align: center;
  }
  .w-100{
    width: 100%;
  }
  .edit-ques-cont{
    min-height: calc(100% - 155px);
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #E8E8E8;
    position: relative;
    box-sizing: border-box;
    .eidtor{
      border: none;
    }
    // 拖动区
    .component {
      .drag-comp-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        max-height: 240px;
        overflow-x: hidden;
        overflow-y: overlay;
        .drag-comp-item-wrap{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background-color: #fff;
          box-sizing: border-box;
          border: 1px solid #f5f5f5;
          .jee-svg-icon{
            font-size: 24px;
            padding-bottom: 10px;
          }
          .drag-comp-item{
            font-size: 12px;
            color: #333333;
          }
          cursor: move;
          &:hover{
            box-shadow: 0 0 2px rgba(0,0,0,0.2);
            z-index: 1;
          }
        }
      }
      .drag-comp-list2 {
        height: 240px;
        overflow-x: hidden;
        overflow-y: overlay;
        display: block;
        .drag-comp-item-wrap{
          display: flex;
          align-items: center;
          min-height: 30px;
          background-color: #fff;
          box-sizing: border-box;
          border: 1px dashed #e8e8e8;
          margin-bottom: 10px;
          margin-right: 26px;
          .jee-svg-icon{
            font-size: 12px;
            padding: 0 10px;
            &.delete{
              padding: 0;
              margin-right: -26px;
              font-size: 16px;
              fill: #797979;
              cursor: pointer;
            }
          }
          .drag-comp-item{
            font-size: 12px;
            color: #333333;
            flex: 1;
          }
          cursor: move;
        }
      }
    }
    .cont-drag{
      min-height:169px;
      position: relative;
    }
    .cont-box{
      margin-top: 25px;
      position: relative;
      width: 100%;
      &__info{
        text-align: center;
        align-items: center;
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        .jee-svg-icon{
          position: relative;
          top: 5.5px;
          margin-right: 15px;
        }
      }
      &__btn{
        margin: 40px auto 50px;
        color: #ffffff;
        background-color: #1ec6df;
        width: 77px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-style: solid;
        box-sizing: border-box;
      }
      .widget-view{
        position: relative;
        box-sizing: border-box;
        &:not(.active):hover {
          .cont-wrap:hover {
            background: #f3f3f3;
          }
        }
        &.active {
          border-width: 1px;
          border-style: dashed;
        }
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
        .cont-wrap{
          padding: 0 85px;
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
            z-index: 1101;
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
        .edit-box{
          padding:10px 96px 0;
          &.active {
            border-width: 1px;
            border-style: dashed;
          }
        }
        .edit-view{
          padding:10px 46px;
        }
      }
    }
  }
  .edit-ques-title{
    color: #333333;
    font-size: 16px;
    display: block;
    line-height: 1;
    margin: 20px 0;
  }
  .edit-ques-wrap{
    flex: 1;
    max-height: 100%;
    min-width: 1030px;
    overflow-y: auto;
    background-color: #F0F0F0;
    position: relative;
    .edit-ques-view{
      margin: 0 auto;
    }
    .bg-wrap{
      padding:50px 48.5px 50px;
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
  .edit-ques-drag{
    width: 131px;
    height: 45px;
    padding-left: 20px;
    box-sizing: border-box;
    line-height: 45px;
    font-size: 14px;
    color: #333333;
    border: 1px solid #E8E8E8;
    border-radius: 4px;
    margin-bottom: 10px;
    cursor: pointer;
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
}
</style>
