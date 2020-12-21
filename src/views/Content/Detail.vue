<template>
  <section class="column-model-edit-container content-detail-container">
    <section class="content-wrap" v-loading="loading">
      <header v-if="handleHeaders.length" :class="{isFullscreen: isFullscreen}">
        <div class="header-wrap" ref="box" v-if="!isFullscreen">
          <handle-hearder @handleHead="handleHead"
            v-bind="{handleHeaders:handleHeaders,detail:detail}">
          </handle-hearder>
          <el-button class="full-screen" type="empty" size="small" @click="handleClickScreenFull">
            <jee-icon :iconClass="isFullscreen?'huanyuanhuabu':'quanping'"></jee-icon>
            {{$t(isFullscreen? 'global.cancelScreenFull':'global.screenFull')}}
          </el-button>
        </div>
      </header>
      <el-form
        label-suffix="："
        ref="form"
        :model="form"
      >
        <div class="content-block scrollbar">
          <div class="content-block-box">
            <div class="content-block-left">
              <!--循环行-->
              <template v-for="(row, rowIndex) in detail.formListBase">
                <div class="ghost-box" :key="rowIndex">
                  <!--判断是否合并-->
                  <template v-if="row instanceof Array && row.length">
                    <!--循环列-->
                    <div class="model-left-box twoModels">
                      <div class="model-left-container ">
                        <div class="model-left-label widgetBr">
                          <template v-for="col in row">
                            <template v-for="(cell, cellIndex) in col">
                              <!-- 合并，判断是否有单图、视频、音频-->
                              <div class="widget-view edit" :key="cell.prop" :class="{'model-left-list': cell.list}" style="width: 50%; box-sizing: border-box;">
                                <el-form-item :label="cell.name" v-if="cell.type === 'modelName'">
                                  <div>{{cell.value.defaultValue}}</div>
                                </el-form-item>
                                <component v-else-if="cell.list === undefined" :is="cell.preview" :index="cellIndex" :option="cell.value" :form="form" v-model="form[cell.value.name]"
                                           :isValidator='true' :getContentText="getContentText"></component>
                                <template v-else>
                                  <p class="model-left-title">{{cell.name}}：</p>
                                  <div class="model-left-label flexwrap">
                                    <template v-for="(item, itemIndex) in cell.list">
                                      <div class="ghost_list_box" :key="itemIndex" :class="{'flex50 hb': item.type === 'fileUpload' || item.type === 'multiImageUpload', w100: item.type !== 'fileUpload' && item.type !== 'multiImageUpload'}">
                                        <div class="widget-view edit" :key="item.prop">
                                          <component :is="item.preview" :index="itemIndex" :option="item.value" :form="form" v-model="form[item.value.name]"
                                                     :isValidator='false'></component>
                                        </div>
                                      </div>
                                    </template>
                                  </div>
                                </template>
                              </div>
                            </template>
                          </template>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <!--判断是否正文-->
                    <el-tabs type="card" v-model="activeContentTab" v-if="row.type === 'content'" @tab-click="handleClickContentTab" class="tab-content" id="cardEdit">
                      <el-tab-pane :label="col.tabLabel" :name="col.tabName" :key="colIndex" v-for="(col, colIndex) in row.list">
                        <div class="widget-view edit"  :key="col.prop" >
                          <component
                            :is="col.preview"
                            :index="colIndex"
                            :key="col.prop"
                            :ref="col.tabName"
                            :option="col.value"
                            :form="form"
                            :editorOptions="{initialFrameHeight: initialFrameHeight}"
                            v-model="form[col.value.name]"
                            :isValidator='false'
                          />
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                    <!--判断是否是文档 -->
                    <el-tabs type="card" class="tab-document" v-model="activeDocument" v-else-if="row.type === 'document'" :before-leave="documentChange">
                      <el-tab-pane label="清除文档" name="close">
                        <div class="tab-document-close jee-hover-color" slot="label"><jee-icon iconClass="delete"></jee-icon>清除文档</div>
                      </el-tab-pane>
                      <el-tab-pane :label="row.name" :name="row.type">
                        <div class="widget-view edit" :key="row.prop">
                          <component :is="row.preview" :index="rowIndex" :option="row.value" :form="form" v-model="form[row.value.name]"
                                     :isValidator='false' :isShowPdf="true"></component>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                    <template v-else>
                      <div class="model-left-box" v-if="row.list === undefined">
                        <div class="model-left-container">
                          <div class="model-left-label">
                            <div class="widget-view edit" :key="row.prop">
                              <el-form-item :label="row.name" v-if="row.type === 'modelName'">
                                <div>{{row.value.defaultValue}}</div>
                              </el-form-item>
                              <component v-else :is="row.preview" :index="rowIndex" :option="row.value" :form="form" v-model="form[row.value.name]"
                                         :isValidator='true' :getContentText="getContentText"></component>
                            </div>
                          </div>
                        </div>
                      </div>
                      <template v-else>
                        <div class="model-left-box">
                          <div class="model-left-container">
                            <p class="model-left-title">{{row.name}}：</p>
                            <div class="model-left-label flexwrap">
                              <template v-for="(col, colIndex) in row.list">
                                <div class="widget-view edit" :class="{flex50: row.type === 'fileUpload' || row.type === 'multiImageUpload', w100: row.type !== 'fileUpload' && row.type !== 'multiImageUpload'}" :key="col.prop">
                                  <component :is="col.preview" :index="colIndex" :option="col.value" :form="form" v-model="form[col.value.name]"
                                             :isValidator='true'></component>
                                </div>
                              </template>
                            </div>
                          </div>
                        </div>
                      </template>
                    </template>
                  </template>
                </div>
              </template>
            </div>
            <div class="content-block-right" v-show="detail.formListExtend && detail.formListExtend.length > 0">
              <template v-for="(item, index) in detail.formListExtend">
                <template v-if="item.type === 'modelName'">
                  <div class="ghost-box" :key="index">
                    <div class="widget-view system-model-newContent">
                      <el-form-item :label="item.name" style="margin-bottom: 0;">
                        <div>{{item.value.defaultValue}}</div>
                      </el-form-item>
                    </div>
                  </div>
                </template>
                <div class="ghost-box" v-else-if="item.list !== undefined" :key="index">
                  <p class="model-right-title">{{item.name}}：</p>
                  <div class="widget-view model-right-list flexwrap edit" :class="{'upload-list':item.type !== 'fileUpload'}">
                    <div v-for="(col, colIndex) in item.list" class="model-right-item" :key="col.prop" :class="{w140: item.type !== 'fileUpload'}">
                      <component :is="col.preview" :index="colIndex" :option="col.value" :form="form" v-model="form[col.value.name]"
                                 :isValidator='true'></component>
                    </div>
                  </div>
                </div>
                <div class="ghost-box" v-else :key="index" >
                  <div class="widget-view edit"  :key="item.prop" >
                    <component :is="item.preview" :index="index" :option="item.value" :form="form" v-model="form[item.value.name]"
                               :isValidator='true' :getContentText="getContentText"></component>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!--<div class="content-form-item-wrap">-->
          <!--&lt;!&ndash; 标题正文区 &ndash;&gt;-->
          <!--<div class="title-content-wrap">-->
            <!--<div class="title-wrap">-->
              <!--&lt;!&ndash; 标题拖拽区 &ndash;&gt;-->
                <!--<template v-for="(item, index) in titleFormItems">-->
                  <!--<component :key="index" :is="item.preview"-->
                  <!--:index="index" :option="item.value"-->
                  <!--:form="form" v-model="form[item.value.name]"-->
                  <!--/>-->
                <!--</template>-->
            <!--</div>-->
            <!--<div class="content-wrap">-->
              <!--&lt;!&ndash; 正文拖拽区 &ndash;&gt;-->
                <!--<el-tabs type="card" v-model="activeContentTab" @tab-click="handleClickContentTab"-->
                <!--&gt;-->
                  <!--<template v-for="(item, index2) in contentFormItems">-->
                    <!--<el-tab-pane :label="item.tabLabel" :name="item.tabName" :key="index2">-->
                        <!--<component :is="item.preview" :index="index2" :ref="item.tabName" :key="index2" :option="item.value" :form="form" v-model="form[item.value.name]"></component>-->
                    <!--</el-tab-pane>-->
                  <!--</template>-->
                <!--</el-tabs>-->
            <!--</div>-->
          <!--</div>-->
          <!--&lt;!&ndash; 属性拖拽区 &ndash;&gt;-->
          <!--<div class="base-extend-wrap">-->
            <!--<el-collapse accordion value="Base" @change='handleChangeAttrPanel'>-->
              <!--<template v-for="(tab, index) in tabs">-->
                <!--<el-collapse-item :title="tab.label" :name="tab.name" :key="index">-->
                  <!--<el-form-item v-if="tab.name === 'Base'"-->
                  <!--class="column-form-item sm-height" prop='modelName' label='内容模型'>-->
                    <!--<span>{{form.modelName}}</span>-->
                  <!--</el-form-item>-->
                  <!--<template v-for="(item, index2) in arrtFormItems[tab.name]">-->
                    <!--<component :key="index2" :is="item.preview"-->
                      <!--:getContentText="getContentText"-->
                      <!--:index="index2" :option="item.value"-->
                      <!--:form="form" v-model="form[item.value.name]"-->
                    <!--/>-->
                  <!--</template>-->
                <!--</el-collapse-item>-->
              <!--</template>-->
            <!--</el-collapse>-->
          <!--</div>-->
        <!--</div>-->
      </el-form>
      <form-dialog
        ref="editDialog"
        v-bind="edit"
        @handleConfirm="handleConfirmEdit"
        @handleChangeCascader="handleChangeCascader"
      >
      </form-dialog>
      <sort-content ref="sortContent" :channelIds="[channelId]"
        @getSort="getSort" key="contentEdit"></sort-content>
      <edition ref="edition" @setEdition="setEdition"></edition>
      <operatio-records ref="operatio"></operatio-records>
      <relevant-contents ref="relevant"></relevant-contents>
      <el-dialog
        :title="examineObj.title"
        :visible.sync="examineObj.visible"
        width="30%"
        height="130"
        :show-close="examineObj.showClose">
          <div class="examineDialog"><jee-icon v-show="examineObj.icon !== ''" :iconClass="examineObj.icon"/>{{examineObj.text}}</div>
      </el-dialog>
      <el-dialog
        title="访问记录"
        width="822px"
        :visible.sync="browsing"
        :before-close="handleBrowsingClose"
      >
        <browseTable @handStatisData="handleBrowsingClose" :contentId="contentIds"></browseTable>
      </el-dialog>
    </section>
  </section>
</template>
<script>
import formDialog from '@/components/mixins/formDialog'
import baseHeader from '@/components/mixins/baseHeader'
import tableDialog from '@/components/mixins/tableDialog'
import PreviewComponents from '@/components/draggable/Preview/components'
import screenFull from '@/components/mixins/screenFull'
import edition from './detailCompoents/Edition'
import operatioRecords from './detailCompoents/operatioRecords'
import relevantContents from './detailCompoents/RelevantContents'
import mixins from './components/mixins'
import sortContent from './components/sortContent'
import handleHearder from './detailCompoents/HandleHearder'
import browseTable from './Browse/BrowseTable'

import { mapGetters, mapActions } from 'vuex'
import { deepClone, arrayFlat } from '@/utils'

export default {
  name: 'contentDetail',
  components: {
    sortContent,
    edition,
    relevantContents,
    operatioRecords,
    handleHearder,
    browseTable,
    ...PreviewComponents
  },
  mixins: [screenFull, mixins, formDialog, tableDialog, baseHeader],
  inject: ['removeTab', 'reflushCurrentPage'],
  provide () {
    return {
      changeColumn: this.getChannlWrokflow,
      fetchContentDetail: this.fetchContentDetail
      // changeCurrentTab: this.changeCurrentTab
    }
  },
  data () {
    var popverBtns = [
      {
        label: '置顶',
        type: 'Istop',
        disShow: this.$route.query.type === 'add',
        power: 'topContentAble',
        icon: 'zhiding',
        disabled: !this._checkPermission('/contentext/top', 'POST')
      },
      {
        label: '复制',
        type: 'Copy',
        power: 'copyContentAble',
        icon: 'fuzhilaiyuanlangmu'
      },
      {
        label: '引用',
        type: 'Quote',
        power: 'quoteContentAble',
        icon: 'yinyong',
        disabled: !this._checkPermission('/contentext/quote', 'POST')
      },
      {
        label: '排序',
        type: 'Sort',
        power: 'sortContentAble',
        icon: 'paixu1',
        disabled: !this._checkPermission('/contentext/sort', 'POST')
      },
      {
        label: '相关内容',
        type: 'Relevant',
        power: 'editContentAble',
        icon: 'neirongguanli'
      },
      {
        name: '7',
        label: '版本',
        power: 'editContentAble',
        icon: 'banben',
        disabled: false
      },
      {
        name: '8',
        label: '操作记录',
        icon: 'caozuojilu',
        disabled: false
      },
      {
        name: '14',
        label: '归档',
        power: 'fileContentAble',
        icon: 'guidang',
        disabled: !this._checkPermission('/contentext/status', 'POST')
      },
      {
        name: '16',
        label: '出档',
        power: 'fileContentAble',
        icon: 'chudang',
        disabled: !this._checkPermission('/contentext/file', 'POST')
      },
      {
        name: '18',
        label: '访问记录',
        power: 'fileRecord',
        icon: 'liulan',
        click: true
      }
    ]
    return {
      browsing: false,
      initialFrameHeight: window.innerHeight - 316,
      searchBarFixed: false,
      loading: false,
      form: {},
      detail: {
        formListExtend: []
      },
      contentIds: '',
      contentId: '',
      channelId: '',
      hasWorkflow: false,
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
      screenFullElement: '.content-wrap',
      headers: [],
      activeContentTab: '',
      activeDocument: 'document',
      popverBtns: popverBtns,
      bttons: [
        {
          name: '1',
          label: '存为初稿',
          icon: 'baocun',
          power: 'editContentAble',
          disabled: !this._checkPermission('/contentext', 'PUT')
        },
        {
          name: '3',
          label: '存为草稿',
          power: 'editContentAble',
          icon: 'cunweicaogao',
          disabled: !this._checkPermission('/contentext', 'PUT')
        },
        {
          name: '2',
          label: '发布',
          power: 'publishContentAble',
          icon: 'fabu',
          disabled: !this._checkPermission('/contentext', 'PUT')
        },
        {
          name: '4',
          label: '待发布',
          power: 'editContentAble',
          icon: 'daifabu',
          disabled: !this._checkPermission('/contentext', 'PUT')
        },
        {
          name: '5',
          label: '预览',
          icon: 'yulang',
          disabled: false
        },
        {
          name: '6',
          label: '浏览',
          icon: 'liulan',
          disabled: false
        },
        {
          name: '7',
          label: '版本',
          power: 'editContentAble',
          icon: 'banben',
          disabled: false
        },
        {
          name: '8',
          label: '操作记录',
          icon: 'caozuojilu',
          disabled: false
        },
        {
          name: '11',
          label: '强制发布',
          power: 'publishContentAble',
          icon: 'fabu',
          disabled: !this._checkPermission('/contentext', 'PUT')
        },
        {
          name: '12',
          label: '提交审核',
          power: 'editContentAble',
          icon: 'shenhe',
          disabled: !this._checkPermission('/contentext', 'PUT')
        },
        {
          name: '13',
          label: '下线',
          power: 'publishContentAble',
          icon: 'xiaxian',
          disabled: !this._checkPermission('/contentext/status', 'POST')
        },
        {
          name: '14',
          label: '归档',
          power: 'fileContentAble',
          icon: 'guidang',
          disabled: !this._checkPermission('/contentext/status', 'POST')
        },
        {
          name: '15',
          label: '删除',
          power: 'deleteContentAble',
          icon: 'delete',
          disabled: !this._checkPermission('/contentext', 'DELETE')
        },
        {
          name: '16',
          label: '出档',
          power: 'fileContentAble',
          icon: 'chudang',
          disabled: !this._checkPermission('/contentext/file', 'POST')
        },
        {
          name: '17',
          label: '撤回(撤回后为初稿状态)',
          power: 'editContentAble',
          icon: 'huanyuan',
          disabled: !this._checkPermission('/contentext', 'PUT')
        }
      ],
      timer: null,
      isQuote: false,
      isCited: false,
      labelWidth: 'auto',
      excludeList: ['imageUpload', 'singleImage', 'audioUpload', 'videoUpload', 'fileUpload'], // 多个模型合并到一行
      modelNameObj: {
        type: 'modelName',
        name: '内容模型',
        index: 1,
        isCustom: false,
        value: {
          defaultValue: '', // 默认值
          label: '内容模型', // 字段名称
          name: 'modelName', // 标签名称
          isLengthLimit: false, // 是否字数限制
          max: 50, // 最大长度
          isInputLimit: false, // 是否输入限制
          inputLimit: '', // 限制类型
          isRegister: false, // 是否应用到注册
          isRequired: false // 是否必填
        }
      }, // 默认模型名称
      examineObj: {
        title: '',
        icon: '',
        text: '',
        visible: false,
        showClose: false,
        handleClose: function () {}
      }, // 审核提示窗信息
      handleHeaders: []
    }
  },
  computed: {
    ...mapGetters(['siteExtendConfig']),
    contentAutoSave () {
      try {
        return this.siteExtendConfig.cfg.contentAutoSave
      } catch (error) {
        return '0'
      }
    },
    contentCommitAllowUpdate () {
      let { contentCommitAllowUpdate } = this.siteExtendConfig.cfg
      return contentCommitAllowUpdate
    },
    titleFormItems () {
      let formItems = []
      if (this.detail && this.detail.renderingField) {
        formItems = this.detail.renderingField.formListTitle || []
      }
      return formItems.sort((a, b) => a.index - b.index)
    },
    contentFormItems () {
      let formItems = []
      if (this.detail && this.detail.renderingField) {
        formItems = this.detail.renderingField.formListContent || []
      }
      return formItems.sort((a, b) => a.index - b.index)
    },
    baseFormItems () {
      let formItems = []
      if (this.detail && this.detail.renderingField) {
        formItems = this.detail.renderingField.formListBase || []
      }
      return formItems.sort((a, b) => a.index - b.index)
    },
    extendFormItems () {
      let formItems = []
      if (this.detail && this.detail.renderingField) {
        formItems = this.detail.renderingField.formListExtend || []
      }
      return formItems.sort((a, b) => a.index - b.index)
    },
    arrtFormItems () {
      return {
        Base: this.baseFormItems,
        Extend: this.extendFormItems
      }
    },
    formItems () {
      // return [...this.titleFormItems, ...this.contentFormItems, ...this.baseFormItems, ...this.extendFormItems]
      return [...this.detail.renderingField.formListBase, ...this.detail.renderingField.formListExtend]
    },
    getFormData () {
      let data = {
        json: {}
      }
      Object.keys(this.form).forEach(d => {
        const item = arrayFlat(this.formItems).find(f => f.value.name === d)
        if (item) {
          if (!item.isCustom) data[d] = this.form[d]
          else data.json[d] = this.form[d]
        } else {
          data[d] = this.form[d]
        }
      })
      return data
    }
  },
  watch: {
    // contentAutoSave () {
    //   this.handleAutoSave()
    // },
    isQuote (newVal) {
      this.isQuote = newVal
    },
    detail: {
      deep: true,
      handler (newData) {
        if (newData) {
          const { id, dataField, renderingField, banJson } = newData
          let detailForm = Object.assign({}, { id }, dataField, this.form, { banJson })
          // if(dataField){
          //   {}, { id }, this.form
          // }
          const fieldKeys = Object.keys(renderingField || {})
          // if (this.$route.query.type === 'link' || this.$route.query.type === 'Link') {
          //   this.channelId = dataField.channelId
          // }
          fieldKeys.forEach(field => {
            const keys = renderingField[field]
            Object.values(keys).forEach(item => {
              let itemName = ''
              let itemValue = ''
              if (item instanceof Array && item.length) {
                // 循环第一层
                item.forEach(d => {
                  d.forEach(v => {
                    if (!(v.value.name in detailForm)) {
                      detailForm[v.value.name] = v.value.defaultValue
                    }
                  })
                })
              } else {
                if (item.list) {
                  // 判断如果有list，则循环list
                  item.list.forEach(d => {
                    if (!(d.value.name in detailForm)) {
                      detailForm[d.value.name] = d.value.defaultValue
                    }
                  })
                } else {
                  itemName = item.value.name
                  itemValue = item.value.defaultValue
                }
              }
              if (!(itemName in detailForm)) {
                detailForm[itemName] = itemValue
              }
            })
          })
          if ('channelId' in detailForm && this.$route.query.type === 'add') {
            detailForm.channelId = Number(this.channelId)
            if ('viewControl' in this.form && !detailForm.viewControl) {
              detailForm.viewControl = this.channelDefault.viewControl === 1 ? 1 : 2
            }
            if ('allowComment' in this.form && !detailForm.allowComment) {
              detailForm.allowComment = this.channelDefault.allowComment
            }
          }
          // console.log('detailForm', detailForm)
          this.form = detailForm
        }
      }
    }
  },
  methods: {
    ...mapActions('config', ['FetchSiteExtentConfig']),
    handleBrowsingClose () {
      this.browsing = false
    },
    handleBrowsingCloseData () {
      this.browsing = false
    },
    getBtnTree (id) {
      var { type } = this.$route.query
      if (type !== 'add' && id) {
        let params = {
          status: 2,
          id: id,
          quote: this.isQuote
        }
        this.$request.fetchContentButton(params).then(res => {
          if (res.code === 200) {
            this.$set(this, 'handleHeaders', res.data.dtos)
          }
        })
      }
    },
    getBtnTreeAdd () {
      if (this.channelId) {
        let params = {
          status: 1,
          channelId: this.channelId,
          quote: this.isQuote
        }
        this.$request.fetchContentButton(params).then(res => {
          if (res.code === 200) {
            this.$set(this, 'handleHeaders', res.data.dtos)
          }
        })
      }
    },
    handleHead (data) {
      if (data.key) {
        this.handleHeaderButton(data)
      } else {
        this.handleEvent(data.key, data)
      }
      if (data.key === '18') {
        this.browsing = true
      }
    },
    // 阻止文档tabs切换
    documentChange (activeName, oldActiveName) {
      if (activeName === 'close') {
        this.detail.formListBase.forEach(d => {
          if (d.type === 'document') {
            this.form[d.value.name] = []
          }
        })
        return false
      }
    },
    handleAutoSave () {
      const { type } = this.$route.query
      if (type === 'add' && (this.contentAutoSave === '1' || this.contentAutoSave === 1)) {
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.$refs.form.validate(valid => {
              if (valid) {
                this.getFormData.type = 1
                this.$request.fetchContentUpdate(this.getFormData).then(res => {
                  if (res.code === 200) {
                    this._messageSuccess('autoSave')
                  }
                })
              }
            })
          }, 10000)
        }
      } else {
        this.handleClearInterval()
      }
    },
    getSort (status) {
      if (status) {
        this.fetchContentDetail()
      }
    },
    setEdition (status) {
      if (status) {
        this.fetchContentDetail()
        this.$nextTick(() => {
          this.reflushCurrentPage(this.$route.fullPath)
        })
      }
    },
    setDefaultContentTab () {
      try {
        // console.log('this.detail', this.detail.formListBase)
        this.detail.formListBase.forEach(d => {
          if (d.type === 'content') {
            this.activeContentTab = d.list[0].tabName
          }
        })
      } catch (error) {}
    },
    handleClickContentTab (tab, e) {
      this.activeContentTab = tab.name
    },
    // 解决扩展设置的label位置问题
    handleChangeAttrPanel () {
      this.labelWidth = ''
      this.$nextTick(() => {
        this.labelWidth = 'auto'
      })
    },
    // 获取当前正文文本内容
    getContentText () {
      try {
        return this.filterHtml(this.$refs[this.activeContentTab][0].value)
      } catch (error) {
        return ''
      }
    },
    filterHtml (str) {
      str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
      str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
      str = str.replace(/\n[\s| | ]*\r/g, '\n') // 去除多余空行
      str = str.replace(/&nbsp;/ig, '')// 去掉&nbsp;
      return str
    },
    setForm () {
      if (this.detail) {
        const { id, modelName, dataField, modelId } = this.detail
        let detailForm = Object.assign({}, { id, modelName, modelId }, dataField)

        if (this.$route.query.type === 'link' || this.$route.query.type === 'Link') {
          this.channelId = dataField.channelId
        }
        if ('channelId' in detailForm && this.$route.query.type === 'add') {
          detailForm.channelId = Number(this.channelId)
        }
        this.getBtnTree(id)
        this.form = detailForm
      }
    },
    restListData (dataField) {
      ['formListBase', 'formListExtend'].forEach(field => {
        const keys = this.detail[field]
        Object.values(keys).forEach(item => {
          if (item instanceof Array && item.length) {
            // 循环第一层
            item.forEach(d => {
              // 循环
              if (d[0].list) {
                d[0].list.forEach(v => {
                  // 循环
                  dataField[v.value.name] = v.value.defaultValue
                })
              } else {
                if (d[0].value.type === 'datetime' && d[0].value.isDefaultNow) {
                  dataField[d[0].value.name] = this.moment().format('YYYY-MM-DD HH:mm:ss')
                } else {
                  dataField[d[0].value.name] = d[0].value.defaultValue
                }
              }
            })
          } else {
            if (item.list) {
              // 判断如果有list，则循环list
              item.list.forEach(d => {
                // 循环
                dataField[d.value.name] = d.value.defaultValue
              })
            } else {
              if (item.value.type === 'datetime' && item.value.isDefaultNow) {
                dataField[item.value.name] = this.moment().format('YYYY-MM-DD HH:mm:ss')
              } else {
                dataField[item.value.name] = item.value.defaultValue
              }
            }
          }
        })
      })
      this.detail.dataField = dataField
    },
    // 获取详情
    fetchContentDetail () {
      this.loading = true
      this.$request.fetchContentDetail(this.contentId).then(res => {
        if (res.code === 200) {
          this.detail = Object.assign({}, res.data)
          this.modelNameObj.value.defaultValue = this.detail.modelName
          const { formListBase, formListExtend } = res.data.renderingField || {}
          if (formListBase instanceof Array && formListBase.length) {
            this.detail.formListBase = this.detailResetData(formListBase)
          } else {
            this.detail.formListBase = []
          }
          if (formListExtend instanceof Array && formListExtend.length) {
            this.detail.formListExtend = this.detailResetData(formListExtend)
          } else {
            this.detail.formListExtend = []
          }
          // 判断下是否字段模型名称
          let tempBaseList = arrayFlat(this.detail.formListBase)
          let tempExtend = arrayFlat(this.detail.formListExtend)
          if (tempBaseList.find(d => d.type === 'modelName') === undefined && tempExtend.find(d => d.type === 'modelName') === undefined) {
            this.detail.formListBase = [this.modelNameObj].concat(this.detail.formListBase)
          }
          this.resetKey()
          this.setForm()
          this.setDefaultContentTab()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取新增字段
    fetchContentDetailAdd  () {
      var _this = this
      _this.loading = true
      _this.$request.fetchContentPlus(_this.contentId).then(res => {
        if (res.code === 200) {
          _this.detail = {
            renderingField: res.data.enableJson
          }
          let dataField = {
            modelId: _this.contentId,
            modelName: _this.$route.query.modelName || '',
            channelId: _this.channelId
          }
          const { formListBase, formListExtend } = res.data.enableJson || {}
          if (formListBase instanceof Array && formListBase.length) {
            // _this.detail.formListBase = _this.detailResetData(formListBase)
            _this.$set(_this.detail, 'formListBase', _this.detailResetData(formListBase))
          } else {
            _this.detail.formListBase = []
          }
          if (formListExtend instanceof Array && formListExtend.length) {
            // _this.detail.formListExtend = _this.detailResetData(formListExtend)
            _this.$set(_this.detail, 'formListExtend', _this.detailResetData(formListExtend))
          } else {
            _this.detail.formListExtend = []
          }
          _this.restListData(dataField)
          _this.resetKey()
          _this.setForm()
          this.setDefaultContentTab()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 替换重组字段
    resetKey () {
      ['formListBase', 'formListExtend'].forEach(i => {
        this.detail[i].forEach(d => {
          // 判断是否是数组
          if (d instanceof Array) {
            // 循环内部数组
            d.forEach(item => {
              return [this.returnNewKey(item[0])]
            })
          } else if (d.list !== undefined) {
            // 判断是否有list
            d.list.forEach(item => {
              return this.returnNewKey(item)
            })
          } else {
            // 其他情况
            d = this.returnNewKey(d)
          }
        })
      })
    },
    // 返回新的字段名称
    returnNewKey (obj) {
      let newKyeText = 'New'
      if ((obj.preview || obj.editor) && (obj.preview.indexOf(newKyeText) === -1 || obj.editor.indexOf(newKyeText) === -1)) {
        obj.preview = newKyeText + obj.preview
        obj.editor = newKyeText + obj.editor
      }
      return obj
    },
    // 表格弹窗数据回调
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data.content.map(v => {
          return v.cmsContent
        })
        this.tablelist.totalCount = res.data.totalElements
      }
    },
    // 保存
    handleSubmit () {
      this.$refs.form.validate(valid => {
        let params = this.getFormData
        params.tplMobile = this.$encode(params.tplMobile)
        params.tplPc = this.$encode(params.tplPc)
        if (params.outLink) {
          params.outLink.outLink = this.$encode(params.outLink.outLink)
        }
        if (params.contentSourceId) {
          params.contentSourceId.sourceLink = this.$encode(params.contentSourceId.sourceLink)
        }
        if (params.json) {
          Object.keys(params.json).forEach(t => {
            // console.log(params.json[t])
            if (typeof params.json[t] === 'string' && params.json[t].indexOf('<') > -1) {
              params.json[t] = this.$encode(params.json[t])
            }
          })
        }
        // console.log(params)
        if (valid && params.id) {
          if (params.json.orgid && params.json.orgid instanceof Array && params.json.orgid.length > 0) {
            params.json.orgid = params.json.orgid[params.json.orgid.legnth - 1]
          }
          this.loading = true
          this.$request.fetchContentUpdate(params).then(res => {
            if (res.code === 200) {
              let removeUrl = this.$route.fullPath
              if (res.data === 10) {
                let _this = this
                this.examineObj = {
                  title: '',
                  icon: '',
                  text: '智能审核中，请稍后...',
                  visible: true,
                  showClose: false
                }
                setTimeout(function () {
                  _this.examineObj.visible = false
                  _this.$routerLink('/content/index', 'audit')
                  _this.removeTab(removeUrl)
                }, 2000)
              } else {
                this._messageSuccess('save')
                this.$routerLink('/content/index', 'list')
                this.removeTab(removeUrl)
              }
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 头部按钮点击
    handleHeaderButton (item) {
      this.contentIds = Number(this.$route.query.id)
      console.log(this.contentIds)
      const { releaseTime, offlineTime } = this.form
      if (this.getFormData.force === true) {
        delete this.getFormData.force
      }
      switch (item.key) {
        case '1':
          this.getFormData.type = 2
          this.handleSubmit()
          break
        case '2':
          if (offlineTime) {
            if (releaseTime && offlineTime < releaseTime) {
              this.$message.error('下线时间小于发布时间时不能发布')
              break
            } else if (new Date(offlineTime) < new Date()) {
              this.$message.error('下线时间小于当前时间时不能发布')
              break
            }
          }
          // 处理保存逻辑
          this.contentReset()
          this.$nextTick(() => {
            this.getFormData.type = 5
            this.handleSubmit()
          })
          break
        case '3':
          this.getFormData.type = 1
          this.handleSubmit()
          break
        case '4':
          this.getFormData.type = 4
          this.handleSubmit()
          break
        case '5':
          // 预览
          if (this.detail.previewUrl) {
            window.open(this.detail.previewUrl)
          } else {
            this.$message('没有预览地址')
          }
          break
        case '6':
          // 浏览
          if (this.detail.url) {
            window.open(this.detail.url)
          } else {
            this.$message('没有浏览地址')
          }
          break
        case '7':
          this.$refs['edition'].showTheDialog(item)
          break
        case '8':
          this.$refs['operatio'].showTheDialog(this.contentId)
          break
        case '11':
          this.getFormData.type = 5
          this.getFormData.force = true
          if (offlineTime) {
            if (releaseTime && offlineTime < releaseTime) {
              this.$message.error('下线时间小于发布时间时不能发布')
              break
            } else if (new Date(offlineTime) < new Date()) {
              this.$message.error('下线时间小于当前时间时不能发布')
              break
            }
          }
          this.handleSubmit()
          break
        case '12':
          // 审核
          this.getFormData.type = 3

          this.$refs.form.validate(valid => {
            if (valid) {
              this.loading = true
              let params = this.getFormData
              params.tplMobile = this.$encode(params.tplMobile)
              params.tplPc = this.$encode(params.tplPc)
              if (params.outLink) {
                params.outLink.outLink = this.$encode(params.outLink.outLink)
              }
              if (params.contentSourceId) {
                params.contentSourceId.sourceLink = this.$encode(params.contentSourceId.sourceLink)
              }
              if (params.json) {
                Object.keys(params.json).forEach(t => {
                  // console.log(params.json[t])
                  if (typeof params.json[t] === 'string' && params.json[t].indexOf('<') > -1) {
                    params.json[t] = this.$encode(params.json[t])
                  }
                })
              }
              this.$request.fetchContentSubmit(params).then(res => {
                let removeUrl = this.$route.fullPath
                this.$restBack(res, () => {
                  this.removeTab(removeUrl)
                  this.$routerLink('/content/index', 'list')
                }, '提交成功')
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
          break
        case '13':
          // 下线
          this.changeStatus([this.form.id], 7)
          // this.getFormData.type = 7
          // this.handleSubmit()
          break
        case '14':
          // 归档
          this.handleEventFile([this.form.id])
          break
        case '15':
          // 删除
          this.handleEventDelete([this.form.id])
          break
        case '16':
          // 出档
          this.handleEventFileout([this.form.id])
          break
        case '17':
          // 撤回
          this.$request.fetchContentTaskRevoke({ contentId: this.form.id }).then(res => {
            this.$restBack(res, () => {
              this.fetchContentDetail()
            })
          })
          break
        default:
          break
      }
    },
    // 保存正文处理
    contentReset () {
      // 获取正文对象
      let contentObj = this.detail.formListBase.find(d => {
        if (d.type === 'content') {
          return d
        }
      })
      // 正文字段值
      let contentKeys = []
      // 判断是否有正文
      if (contentObj) {
        contentKeys = contentObj.list.map(item => {
          return item.value.name
        })
      }
      // 如果有正文字段
      if (contentKeys.length > 0) {
        contentKeys.forEach(item => {
          console.log(item)
          this.clearSpan(item)
          if (this.form[item].indexOf('<hr/>') !== -1) {
            this.form[item] = this.form[item].replace('<hr/>', '[NextPage][/NextPage]')
          }
        })
      }
    },
    // 清除span标签
    clearSpan (key) {
      // 获取所有文本
      let texts = this.form[key]
      // 标红span标签
      let regex = new RegExp('<span class="banClass".*?</span>')
      // 所有标红span标签集合
      let textList = texts.match(regex)
      // 获取删除span以后的内容
      if (textList != null) {
        let testTemp = textList.map(d => {
          let regex2 = new RegExp('<span class="banClass".*?>')
          return d.replace(regex2, '').replace('</span>', '')
        })
        // 循环替换
        textList.forEach((item, index) => {
          this.form[key] = texts.replace(item, testTemp[index])
        })
      }
    },
    // 右侧弹出层
    handleEvent (type, btn) {
      this.handleEventAll([this.detail.id], btn)
    },
    // 右侧按钮点击
    handleEventRelevant (data, btn) {
      this.$refs['relevant'].showTheDialog(this.contentTree, data[0])
    },
    // 是否工作流
    getChannlWrokflow (id) {},
    getFormDatas (status) {
      var { id, channelId, isQuote, type, isCited } = this.$route.query
      this.isCited = !!isCited
      this.isQuote = isQuote === 'true' || isQuote === true
      if (type === 'add' && channelId) {
        this.channelId = channelId
        this.fetchContentList(true)
        this.getBtnTreeAdd()
      }
      if (id || status) {
        this.contentId = id ? Number(id) : ''
        if (type !== 'add') {
          this.fetchContentList()
          this.fetchContentDetail()
        } else {
          this.fetchContentDetailAdd()
        }
      }
    },
    detailResetData (list) {
      let data = deepClone(list)
      let excludeList = ['content', ...this.excludeList]
      // 去除多余数组
      // 返回空数据[[]]时会报异常
      let RowList = data.filter(d => d[0].length > 0).map((d) => {
        // 判断是否有多数组
        if (d.length > 1) {
          let list = []
          d.forEach(item => {
            // 判断是否有多个数据并且是需要合并的
            if (item.length > 1 && excludeList.indexOf(item[0].type) !== -1) {
              let obj = {
                type: item[0].type,
                index: item[0].index,
                name: item[0].name,
                list: item,
                canDelete: item[0].canDelete,
                value: {
                  name: item[0].value.name
                }
              }
              list.push([obj])
            } else {
              list.push([item[0]])
            }
          })
          return list
        } else if (excludeList.indexOf(d[0][0].type) !== -1) {
          let obj = {
            type: d[0][0].type,
            index: d[0][0].index,
            name: d[0][0].name,
            list: d[0],
            value: {
              name: d[0][0].value.name
            }
          }
          return obj
        } else {
          return d[0][0]
        }
      })
      return RowList
    },
    handleClearInterval () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
    // changeCurrentTab () {}
  },
  mounted () {
    this.FetchSiteExtentConfig()
    // this.handleAutoSave()
    this.$nextTick(() => {
      const { id } = this.$route.query
      console.log(id)
      this.getFormDatas()
      if (id) {
        this.FetchWechatInfoPage()
        this.GetOwnerTrees()
        this.FetchSiteExtentConfig(this.currentSiteId)
      }
    })
  },
  activated () {
    // if (this.detail.id !== this.$route.query.id) {
    //   this.getFormDatas()
    // }
    this.detail = {}
    this.contentId = ''
    this.getFormDatas()
    this.handleAutoSave()
  },
  deactivated () {
    this.handleClearInterval()
  },
  beforeDestroy () {
    // this.handleClearInterval()
  }
}
</script>
<style lang="scss">
@import '@/views/System/Model/detail.scss';
.isFixed{
  width: 775px;
  margin-right: 20px;
  top: 180px;
  z-index: 99;
  position: fixed !important;
  border-top: 1px solid #eee;
}
.view{
  padding: 15px 0 !important;
}
.ct-pover{
    padding: 0 !important;
    min-width: 135px !important;
    &__box{
      padding:8px 0;
    }
    &__item{
      padding: 0 12px !important;
      line-height: 28px;
      color: #666666 ;
      display: block !important;
      .jee-svg-icon{
          fill: #666;
          margin-right: 8px;
        }
      &:hover{
        background-color: #F3F3F3;
      }
    }
  }
.content-detail-container{
  background-color: #F1EFF2;
  .el-tabs__header{
    background: #ffffff !important;
  }
  .handle-detail-hearder{
    flex: 1;
  }
  .el-main{
    overflow-x: hidden;
  }
  .content-wrap{
    background-color: #ffffff;
    // height: 100%;
    // overflow-x: hidden;
    // overflow-y: overlay;
    >header{
      position: fixed;
      z-index: 100;
      width: 100%;
      &.isFullscreen{
        background: #fff;
        margin-top: 20px;
      }
      &:not(.isFullscreen){
        position: fixed;
        z-index: 3;
        width: calc(100% - 138px);
      }
      .header-wrap{
        background: #fff;
        height: 58px;
        width: 1170px;
        margin: 0 auto;
        box-sizing: border-box;
        display: flex;
        padding-left: 16px;
        align-items: center;
        border-radius: 4px;
        border: 1px solid #E8E8E8;
        .is-disabled {
          cursor: not-allowed !important;
          color: #c0c4cc !important;
        }
      }
      .full-screen{
        background-color: #fff;
        padding: 8px 20px;
        margin-right: 30px;
      }
    }
    >.el-form{
      height: calc(100% - 60px);
      overflow-y: overlay;
    }
    .content-form-item-wrap{
      padding-top: 20px;
      display: flex;
      justify-content: center;
      .title-content-wrap{
        width: 900px;
        margin-right: 20px;
        .title-wrap{
          padding: 0 22px 0 16px;
          margin-bottom: 20px;
          border: 2px solid #e8e8e8;
          border-radius: 4px;
          .el-form-item{
            padding: 6px 0;
            .el-input{
              max-width: 100%;
              .el-input__inner{
                border: 0;
              }
            }
            .el-form-item__label-wrap{
              margin-left: 0!important;
            }
            .el-form-item__content{
              margin-left: 68px!important;
              .el-form-item__content{
                margin-left: 0!important;
              }
            }
          }
          :first-child .el-form-item{
            border-bottom: 1px solid #e8e8e8;
          }
        }
        .content-wrap{
          .ql-editor{
            min-height: 400px;
          }
        }
        .el-tabs{
          .el-tab-pane{
            border: 1px solid #e8e8e8;
            border-radius: 0 4px 4px 4px;
          }
        }
      }
      .base-extend-wrap{
        width: 360px;
        .column-form-item{
          margin: 0!important;
          padding: 5px 0;

        }
        .z-draggable-preview{
          >.el-form-item{
            padding: 5px 0;
            .el-form-item__error{
              position: relative;
              padding-top: 10px;
              line-height: 1;
            }
          }
        }
      }

      .el-collapse-item__wrap{
        overflow: visible;
      }

      .el-collapse{
        border-top: 0;
        .el-collapse-item{
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          padding: 0 20px 30px;
          .el-collapse-item__header {
            border-bottom-color: transparent;
            height: 14px!important;
            font-size: 16px;
            font-weight: 600;
            padding: 30px 0 0;
            &.is-active{
              padding-bottom: 10px;
              border-bottom-color: #e8e8e8;
            }
            .el-collapse-item__arrow{
              font-size: 18px;
            }
          }
          .el-collapse-item__wrap{
            border-bottom: 0;
            .el-collapse-item__content{
              padding-bottom: 0;
              padding-top: 20px;
            }
          }
          & + .el-collapse-item{
            margin-top: 30px;
          }
        }
      }
      .el-picker-panel.el-popper{
        left: auto!important;
        right: 0;
      }
    }
  }
  .jee-multi-image-resource-upload-container .resource-upload-wrap {
    line-height: 35px;
    >div:last-of-type{
      .image-desc{
        margin-bottom: 0px;
      }
    }
  }
}

.content-detail-container .content-block-box{
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 50px;
  .z-draggable-preview{
    >.el-form-item{
      padding-left: 0;
    }
  }
  .content-block-left{
    width: 775px;
    margin-right: 20px;
    .d-datetime-preview.z-draggable-preview {
      .el-input__inner {
        padding-left: 25px !important;
      }
      .el-input__prefix{
        left: -2px;
      }
      .el-date-picker.el-popper {
        left: 8px !important;
      }
    }
    .d-address-preview.new-content .el-form-item {
      flex-direction: row;
      padding-right: 0 !important;
      >.el-form-item__content{
        flex-grow: 1;
      }
    }
    .d-organize-preview .el-form-item,.d-city-preview .el-form-item{
      padding-right: 0 !important;
    }
    .d-organize-preview >.el-form-item{
      .organize-wrap{
        flex-direction: column;
      }
    }
    .d-organize-preview >.el-form-item.is-error {
      >.el-form-item__content{
        display: flex;
        flex-direction: column;
      }
    }
    .model-left-label.widgetBr{
      .d-address-preview.new-content .el-form-item{
        flex-direction: row;
        .address-cascader {
          width: 100%;
          margin-bottom: 10px;
        }
      }

    }
    .d-sub-title-preview.z-draggable-preview{
      span.el-input__count-inner{
        padding-right: 0 !important;
      }
    }
    // .model-left-label{
      // &:not(.widgetBr){
        .model-left-label.flexwrap{
          padding: 0 15px;
          // justify-content: space-between;
          .widget-view.edit{
            padding: 0 15px;
            margin-right: 19px;
            &.flex50{
              padding: 0;
              margin-right: 0;
              margin-bottom: 0;
              .widget-view{
                padding: 0;
                border-radius: 4px;
              }
              &:last-of-type{
                .widget-view{
                  padding: 0 0 5px;
                }
              }
            }
            &:last-child{
              margin-right: 0;
            }
            &:nth-child(4n){
              margin-right: 0;
            }
          }
        }
      // }
    // }

    .model-left-box{
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      margin-bottom: 10px;
      background-color: #fff;
      font-size: 14px;
      color: #666;
      position: relative;
      .el-cascader,.el-select{
        max-width: 330px;
        .el-input__suffix{
          right: -5px;
        }
      }
      .model-left-title{
        padding: 20px 30px 10px;
      }
      .xiangshangji, .xiangxiaji, .zuoyouyi{
        position: absolute;
        left: 50%;
        z-index: 1102;
        opacity: 0;
        cursor: pointer;
        font-size: 18px;
      }
      .xiangshangji{
        top: -7px;
        transform: translate(-50%, 0);
      }
      .xiangxiaji{
        bottom: -7px;
        transform: translate(-50%, 0);
      }
      .zuoyouyi{
        top: 50%;
        transform: translate(-50%, -50%);
      }
      &.active{
        background-color: rgba(213,244,248,1);
        border: 1px dashed #1EC6DF;
        .close, .xiangshangji, .xiangxiaji, .zuoyouyi{
          opacity: 1;
        }
      }
      .widget-view{
        padding: 0 30px;
        &.active{
          background-color: rgba(213,244,248,1);
          border: 1px dashed #1EC6DF;
          .close, .xiangshangji, .xiangxiaji, .zuoyouyi{
            opacity: 1;
          }
        }
      }
      // .widget-view:first-child{
      //   padding-left: 30px;
      // }
      // .widget-view{
      //   margin-right: 50px;
      // }
      // .widget-view:nth-child(4n+4) {
      //   margin-right: 0;
      // }
      // .widget-view:last-child{
      //   padding-right: 30px;
      //   margin-right: 0;
      // }
      .model-left-label{
        display: flex;
        // align-items: center;
        position: relative;
        &.widgetBr:before{
          position: absolute;
          left: 50%;
          top: 50%;
          width: 1px;
          height: 100%;
          display: block;
          content: '';
          border-left: 1px solid #e8e8e8;
          transform: translate(-50%, -50%);
        }
        &.flexwrap{
          flex-wrap: wrap;
          align-items: start;
          .w100{
            width: 140px;
            flex: inherit;
            &:last-of-type{
              margin-bottom: 12px;
            }
          }
          .flex50{
            min-width: 50%;
            box-sizing: border-box;
            flex: inherit;
            padding: 0;
            &:last-of-type{
              margin-bottom: 15px;
            }

          }
          .flex50:not(.hb){
            &:nth-of-type(n+2){
              width: 50%;
            }
          }
        }
        // 单图、视频、音频、多图、附件 跟其他字段合并
        .model-left-list{
          // 清除选中遮挡层
          &:after{
            display: none;
          }
          .model-left-title{
            padding: 20px 0 10px;
          }
          .ghost_list_box{
            width: 50%;
            margin-right: 0;
            &.w100 {
              width: 140px;
              margin-right: 46px;
              &:nth-child(2n){
                margin-right: 0;
              }
            }
            &.el-form-item{
              padding: 0;
            }
          }
          .model-left-label{
            padding: 0;
          }
          .widget-view{
            padding: 0;
            .close{
              opacity: 0;
            }
            &:hover{
              .close{
                opacity: 1;
              }
            }
          }
          // 附件
          .flex50{
            width: 100%;
          }
          .d-file-upload-preview.z-draggable-preview.new-content {
            > .el-form-item {
              padding: 15px 0 !important;
            }
          }
        }
        /deep/ .el-form-item{
          // align-items: center;
          margin-bottom: 0;
          font-size: 16px;
          color: #666;
          display: flex;
          padding: 11px 0;
          .el-radio-group .el-radio, .el-checkbox-group .el-checkbox{
            padding: 0;
            .el-form-item{
              padding:0;
            }
          }
           .el-form-item__label{
              line-height: 35px;
            }
          /deep/ .el-form-item__content{
            flex: 1;
            line-height: 35px;
            .el-input__inner{
              border-width: 0px!important;
              padding-left: 0;
              line-height: 35px;
              height: auto;
            }
            .el-input,.el-cascader{
              max-width: none;
              line-height: 35px;
              height: auto;
              &.line .el-input__inner{
                border-width:1px !important;
                border-radius:4px;
              }
              .el-input__icon{
                line-height: 35px;
              }
            }
          }
          /deep/ .el-dialog  .el-form-item{
            display: block;
            .el-form-item__content{
              flex: none;
            }
          }
          .content-wrap{
            .el-select, .el-input{
              flex: 1;
            }
          }
          .source-wrap{
            .el-autocomplete, .el-input{
              flex: 1;
            }
          }
        }
        /deep/ .d-file-upload-preview{
          .el-form-item{
            /deep/ .el-form-item__content{
              .el-input__inner{
                border-width:1px!important;
              }
            }
          }
        }
        // 左边多行输入框样式
        /deep/ .widget-view{
          .d-textarea-preview,.d-abstr-preview{
            margin-right: -28px;
            >.el-form-item{
              padding-bottom:2px;
              .el-textarea__inner{
                height: 115px;
                background-color: transparent;
              }
            }
          }
        }
      }
    }
    /deep/ .el-tabs__content{
      width: 100%;
      margin-bottom: 10px;
      .el-tab-pane{
        background-color: #fff;
      }
    }

    // 富文本组件标签页
    .tab-content.el-tabs.el-tabs--card{
      >.el-tabs__header .el-tabs__item{
        border-radius: 0;
        padding: 0 26px;
        &:first-child{
          border-radius: 4px 0 0 0;
        }
        &:last-child{
          border-radius: 0 4px 0 0;
        }
        &.is-active{
          border-top-style: solid;
          border-top-width: 1px;
        }
      }
      // /deep/ .el-tabs__content .el-tab-pane{
      //   border-top: 0;
      // }
    }
    .tab-document{
      /deep/ .el-tabs__nav{
        position: relative;
        width: 100%;
        #tab-close{
          position: absolute;
          border: none;
          background-color: transparent;
          right: 0;
          padding: 0;
          .tab-document-close{
            color: #666;
            .jee-svg-icon{
              margin-right:10px;
              fill: #777;
            }
          }
        }
      }
    }

    .ghost-box:last-child{
      /deep/ .el-tabs__content{
        margin-bottom: 0;
      }
    }
  }
  .content-block-right{
    width: 372px;
    background-color: #fff;
    border: 1px solid #E8E8E8;
    border-radius: 4px;
    // overflow: hidden;
    .d-address-preview.new-content.z-draggable-preview{
      .el-form-item{
        flex-direction: column;
        align-items: flex-start;
      }
    }
    .d-city-preview.new-content.z-draggable-preview,.d-organize-preview.z-draggable-preview{
      .el-form-item{
        display: block;
        .el-form-item{
          padding-left: 0;
          padding-right: 0;
        }
      }
      >.el-form-item{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .el-form-item__content{
          width: 100%;
        }
      }
    }
    .d-address-preview.new-content .el-form-item{
      .address-cascader {
        width: 310px;
        margin-bottom: 10px;
        // margin-right: 10px;
      }
    }
    .ghost-box{
      border-left: 1px solid #fff;
      border-top: 1px solid #fff;
      border-right: 1px solid #fff;
      border-bottom: 1px solid #e8e8e8;
      .system-model-newContent{
          .el-form-item{
            padding: 11px 30px;
          }
        }
    }
    .ghost-box:last-of-type{
      border-bottom: 1px solid #fff;
    }
    .ghost-box:first-of-type{
      border-bottom: 1px solid #e8e8e8;
    }
    .widget-view{
      &.active{
        background-color: rgba(213,244,248,1);
        border: 1px dashed #1EC6DF!important;
      }
    }
    .model-right-title{
      height: 14px;
      line-height: 1;
      color: #666666;
      font-size: 14px;
      padding: 20px 30px 10px;
    }
    .model-right-list{
      padding:5px 0;
      &.flexwrap{
        padding: 0 15px 15px;
        .w140{
          width: 50%;
          box-sizing: border-box;
          flex: initial;
          margin-bottom: 5px;
          // padding: 0 15px;
        }
      }
      &.upload-list{
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        padding: 5px 15px 0;
        &.widget-view{
          padding: 0 15px;
          border-radius: 4px;
          /deep/ .new-content{
            >.el-form-item{
              padding:13px 0 0;
            }
          }
        }
        &:last-child{
          margin-right: 0;
        }
        &:nth-child(2n){
          margin-right: 0;
        }
        &:last-of-type{
          margin-bottom: 7px;
        }
      }
    }
    /deep/ .d-multi-image-upload-preview.z-draggable-preview > .el-form-item{
      padding-top: 15px;
    }
  }
  .widget-view{
    flex: 1;
    position: relative;
  }
  .d-multi-image-upload-preview.new-content.z-draggable-preview{
      .el-form-item__content{
        width: 100%;
      }
      .drag-wrap:not(.none-drag-wrap){
        display: flex;
        margin-left: 0px;
        // margin-top: 30px;
        // padding-bottom: 10px;
      }
      .upload-item{
        // display: block;
      }
      p.form-label{
        flex-shrink: 0;
      }
      .el-dialog{
        .el-dialog__body{
          margin-bottom: 20px;
        }
        .el-form-item{
          padding: 0;
        }
      }
      /deep/ .image-desc-wrap{
        display: flex;
        margin-right: 52px;
        margin-top: 30px;
        padding-right: 0;
        margin-bottom: 0px;
        width: 330px;
        &:last-child{
          margin-right: 0;
        }
        &:nth-child(2n){
          margin-right: 0;
        }
        .el-textarea__inner{
          height: 140px;
          &:focus-within{
            border-color: #1EC6DF;
          }
        }
        .image-desc.el-textarea{
          width: 180px;
          margin-left: 10px;
          margin-top: 0;
          .el-textarea__inner::-webkit-scrollbar{
            // overflow-y: hidden
            width: 10px;
            // background: #fff;
          }
          .el-textarea__inner::-webkit-scrollbar-thumb{
            background: #fff;

          }
          .el-textarea__inner::-webkit-scrollbar-track-piece{
            background: #fff;
          }
        }
        &:last-of-type{
          margin-bottom: 20px;
        }
      }
      .el-dialog__wrapper{
        /deep/ .image-desc-wrap{
          margin-right: 30px;
        }
      }
    }

}
// 多图上传
.content-detail-container .content-block-box .content-block-right{
  .d-multi-image-upload-preview.new-content.z-draggable-preview{
    /deep/ .image-desc-wrap{
      // margin-bottom: 30px;
      .image-desc.el-textarea{
        width: 160px;
        line-height: 1.5;
      }
      &:last-of-type{
        margin-bottom: 10px;
        /*margin-top: 0;*/
      }
    }
  }
  // 发布平台
    /deep/ .d-release-platform.new-content{
      .el-checkbox{
        margin-right: 30px;
        &:nth-of-type(1){
          width: 52px;
        }
        &:nth-of-type(2){
          width: 120px;
        }
      }
    }
}
.column-model-edit-container.content-detail-container{
  .content-block-box{
    .content-block-left{
      .model-left-box{
        &:hover{
          border-color: #ccc;
        }
        .z-tip-form-item{
          max-width: 140px;
          white-space: inherit;
          word-break: break-all ;
        }
        .d-textarea-preview,.d-abstr-preview{
          .el-form-item__content{
            .z-tip-form-item{
              margin-left: 10px;
            }
          }
        }
        .d-postcontent-preview{
          .content-wrap{
            display: flex;
            .el-select{
              margin-right: 30px !important;
            }
          }
        }
      }
      // 级联
      /deep/ .el-popper.el-cascader__dropdown{
        border-radius: 4px!important;
      }
    }
    .content-block-right{
      .z-draggable-preview{
        >.el-form-item{
          padding: 8px 30px 20px;
          box-sizing: border-box;
          /deep/ .el-form-item__label{
            line-height: 32px;
          }
          /deep/ .el-form-item__content{
            line-height: 35px;
            .el-input,.el-cascader{
              line-height: 35px;
              box-sizing: border-box;
              height: auto;
              .el-input__inner{
                line-height: 33px;
                height: auto;
              }
              .el-input__icon{
                line-height: 35px;
              }
            }
          }
        }
        .el-form-item__content{
          .z-tip-form-item{
            padding-left: 20px;
            line-height: 1;
            // padding: 5px 0 0 !important;
          }
          .el-form-item__error{
            padding-left: 20px!important;
          }
        }
      }
      .w140{
        .z-draggable-preview{
          >.el-form-item{
            padding: 0 15px 5px;
          }
        }
      }
    }

    .d-radio-preview.z-draggable-preview{
      .el-form-item__content{
        .el-radio-group{
          .el-radio:not(.is-checked){
            .el-radio__inner{
              border-color: 1px solid #ccc;
            }
          }
        }
      }
    }
  }
}
.column-model-edit-container.content-detail-container{
  .model-left-box.twoModels{
    .d-checkbox-preview.z-draggable-preview:not(.d-checkbox-preview__horizontal){
      >.el-form-item{
        display: flex;
        align-items: flex-start !important;
      }
      .el-checkbox-group.z-checkbox-group{
        display: grid;
        grid-template-columns: 76px auto;
        .el-checkbox{
          /*margin: 10px 0;*/
        }
      }
    }
    .d-postcontent-preview.z-draggable-preview{
      >.el-form-item{
        display: flex;
        align-items: flex-start;
      }
      .content-wrap{
        flex-direction: column;
        .el-select{
          // margin-bottom: 20px;
          &:last-child{
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>

.z-draggable-preview{
  /deep/ .input-wrap{
    align-items: flex-start;
    .m-colorPicker{
      width: 40px;
      height: 40px;
      .colorBtn{
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
  /deep/ .d-postcontent-preview{
    .el-select{
      margin-right: 0!important;
      .el-input__inner{
        padding-left: 0;
      }
    }
  }
  /deep/ .el-select-dropdown{
    border-radius: 4px!important;
  }
  /deep/ .el-form-item__error{
    position: static;
  }
}

.examineDialog{
  color: #333333;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  padding: 20px 0;
}

</style>
